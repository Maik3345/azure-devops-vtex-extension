import * as tl from 'azure-pipelines-task-lib'

import { configurePipelineGit } from '../../shared'

async function run() {
  try {
    // 1. configure the source branch and email
    await configurePipelineGit()
    // 2. Show pipeline success message
    tl.setResult(tl.TaskResult.Succeeded, `change origin successfully`)
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
