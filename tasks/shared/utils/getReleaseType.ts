import { ChangelogSection, ReleaseType } from '../constants'
import { AzureConnectionType } from '../models'
import { errorOnGetReleaseTypeMessage } from './messages'

/**
 * The function `getReleaseType` extracts the release type and corresponding changelog section from a
 * pull request title in Azure DevOps.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType is an object that contains
 * information about the Azure connection, specifically the pullRequest property which contains
 * information about the pull request being processed. The title property of the pullRequest contains
 * the title of the pull request.
 * @returns The `getReleaseType` function is returning an object with `typeRelease` and `titleRelease`
 * properties based on the match found in the pull request title. The properties are determined based
 * on the matched release type (major, minor, changed, or patch) and correspond to specific sections in
 * a changelog (major, added, changed, or fixed).
 */
export const getReleaseType = async (azureConnection: AzureConnectionType) => {
  const { pullRequest } = azureConnection
  const { title } = pullRequest

  // Expresión regular para buscar la estructura deseada
  const regex = /\[(minor|patch|major|changed)\](.*|$)/

  // Comprobar si el título cumple con la estructura deseada
  const match = title.match(regex)

  if (!match || match.length < 1) {
    errorOnGetReleaseTypeMessage(azureConnection)
    return
  }

  console.log(`Release type: ${match[1]}`)

  switch (match[1]) {
    case ReleaseType.major:
      return {
        typeRelease: ReleaseType.major,
        titleRelease: ChangelogSection.major,
      }
    case ReleaseType.minor:
      return {
        typeRelease: ReleaseType.minor,
        titleRelease: ChangelogSection.added,
      }
    case ReleaseType.changed:
      return {
        typeRelease: ReleaseType.minor,
        titleRelease: ChangelogSection.changed,
      }
    case ReleaseType.patch:
      return {
        typeRelease: ReleaseType.patch,
        titleRelease: ChangelogSection.fixed,
      }
    default:
      errorOnGetReleaseTypeMessage(azureConnection)
  }
}

/**
 * The function `ignoreBetaRelease` checks if a pull request title contains a specific pattern to
 * ignore beta releases.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter in the
 * `ignoreBetaRelease` function represents a connection to an Azure service, specifically the Azure
 * DevOps service. It contains information about a pull request, including the title of the pull
 * request.
 * @returns The function `ignoreBetaRelease` is returning a boolean value. If the title of the pull
 * request matches the specified structure `[no-beta] <message>`, it will return `true` indicating that
 * the beta release should be ignored. Otherwise, it will return `false`.
 */
export const ignoreBetaRelease = async (
  azureConnection: AzureConnectionType
) => {
  const { pullRequest } = azureConnection
  const { title } = pullRequest

  // Expresión regular para buscar la estructura deseada
  const regex = /\[no-beta\](.*|$)/

  // Comprobar si el título cumple con la estructura deseada
  const match = title.match(regex)

  if (!match || match.length < 1) {
    return false
  }

  console.log(`Beta release is ignore because pass in the title: ${match[1]}`)

  return true
}

/**
 * The function `ignorePublish` checks if a pull request title contains the `[no-publish]` tag and logs
 * a message if it does.
 * @param {AzureConnectionType} azureConnection - The `azureConnection` parameter in the
 * `ignorePublish` function is of type `AzureConnectionType`. It contains information related to the
 * Azure connection, specifically the `pullRequest` object which has a `title` property. The function
 * checks if the title of the pull request matches a specific pattern (`
 * @returns The `ignorePublish` function returns a boolean value. It returns `true` if the title of the
 * pull request contains the pattern "[no-publish] " followed by any text, indicating that the publish
 * app should be ignored. Otherwise, it returns `false`.
 */
export const ignorePublish = async (azureConnection: AzureConnectionType) => {
  const { pullRequest } = azureConnection
  const { title } = pullRequest

  // Expresión regular para buscar la estructura deseada
  const regex = /\[no-publish\](.*|$)/

  // Comprobar si el título cumple con la estructura deseada
  const match = title.match(regex)

  if (!match || match.length < 1) {
    return false
  }

  console.log(`Publish app is ignore because pass in the title: ${match[1]}`)

  return true
}

/**
 * The function `checkReleaseType` determines the release type based on the input parameters and
 * returns the title and type of the release.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType - a type representing a
 * connection to Azure services
 * @param {string} beta - The `beta` parameter is a string that indicates whether the release type is
 * beta or not. If the value of `beta` is 'true', it means the release type is beta.
 * @returns The function `checkReleaseType` returns an object with `titleRelease` and `typeRelease`
 * properties. If the `beta` parameter is equal to 'true', it sets `typeRelease` to
 * `ReleaseType.prerelease` and `titleRelease` to `ChangelogSection.added`, then returns the object
 * with these values. Otherwise, it calls the `getReleaseType` function
 */
/**
 * The function `determineReleaseType` determines the release type based on the input parameters and
 * returns the title and type of the release.
 * @param {AzureConnectionType} azureConnection - AzureConnectionType - a type representing a
 * connection to Azure services
 * @param {string} beta - The `beta` parameter is a string that indicates whether the release type is
 * beta or not. If the value of `beta` is 'true', it means the release type is beta.
 * @returns The function `determineReleaseType` returns an object with `titleRelease` and `typeRelease`
 * properties. If the `beta` parameter is equal to 'true', it sets `typeRelease` to
 * `ReleaseType.prerelease` and `titleRelease` to `ChangelogSection.added`, then returns the object
 * with these values. Otherwise, it calls the `getReleaseType` function
 */
export const determineReleaseType = async (
  azureConnection: AzureConnectionType,
  beta: boolean
) => {
  const release = await getReleaseType(azureConnection)

  if (!release.titleRelease || !release.typeRelease) {
    throw new Error('Error on get release type')
  }

  if (beta) {
    return {
      titleRelease: ChangelogSection.added,
      typeRelease: ReleaseType.prerelease,
    }
  }

  return release
}
