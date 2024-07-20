import * as tl from 'azure-pipelines-task-lib'

import {
  checkDirectory,
  getPublishVariables,
  installPackages,
  installProjex,
  installVtex,
  makeLoginVtex,
  makeReleaseWithoutPush,
  makeResetHard,
  vtexDeploy,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const taskVariables = getPublishVariables()
    const { deployCommand } = taskVariables
    // 3. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Deploy *******
    await makeReleaseWithoutPush('stable')
    await vtexDeploy(deployCommand)
    await makeResetHard()
    // 2. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `deploy success`)
    // ******* Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
