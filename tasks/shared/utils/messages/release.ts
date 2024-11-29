import * as tl from 'azure-pipelines-task-lib'
import { AzureConnectionType } from '../../models'
import { createPullRequestThreadService } from '../../services'
import { getPipelineUrl } from '../methods'

/**
 * The function `releaseAppSuccessMessage` sends a success message with app details after a successful
 * release.
 * @param {AzureConnectionType} azureConnection - `azureConnection` is a parameter of type
 * `AzureConnectionType` which likely contains the necessary information to establish a connection with
 * Azure services or resources. This could include credentials, endpoints, or other configuration
 * details required to interact with Azure services programmatically.
 * @param {string} old_version - The `old_version` parameter in the `releaseAppSuccessMessage` function
 * represents the version number of the app before the release. It is a string that indicates the
 * previous version of the app that is being updated.
 * @param {string} new_version - The `new_version` parameter in the `releaseAppSuccessMessage` function
 * represents the version number of the app that has been successfully released. It is a string value
 * that indicates the new version of the app.
 * @param {string} app_name - The `app_name` parameter in the `releaseAppSuccessMessage` function
 * refers to the name of the application that has been released. It is a string value that represents
 * the name of the app.
 * @returns The function `releaseAppSuccessMessage` is returning the result of calling the
 * `createPullRequestThreadService` function with the `azureConnection` and `message` parameters.
 */
export const releaseAppSuccessMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  const message = `
  Your app ${app_name}@${new_version} has been successfully released! 🚀
  version: **${old_version} :arrow_right: ${new_version}**
`
  return await createPullRequestThreadService(azureConnection, message)
}

/**
 * The function `startReleaseMessage` generates a release message with version information and a link
 * to the build pipeline, then creates a pull request thread using the message.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is likely an object
 * or a connection string that provides the necessary credentials and information to interact with
 * Azure services, such as Azure DevOps or Azure Pipelines. It could include details like the
 * authentication token, project ID, organization URL, or any other required information to establish a
 * @param {string} old_version - The `old_version` parameter in the `startReleaseMessage` function
 * represents the version number of the app before the release. It is a string that indicates the
 * previous version of the application that is being updated or released.
 * @param {string} new_version - The `new_version` parameter in the `startReleaseMessage` function
 * represents the version number of the app that is being released. It is the updated version number
 * that will be deployed as part of the release process.
 * @returns The `startReleaseMessage` function is returning the result of the
 * `createPullRequestThreadService` function after passing in the `azureConnection` and `message`
 * parameters.
 */
export const startReleaseMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string
) => {
  const pipelineLink = getPipelineUrl()
  const message = `
  Your app is being released! 🚀
  version: **${old_version} :arrow_right: ${new_version}**
  
  You can check the execution of the build pipeline by following this.
  
  <a href="${pipelineLink}">pipeline link</a>
  
  Happy release 😉!
`
  return await createPullRequestThreadService(azureConnection, message)
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
  **[no-beta]** Skip the beta version and release directly to the stable version.
  **[no-publish]** Skip the release process and do not publish the app.


  > example: **[minor] Merge feature/branch into develop**

  Thank you! 🙏
`
  await createPullRequestThreadService(azureConnection, messageThread)
  const errorMessage =
    'Could not get release type. Please make sure you have the correct configuration in the package.json or manifest.json file.'
  tl.setResult(tl.TaskResult.Failed, errorMessage)
  throw new Error(errorMessage)
}

/**
 * The function sends an error message to a pull request thread in Azure DevOps.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to connect to the Azure
 * service.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const errorOnGetTheReleaseVersionMessage = async (
  azureConnection?: AzureConnectionType
) => {
  if (azureConnection) {
    const messageThread = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 It seems that there was an error while attempting to get the release version. Please check the logs and address the issue as soon as possible.

  Thank you! 🙏
`
    await createPullRequestThreadService(azureConnection, messageThread)
  }

  const errorMessage =
    'Could not get release version. Please make sure you have the correct configuration in the package.json or manifest.json file.'
  tl.setResult(tl.TaskResult.Failed, errorMessage)
  throw new Error(errorMessage)
}
