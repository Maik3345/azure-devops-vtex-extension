import axios from 'axios'
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces'
import { AzureConnectionType } from '../models'

/**
 * The `completePullRequestService` function completes a pull request by sending a PATCH request to the
 * Azure DevOps API with the necessary data and headers.
 * @param {GitPullRequest} pullRequest - The `pullRequest` parameter is an object that represents the
 * pull request being completed. It contains information such as the pull request ID, title,
 * description, and the last merge source commit.
 * @param {AzureConnectionType}  - - `pullRequest`: The GitPullRequest object representing the pull
 * request to be completed.
 * @returns the result of the axios request.
 */
export const completePullRequestService = async (
  { repositoryId, collectionUri, accessToken }: AzureConnectionType,
  pullRequest: GitPullRequest
) => {
  const mergeCommitMessage = `Merged PR ${pullRequest.pullRequestId}: ${pullRequest.title} \n ${pullRequest.description}`

  return await axios({
    method: 'PATCH',
    url: `${collectionUri}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequest.pullRequestId}?api-version=6.0`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: JSON.stringify({
      status: 'completed',
      lastMergeSourceCommit: {
        commitId: pullRequest.lastMergeSourceCommit.commitId,
      },
      completionOptions: {
        bypassPolicy: true,
        bypassReason: 'CI/CD Automated PR merge',
        deleteSourceBranch: true,
        description: pullRequest.description,
        mergeCommitMessage,
      },
    }),
  })
}
