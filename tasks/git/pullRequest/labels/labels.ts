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
    await applyLabelOperations(
      gitApi,
      repositoryId,
      pullRequest.pullRequestId,
      operations
    )

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
  const operations: LabelOperation[] = []

  // Find labels to add (suggested but not current)
  for (const suggestedLabel of suggestedLabels) {
    if (!currentLabels.includes(suggestedLabel)) {
      operations.push({
        action: 'add',
        label: suggestedLabel,
      })
    }
  }

  // Find labels to remove (current but not suggested, if removeOutdated is true)
  if (removeOutdated) {
    for (const currentLabel of currentLabels) {
      if (!suggestedLabels.includes(currentLabel)) {
        operations.push({
          action: 'remove',
          label: currentLabel,
        })
      }
    }
  }

  return operations
}

async function applyLabelOperations(
  gitApi: any,
  repositoryId: string,
  pullRequestId: number,
  operations: LabelOperation[]
): Promise<void> {
  for (const operation of operations) {
    try {
      if (operation.action === 'add') {
        console.log(`Adding label: ${operation.label}`)
        await gitApi.createPullRequestLabel(
          {
            name: operation.label,
          },
          repositoryId,
          pullRequestId
        )
      } else if (operation.action === 'remove') {
        console.log(`Removing label: ${operation.label}`)
        await gitApi.deletePullRequestLabels(
          repositoryId,
          pullRequestId,
          operation.label
        )
      }
    } catch (error) {
      console.warn(
        `Failed to ${operation.action} label '${operation.label}': ${error}`
      )
      // Continue with other operations even if one fails
    }
  }
}

run()
