import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  changeOriginToSourceBranch,
  checkDirectory,
  getPublishVariables,
  getReleaseVersion,
  installPackages,
  installProjex,
  installVtex,
  makeLoginVtex,
  vtexPullRequestPublish,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const taskVariables = getPublishVariables()
    const { publishCommand } = taskVariables
    const azureConnection = await GitPulRequestConnection()
    const { pullRequest } = azureConnection
    const { sourceRefName } = pullRequest

    // 3. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(sourceRefName, azureConnection)
    // 2. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      true,
      azureConnection
    )
    // ******* Configuration *******

    // ******* Publish *******
    // 1. make the publish
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
