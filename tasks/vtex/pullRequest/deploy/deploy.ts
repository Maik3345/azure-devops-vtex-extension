import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  changeOriginToSourceBranch,
  getPublishVariables,
  vtexPullRequestDeploy,
} from '../../../shared'

async function run() {
  try {
    // 1. Get the variables
    const { deployCommand } = getPublishVariables()
    const azureConnection = await GitPulRequestConnection()
    const {
      pullRequest: { sourceRefName },
    } = azureConnection

    // 2. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(sourceRefName)
    // 3. make the Deploy
    await vtexPullRequestDeploy(deployCommand)
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
