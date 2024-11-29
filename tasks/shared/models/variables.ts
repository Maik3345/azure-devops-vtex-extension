export interface TaskPublishVariablesType {
  publishCommand: string
  deployCommand: string
}

export interface TaskLoginVariablesType {
  apiKey: string
  apiToken: string
  email: string
  account: string
}

export interface TaskGitMergeIntoBranchVariablesType {
  branch: string
}

export interface TaskInstallDependenciesVariablesType {
  installProjex: boolean
  installVtex: boolean
  installDependencies: boolean
  checkDirectory: boolean
}
