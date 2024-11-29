import * as tl from 'azure-pipelines-task-lib'

import {
  getPublishVariables,
  makeReleaseWithoutPush,
  makeResetHard,
  vtexPublish,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Get the variables
    const { publishCommand } = getPublishVariables()
    // ******* Setup utilities *******

    // ******* Publish *******
    // 1. Create the release without push
    await makeReleaseWithoutPush('stable')
    // 2. Publish the app
    await vtexPublish(publishCommand)
    // 3. Reset the hard
    await makeResetHard()

    // 4. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `publish success`)
    // ******* Publish *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
