import * as tl from 'azure-pipelines-task-lib'

import {
  GitPulRequestConnection,
  createPullRequestService,
  getDevelopTargetRefBranch,
  getGitMergeIntoBranch,
} from '../../../shared'

async function run() {
  try {
    // 1. Get the git release variables
    const { branch } = getGitMergeIntoBranch()
    const azureConnection = await GitPulRequestConnection()

    // 1. Create pull request to branch and automatically merge it
    await createPullRequestService(
      azureConnection,
      getDevelopTargetRefBranch(branch)
    )
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
