import * as tl from '../../vtex/build/node_modules/azure-pipelines-task-lib/task'
import { runCommand } from './runCommand'
import { getAppRoot } from './manifestUtils'
import { resolve } from 'path'

export const makeInitialSetup = async () => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)
  const devBranch: string | undefined = tl.getInput('devBranch', true)
  const forceVtexPublish: string | undefined = tl.getInput(
    'forceVtexPublish',
    true
  )

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

  if (
    !apiKey ||
    !apiToken ||
    !email ||
    !account ||
    !devBranch ||
    apiKey == 'bad' ||
    apiToken == 'bad' ||
    email == 'bad' ||
    account == 'bad' ||
    devBranch == 'bad'
  ) {
    tl.setResult(tl.TaskResult.Failed, 'Bad input was given')
    return
  }

  // Install projex
  await runCommand(
    `yarn global add projex`,
    '.',
    'yarn global add projex',
    false,
    0,
    false
  )

  // Install packages
  await runCommand(`yarn install`, '.', 'yarn install', false, 0, false)

  // Install vtex
  await runCommand(
    `yarn global add vtex`,
    '.',
    'yarn global add vtex',
    false,
    0,
    false
  )

  // Login to vtex with projex
  await runCommand(
    `projex vtex login ${account} ${email} master ${apiKey} ${apiToken}`,
    '.',
    'vtex login',
    false,
    0,
    false
  )

  // check login status
  await runCommand(`vtex whoami`, '.', 'vtex whoami', false, 0, false)

  return {
    apiKey,
    apiToken,
    email,
    account,
    manifestFile,
    packageFile,
    changelogPath,
    devBranch,
    forceVtexPublish,
  }
}
