import * as tl from 'azure-pipelines-task-lib'

import { getLoginVariables, makeLoginVtex } from '../../shared'

async function run() {
  try {
    // 1. Make login to VTEX
    await makeLoginVtex(getLoginVariables())
    // 2. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `login success`)
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
