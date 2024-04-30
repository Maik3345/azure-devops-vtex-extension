export interface TaskPublishVariablesType {
  apiKey: string
  apiToken: string
  email: string
  account: string
  forcePublish: boolean
  deploy: boolean
  beta: boolean
}

export interface TaskGitReleaseVariablesType {
  devBranch: string
  beta: boolean
  mergeIntoDevelop: boolean
}
