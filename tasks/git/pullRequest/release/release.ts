import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  changeOriginToSourceBranch,
  checkDirectory,
  createPullRequestService,
  createRelease,
  getDevelopTargetRefBranch,
  getGitReleaseVariables,
  getReleaseVersion,
  installPackages,
  installProjex,
  releaseAppSuccessMessage,
  setEmailAndUserGit,
  startReleaseMessage,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const { devBranch, mergeIntoDevelop } = getGitReleaseVariables()
    const azureConnection = await GitPulRequestConnection()

    const { pullRequest } = azureConnection
    const { sourceRefName, targetRefName, createdBy } = pullRequest

    // 3. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installProjex()
    // ******* Setup utilities *******

    // ******* Configuration *******
    const { displayName, uniqueName } = createdBy ?? {}
    // 1. set the email and user in git
    await setEmailAndUserGit(displayName, uniqueName, azureConnection)
    // 2. change current source origin to sourceBranchName
    await changeOriginToSourceBranch(sourceRefName, azureConnection)
    // 3. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(
      true,
      azureConnection
    )
    // 3. show pipeline start release process
    await startReleaseMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // 4. Create the release and push the changes to git
    await createRelease(true, azureConnection)

    if (mergeIntoDevelop) {
      // 1. Create pull request to develop and automatically merge it
      await createPullRequestService(
        azureConnection,
        getDevelopTargetRefBranch(devBranch)
      )
    }

    // 5. Show pipeline success message
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
