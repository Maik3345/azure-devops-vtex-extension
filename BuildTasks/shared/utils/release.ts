import { ReleaseType } from '../constants'
import { AzureConnectionType } from '../models'
import { vtexBuildFailureMessage } from './messages'
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
    'reset changes and push the beta build to git',
    false,
    0,
    false,
    true,
    () => vtexBuildFailureMessage(azureConnection)
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
  const commitsInString = await getPullRequestCommits(azureConnection)

  // Release Type, Title Release, Commits in string
  const args = `${releaseType} stable ${titleRelease} ${JSON.stringify(
    commitsInString
  )}`

  // Generate the release and push the changes to git, this execution change the manifest.json file and update the changelog file with the last commits
  return makeRelease(azureConnection, args)
}
