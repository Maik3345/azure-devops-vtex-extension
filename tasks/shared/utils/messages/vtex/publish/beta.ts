import { AzureConnectionType } from '../../../../models'
import { createPullRequestThreadService } from '../../../../services'
import { code } from '../../../markdown'
import { getPipelineUrl } from '../../../methods'

/**
 * The `startPublishBetaMessage` function generates a message to notify users that their Beta app is
 * being published, including the old and new version numbers, and a link to the build pipeline.
 * @param {string} old_version - The old version of the app that is being updated.
 * @param {string} new_version - The `new_version` parameter is a string that represents the new
 * version of the app being published.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It represents the connection details required to connect to Azure services.
 * @returns a promise that resolves to the result of the `createPullRequestThreadService` function.
 */
export const startPublishBetaMessage = async (
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

export const betaPublishIgnoreMessage = async (
  azureConnection: AzureConnectionType
) => {
  const message = `
  Hi there! 👋 I'm the CI/CD Bot, and I'm here to assist you! 🤖

  You use the tag [no-beta] in the title of the pull request.

  🚫 The beta publish app process has been ignored based on the title of the pull request. No action has been taken.

  If you believe this is an error or need further assistance, please let us know.

  Thank you! 🙏
`
  return await createPullRequestThreadService(azureConnection, message)
}
