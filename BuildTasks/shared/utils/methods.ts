import * as tl from 'azure-pipelines-task-lib'

export const getPipelineUrl = () => {
  const url = `${tl.getVariable('System.CollectionUri')}${tl.getVariable(
    'System.TeamProject'
  )}/_build/results?buildId=${tl.getVariable('Build.BuildId')}`
  return url
}
