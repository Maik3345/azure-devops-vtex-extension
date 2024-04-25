import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  changeOriginToSourceBranch,
  determineReleaseType,
  getReleaseVersion,
  ignoreExecutionBeta,
  initialSetup,
  publishAppSuccessMessage,
  setEmailAndUserGit,
  startPublishMessage,
  vtexPullRequestPublish,
  installPackages,
  installProjex,
  installVtex,
  makeLoginVtex,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Get the task variables and check the directory
    const taskVariables = await initialSetup()
    const { forcePublish, deploy, beta } = taskVariables
    const azureConnection = await GitConnection()
    const ignoreBeta = await ignoreExecutionBeta(azureConnection, beta)

    if (ignoreBeta) {
      return
    }

    const { pullRequest } = azureConnection
    const { createdBy, sourceRefName } = pullRequest

    // 2. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release type from the title of the pull request
    const { typeRelease, titleRelease } = await determineReleaseType(
      azureConnection,
      beta
    )

    // 2. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      azureConnection,
      typeRelease
    )
    const { displayName, uniqueName } = createdBy ?? {}
    // 2. set the email and user in git
    await setEmailAndUserGit(azureConnection, displayName, uniqueName)
    // 3. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(azureConnection, sourceRefName)
    // 5. show pipeline start build process
    await startPublishMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // ******* Publish *******
    // 1. make the publish
    await vtexPullRequestPublish(
      azureConnection,
      titleRelease,
      typeRelease,
      forcePublish,
      deploy
    )
    // ******* Publish *******

    // ******* Publish success thread *******
    await publishAppSuccessMessage(
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
