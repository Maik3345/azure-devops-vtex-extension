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
  const beta: string | undefined = tl.getInput('beta', false)

  const variables = {
    devBranch,
    beta: beta == 'true' ? true : false,
    mergeIntoDevelop: mergeIntoDevelop == 'true' ? true : false,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}

/**
 * The function `getTaskVariables` retrieves input variables for a task in a TypeScript script and
 * performs validation before returning them.
 * @returns The `getTaskVariables` function returns an object containing the following properties:
 * - apiKey
 * - apiToken
 * - email
 * - account
 * - devBranch
 * - forcePublish
 * - deploy
 */
export const getPublishVariables = (): TaskPublishVariablesType => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)
  const forcePublish: string | undefined = tl.getInput('forcePublish', false)
  const deploy: string | undefined = tl.getInput('deploy', false)
  const beta: string | undefined = tl.getInput('beta', false)

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
    forcePublish: forcePublish == 'true' ? true : false,
    deploy: deploy == 'true' ? true : false,
    beta: beta == 'true' ? true : false,
  }

  tl.setResult(
    tl.TaskResult.Succeeded,
    `Task variables: ${JSON.stringify(variables)}`
  )

  return variables
}
