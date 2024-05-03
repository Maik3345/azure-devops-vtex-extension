import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  betaPublishIgnoreMessage,
  changeOriginToSourceBranch,
  checkDirectory,
  determineReleaseType,
  getPublishVariables,
  getReleaseVersion,
  ignoreExecutionBeta,
  ignoreExecutionPublish,
  installPackages,
  installProjex,
  installVtex,
  makeLoginVtex,
  publishAppIsIgnoredMessage,
  setEmailAndUserGit,
  startPublishMessage,
  vtexPullRequestDeploy,
  vtexPullRequestPublish,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const taskVariables = getPublishVariables()
    const azureConnection = await GitConnection()

    const { pullRequest } = azureConnection
    const { createdBy, sourceRefName } = pullRequest
    // 3. get the release type from the title of the pull request
    const { typeRelease } = await determineReleaseType(azureConnection, false)

    // 4. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Configuration *******
    const { displayName, uniqueName } = createdBy ?? {}
    // 1. set the email and user in git
    await setEmailAndUserGit(azureConnection, displayName, uniqueName)
    // 2. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(azureConnection, sourceRefName)
    // 3. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      azureConnection,
      typeRelease
    )
    // ******* Configuration *******

    // ******* Deploy *******
    // 1. make the Deploy
    await vtexPullRequestDeploy(
      azureConnection,
      typeRelease,
      old_version,
      new_version,
      app_name
    )
    // ******* Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
