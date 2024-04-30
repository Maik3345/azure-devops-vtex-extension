import * as tl from 'azure-pipelines-task-lib'

import {
  checkDirectory,
  getPublishVariables,
  installPackages,
  installProjex,
  installVtex,
  makeLoginVtex,
  vtexDeploy,
  vtexPublish,
} from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. Check the directory
    await checkDirectory()
    // 2. Get the git release variables
    const taskVariables = getPublishVariables()
    const { forcePublish, deploy } = taskVariables
    // 3. install packages, vtex, projex and make login in vtex with projex
    await installPackages()
    await installVtex()
    await installProjex()
    await makeLoginVtex(taskVariables)
    // ******* Setup utilities *******

    // ******* Publish And Deploy *******
    // 1. make the publish
    await vtexPublish(forcePublish)
    await vtexDeploy(deploy)
    console.log(`Publish ${deploy ? 'and deploy' : ''} success`)
    // ******* Publish And Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
