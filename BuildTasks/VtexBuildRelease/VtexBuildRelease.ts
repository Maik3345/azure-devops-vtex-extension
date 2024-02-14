import * as tl from 'azure-pipelines-task-lib'

import {
  GitConnection,
  asyncTimeout,
  changeOriginToSourceBranch,
  completePullRequestService,
  createRelease,
  getReleaseType,
  getReleaseVersion,
  makeInitialSetup,
  publishAppSuccessMessage,
  setEmailAndUserGit,
  startBuildMessage,
  vtexPublish,
} from '../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. install vtex, projex and make login in vtex with projex
    await makeInitialSetup()
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
    // 5. show pipeline start build process
    await startBuildMessage(azureConnection, old_version, new_version)
    // ******* Configuration *******

    // ******* Publish *******
    // 1. make the publish
    await vtexPublish(azureConnection, titleRelease, typeRelease)

    // 2. Complete the pull request in the main branch
    await completePullRequestService(azureConnection, pullRequest)

    // 2.1 Esperar 30 segundos para que el pull request se cree correctamente
    await asyncTimeout(30000)

    // 3. Change to the main branch
    await changeOriginToSourceBranch(azureConnection, targetRefName)

    // 4. Create the release and push the changes to git
    await createRelease(azureConnection, titleRelease, typeRelease)
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
