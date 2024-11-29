import * as tl from 'azure-pipelines-task-lib'
import { AzureConnectionType } from '../models'
import { changeOriginToSourceBranch, setEmailAndUserGit } from './git'

export const getPipelineExecutorInformation = () => {
  let requestedFor = tl.getVariable('Build.RequestedFor')
  let requestedForEmail = tl.getVariable('Build.RequestedForEmail')

  if (!requestedFor || !requestedForEmail) {
    console.error(
      `RequestedFor or RequestedForEmail not found in the pipeline variables.`
    )
    throw new Error(
      'RequestedFor or RequestedForEmail not found in the pipeline variables.'
    )
  }
  return {
    requestedFor,
    requestedForEmail,
  }
}

export const getPipelineSourceBranch = () => {
  const sourceBranch = tl.getVariable('Build.SourceBranch')
  if (!sourceBranch) {
    console.error(`SourceBranch not found in the pipeline variables.`)
    throw new Error('SourceBranch not found in the pipeline variables.')
  }
  return sourceBranch
}

export const configurePipelineGit = async () => {
  // 1. set the email and user in git
  const { requestedFor, requestedForEmail } = getPipelineExecutorInformation()
  await setEmailAndUserGit(requestedFor, requestedForEmail)
  // 2. Change origin to source branch
  const sourceRefName = getPipelineSourceBranch()
  await changeOriginToSourceBranch(sourceRefName)
}
