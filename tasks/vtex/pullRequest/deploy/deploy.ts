import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  changeOriginToSourceBranch,
  getPublishVariables,
  getReleaseVersion,
  vtexPullRequestDeploy,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Get the variables
    const { deployCommand } = getPublishVariables()
    const azureConnection = await GitPulRequestConnection()
    const {
      pullRequest: { sourceRefName },
    } = azureConnection
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(sourceRefName, azureConnection)
    // 2. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      false,
      azureConnection
    )
    // ******* Configuration *******

    // ******* Deploy *******
    // 1. make the Deploy
    await vtexPullRequestDeploy(
      azureConnection,
      old_version,
      new_version,
      app_name,
      deployCommand
    )
    // ******* Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
