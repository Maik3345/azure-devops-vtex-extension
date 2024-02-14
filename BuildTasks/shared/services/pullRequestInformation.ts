import { GitApi } from 'azure-devops-node-api/GitApi'

export const getPullRequestInformationService = async (
  gitApi: GitApi,
  pullRequestId: number
) => {
  const response = gitApi.getPullRequestById(pullRequestId)

  return response
}
