import * as tl from 'azure-pipelines-task-lib'

import {
  changeOriginToSourceBranch,
  checkDirectory,
  createRelease,
  getPipelineExecutorInformation,
  getPipelineSourceBranch,
  getReleaseVersion,
  installPackages,
  installProjex,
  setEmailAndUserGit,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installProjex()
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 1. get the release version from the title of the pull request
    const { app_name, new_version } = await getReleaseVersion(false)
    // 2. set the email and user in git
    const { requestedFor, requestedForEmail } = getPipelineExecutorInformation()
    await setEmailAndUserGit(requestedFor, requestedForEmail)
    // 3. Change origin to source branch
    const sourceRefName = getPipelineSourceBranch()
    await changeOriginToSourceBranch(sourceRefName)
    // ******* Configuration *******

    // ******* Release *******
    // 1. Create the release and push the changes to git
    await createRelease(false)

    // 5. Show pipeline success message
    tl.setResult(
      tl.TaskResult.Succeeded,
      `app ${app_name} released successfully with version ${new_version}`
    )
    // ******* Release *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
