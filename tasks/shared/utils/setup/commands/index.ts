import { runCommand } from '../../runCommand'

export const installProjex = async () => {
  await runCommand(
    `yarn global add projex`,
    '.',
    'yarn global add projex',
    false,
    0,
    false
  )
}

export const installVtex = async () => {
  await runCommand(
    `yarn global add vtex`,
    '.',
    'yarn global add vtex',
    false,
    0,
    false
  )
}

export const loginVtex = async (
  email: string,
  account: string,
  apiKey: string,
  apiToken: string
) => {
  // Login to vtex with projex
  await runCommand(
    `projex vtex login ${account} ${email} master ${apiKey} ${apiToken}`,
    '.',
    'vtex login',
    false,
    0,
    false
  )
}

export const installPackages = async () => {
  await runCommand(`yarn install`, '.', 'yarn install', false, 0, false)
}
