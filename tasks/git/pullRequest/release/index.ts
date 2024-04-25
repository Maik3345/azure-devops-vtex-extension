import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  asyncTimeout,
  changeOriginToSourceBranch,
  completePullRequestService,
  createPullRequestService,
  createRelease,
  determineReleaseType,
  getDevelopTargetRefBranch,
  getReleaseVersion,
  ignoreBetaRelease,
  ignoreExecutionBeta,
  initialSetup,
  installPackages,
  installProjex,
  releaseAppSuccessMessage,
  setEmailAndUserGit,
  startReleaseMessage,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Get the task variables and check the directory
    const taskVariables = await initialSetup()
    const { beta, mergeIntoDevelop, devBranch } = taskVariables
    const azureConnection = await GitConnection()
    const ignoreBeta = await ignoreExecutionBeta(azureConnection, beta)

    if (ignoreBeta) {
      return
    }

    const { pullRequest } = azureConnection
    const { createdBy, sourceRefName, targetRefName } = pullRequest

    // 2. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installProjex()
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release type from the title of the pull request, if it is a beta release, it will return the type and title
    const { typeRelease, titleRelease } =
      (await determineReleaseType(azureConnection, beta)) ?? {}

    if (!titleRelease || !typeRelease) {
      throw new Error(
        'Failed to retrieve release type from the pull request title'
      )
    }

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
    // 5. show pipeline start release process
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
    // ******* Release *******

    // ******* Release success thread *******
    await releaseAppSuccessMessage(
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
