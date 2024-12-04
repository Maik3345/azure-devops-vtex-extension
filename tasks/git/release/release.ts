import * as tl from 'azure-pipelines-task-lib'

import {
  configurePipelineGit,
  createRelease,
  getReleaseVariables,
} from '../../shared'

async function run() {
  try {
    // 1. Get the git release variables
    const { beta } = getReleaseVariables()
    // ******* Configuration *******
    await configurePipelineGit()
    // ******* Configuration *******

    // ******* Release *******
    // 1. Create the release and push the changes to git
    await createRelease(beta)
    // 2. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, 'app released successfully')
    // ******* Release *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
