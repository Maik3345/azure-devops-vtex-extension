import { AzureConnectionType } from '../models'
import { vtexBuildFailureMessage } from './messages'
import { runCommand } from './runCommand'

export const setEmailAndUserGit = async (
  azureConnection: AzureConnectionType,
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
    true,
    () => vtexBuildFailureMessage(azureConnection)
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
  azureConnection: AzureConnectionType,
  sourceRefName: string
) => {
  const sourceBranchName = sourceRefName.replace('refs/heads/', '')

  return await runCommand(
    `git fetch origin && git checkout ${sourceBranchName}`,
    '.',
    'fetch origin and checkout source branch',
    false,
    0,
    false,
    true,
    () => vtexBuildFailureMessage(azureConnection)
  )
}
