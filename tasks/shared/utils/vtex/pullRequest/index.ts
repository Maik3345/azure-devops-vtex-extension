import { AzureConnectionType } from '../../../models'
import { makeReleaseWithoutPush, makeResetHard } from '../../git'
import {
  publishAppSuccessMessage,
  publishWithDeployAppSuccessMessage,
  startDeployMessage,
  startPublishMessage,
  vtexPublishFailureMessage,
} from '../../messages'
import { runCommand } from '../../runCommand'

const makePublish = async (
  azureConnection: AzureConnectionType,
  publishCommand: string
) => {
  return await runCommand(
    publishCommand,
    '.',
    `running ${publishCommand}`,
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

const makeDeploy = async (
  azureConnection: AzureConnectionType,
  deployCommand: string
) => {
  return await runCommand(
    deployCommand,
    '.',
    `running ${deployCommand}`,
    false,
    0,
    false,
    true,
    () => vtexPublishFailureMessage(azureConnection)
  )
}

export const vtexPullRequestPublish = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string,
  publishCommand: string
) => {
  // 1. show pipeline start build process
  await startPublishMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush('', azureConnection)
  // 3. publish using vtex
  await makePublish(azureConnection, publishCommand)
  // 4. print success message
  await publishAppSuccessMessage(
    azureConnection,
    old_version,
    new_version,
    app_name
  )
  // 5. reset --hard
  await makeResetHard(azureConnection)
}

export const vtexPullRequestDeploy = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string,
  deployCommand: string
) => {
  // 1. print warning message
  await startDeployMessage(azureConnection, old_version, new_version)
  // 2. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush('', azureConnection)
  // 3 deploy using vtex
  await makeDeploy(azureConnection, deployCommand)
  // 4. print success message
  await publishWithDeployAppSuccessMessage(
    azureConnection,
    old_version,
    new_version,
    app_name
  )
  // 5. reset --hard
  await makeResetHard(azureConnection)
}
