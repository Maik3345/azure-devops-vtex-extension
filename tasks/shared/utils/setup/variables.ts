import * as tl from 'azure-pipelines-task-lib'
import { TaskVariables } from '../../models'

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
export const getTaskVariables = (): TaskVariables => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)
  const devBranch: string | undefined = tl.getInput('devBranch', true)
  const forcePublish: string | undefined = tl.getInput('forcePublish', false)
  const deploy: string | undefined = tl.getInput('deploy', false)
  const beta: string | undefined = tl.getInput('beta', false)
  const mergeIntoDevelop: string | undefined = tl.getInput(
    'mergeIntoDevelop',
    false
  )

  if (
    !apiKey ||
    !apiToken ||
    !email ||
    !account ||
    !devBranch ||
    apiKey == 'bad' ||
    apiToken == 'bad' ||
    email == 'bad' ||
    account == 'bad' ||
    devBranch == 'bad'
  ) {
    tl.setResult(tl.TaskResult.Failed, 'Bad input was given')
    return
  }

  return {
    apiKey,
    apiToken,
    email,
    account,
    devBranch,
    forcePublish: forcePublish === 'true' ? true : false,
    deploy: deploy === 'true' ? true : false,
    beta: beta === 'true' ? true : false,
    mergeIntoDevelop: mergeIntoDevelop === 'true' ? true : false,
  }
}
