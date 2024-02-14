import { ChangelogSection, ReleaseType } from '../constants'
import { AzureConnectionType } from '../models'
import { errorOnGetReleaseTypeMessage } from './messages'

export const getReleaseType = async (azureConnection: AzureConnectionType) => {
  const { pullRequest } = azureConnection
  const { title } = pullRequest

  // Expresión regular para buscar la estructura deseada
  const regex = /^\[(minor|patch|major|changed)\]\s+(.*)/

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
