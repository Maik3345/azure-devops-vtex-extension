import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  asyncTimeout,
  changeOriginToSourceBranch,
  completePullRequestService,
  createRelease,
  getReleaseType,
  getReleaseVersion,
  initialSetup,
  releaseAppSuccessMessage,
  setEmailAndUserGit,
  startReleaseMessage,
} from '../../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. setup the initial configuration for the task and only install projex to make the release
    await initialSetup({
      projex: true,
    })
    const azureConnection = await GitConnection()
    const { pullRequest } = azureConnection
    const { createdBy, sourceRefName, targetRefName } = pullRequest
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release type from the title of the pull request
    const { typeRelease, titleRelease } =
      (await getReleaseType(azureConnection)) ?? {}
    if (!titleRelease || !typeRelease) {
      throw new Error('Error on get release type')
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
    // 1. Complete the pull request in the main branch
    await completePullRequestService(azureConnection, pullRequest)

    // 1.1 Esperar 30 segundos para que el pull request se cree correctamente
    await asyncTimeout(30000)

    // 2. Change to the main branch
    await changeOriginToSourceBranch(azureConnection, targetRefName)

    // 3. Create the release and push the changes to git
    await createRelease(azureConnection, titleRelease, typeRelease)
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
