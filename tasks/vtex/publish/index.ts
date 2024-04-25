import * as tl from 'azure-pipelines-task-lib'

import { initialSetup, vtexDeploy, vtexPublish } from '../../shared'

async function run() {
  try {
    // ******* Setup utilities *******
    // 1. install vtex, projex and make login in vtex with projex
    const { forceVtexPublish, deploy } = await initialSetup({
      vtex: true,
      projex: true,
    })
    // ******* Setup utilities *******

    // ******* Publish And Deploy *******
    // 1. make the publish
    await vtexPublish(forceVtexPublish)
    await vtexDeploy(deploy)
    console.log(`Publish ${deploy === 'true' ? 'and deploy' : ''} success`)
    // ******* Publish And Deploy *******
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
