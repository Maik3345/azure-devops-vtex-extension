import * as tl from 'azure-pipelines-task-lib'

async function run() {
  try {
    tl.setResult(tl.TaskResult.Failed, 'Task deprecated.')
  } catch {
    tl.setResult(tl.TaskResult.Failed, 'Task deprecated.')
  }
}

run()
