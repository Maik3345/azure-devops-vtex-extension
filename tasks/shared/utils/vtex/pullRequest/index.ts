import { ReleaseType } from '../../../constants'
import { AzureConnectionType } from '../../../models'
import {
  publishAppSuccessMessage,
  publishWithDeployAppSuccessMessage,
  startDeployMessage,
  startPublishMessage,
  vtexPublishFailureMessage,
} from '../../messages'
import { runCommand } from '../../runCommand'

/**
 * This TypeScript function generates a release change in the manifest.json file without pushing to
 * git.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType - a type representing the
 * connection details needed to interact with Azure services, such as authentication credentials or
 * connection settings.
 * @param {string} release - The `release` parameter is a string that represents the version or name of
 * the release being created. In this function, it is used as part of the command to generate a release
 * change in the manifest.json file without pushing to Git.
 * @returns The function `makeReleaseWithoutPush` is returning the result of the `runCommand` function
 * with the specified parameters. The `runCommand` function is executing the command `projex git
 * release  --yes --no-deploy --no-push --no-check-release` in the current directory (`'.'`)
 * with a description of 'generate release change in the manifest.json file without push to
 */
const makeReleaseWithoutPush = async (
  azureConnection: AzureConnectionType,
  release: string
) => {
  return await runCommand(
    `projex git release ${release} --yes --no-deploy --no-push --no-check-release --no-tag`,
    '.',
    'generate release change in the manifest.json file without push to git',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

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
 * The function `makeResetHard` resets changes in a Git repository using a specific command and handles
 * failure messages related to Azure connections.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType
 * @returns The `makeResetHard` function is returning the result of the `runCommand` function with the
 * specified parameters.
 */
const makeResetHard = async (azureConnection: AzureConnectionType) => {
  return await runCommand(
    `projex bash run "git reset --hard"`,
    '.',
    'reset changes',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

/**
 * The function `vtexPullRequestPublish` updates a changelog file, publishes using VTEX, and then
 * resets the changes.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter likely represents the
 * connection details or credentials required to interact with Azure services in your code. It could
 * include information such as the Azure account credentials, subscription details, or any other
 * necessary authentication information needed to perform actions in Azure.
 * @param {string} titleRelease - The `titleRelease` parameter is a string that represents the title of
 * the release being published. It is used in the process of updating the changelog file and publishing
 * the release using VTEX.
 * @param {ReleaseType} releaseType - The `releaseType` parameter in the `vtexPullRequestPublish`
 * function is used to specify the type of release being published. It could be values like "major",
 * "minor", or "patch" indicating the significance of the release version.
 * @param {boolean} forcePublish - The `forcePublish` parameter is used to specify whether the
 * VTEX publish should be forced. When set to `true`, it indicates that the publish operation should
 * proceed even if there are potential conflicts or issues that would normally prevent the publish.
 * This can be useful in situations where you want to
 */
export const vtexPullRequestPublish = async (
  azureConnection: AzureConnectionType,
  releaseType: ReleaseType,
  forcePublish: boolean,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  // 1. show pipeline start build process
  await startPublishMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush(azureConnection, `${releaseType} stable`)
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
 * The function `vtexPullRequestDeploy` deploys an application using VTEX, with the option to force
 * publish, and includes warning and success messages.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType` and likely contains the necessary information to connect to an Azure service
 * for deployment.
 * @param {boolean} forcePublish - The `forcePublish` parameter is a boolean value that determines
 * whether the deployment should be forced or not. If set to `true`, the deployment will be forced,
 * bypassing any checks or restrictions. If set to `false`, the deployment will proceed normally
 * without forcing it.
 * @param {string} old_version - The `old_version` parameter in the `vtexPullRequestDeploy` function
 * represents the version of the application before the deployment process. It is a string that
 * indicates the previous version of the application that is being updated or deployed.
 * @param {string} new_version - The `new_version` parameter in the `vtexPullRequestDeploy` function
 * represents the version number of the application that you are deploying. It is used to specify the
 * new version of the application that will be deployed during the process.
 * @param {string} app_name - The `app_name` parameter in the `vtexPullRequestDeploy` function
 * represents the name of the application that is being deployed using VTEX. It is a string value that
 * identifies the specific application being deployed.
 */
export const vtexPullRequestDeploy = async (
  azureConnection: AzureConnectionType,
  releaseType: ReleaseType,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  // 1. print warning message
  await startDeployMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush(azureConnection, `${releaseType} stable`)
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
