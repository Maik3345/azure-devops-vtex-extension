import { AzureConnectionType } from '../models'
import { vtexPublishFailureMessage } from './messages'
import { runCommand } from './runCommand'

/**
 * This function sets the user name and email for Git globally using the provided author name and
 * email.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType - a type representing the
 * connection details to an Azure service, such as credentials or endpoint information.
 * @param {string} authorName - The `authorName` parameter is a string that represents the name of the
 * user that will be associated with the Git commits.
 * @param {string} authorEmail - The `authorEmail` parameter is the email address that will be
 * associated with the Git user when setting up the global Git configuration. This email address is
 * typically used for identification and communication purposes when making commits to a Git
 * repository.
 * @returns The `setEmailAndUserGit` function is returning the result of running a command to set the
 * global user name and email in Git configuration.
 */
export const setEmailAndUserGit = async (
  authorName: string,
  authorEmail: string,
  azureConnection?: AzureConnectionType
) => {
  return runCommand(
    `git config --global user.name "${authorName}" && git config --global user.email "${authorEmail}"`,
    '.',
    'apply email and user to git',
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
 * The function changes the current branch to the specified source branch by fetching the latest
 * changes from the origin and checking out the source branch.
 * @param {string} sourceRefName - The `sourceRefName` parameter is a string that represents the
 * reference name of the source branch. It should be in the format `refs/heads/<branch-name>`, where
 * `<branch-name>` is the name of the branch you want to change to.
 * @returns Nothing is being returned. The function has a return type of `void`, which means it does
 * not return any value.
 */
export const changeOriginToSourceBranch = async (
  sourceRefName: string,
  azureConnection?: AzureConnectionType
) => {
  const sourceBranchName = sourceRefName.replace('refs/heads/', '')

  return await runCommand(
    `git fetch origin && git checkout ${sourceBranchName} && git pull origin ${sourceBranchName} && git fetch --unshallow && git rev-list HEAD --pretty=oneline`,
    '.',
    'fetch origin and checkout source branch',
    false,
    0,
    false,
    true,
    azureConnection
      ? () => vtexPublishFailureMessage(azureConnection)
      : () => {}
  )
}

export const makeReleaseWithoutPush = async (
  tagName: string,
  azureConnection?: AzureConnectionType
) => {
  return await runCommand(
    `projex git release ${tagName} --yes --no-deploy --no-push --no-check-release --no-tag`,
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

export const makeResetHard = async (azureConnection?: AzureConnectionType) => {
  return await runCommand(
    `projex bash run "git reset --hard"`,
    '.',
    'reset changes',
    false,
    0,
    false,
    true,
    azureConnection
      ? () => vtexPublishFailureMessage(azureConnection)
      : () => {}
  )
}
