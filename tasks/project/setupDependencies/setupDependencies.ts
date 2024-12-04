import * as tl from 'azure-pipelines-task-lib'

import {
  checkIfDirectoryIsCorrect,
  getInstallDependenciesVariables,
  installPackages,
  installProjexCli,
  installVtexCli,
} from '../../shared'

async function run() {
  try {
    // 1. Get the git release variables
    const {
      installDependencies,
      installProjex,
      installVtex,
      checkDirectory,
      packageManager,
    } = getInstallDependenciesVariables()
    // 2. Check the directory
    if (checkDirectory) checkIfDirectoryIsCorrect()
    // 3. Install packages
    if (installDependencies) await installPackages(packageManager)
    // 4. Install VTEX Cli
    if (installVtex) await installVtexCli()
    // 5. Install Projex Cli
    if (installProjex) await installProjexCli()
    // 6. Show pipeline success message
    tl.setResult(
      tl.TaskResult.Succeeded,
      `install packages and dependencies success`
    )
  } catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message)
  }
}

run()
