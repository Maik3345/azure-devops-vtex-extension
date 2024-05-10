import { AzureConnectionType } from '../../../models'
import { makeReleaseWithoutPush, makeResetHard } from '../../git'
import {
  publishAppSuccessMessage,
  publishWithDeployAppSuccessMessage,
  startDeployMessage,
  startPublishMessage,
  vtexPublishFailureMessage,
} from '../../messages'
import { runCommand } from '../../runCommand'

/**
 * The function `makePublish` asynchronously runs a VTEX publish command with optional force flag based
 * on the input parameters.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter likely represents a
 * connection to an Azure service or resource. It could be an object or configuration that contains
 * information needed to interact with Azure services, such as credentials, endpoints, or other
 * settings. This connection is used within the `makePublish` function to handle a failure scenario
 * @param {boolean} forcePublish - The `forcePublish` parameter is a string that determines
 * whether the VTEX publish command should be forced. If the value of `forcePublish` is `'true'`,
 * then the `--force` flag will be included in the VTEX publish command.
 * @returns The `makePublish` function is returning the result of the `runCommand` function with the
 * specified parameters.
 */
const makePublish = async (
  azureConnection: AzureConnectionType,
  forcePublish: boolean
) => {
  const force = forcePublish ? '--force' : ''
  return await runCommand(
    `projex vtex run "vtex publish -y ${force} --verbose" --verbose`,
    '.',
    'vtex publish',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

const makeDeploy = async (
  azureConnection: AzureConnectionType,
  force: boolean
) => {
  const forceDeploy = force ? '--force' : ''
  return await runCommand(
    `projex vtex run "vtex deploy -y ${forceDeploy} --verbose" --verbose`,
    '.',
    'vtex deploy',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

/**
 * This TypeScript function handles the process of publishing a VTEX pull request, including starting
 * the build process, updating the changelog, publishing using VTEX, printing success messages, and
 * resetting changes.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is likely an object
 * that contains connection information for interacting with Azure services, such as authentication
 * details, endpoints, and other configuration settings. It is used throughout the
 * `vtexPullRequestPublish` function to perform various actions related to publishing a VTEX pull
 * request.
 * @param {boolean} forcePublish - The `forcePublish` parameter is a boolean value that determines
 * whether the publishing process should be forced or not. If set to `true`, the publishing will be
 * done forcefully without any checks or validations. If set to `false`, the publishing process will
 * proceed as usual with the necessary checks and validations in
 * @param {string} old_version - The `old_version` parameter in the `vtexPullRequestPublish` function
 * represents the version of the application before the update or changes being made. It is a string
 * value that indicates the previous version of the application.
 * @param {string} new_version - The `new_version` parameter in the `vtexPullRequestPublish` function
 * is used to specify the new version number of the application being published. It is a string type
 * parameter that represents the version number to be assigned to the updated application.
 * @param {string} app_name - The `app_name` parameter in the `vtexPullRequestPublish` function
 * represents the name of the application that is being published. It is used in the final step to
 * print a success message after the publishing process is completed.
 * @param {boolean} beta - The `beta` parameter is a boolean flag that indicates whether the release is
 * a beta version or not. If `beta` is true, the release will be marked as a beta version; otherwise,
 * it will be marked as a stable version.
 */
export const vtexPullRequestPublish = async (
  azureConnection: AzureConnectionType,
  forcePublish: boolean,
  old_version: string,
  new_version: string,
  app_name: string,
  beta: boolean
) => {
  // 1. show pipeline start build process
  await startPublishMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush(beta ? '' : 'stable', azureConnection)
  // 3. publish using vtex
  await makePublish(azureConnection, forcePublish)
  // 4. print success message
  await publishAppSuccessMessage(
    azureConnection,
    old_version,
    new_version,
    app_name
  )
  // 5. reset --hard
  await makeResetHard(azureConnection)
}

/**
 * This TypeScript function handles the deployment process for a VTEX pull request, including printing
 * messages, updating changelog, deploying using VTEX, and resetting changes.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is likely an object
 * that contains connection information for Azure services, such as credentials, endpoints, or other
 * configuration details needed to interact with Azure resources.
 * @param {string} old_version - The `old_version` parameter in the `vtexPullRequestDeploy` function
 * represents the version of the application before the deployment process begins. It is a string that
 * indicates the previous version of the application that is being updated or deployed.
 * @param {string} new_version - The `new_version` parameter in the `vtexPullRequestDeploy` function
 * represents the version number of the application that you are deploying. It is the updated version
 * that will be deployed as part of the pull request deployment process.
 * @param {string} app_name - The `app_name` parameter in the `vtexPullRequestDeploy` function
 * represents the name of the application that is being deployed. It is a string value that specifies
 * the name of the application for which the deployment process is being carried out.
 * @param {boolean} beta - The `beta` parameter in the `vtexPullRequestDeploy` function is a boolean
 * flag that indicates whether the deployment is for a beta version or a stable version of the
 * application. If `beta` is `true`, the deployment is for a beta version; otherwise, it is for a
 * stable
 */
export const vtexPullRequestDeploy = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string,
  beta: boolean
) => {
  // 1. print warning message
  await startDeployMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush(`${beta ? '' : 'stable'}`, azureConnection)
  // 3 deploy using vtex
  await makeDeploy(azureConnection, true)
  // 4. print success message
  await publishWithDeployAppSuccessMessage(
    azureConnection,
    old_version,
    new_version,
    app_name
  )
  // 5. reset --hard
  await makeResetHard(azureConnection)
}
