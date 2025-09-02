import * as tl from 'azure-pipelines-task-lib'

/**
 * Throws an error and sets the task result to failed when the release version cannot be retrieved.
 *
 * This function is typically used in build or deployment pipelines to indicate that the release version
 * could not be determined due to missing or incorrect configuration in the `package.json` or `manifest.json` files.
 *
 * @throws {Error} Always throws an error with a descriptive message about the missing release version.
 */
export const errorOnGetTheReleaseVersionMessage = async () => {
  const errorMessage =
    'Could not get release version. Please make sure you have the correct configuration in the package.json or manifest.json file.'
  tl.setResult(tl.TaskResult.Failed, errorMessage)
  throw new Error(errorMessage)
}
