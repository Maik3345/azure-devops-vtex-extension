import axios from 'axios'
import { AzureConnectionType, PullRequestCommentsType } from '../models'

export const getAllPullRequestCommitsService = async ({
  repositoryId,
  collectionUri,
  accessToken,
  pullRequest,
}: AzureConnectionType): Promise<PullRequestCommentsType> => {
  const commits = await axios({
    method: 'GET',
    url: `${collectionUri}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequest.pullRequestId}/commits?api-version=7.1-preview.1`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return commits.data
}
