import { GitApi } from 'azure-devops-node-api/GitApi'
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces'

export interface AzureConnectionType {
  gitApi: GitApi
  repositoryId: string
  collectionUri: string
  pullRequest: GitPullRequest
  accessToken: string
}
