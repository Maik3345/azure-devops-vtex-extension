import * as tl from 'azure-pipelines-task-lib'

import { AzureConnectionType } from '../models'
import {
  pullRequestCreationErrorMessage,
  pullRequestCreationSuccessMessage,
} from '../utils'
import { asyncTimeout } from '../utils/asyncTmeOut'
import { completePullRequestService } from './completePullRequest'

export const createPullRequestService = async (
  azureConnection: AzureConnectionType,
  targetRef: string // Rama de destino
) => {
  const {
    gitApi,
    repositoryId,
    pullRequest: { sourceRefName, title, description, createdBy },
  } = azureConnection
  try {
    const pullRequest = await gitApi.createPullRequest(
      {
        status: 2,
        sourceRefName: sourceRefName,
        targetRefName: targetRef,
        title: title,
        description: description,
        createdBy,
        creationDate: new Date(),
      },
      repositoryId
    )

    if (!pullRequest) {
      pullRequestCreationErrorMessage(
        azureConnection,
        sourceRefName,
        targetRef,
        title,
        createdBy
      )
      tl.setResult(tl.TaskResult.Failed, 'Error creating pull request.')
      throw new Error('Error creating pull request')
    }

    // Esperar 30 segundos para que el pull request se cree correctamente
    await asyncTimeout(30000)

    await completePullRequestService(azureConnection, pullRequest)

    await pullRequestCreationSuccessMessage(
      azureConnection,
      pullRequest.repository.webUrl,
      sourceRefName,
      targetRef,
      title,
      createdBy.displayName,
      pullRequest.pullRequestId
    )

    return pullRequest
  } catch (error) {
    console.error(error)
    await pullRequestCreationErrorMessage(
      azureConnection,
      sourceRefName,
      targetRef,
      title,
      createdBy
    )
    tl.setResult(tl.TaskResult.Failed, 'Error creating pull request.')
    throw new Error('Error creating pull request')
  }
}
