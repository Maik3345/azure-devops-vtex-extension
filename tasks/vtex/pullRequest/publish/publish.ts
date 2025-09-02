import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  getPublishVariables,
  getReleaseVersion,
  vtexPullRequestPublish,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 2. Get the variables
    const { publishCommand } = getPublishVariables()
    const azureConnection = await GitPulRequestConnection()
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(true)
    // ******* Configuration *******

    // ******* Publish *******
    // 2. make the publish
    await vtexPullRequestPublish(
      azureConnection,
      old_version,
      new_version,
      app_name,
      publishCommand
    )
    // ******* Publish *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
