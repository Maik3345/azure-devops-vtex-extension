import { AzureConnectionType } from '../../models'
import { ignoreBetaRelease } from '../getReleaseType'
import * as tl from 'azure-pipelines-task-lib'

/**
 * The function `ignoreExecutionBeta` checks if a pull request is a beta release and if it should be
 * ignored based on certain conditions.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is likely an object
 * that represents a connection to Azure services or resources. It could contain information such as
 * credentials, endpoints, or configurations needed to interact with Azure services programmatically.
 * @param {boolean} beta - The `beta` parameter is a boolean value that indicates whether the pull
 * request is a beta release or not. If `beta` is `true`, it means the pull request is a beta release
 * and needs to be checked for further processing.
 * @returns The function `ignoreExecutionBeta` is returning a Promise that resolves to `undefined`.
 */
export const ignoreExecutionBeta = async (
  azureConnection: AzureConnectionType,
  beta: boolean
) => {
  // 1. check if the pull request is a beta release and if it should be ignored
  if (!beta) {
    return true
  }

  const ignoreBetaExecution = await ignoreBetaRelease(azureConnection)
  if (ignoreBetaExecution) {
    tl.setResult(
      tl.TaskResult.Succeeded,
      'Beta release ignored because of the title of the pull request have [no-beta]'
    )
    return false
  }
}
