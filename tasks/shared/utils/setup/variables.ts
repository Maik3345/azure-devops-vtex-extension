import * as tl from 'azure-pipelines-task-lib'

/**
 * The function `getTaskVariables` retrieves input variables for a task in a TypeScript script and
 * performs validation before returning them.
 * @returns The `getTaskVariables` function returns an object containing the following properties:
 * - apiKey
 * - apiToken
 * - email
 * - account
 * - devBranch
 * - forceVtexPublish
 * - deploy
 */
export const getTaskVariables = () => {
  const apiKey: string | undefined = tl.getInput('apiKey', true)
  const apiToken: string | undefined = tl.getInput('apiToken', true)
  const email: string | undefined = tl.getInput('email', true)
  const account: string | undefined = tl.getInput('account', true)
  const devBranch: string | undefined = tl.getInput('devBranch', true)
  const forceVtexPublish: string | undefined = tl.getInput(
    'forceVtexPublish',
    false
  )
  const deploy: string | undefined = tl.getInput('deploy', false)

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
    forceVtexPublish,
    deploy,
  }
}
