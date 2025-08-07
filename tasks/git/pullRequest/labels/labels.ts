import { getInput, setResult, TaskResult } from 'azure-pipelines-task-lib/task'
import { runCommand } from '../../../shared/utils'
import { GitPulRequestConnection } from '../../../shared/services/azureConnection'

interface LabelOperation {
  action: 'add' | 'remove'
  label: string
}

async function run(): Promise<void> {
  try {
    console.log('Starting Pull Request Labels task...')

    // Get task inputs
    const removeOutdatedLabels = getInput('removeOutdatedLabels') === 'true'
    const dryRun = getInput('dryRun') === 'true'
    const customLabels = getInput('customLabels') || ''

    console.log(`Input removeOutdatedLabels raw: "${getInput('removeOutdatedLabels')}"`)
    console.log(`Input dryRun raw: "${getInput('dryRun')}"`)
    console.log(
      `Configuration: removeOutdatedLabels=${removeOutdatedLabels}, dryRun=${dryRun}`
    )

    // Get suggested labels from projex
    console.log('Getting suggested labels from projex...')
    const suggestedLabelsOutput = await runCommand(
      'projex pull-request labels suggest --format csv',
      process.cwd(),
      'Successfully got suggested labels',
      true, // hideOutput = true para capturar el output
      0,
      false,
      true
    )

    console.log(`Raw projex output: "${suggestedLabelsOutput}"`)
    const suggestedLabels = parseSuggestedLabels(
      suggestedLabelsOutput?.trim() || ''
    )
    console.log(`Parsed suggested labels: [${suggestedLabels.join(', ')}]`)

    // Add custom labels if provided
    const customLabelsList = customLabels
      ? customLabels
          .split(',')
          .map((label) => label.trim())
          .filter((label) => label.length > 0)
      : []

    const allSuggestedLabels = [
      ...new Set([...suggestedLabels, ...customLabelsList]),
    ] // Remove duplicates

    console.log(
      `All suggested labels (including custom): [${allSuggestedLabels.join(', ')}]`
    )

    // Get Azure DevOps connection
    console.log('Connecting to Azure DevOps...')
    const connection = await GitPulRequestConnection()

    if (!connection) {
      throw new Error('Failed to establish Azure DevOps connection')
    }

    const { gitApi, repositoryId, pullRequest } = connection

    if (!pullRequest) {
      throw new Error('This task must be run in the context of a pull request')
    }

    // Get current pull request labels
    console.log(
      `Getting current labels for PR #${pullRequest.pullRequestId}...`
    )
    const currentLabelsResponse = await gitApi.getPullRequestLabels(
      repositoryId,
      pullRequest.pullRequestId
    )
    const currentLabels =
      currentLabelsResponse?.map((label: any) => label.name || '') || []

    console.log(`Current labels: [${currentLabels.join(', ')}]`)
    console.log(`Full label objects:`, JSON.stringify(currentLabelsResponse, null, 2))

    // Calculate label operations
    const operations = calculateLabelOperations(
      currentLabels,
      allSuggestedLabels,
      removeOutdatedLabels
    )

    if (operations.length === 0) {
      console.log('No label changes needed')
      setResult(
        TaskResult.Succeeded,
        'Pull request labels are already up to date'
      )
      return
    }

    // Log planned operations
    console.log('Planned label operations:')
    operations.forEach((op) => {
      console.log(`  ${op.action.toUpperCase()}: ${op.label}`)
    })

    if (dryRun) {
      console.log('Dry run mode - no changes will be made')
      setResult(
        TaskResult.Succeeded,
        `Dry run completed. Would perform ${operations.length} label operations`
      )
      return
    }

    // Apply label changes
    if (removeOutdatedLabels && operations.some(op => op.action === 'remove')) {
      // If we need to remove labels, use the replacement strategy to avoid API issues with special characters
      console.log('🔄 Using replacement strategy for label management...')
      await replaceAllLabels(gitApi, repositoryId, pullRequest.pullRequestId, allSuggestedLabels)
    } else {
      // Only adding labels, use individual operations
      console.log('➕ Using individual operations for adding labels only...')
      await applyLabelOperations(gitApi, repositoryId, pullRequest.pullRequestId, operations)
    }

    const addCount = operations.filter((op) => op.action === 'add').length
    const removeCount = operations.filter((op) => op.action === 'remove').length

    setResult(
      TaskResult.Succeeded,
      `Successfully updated pull request labels: ${addCount} added, ${removeCount} removed`
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    console.error(`Pull Request Labels task failed: ${errorMessage}`)
    setResult(TaskResult.Failed, errorMessage)
  }
}

function parseSuggestedLabels(output: string): string[] {
  console.log(`Parsing suggested labels from output: "${output}"`)

  if (!output || output.trim().length === 0) {
    console.log('No output to parse, returning empty array')
    return []
  }

  // Handle the case where output might contain newlines or extra text
  // Look for CSV-like content
  const lines = output.split('\n')
  let csvLine = ''

  // Find the line that looks like CSV (contains commas)
  for (const line of lines) {
    if (line.includes(',') && !line.includes('Successfully')) {
      csvLine = line.trim()
      break
    }
  }

  // If no CSV line found, try the whole output
  if (!csvLine) {
    csvLine = output.trim()
  }

  console.log(`Using CSV line: "${csvLine}"`)

  const labels = csvLine
    .split(',')
    .map((label) => label.trim())
    .filter((label) => label.length > 0 && !label.includes('Successfully'))

  console.log(`Extracted labels: [${labels.join(', ')}]`)
  return labels
}

function calculateLabelOperations(
  currentLabels: string[],
  suggestedLabels: string[],
  removeOutdated: boolean
): LabelOperation[] {
  console.log(`\n=== Calculating Label Operations ===`)
  console.log(`Current labels: [${currentLabels.join(', ')}]`)
  console.log(`Suggested labels: [${suggestedLabels.join(', ')}]`)
  console.log(`Remove outdated: ${removeOutdated}`)
  
  const operations: LabelOperation[] = []

  // Find labels to add (suggested but not current)
  console.log(`\n--- Checking labels to ADD ---`)
  for (const suggestedLabel of suggestedLabels) {
    if (!currentLabels.includes(suggestedLabel)) {
      console.log(`  Will ADD: "${suggestedLabel}" (not in current labels)`)
      operations.push({
        action: 'add',
        label: suggestedLabel,
      })
    } else {
      console.log(`  SKIP ADD: "${suggestedLabel}" (already exists)`)
    }
  }

  // Find labels to remove (current but not suggested, if removeOutdated is true)
  console.log(`\n--- Checking labels to REMOVE ---`)
  if (removeOutdated) {
    console.log(`Remove outdated is TRUE, checking current labels...`)
    for (const currentLabel of currentLabels) {
      if (!suggestedLabels.includes(currentLabel)) {
        console.log(`  Will REMOVE: "${currentLabel}" (not in suggested labels)`)
        operations.push({
          action: 'remove',
          label: currentLabel,
        })
      } else {
        console.log(`  KEEP: "${currentLabel}" (found in suggested labels)`)
      }
    }
  } else {
    console.log(`Remove outdated is FALSE, keeping all current labels`)
  }

  console.log(`\n=== Final Operations Summary ===`)
  console.log(`Total operations: ${operations.length}`)
  operations.forEach((op, index) => {
    console.log(`  ${index + 1}. ${op.action.toUpperCase()}: "${op.label}"`)
  })
  console.log(`=====================================\n`)

  return operations
}

async function replaceAllLabels(
  gitApi: any,
  repositoryId: string,
  pullRequestId: number,
  targetLabels: string[]
): Promise<void> {
  console.log(`\n=== Replacing All Labels Strategy ===`)
  console.log(`🎯 Target labels: [${targetLabels.join(', ')}]`)
  
  try {
    // Get current labels with full objects for IDs
    const currentLabelsResponse = await gitApi.getPullRequestLabels(repositoryId, pullRequestId)
    const currentLabels = currentLabelsResponse?.map((label: any) => label.name || '') || []
    
    console.log(`📋 Current labels: [${currentLabels.join(', ')}]`)
    console.log(`🔍 Full label objects:`, JSON.stringify(currentLabelsResponse, null, 2))
    
    // Step 1: Remove ALL current labels using different strategies
    console.log(`🗑️  Removing all current labels...`)
    for (const labelObj of currentLabelsResponse || []) {
      const labelName = labelObj.name || ''
      const labelId = labelObj.id || ''
      
      try {
        console.log(`   Removing: "${labelName}" (ID: ${labelId})`)
        
        // Strategy 1: Try using ID if available
        if (labelId) {
          try {
            console.log(`     Trying removal by ID: ${labelId}`)
            await gitApi.deletePullRequestLabels(repositoryId, pullRequestId, labelId)
            console.log(`     ✅ Removed by ID: "${labelName}"`)
            continue
          } catch (idError) {
            console.log(`     ⚠️  ID removal failed:`, idError instanceof Error ? idError.message : String(idError))
          }
        }
        
        // Strategy 2: Try with URL encoding for special characters
        if (labelName.includes(':')) {
          const encodedLabel = encodeURIComponent(labelName)
          try {
            console.log(`     Trying encoded name: ${encodedLabel}`)
            await gitApi.deletePullRequestLabels(repositoryId, pullRequestId, encodedLabel)
            console.log(`     ✅ Removed (encoded): "${labelName}"`)
            continue
          } catch (encodedError) {
            console.log(`     ⚠️  Encoded removal failed:`, encodedError instanceof Error ? encodedError.message : String(encodedError))
          }
        }
        
        // Strategy 3: Try direct name
        try {
          console.log(`     Trying direct name: ${labelName}`)
          await gitApi.deletePullRequestLabels(repositoryId, pullRequestId, labelName)
          console.log(`     ✅ Removed (direct): "${labelName}"`)
        } catch (directError) {
          console.log(`     ❌ All removal strategies failed for: "${labelName}"`)
          console.log(`       Direct error:`, directError instanceof Error ? directError.message : String(directError))
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(`   ⚠️  Failed to remove "${labelName}": ${errorMessage}`)
        // Continue with other labels
      }
    }
    
    // Step 2: Verify current state after removal
    console.log(`\n🔍 Checking labels after removal...`)
    const labelsAfterRemoval = await gitApi.getPullRequestLabels(repositoryId, pullRequestId)
    const remainingLabels = labelsAfterRemoval?.map((label: any) => label.name || '') || []
    console.log(`   Remaining labels: [${remainingLabels.join(', ')}]`)
    
    // Step 3: Add all target labels
    console.log(`\n🏷️  Adding target labels...`)
    for (const targetLabel of targetLabels) {
      // Skip if the label already exists
      if (remainingLabels.includes(targetLabel)) {
        console.log(`   Skipping (already exists): "${targetLabel}"`)
        continue
      }
      
      try {
        console.log(`   Adding: "${targetLabel}"`)
        await gitApi.createPullRequestLabel(
          {
            name: targetLabel,
          },
          repositoryId,
          pullRequestId
        )
        console.log(`   ✅ Added: "${targetLabel}"`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(`   ⚠️  Failed to add "${targetLabel}": ${errorMessage}`)
        // Continue with other labels
      }
    }
    
    console.log(`✅ Label replacement process completed`)
    
    // Verify the final state
    const finalLabelsResponse = await gitApi.getPullRequestLabels(repositoryId, pullRequestId)
    const finalLabels = finalLabelsResponse?.map((label: any) => label.name || '') || []
    console.log(`🔍 Final labels: [${finalLabels.join(', ')}]`)
    
    // Log what was actually changed
    const added = targetLabels.filter((label: string) => !currentLabels.includes(label))
    const removed = currentLabels.filter((label: string) => !targetLabels.includes(label))
    const actuallyRemoved = currentLabels.filter((label: string) => !finalLabels.includes(label))
    
    if (added.length > 0) {
      console.log(`➕ Intended to add: [${added.join(', ')}]`)
    }
    if (removed.length > 0) {
      console.log(`➖ Intended to remove: [${removed.join(', ')}]`)
    }
    if (actuallyRemoved.length > 0) {
      console.log(`✂️  Actually removed: [${actuallyRemoved.join(', ')}]`)
    }
    
  } catch (error) {
    console.error(`❌ Failed during label replacement process:`, error)
    throw error
  }
  
  console.log(`=== Label Replacement Completed ===\n`)
}

async function applyLabelOperations(
  gitApi: any,
  repositoryId: string,
  pullRequestId: number,
  operations: LabelOperation[]
): Promise<void> {
  console.log(`\n=== Applying ${operations.length} Label Operations ===`)
  
  for (const operation of operations) {
    try {
      if (operation.action === 'add') {
        console.log(`🏷️  Adding label: "${operation.label}"`)
        await gitApi.createPullRequestLabel(
          {
            name: operation.label,
          },
          repositoryId,
          pullRequestId
        )
        console.log(`✅ Successfully added label: "${operation.label}"`)
      } else if (operation.action === 'remove') {
        console.log(`🗑️  Removing label: "${operation.label}"`)
        
        // Check if label contains special characters that need encoding
        const hasSpecialChars = operation.label.includes(':') || operation.label.includes('/') || operation.label.includes('?')
        
        if (hasSpecialChars) {
          console.log(`🔧 Label contains special characters, trying URL encoding...`)
          const encodedLabelName = encodeURIComponent(operation.label)
          console.log(`🔧 Encoded label name: "${encodedLabelName}"`)
          
          try {
            await gitApi.deletePullRequestLabels(
              repositoryId,
              pullRequestId,
              encodedLabelName
            )
            console.log(`✅ Successfully removed label with encoding: "${operation.label}"`)
          } catch (encodedError) {
            console.warn(`⚠️  URL encoded delete failed, trying direct API call...`)
            
            // Try a more direct approach - get all labels and set the new ones
            try {
              const currentLabelsResponse = await gitApi.getPullRequestLabels(repositoryId, pullRequestId)
              const currentLabels = currentLabelsResponse?.map((label: any) => label.name || '') || []
              
              // Remove the target label from current labels
              const updatedLabels = currentLabels.filter((label: string) => label !== operation.label)
              
              console.log(`🔄 Updating labels via replacement: removing "${operation.label}"`)
              console.log(`   Before: [${currentLabels.join(', ')}]`)
              console.log(`   After:  [${updatedLabels.join(', ')}]`)
              
              // Use updatePullRequestLabels to set all labels at once
              await gitApi.updatePullRequestLabels(
                updatedLabels.map((labelName: string) => ({ name: labelName })),
                repositoryId,
                pullRequestId
              )
              
              console.log(`✅ Successfully removed label via replacement: "${operation.label}"`)
            } catch (replacementError) {
              console.error(`❌ All removal methods failed for label "${operation.label}":`)
              console.error(`  Encoded error:`, encodedError)
              console.error(`  Replacement error:`, replacementError)
              console.warn(`⚠️  Skipping removal of label "${operation.label}"`)
            }
          }
        } else {
          // Simple label without special characters - use standard API
          try {
            await gitApi.deletePullRequestLabels(
              repositoryId,
              pullRequestId,
              operation.label
            )
            console.log(`✅ Successfully removed simple label: "${operation.label}"`)
          } catch (simpleError) {
            console.error(`❌ Failed to remove simple label "${operation.label}":`, simpleError)
          }
        }
      }
    } catch (error) {
      console.error(`❌ Failed to ${operation.action} label '${operation.label}':`, error)
      // Continue with other operations even if one fails
    }
  }
  
  console.log(`=== Label Operations Completed ===\n`)
}

run()
