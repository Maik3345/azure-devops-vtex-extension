import { code } from '../../../..'
import { AzureConnectionType } from '../../../../models'
import { createPullRequestThreadService } from '../../../../services'
import { getPipelineUrl } from '../../../methods'

/**
 * The `startPublishMessage` function generates a message to notify the user about the start of a build
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
export const startPublishMessage = async (
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
 * The function `vtexPublishFailureMessage` sends a failure message with a link to the pipeline to a pull
 * request thread using an Azure connection.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to interact with Azure
 * services. The specific properties and structure of `AzureConnectionType` are not provided in the
 * code snippet, so you would need to refer to the documentation or code implementation to understand
 * its
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const vtexPublishFailureMessage = async (
  azureConnection: AzureConnectionType
) => {
  const pipelineLink = getPipelineUrl()
  const message = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  🚨 It seems that there was an error while attempting to publish the app. Please check the logs and address the issue as soon as possible.

  <a href="${pipelineLink}">pipeline link</a>

  Thank you! 🙏
`
  return await createPullRequestThreadService(azureConnection, message)
}

/**
 * The function `publishAppSuccessMessage` generates a success message with instructions for deploying
 * and installing a new version of an app.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter likely refers to the
 * connection details needed to interact with Azure services, such as authentication credentials or
 * connection settings. This could include information like Azure account credentials, subscription
 * details, or resource group information.
 * @param {string} old_version - The `old_version` parameter in the `publishAppSuccessMessage` function
 * represents the version of the app before the update or publish action. It is the version that was
 * previously in use before the new version (`new_version`) was published.
 * @param {string} new_version - The `new_version` parameter in the `publishAppSuccessMessage` function
 * represents the version of your app that has been successfully published. It is the updated version
 * of the app that has undergone the build process and is ready for deployment. This version number is
 * typically incremented from the `old_version` to
 * @param {string} app_name - The `app_name` parameter in the `publishAppSuccessMessage` function
 * refers to the name of the application that has been successfully published. It is used to display
 * the app name in the success message and also in the commands for installing and deploying the new
 * version of the app.
 * @returns The `publishAppSuccessMessage` function returns a Promise that resolves to the result of
 * calling the `createPullRequestThreadService` function with the `azureConnection` and `message`
 * parameters. The `message` is a formatted string containing information about the successful app
 * publication, deployment commands, documentation links, notes, and a message encouraging testing and
 * deployment.
 */
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
