import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces'
import { AzureConnectionType } from '../../models'
import { createPullRequestThreadService } from '../../services'
import { oneLineCode } from '../markdown'

/**
 * This function generates an error message for a failed pull request creation and sends it to a pull
 * request thread service.
 * @param {string} sourceRef - The source branch from which the pull request is being created.
 * @param {string} targetRef - The target branch where the pull request is being created.
 * @param {string} title - The title of the pull request. It is a string that represents the title of
 * the pull request that was attempted to be created.
 * @param {IdentityRef} createdBy - The `createdBy` parameter is of type `IdentityRef` and represents
 * the user who created the pull request. It contains information about the user, such as their display
 * name, unique identifier, and other properties.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection to the Azure DevOps service.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const pullRequestCreationErrorMessage = async (
  azureConnection: AzureConnectionType,
  sourceRef: string, // Rama de origen
  targetRef: string, // Rama de destino
  title: string, // Título del pull request
  createdBy: IdentityRef // Descripción del pull request
) => {
  const message = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 It seems that there was an error while attempting to create the pull request in the target branch ${oneLineCode(
    targetRef
  )}. Please check if there's already an active pull request from the current source branch ${oneLineCode(
    sourceRef
  )}.
  
  **Error Details:**
  - **Source Branch:** ${oneLineCode(sourceRef)}
  - **Target Branch:** ${oneLineCode(targetRef)}
  - **Title:** ${oneLineCode(title)}
  - **Created by:** ${oneLineCode(createdBy.displayName)}
  
  Kindly review and address this issue as soon as possible. If you need further assistance, feel free to reach out to the development team.
  
  Thank you! 🙏
`
  return await createPullRequestThreadService(azureConnection, message)
}

/**
 * The function `pullRequestCreationSuccessMessage` generates a success message for a pull request
 * creation and sends it as a thread in an Azure DevOps service.
 * @param {string} remoteUrl - The URL of the remote repository where the pull request was created.
 * @param {string} sourceRef - The source branch of the pull request. It represents the branch where
 * the changes were made and will be merged into the target branch.
 * @param {string} targetRef - The `targetRef` parameter represents the target branch of the pull
 * request. It is the branch where the changes will be merged into.
 * @param {string} title - The `title` parameter is a string that represents the title of the pull
 * request. It is used to provide a brief description of the changes being made in the pull request.
 * @param {string} displayName - The `displayName` parameter is the name of the user who created the
 * pull request. It is used to display the name of the user in the pull request creation success
 * message.
 * @param {number} pullRequestId - The `pullRequestId` parameter is the unique identifier of the pull
 * request that was created. It is typically a number that is assigned to the pull request by the
 * version control system.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It is used to establish a connection to the Azure DevOps service in order to
 * create a pull request thread. The specific implementation of `AzureConnectionType` is not provided
 * in the code snippet, but it likely contains the necessary information
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const pullRequestCreationSuccessMessage = async (
  azureConnection: AzureConnectionType,
  remoteUrl: string,
  sourceRef: string,
  targetRef: string,
  title: string,
  displayName: string,
  pullRequestId: number
) => {
  const message = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm excited to inform you that the pull request has been created successfully! 🎉
  
  Your changes have been submitted for review. If you need further assistance or have any questions, feel free to reach out to the development team.
  
  <a href="${remoteUrl}/pullrequest/${pullRequestId}" target="_blank">Click here to view the pull request</a>
  
  **Pull Request Details:**
  - **Source Branch:** ${oneLineCode(sourceRef)}
  - **Target Branch:** ${oneLineCode(targetRef)}
  - **Title:** ${oneLineCode(title)}
  - **Created by:** ${oneLineCode(displayName)}
  
  Thank you for your contribution! 🙌
`
  return await createPullRequestThreadService(azureConnection, message)
}
