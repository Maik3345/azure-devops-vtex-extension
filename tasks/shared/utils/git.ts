import { AzureConnectionType } from '../models'
import { runCommand } from './runCommand'

/**
 * Sets the global Git user name and email configuration.
 *
 * Executes the necessary Git commands to configure the global user name and email
 * using the provided `authorName` and `authorEmail` values.
 *
 * @param authorName - The name to set as the Git user name.
 * @param authorEmail - The email address to set as the Git user email.
 * @returns A promise that resolves when the Git configuration commands have completed.
 */
export const setEmailAndUserGit = async (
  authorName: string,
  authorEmail: string
) => {
  return runCommand(
    `git config --global user.name "${authorName}" && git config --global user.email "${authorEmail}"`,
    '.',
    'apply email and user to git',
    false,
    0,
    false,
    true
  )
}

/**
 * Changes the current Git working directory to the specified source branch.
 *
 * This function performs the following steps:
 * 1. Extracts the branch name from the given `sourceRefName` (removing the 'refs/heads/' prefix).
 * 2. Fetches the latest changes from the remote `origin`.
 * 3. Checks out the extracted source branch.
 * 4. Pulls the latest changes for the source branch from `origin`.
 * 5. Converts the repository to a complete clone if it was a shallow clone.
 * 6. Lists all commits in the current branch in a one-line format.
 *
 * @param sourceRefName - The full ref name of the source branch (e.g., 'refs/heads/feature/my-branch').
 * @returns A promise that resolves with the result of the executed Git commands.
 */
export const changeOriginToSourceBranch = async (sourceRefName: string) => {
  const sourceBranchName = sourceRefName.replace('refs/heads/', '')

  return await runCommand(
    `git fetch origin && git checkout ${sourceBranchName} && git pull origin ${sourceBranchName} && git fetch --unshallow && git rev-list HEAD --pretty=oneline`,
    '.',
    'fetch origin and checkout source branch',
    false,
    0,
    false,
    true
  )
}

/**
 * Generates a release change in the `manifest.json` file without pushing changes to Git.
 *
 * This function runs the `projex git release` command with options to skip deployment,
 * pushing, release checks, and tagging. It is useful for preparing a release locally
 * without affecting the remote repository.
 *
 * @param tagName - The name of the release tag to generate.
 * @returns A promise that resolves with the result of the release command execution.
 */
export const makeReleaseWithoutPush = async (tagName: string) => {
  return await runCommand(
    `projex git release ${tagName} --yes --no-deploy --no-push --no-check-release --no-tag`,
    '.',
    'generate release change in the manifest.json file without push to git',
    false,
    0,
    false,
    true
  )
}

export const makeResetHard = async () => {
  return await runCommand(
    `projex bash run "git reset --hard"`,
    '.',
    'reset changes',
    false,
    0,
    false,
    true
  )
}

export const configurePullRequestAndGit = async (
  azureConnection?: AzureConnectionType
) => {
  const { pullRequest } = azureConnection
  const { sourceRefName, createdBy } = pullRequest
  const { displayName, uniqueName } = createdBy ?? {}
  // 1. set the email and user in git
  await setEmailAndUserGit(displayName, uniqueName)
  // 2. change current source origin to sourceBranchName
  await changeOriginToSourceBranch(sourceRefName)
}
