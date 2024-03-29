import * as tl from 'azure-pipelines-task-lib'

export const getPullRequestId = () => {
  const pullRequestId = parseInt(
    tl.getVariable('System.PullRequest.PullRequestId') ?? '-1'
  )
  if (pullRequestId < 0) {
    console.log(`No pull request id - skipping PR comment`)
    return
  }
  return pullRequestId
}
