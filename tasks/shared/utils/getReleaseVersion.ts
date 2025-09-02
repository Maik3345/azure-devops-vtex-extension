import { AzureConnectionType, ReleaseOutputType } from '../models'
import { errorOnGetTheReleaseVersionMessage } from './messages'
import { runCommand } from './runCommand'

/**
 * The `getReleaseVersion` function retrieves the release version, app name, and push status from an
 * Azure connection and returns them as an object.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter is of type
 * `AzureConnectionType`, which is a custom type representing the connection details for Azure. It
 * likely includes properties such as the Azure account credentials or access token.
 * @param releaseType - The `releaseType` parameter is a string that represents the type of release. It
 * is one of the keys of the `ReleaseType` object.
 * @returns an object of type `ReleaseOutputType`, which contains the following properties:
 */
export const getReleaseVersion = async (beta: boolean) => {
  const str = await runCommand(
    `projex git release ${beta ? '' : 'stable'} --get-version`,
    '.',
    'get release version',
    true,
    0,
    false
  )
  console.log(str)

  if (!str || str === '') {
    return errorOnGetTheReleaseVersionMessage()
  }

  let oldVersionMatch = str.match(/oldVersion: '([^']*)'/)
  let newVersionMatch = str.match(/newVersion: '([^']*)'/)
  let pushCommandTextMatch = str.match(/pushCommandText: '([^']*)'/)
  let appNameMatch = str.match(/appName: '([^']*)'/)

  let old_version = oldVersionMatch ? oldVersionMatch[1] : null
  let new_version = newVersionMatch ? newVersionMatch[1] : null
  let push = pushCommandTextMatch ? pushCommandTextMatch[1] : null
  let app_name = appNameMatch ? appNameMatch[1] : null

  console.log('Get release version')
  console.log({
    old_version,
    new_version,
    push,
    app_name,
  })

  // Inicializar un objeto para almacenar los valores
  const values: ReleaseOutputType = {
    new_version,
    old_version,
    app_name,
    push,
  }

  if (
    !values.new_version ||
    !values.old_version ||
    !values.app_name ||
    !values.push
  ) {
    return errorOnGetTheReleaseVersionMessage()
  }

  // Imprimir el objeto resultante
  console.log(values)
  return values
}
