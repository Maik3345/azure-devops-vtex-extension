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
export const getReleaseVersion = async (
  beta: boolean,
  azureConnection?: AzureConnectionType
) => {
  const versions = await runCommand(
    `projex git release ${beta ? '' : 'stable'} --get-version`,
    '.',
    'get release version',
    true,
    0,
    false
  )
  console.log(versions)

  if (!versions || versions === '') {
    errorOnGetTheReleaseVersionMessage(azureConnection)
  }

  // Dividir el string en un array usando la coma como separador
  const parts = versions.split(',')

  // Inicializar un objeto para almacenar los valores
  const values: ReleaseOutputType = {
    new_version: null,
    old_version: null,
    app_name: null,
    push: null,
  }

  // Iterar sobre cada elemento del array
  parts.forEach((part: string) => {
    // Dividir cada elemento en clave y valor usando ":" como separador
    const [key, value] = part.split(':')

    // Almacenar el valor en el objeto utilizando la clave correspondiente
    values[key as keyof typeof values] = value
  })

  if (
    !values.new_version ||
    !values.old_version ||
    !values.app_name ||
    !values.push
  ) {
    errorOnGetTheReleaseVersionMessage(azureConnection)
  }

  // Imprimir el objeto resultante
  console.log(values)
  return values
}
