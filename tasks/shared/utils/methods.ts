import * as tl from '../../vtex/build/node_modules/azure-pipelines-task-lib/task'

export const getPipelineUrl = () => {
  const url = `${tl.getVariable('System.CollectionUri')}${tl.getVariable(
    'System.TeamProject'
  )}/_build/results?buildId=${tl.getVariable('Build.BuildId')}`
  return url
}

/**
 * The function `getDevelopTargetRefBranch` returns a reference to the branch with the given name.
 * @param {string} branch - The `branch` parameter is a string that represents the name of a branch in
 * a version control system, such as Git.
 * @returns a string that is the concatenation of the string "refs/heads/" and the value of the
 * `branch` parameter.
 */
export const getDevelopTargetRefBranch = (branch: string) => {
  return `refs/heads/${branch}`
}
