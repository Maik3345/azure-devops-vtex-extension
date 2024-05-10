import * as tl from 'azure-pipelines-task-lib'
import * as azdev from 'azure-devops-node-api'
import { GitApi } from 'azure-devops-node-api/GitApi'
import { getPullRequestId } from '../utils'
import { AzureConnectionType } from '../models'
import { getPullRequestInformationService } from './pullRequestInformation'

export const GitPulRequestConnection = async (): Promise<AzureConnectionType> => {
  const pullRequestId = getPullRequestId()
  const accessToken =
    tl.getEndpointAuthorizationParameter(
      'SystemVssConnection',
      'AccessToken',
      false
    ) ?? ''
  const authHandler = azdev.getPersonalAccessTokenHandler(accessToken) ?? ''

  if (!pullRequestId || !authHandler) {
    console.log(
      { pullRequestId, authHandler },
      'No pull request id - skipping PR comment or no auth handler found.'
    )
    tl.setResult(
      tl.TaskResult.Failed,
      'No pull request id - skipping PR comment or no auth handler found.'
    )
    return
  }

  if (!authHandler) {
    console.log({ authHandler }, 'no auth handler found.')
    tl.setResult(tl.TaskResult.Failed, 'no auth handler found.')
    return
  }

  const collectionUri = tl.getVariable('System.CollectionUri') ?? ''
  const repositoryId = tl.getVariable('Build.Repository.ID') ?? ''
  const connection = new azdev.WebApi(collectionUri, authHandler)
  const gitApi: GitApi = await connection.getGitApi()

  const pullRequest = await getPullRequestInformationService(
    gitApi,
    pullRequestId
  )

  if (!pullRequest) {
    console.log({ pullRequest }, 'No pull request found.')
    tl.setResult(tl.TaskResult.Failed, 'No pull request found.')
    return
  }

  const settings = {
    repositoryId,
    collectionUri,
    pullRequest,
    accessToken,
  }
  console.log(JSON.stringify(settings))

  return { ...settings, gitApi }
}
