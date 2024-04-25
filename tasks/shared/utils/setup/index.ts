import {
  installPackages,
  installProjex,
  installVtex,
  loginVtex,
} from './commands'
import { checkDirectory } from './directory'
import { getTaskVariables } from './variables'

/**
 * The function `makeInitialSetup` performs initial setup tasks such as installing packages, checking
 * directories, and optionally installing Projex and Vtex with login.
 * @param [install] - The `install` parameter is an optional object that can have the following
 * properties:
 * @returns The function `makeInitialSetup` returns an object with the following properties:
 */
export const initialSetup = async (install?: {
  vtex?: boolean
  projex?: boolean
  login?: boolean
}) => {
  const { vtex, projex, login } = install ?? {}

  // 1. Get task variables
  const {
    apiKey,
    apiToken,
    email,
    account,
    devBranch,
    forceVtexPublish,
    deploy,
  } = getTaskVariables()
  // 2. Check directory
  const { manifestFile, packageFile, changelogPath } = checkDirectory()

  // 3. Install packages
  installPackages()

  // 4. Install projex and vtex and login in vtex with projex
  if (projex) installProjex()
  if (vtex) installVtex()
  if (vtex && login) loginVtex(email, account, apiKey, apiToken)

  return {
    apiKey,
    apiToken,
    email,
    account,
    manifestFile,
    packageFile,
    changelogPath,
    devBranch,
    forceVtexPublish,
    deploy,
  }
}
