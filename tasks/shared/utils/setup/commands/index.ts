import { TaskLoginVariablesType } from '../../../models'
import { runCommand } from '../../runCommand'

/**
 * This TypeScript function installs the Projex package globally using Yarn.
 */
export const installProjexCli = async () => {
  await runCommand(
    `yarn global add projex`,
    '.',
    'yarn global add projex',
    false,
    0,
    false
  )
}

/**
 * The function `installVtex` installs the VTEX CLI globally using yarn.
 */
export const installVtexCli = async () => {
  await runCommand(
    `yarn global add vtex`,
    '.',
    'yarn global add vtex',
    false,
    0,
    false
  )
}

/**
 * The `installPackages` function uses `yarn install` command to install packages in the current
 * directory asynchronously.
 */
export const installPackages = async (packageManager: string) => {
  await runCommand(
    `${packageManager} install`,
    '.',
    `${packageManager} install`,
    false,
    0,
    false
  )
}

/**
 * The function `makeLoginVtex` in TypeScript takes in variables and calls the `loginVtex` function
 * with specific parameters.
 * @param {TaskLoginVariablesType} variables - The `variables` parameter in the `makeLoginVtex` function is an
 * object that contains the following properties:
 */
export const makeLoginVtex = async (variables: TaskLoginVariablesType) => {
  const { email, account, apiKey, apiToken } = variables
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
