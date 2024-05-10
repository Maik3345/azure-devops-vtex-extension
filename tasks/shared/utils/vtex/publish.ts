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

export const vtexDeploy = async () => {
  return await runCommand(
    `projex vtex run "vtex deploy --yes --force"`,
    '.',
    'vtex deploy',
    false,
    0,
    false,
    true
  )
}
