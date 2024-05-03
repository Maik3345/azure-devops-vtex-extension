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
  vtexPullRequestPublish,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const taskVariables = getPublishVariables()
    const { forcePublish, deploy, beta } = taskVariables
    const azureConnection = await GitConnection()
    const ignoreBeta = await ignoreExecutionBeta(azureConnection, beta)
    const ignorePublish = await ignoreExecutionPublish(azureConnection)

    if (ignoreBeta) {
      console.log('Ignoring beta release')
      betaPublishIgnoreMessage(azureConnection)
      tl.setResult(tl.TaskResult.Skipped, 'Ignoring beta release')
      return
    }

    if (ignorePublish) {
      console.log('Ignoring publish')
      publishAppIsIgnoredMessage(azureConnection)
      tl.setResult(tl.TaskResult.Skipped, 'Ignoring publish')
      return
    }

    const { pullRequest } = azureConnection
    const { sourceRefName } = pullRequest
    // 3. get the release type from the title of the pull request
    const { typeRelease } = await determineReleaseType(azureConnection, beta)

    // 4. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(azureConnection, sourceRefName)
    // 3. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      azureConnection,
      typeRelease
    )
    // ******* Configuration *******

    // ******* Publish *******
    // 1. make the publish
    await vtexPullRequestPublish(
      azureConnection,
      typeRelease,
      forcePublish,
      old_version,
      new_version,
      app_name
    )
    // ******* Publish *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
