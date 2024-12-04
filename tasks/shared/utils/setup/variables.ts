import * as tl from 'azure-pipelines-task-lib'
import {
  TaskGitMergeIntoBranchVariablesType,
  TaskInstallDependenciesVariablesType,
  TaskLoginVariablesType,
  TaskPublishVariablesType,
  TaskReleaseVariablesType,
} from '../../models'
import {
  DEPLOY_DEFAULT_COMMAND,
  PUBLISH_DEFAULT_COMMAND,
} from '../../constants'

/**
 * This TypeScript function retrieves the branch name input and returns it as a task variable.
 * @returns The function `getGitMergeIntoBranch` is returning an object `variables` which contains the
 * `branch` value obtained from the input. The `variables` object is then logged as a string in the
 * task result before being returned.
 */
export const getGitMergeIntoBranch =
  (): TaskGitMergeIntoBranchVariablesType => {
    const branch: string | undefined = tl.getInput('branch', false)

    const variables = {
      branch,
    }

    tl.setResult(
      tl.TaskResult.Succeeded,
      `Task variables: ${JSON.stringify(variables)}`
    )

    return variables
  }

export const getPublishVariables = (): TaskPublishVariablesType => {
  const variables = {
    publishCommand:
      tl.getInput('publishCommand', false) || PUBLISH_DEFAULT_COMMAND,
    deployCommand:
      tl.getInput('deployCommand', false) || DEPLOY_DEFAULT_COMMAND,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}

/**
 * The function `getLoginVariables` retrieves login variables from user inputs and returns them as an
 * object if inputs are valid.
 * @returns The function `getLoginVariables` returns an object containing the variables `apiKey`,
 * `apiToken`, `email`, and `account` if all input values are provided and not equal to 'bad'. If any
 * of the inputs are missing or equal to 'bad', the function sets the task result to 'Failed' with a
 * message indicating bad input was given.
 */
export const getLoginVariables = (): TaskLoginVariablesType => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)

  if (
    !apiKey ||
    !apiToken ||
    !email ||
    !account ||
    apiKey == 'bad' ||
    apiToken == 'bad' ||
    email == 'bad' ||
    account == 'bad'
  ) {
    tl.setResult(tl.TaskResult.Failed, 'Bad input was given')
    return
  }

  const variables = {
    apiKey,
    apiToken,
    email,
    account,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}

export const getInstallDependenciesVariables =
  (): TaskInstallDependenciesVariablesType => {
    const installProjex: boolean = tl.getBoolInput('installProjex', false)
    const installVtex: boolean = tl.getBoolInput('installVtex', false)
    const installDependencies: boolean = tl.getBoolInput(
      'installDependencies',
      false
    )
    const checkDirectory: boolean = tl.getBoolInput('checkDirectory', false)
    const packageManager: string = tl.getInput('packageManager', false)

    const variables = {
      installProjex,
      installVtex,
      installDependencies,
      checkDirectory,
      packageManager,
    }

    tl.setResult(
      tl.TaskResult.Succeeded,
      `Task variables: ${JSON.stringify(variables)}`
    )

    return variables
  }

export const getReleaseVariables = (): TaskReleaseVariablesType => {
  const beta: boolean = tl.getBoolInput('beta', false)

  const variables = {
    beta,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}
