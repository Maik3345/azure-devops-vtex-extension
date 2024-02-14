import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  ReleaseType,
  changeOriginToSourceBranch,
  createRelease,
  createPullRequestService,
  getReleaseType,
  getReleaseVersion,
  makeInitialSetup,
  betaPublishAppSuccessMessage,
  setEmailAndUserGit,
  startBuildBetaMessage,
  vtexPublish,
  getDevelopTargetRefBranch,
} from '../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. install vtex, projex and make login in vtex with projex
    const { devBranch } = await makeInitialSetup()
    const azureConnection = await GitConnection()
    const { pullRequest } = azureConnection
    const { createdBy, sourceRefName } = pullRequest

    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release type from the title of the pull request
    const { titleRelease } = (await getReleaseType(azureConnection)) ?? {}
    if (!titleRelease) {
      throw new Error('Error on get release type')
    }

    // 2. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      azureConnection,
      ReleaseType.prerelease
    )
    const { displayName, uniqueName } = createdBy ?? {}
    // 2. set the email and user in git
    await setEmailAndUserGit(azureConnection, displayName, uniqueName)
    // 3. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(azureConnection, sourceRefName)
    // 5. show pipeline start build beta process
    await startBuildBetaMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // ******* Beta publish *******
    // 1. make the beta publish
    await vtexPublish(azureConnection, titleRelease, ReleaseType.prerelease)

    // 2. Create the beta release and push the changes to git
    await createRelease(azureConnection, titleRelease, ReleaseType.prerelease)

    // 3. Create pull request to develop and automatically merge it
    await createPullRequestService(
      azureConnection,
      getDevelopTargetRefBranch(devBranch)
    )
    // ******* Beta publish *******

    // ******* Beta success thread *******
    await betaPublishAppSuccessMessage(
      azureConnection,
      old_version,
      new_version,
      app_name
    )
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
