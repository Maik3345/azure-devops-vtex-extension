import { code } from '../../../..'
import { AzureConnectionType } from '../../../../models'
import { createPullRequestThreadService } from '../../../../services'

/**
 * Publishes a success message indicating that an app has been updated to a new version,
 * and creates a pull request thread with installation instructions.
 *
 * @param azureConnection - The Azure connection object used to interact with Azure DevOps.
 * @param old_version - The previous version of the app.
 * @param new_version - The new version of the app that has been published.
 * @param app_name - The name of the app that was published.
 * @returns A promise that resolves when the pull request thread has been created.
 */
export const publishAppSuccessMessage = async (
  azureConnection: AzureConnectionType,
  old_version: string,
  new_version: string,
  app_name: string
) => {
  const installMessage = code(`vtex install ${app_name}@${new_version}`)
  const message = `
  ✅ App published: **${old_version} → ${new_version}**

  Install in your workspace:
  ${installMessage}
`
  return await createPullRequestThreadService(azureConnection, message)
}
