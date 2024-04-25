import { ReleaseType } from '../constants'
import { AzureConnectionType } from '../models'
import { vtexBuildFailureMessage } from './messages'
import { runCommand } from './runCommand'

const makeReleaseWithoutPush = async (
  azureConnection: AzureConnectionType,
  release: string
) => {
  return await runCommand(
    `projex git release ${release} --yes --no-deploy --no-push --no-check-release`,
    '.',
    'generate release change in the manifest.json file without push to git',
    false,
    0,
    false,
    true,
    () => vtexBuildFailureMessage(azureConnection)
  )
}

const makePublish = async (
  azureConnection: AzureConnectionType,
  forceVtexPublish: string
) => {
  const forcePublish = forceVtexPublish === 'true' ? '--force' : ''
  return await runCommand(
    `projex vtex run "vtex publish -y ${forcePublish}"`,
    '.',
    'vtex publish',
    false,
    0,
    false,
    true,
    () => vtexBuildFailureMessage(azureConnection)
  )
}

const makeResetHard = async (azureConnection: AzureConnectionType) => {
  return await runCommand(
    `projex bash run "git reset --hard"`,
    '.',
    'reset changes',
    false,
    0,
    false,
    true,
    () => vtexBuildFailureMessage(azureConnection)
  )
}

export const vtexPublish = async (
  azureConnection: AzureConnectionType,
  titleRelease: string,
  releaseType: ReleaseType,
  forceVtexPublish: string
) => {
  // 1. update changelog file with the release type, not push changes to git, only overwrite the file
  await makeReleaseWithoutPush(
    azureConnection,
    `${releaseType} stable ${titleRelease}`
  )
  // 2. publish using vtex
  await makePublish(azureConnection, forceVtexPublish)
  // 3. reset --hard
  await makeResetHard(azureConnection)
}
