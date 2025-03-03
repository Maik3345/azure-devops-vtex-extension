import * as tl from 'azure-pipelines-task-lib'

import {
  changeOriginToSourceBranch,
  GitPulRequestConnection,
} from '../../../shared'

async function run() {
  try {
    const azureConnection = await GitPulRequestConnection()
    const {
      pullRequest: { sourceRefName },
    } = azureConnection
    // 1. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(sourceRefName, azureConnection)
    // 2. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `change origin successfully`)
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
