import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  configurePullRequestAndGit,
  createRelease,
  getReleaseVersion,
  releaseAppSuccessMessage,
  startReleaseMessage,
} from '../../../shared'

async function run() {
  try {
    // ******* get connection *******
    const azureConnection = await GitPulRequestConnection()
    // ******* get connection *******

    // ******* Configuration *******
    await configurePullRequestAndGit(azureConnection)
    // ******* Configuration *******

    // ******* Release *******
    // 1. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      true,
      azureConnection
    )
    // 2. show pipeline start release process
    await startReleaseMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // 3. Create the release and push the changes to git
    await createRelease(true, azureConnection)

    // 4. Show pipeline success message
    await releaseAppSuccessMessage(
      azureConnection,
      old_version,
      new_version,
      app_name
    )
    // ******* Release *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
