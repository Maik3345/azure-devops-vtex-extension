import * as tl from 'azure-pipelines-task-lib'

import {
  initialSetup,
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
    // 1. install vtex, projex and make login in vtex with projex
    // 1. Get the task variables and check the directory
    const taskVariables = await initialSetup()
    const { forcePublish, deploy } = taskVariables

    // 2. install packages, vtex, projex and make login in vtex with projex
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
