import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  configurePullRequestAndGit,
  createRelease,
  getReleaseVersion,
  makeResetHard,
} from '../../../shared'

async function run() {
  try {
    await makeResetHard()

    // ******* get connection *******
    const azureConnection = await GitPulRequestConnection()
    // ******* get connection *******

    // ******* Configuration *******
    await configurePullRequestAndGit(azureConnection)
    // ******* Configuration *******

    // ******* Release *******
    // 1. get the release version from the title of the pull request
    await getReleaseVersion(true)
    // ******* Configuration *******

    // 2. Create the release and push the changes to git
    await createRelease(true)

    // ******* Release *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
