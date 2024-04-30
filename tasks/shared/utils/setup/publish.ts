import { AzureConnectionType } from '../../models'
import { ignorePublish } from '../getReleaseType'
import * as tl from 'azure-pipelines-task-lib'

export const ignoreExecutionPublish = async (
  azureConnection: AzureConnectionType
) => {
  const ignore = await ignorePublish(azureConnection)
  if (ignore) {
    tl.setResult(
      tl.TaskResult.Skipped,
      'Publish process ignored because of the title of the pull request have [no-publish]'
    )
    return true
  }

  return false
}
