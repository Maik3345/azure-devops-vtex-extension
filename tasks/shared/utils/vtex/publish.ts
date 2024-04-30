import { runCommand } from '../runCommand'

/**
 * The function `vtexPublish` is used to run a VTEX publish command with an optional force flag.
 * @param {boolean} forcePublish - The `forcePublish` parameter is a string that determines
 * whether to force the VTEX publish operation. If the value of `forcePublish` is 'true', then the
 * `--force` flag will be included in the VTEX publish command.
 * @returns The `vtexPublish` function is returning the result of the `runCommand` function with the
 * specified parameters. The `runCommand` function is executing the command `projex vtex run "vtex
 * publish -y "` in the current directory (`'.'`) with the command name `'vtex
 * publish'`, without logging the command, with a timeout of 0,
 */
export const vtexPublish = async (forcePublish: boolean) => {
  const force = forcePublish ? '--force' : ''
  return await runCommand(
    `projex vtex run "vtex publish --yes ${force}"`,
    '.',
    'vtex publish',
    false,
    0,
    false,
    true
  )
}

/**
 * The function `vtexDeploy` is used to deploy a VTEX project with an optional force flag.
 * @param {boolean} deploy - The `deploy` parameter is a string that determines whether the deployment
 * should be forced or not. If the value of `deploy` is `'true'`, then the deployment will be forced by
 * adding the `--force` flag to the command.
 * @returns The `vtexDeploy` function is returning the result of the `runCommand` function with the
 * specified parameters. The `runCommand` function is executing the command `projex vtex run "vtex
 * deploy --yes "` in the current directory (`'.'`) with the command name `'vtex
 * deploy'`, without logging the command, with a timeout of 0 milliseconds
 */
export const vtexDeploy = async (deploy: boolean) => {
  const forceDeploy = deploy ? '--force' : ''

  return await runCommand(
    `projex vtex run "vtex deploy --yes ${forceDeploy}"`,
    '.',
    'vtex deploy',
    false,
    0,
    false,
    true
  )
}
