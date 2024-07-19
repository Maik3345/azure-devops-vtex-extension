import * as tl from 'azure-pipelines-task-lib'
import {
  TaskGitReleaseVariablesType,
  TaskPublishVariablesType,
} from '../../models'

/**
 * This function retrieves the development branch variable for a Git release process.
 * @returns The function `getGitReleaseVariables` is returning an object with the `devBranch` variable
 * as a property.
 */
export const getGitReleaseVariables = (): TaskGitReleaseVariablesType => {
  const devBranch: string | undefined = tl.getInput('devBranch', false)
  const mergeIntoDevelop: string | undefined = tl.getInput(
    'mergeIntoDevelop',
    false
  )

  const variables = {
    devBranch,
    mergeIntoDevelop: mergeIntoDevelop == 'true' ? true : false,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}

export const getPublishVariables = (): TaskPublishVariablesType => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)
  const publishCommand: string | undefined = tl.getInput('publishCommand', true)
  const deployCommand: string | undefined = tl.getInput('deployCommand', true)

  if (
    !apiKey ||
    !apiToken ||
    !email ||
    !account ||
    apiKey == 'bad' ||
    apiToken == 'bad' ||
    email == 'bad' ||
    account == 'bad' ||
    !publishCommand ||
    !deployCommand ||
    publishCommand == 'bad' ||
    deployCommand == 'bad'
  ) {
    tl.setResult(tl.TaskResult.Failed, 'Bad input was given')
    return
  }

  const variables = {
    apiKey,
    apiToken,
    email,
    account,
    publishCommand,
    deployCommand,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}
