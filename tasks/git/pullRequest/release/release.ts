import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  asyncTimeout,
  betaPublishIgnoreMessage,
  changeOriginToSourceBranch,
  checkDirectory,
  completePullRequestService,
  createPullRequestService,
  createRelease,
  determineReleaseType,
  getDevelopTargetRefBranch,
  getGitReleaseVariables,
  getReleaseVersion,
  ignoreExecutionBeta,
  ignoreExecutionPublish,
  installPackages,
  installProjex,
  publishAppIsIgnoredMessage,
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
    const { devBranch, mergeIntoDevelop, beta } = getGitReleaseVariables()
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
    const { createdBy, sourceRefName, targetRefName } = pullRequest
    // 3. get the release type from the title of the pull request, if it is a beta release, it will return the type and title
    const { typeRelease, titleRelease } =
      (await determineReleaseType(azureConnection, beta)) ?? {}

    // 4. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installProjex()
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
    // 4. show pipeline start release process
    await startReleaseMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // ******* Release *******
    if (!beta) {
      // 1. Complete the pull request in the main branch
      await completePullRequestService(azureConnection, pullRequest)

      // 1.1 Esperar 30 segundos para que el pull request se cree correctamente
      await asyncTimeout(30000)

      // 2. Change to the main branch
      await changeOriginToSourceBranch(azureConnection, targetRefName)
    }

    // 3. Create the release and push the changes to git
    await createRelease(azureConnection, titleRelease, typeRelease)

    if (beta && mergeIntoDevelop) {
      // 3. Create pull request to develop and automatically merge it
      await createPullRequestService(
        azureConnection,
        getDevelopTargetRefBranch(devBranch)
      )
    }

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
