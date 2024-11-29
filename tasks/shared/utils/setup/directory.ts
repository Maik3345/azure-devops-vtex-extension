import { getAppRoot } from '../manifestUtils'
import { resolve } from 'path'
import * as tl from 'azure-pipelines-task-lib'

/**
 * The function `checkIfDirectoryIsCorrect` checks for the presence of specific files in a directory and returns
 * their paths if found.
 * @returns The function `checkIfDirectoryIsCorrect` is returning an object with properties `manifestFile`,
 * `packageFile`, and `changelogPath` if they are found in the specified directory. If `CHANGELOG.md`
 * is not found, it will set the task result to 'Failed' with a message indicating that the file is not
 * found. If either `manifest.json` or `package.json` is not found
 */
export const checkIfDirectoryIsCorrect = () => {
  const root = getAppRoot()
  const manifestFile = resolve(root, 'manifest.json')
  const packageFile = resolve(root, 'package.json')
  const changelogPath = resolve(root, 'CHANGELOG.md')

  if (!changelogPath) {
    tl.setResult(tl.TaskResult.Failed, 'CHANGELOG.md not found')
    return
  }

  if (!manifestFile || !packageFile) {
    tl.setResult(
      tl.TaskResult.Failed,
      'manifest.json or package.json not found'
    )
    return
  }

  return { manifestFile, packageFile, changelogPath }
}
