import { AzureConnectionType } from '../../../models'
import { makeReleaseWithoutPush, makeResetHard } from '../../git'
import { publishAppSuccessMessage } from '../../messages'
import { runCommand } from '../../runCommand'

const makePublish = async (publishCommand: string) => {
  return await runCommand(
    publishCommand,
    '.',
    `running ${publishCommand}`,
    false,
    0,
    false,
    true
  )
}

const makeDeploy = async (deployCommand: string) => {
  return await runCommand(
    deployCommand,
    '.',
    `running ${deployCommand}`,
    false,
    0,
    false,
    true
  )
}

export const vtexPullRequestPublish = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string,
  publishCommand: string
) => {
  // 1. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush('')
  // 2. publish using vtex
  await makePublish(publishCommand)
  // 3. print success message
  await publishAppSuccessMessage(
    azureConnection,
    old_version,
    new_version,
    app_name
  )
  // 4. reset --hard
  await makeResetHard()
}

export const vtexPullRequestDeploy = async (deployCommand: string) => {
  // 1. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush('')
  // 2. deploy using vtex
  await makeDeploy(deployCommand)
  // 3. reset --hard
  await makeResetHard()
}
