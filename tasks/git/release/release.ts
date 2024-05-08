import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  checkDirectory,
  createRelease,
  getGitReleaseVariables,
  getReleaseVersion,
  installPackages,
  installProjex,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const { devBranch, mergeIntoDevelop, beta } = getGitReleaseVariables()
    const azureConnection = await GitPulRequestConnection()
    // 4. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installProjex()
    // ******* Setup utilities *******

    // ******* Configuration *******
    // 2. get the release version from the title of the pull request
    const { app_name, old_version, new_version } = await getReleaseVersion(beta)
    // ******* Configuration *******

    // ******* Release *******
    // 1. Create the release and push the changes to git
    await createRelease(beta)

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
