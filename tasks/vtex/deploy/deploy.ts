import * as tl from 'azure-pipelines-task-lib'

import {
  getPublishVariables,
  makeReleaseWithoutPush,
  makeResetHard,
  vtexDeploy,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Get the variables
    const { deployCommand } = getPublishVariables()
    // ******* Setup utilities *******

    // ******* Deploy *******
    // 1. Make release without push
    await makeReleaseWithoutPush('stable')
    // 2. Deploy
    await vtexDeploy(deployCommand)
    // 3. Reset hard
    await makeResetHard()
    // 4. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `deploy success`)
    // ******* Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
