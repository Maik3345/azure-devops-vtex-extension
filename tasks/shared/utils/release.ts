import { ReleaseType } from '../constants'
import { AzureConnectionType } from '../models'
import { vtexPublishFailureMessage } from './messages'
import { getPullRequestCommits } from './pullRequest'
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
  azureConnection: AzureConnectionType,
  args: string
) => {
  await runCommand(
    `projex git release ${args} --yes --no-deploy --no-check-release`,
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
 * The function `updateChangelogContent` updates the changelog file with the last commits for a
 * specific release in an Azure project.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter likely represents a
 * connection to an Azure service or resource. It could be an object containing authentication details,
 * such as credentials or tokens, needed to interact with Azure services programmatically. This
 * connection is used within the `updateChangelogContent` function to retrieve pull request commits and
 * @param {string} titleRelease - The `titleRelease` parameter is a string that represents the title of
 * the release for which you want to update the changelog content. It is used as part of the arguments
 * passed to the `projex git update changelog` command to specify the title of the release.
 */
const updateChangelogContent = async (
  azureConnection: AzureConnectionType,
  titleRelease: string
) => {
  const commitsInString = await getPullRequestCommits(azureConnection)

  // Release Type, Title Release, Commits in string
  const args = `${titleRelease} ${JSON.stringify(commitsInString)}`
  await runCommand(
    `projex git update changelog ${args}`,
    '.',
    'update changelog file with the last commits',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

/**
 * This function adds all changes in the Git repository.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is likely an object
 * or a type that contains information related to connecting to Azure services. It could include
 * details such as authentication credentials, connection settings, or other necessary information for
 * interacting with Azure services in the context of the function `makeAddGitChanges`.
 * @returns The `makeAddGitChanges` function is being returned.
 */
const makeAddGitChanges = async (azureConnection: AzureConnectionType) => {
  return await runCommand(
    `git add .`,
    '.',
    'add git changes',
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

/**
 * The function `createRelease` generates a release and pushes the changes to git, updating the
 * manifest.json file and changelog file with the last commits.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`, which represents the connection details for connecting to Azure services.
 * @param {string} titleRelease - The `titleRelease` parameter is a string that represents the title or
 * name of the release. It is used to identify the release in the system.
 * @param {ReleaseType} releaseType - The `releaseType` parameter is a string that represents the type
 * of release. It could be "major", "minor", or "patch" depending on the versioning scheme you are
 * using.
 * @returns the result of the `makeRelease` function, which is likely a promise that resolves to the
 * result of generating a release and pushing the changes to git.
 */
export const createRelease = async (
  azureConnection: AzureConnectionType,
  titleRelease: string,
  releaseType: ReleaseType
) => {
  // Update the changelog file with the last commits
  await updateChangelogContent(azureConnection, titleRelease)
  await makeAddGitChanges(azureConnection)

  // Release Type, Title Release
  const args = `${releaseType} stable`

  // Generate the release and push the changes to git, this execution change the manifest.json file and update the changelog file with the last commits
  return makeRelease(azureConnection, args)
}
