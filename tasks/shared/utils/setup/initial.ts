import { checkDirectory } from './directory'
import { getTaskVariables } from './variables'

/**
 * The function `makeInitialSetup` performs initial setup tasks such as installing packages, checking
 * directories, and optionally installing Projex and Vtex with login.
 * @param [install] - The `install` parameter is an optional object that can have the following
 * properties:
 * @returns The function `makeInitialSetup` returns an object with the following properties:
 */
export const initialSetup = async () => {
  // 1. Get task variables
  const variables = getTaskVariables()
  // 2. Check directory
  const { manifestFile, packageFile, changelogPath } = checkDirectory()

  return {
    ...variables,
    manifestFile,
    packageFile,
    changelogPath,
  }
}
