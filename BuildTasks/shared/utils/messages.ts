import * as tl from 'azure-pipelines-task-lib'

import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces'

import { AzureConnectionType } from '../models'
import { createPullRequestThreadService } from '../services'
import { code, oneLineCode } from './markdown'
import { getPipelineUrl } from './methods'

/**
 * The function `betaPublishAppSuccessMessage` sends a success message for a beta app publication, including
 * the old and new versions, app name, and a link to the build pipeline.
 * @param {string} old_version - The old version of the app.
 * @param {string} new_version - The `new_version` parameter is a string that represents the new
 * version of the app being published.
 * @param {string} app_name - The `app_name` parameter is the name of the application that is being
 * published.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It is used to establish a connection to Azure DevOps for creating a pull
 * request thread.
 * @returns the result of the `createPullRequestThreadService` function, which is an asynchronous
 * operation.
 */
export const betaPublishAppSuccessMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  const pipelineLink = getPipelineUrl()
  const installMessage = code(`vtex install ${app_name}@${new_version}`)
  const message = `
  Your App in **Beta** is successfully published. :rocket:
  version: **${old_version} :arrow_right: ${new_version}**
  
  You can proceed with the installation in your workspace by running the following command:
  
  ${installMessage}
  
  You can check the execution of the build pipeline by following this <a href="${pipelineLink}">link</a>.
  
  Happy testing 😉!
`
  return await createPullRequestThreadService(azureConnection, message)
}

export const publishAppSuccessMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  const installMessage = code(`vtex install ${app_name}@${new_version}`)
  const deployMessage = code(`vtex deploy ${app_name}@${new_version}`)
  const message = `
  Your app has been successfully published! :rocket:
  version: **${old_version} :arrow_right: ${new_version}**
  
  Once the A/B tests have been performed with the new version, you can proceed with deploying your release by running the following command:

  ${deployMessage}

  Or you can install the new version in your workspace by running the following command:

  ${installMessage}

  After the deployment, your app will be updated on all accounts.

  For more information on the deployment process, please refer to the [documentation](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-making-your-new-app-version-publicly-available#step-5---deploying-the-app-stable-version). :book:

  > Note: At this stage, only the build process has been completed successfully. The application still needs to undergo testing and the final deployment to ensure its stability and reliability. Make sure to follow the necessary procedures and best practices to guarantee a smooth release.

  If you have any questions or need further assistance, feel free to reach out to us.

  Happy testing and deploying! :tada:
`
  return await createPullRequestThreadService(azureConnection, message)
}

/**
 * The `startBuildBetaMessage` function generates a message to notify users that their Beta app is
 * being published, including the old and new version numbers, and a link to the build pipeline.
 * @param {string} old_version - The old version of the app that is being updated.
 * @param {string} new_version - The `new_version` parameter is a string that represents the new
 * version of the app being published.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to connect to Azure services.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const startBuildBetaMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string
) => {
  const pipelineLink = getPipelineUrl()
  const message = `
  Your **Beta** app is being published 📦
  version: **${old_version} :arrow_right: ${new_version}**
  
  You can check the execution of the build pipeline by following this.
  
  <a href="${pipelineLink}">pipeline link</a>
  
  Happy build 😉!
`
  return await createPullRequestThreadService(azureConnection, message)
}

/**
 * The `startBuildMessage` function generates a message to notify the user about the start of a build
 * process, including the old and new versions of the app and a link to the build pipeline.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType` and represents the connection to the Azure DevOps service. It is used to
 * authenticate and authorize the user to perform actions related to the build pipeline.
 * @param {string} old_version - The `old_version` parameter represents the current version of the app
 * before the build.
 * @param {string} new_version - The `new_version` parameter is a string that represents the new
 * version of the app that is being published.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const startBuildMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string
) => {
  const pipelineLink = getPipelineUrl()
  const message = `
  Your app is being published! 📦
  version: **${old_version} :arrow_right: ${new_version}**
  
  You can check the execution of the build pipeline by following this.
  
  <a href="${pipelineLink}">pipeline link</a>
  
  Happy build 😉!
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

/**
 * The function `vtexBuildFailureMessage` sends a failure message with a link to the pipeline to a pull
 * request thread using an Azure connection.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to interact with Azure
 * services. The specific properties and structure of `AzureConnectionType` are not provided in the
 * code snippet, so you would need to refer to the documentation or code implementation to understand
 * its
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const vtexBuildFailureMessage = async (
  azureConnection: AzureConnectionType
) => {
  const pipelineLink = getPipelineUrl()
  const message = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 It seems that there was an error while attempting to build the app. Please check the logs and address the issue as soon as possible.

  <a href="${pipelineLink}">pipeline link</a>

  Thank you! 🙏
`
  return await createPullRequestThreadService(azureConnection, message)
}

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
 * The function sends an error message to a pull request thread in Azure DevOps.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to connect to the Azure
 * service.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const errorOnGetTheReleaseVersionMessage = async (
  azureConnection: AzureConnectionType
) => {
  const messageThread = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 It seems that there was an error while attempting to get the release version. Please check the logs and address the issue as soon as possible.

  Thank you! 🙏
`
  await createPullRequestThreadService(azureConnection, messageThread)
  const errorMessage =
    'Could not get release version. Please make sure you have the correct configuration in the package.json or manifest.json file.'
  tl.setResult(tl.TaskResult.Failed, errorMessage)
  throw new Error(errorMessage)
}

/**
 * This function sends a message to a pull request thread and throws an error if the release type
 * cannot be obtained.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection to the Azure DevOps service.
 */
export const errorOnGetReleaseTypeMessage = async (
  azureConnection: AzureConnectionType
) => {
  const messageThread = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 Please add a title to the pull request with the following format:

  **[minor]** or [changed] New feature, functionality, or content added to the project.
  **[patch]** Modifications or updates to existing features, functionality, or content.
  **[major]** Significant changes that may impact compatibility or require special attention.

  > example: **[minor] Merge feature/branch into develop**

  Thank you! 🙏
`
  await createPullRequestThreadService(azureConnection, messageThread)
  const errorMessage =
    'Could not get release type. Please make sure you have the correct configuration in the package.json or manifest.json file.'
  tl.setResult(tl.TaskResult.Failed, errorMessage)
  throw new Error(errorMessage)
}
