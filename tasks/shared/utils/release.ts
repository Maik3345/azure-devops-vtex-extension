import { AzureConnectionType } from '../models'
import { vtexPublishFailureMessage } from './messages'
import { runCommand } from './runCommand'

/**
 * The `makeRelease` function runs a command to create a release in Azure, with specified arguments,
 * and handles the success and failure cases.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`. It is likely an object that contains information needed to establish a
 * connection to an Azure service, such as credentials or connection settings.
 * @param {string} args - The `args` parameter is a string that represents additional arguments to be
 * passed to the `projex git release` command. These arguments can be used to customize the behavior of
 * the release process.
 */
const makeRelease = async (
  tagName: string,
  azureConnection?: AzureConnectionType
) => {
  await runCommand(
    `projex git release ${tagName} --yes --no-deploy --no-check-release`,
    '.',
    'generate release change in the manifest.json file without push to git',
    false,
    0,
    false,
    true,
    azureConnection
      ? () => vtexPublishFailureMessage(azureConnection)
      : () => {}
  )
}

/**
 * The function `createRelease` generates a release and pushes changes to git, updating the
 * manifest.json file and changelog based on the specified beta flag and Azure connection.
 * @param {boolean} beta - The `beta` parameter is a boolean value that indicates whether the release
 * being created is a beta release or not. If `beta` is `true`, then the release will be a beta
 * release; otherwise, it will be a stable release.
 * @param {AzureConnectionType} [azureConnection] - The `azureConnection` parameter is an optional
 * parameter of type `AzureConnectionType`. It is used to establish a connection to Azure services if
 * needed for the release process. If provided, it will be used in the `makeRelease` function to
 * interact with Azure services during the release creation.
 * @returns The `createRelease` function is returning the result of calling the `makeRelease` function
 * with the `args` and `azureConnection` parameters. The `makeRelease` function generates a release and
 * pushes changes to git, updating the `manifest.json` file and changelog file with the last commits.
 * The result of this operation is being returned by the `createRelease` function.
 */
export const createRelease = async (
  beta: boolean,
  azureConnection?: AzureConnectionType
) => {
  // TagName to use in the release
  const tagName = beta ? '' : 'stable'

  // Generate the release and push the changes to git, this execution change the manifest.json file and update the changelog file with the last commits
  return makeRelease(tagName, azureConnection)
}
