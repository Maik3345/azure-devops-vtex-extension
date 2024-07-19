export interface TaskPublishVariablesType {
  apiKey: string
  apiToken: string
  email: string
  account: string
  publishCommand: string
  deployCommand: string
}

export interface TaskGitReleaseVariablesType {
  devBranch: string
  mergeIntoDevelop: boolean
}
