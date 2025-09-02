# `VtexPullRequestDeploy`

[Back to home](../../../../README.md)

## Description

This task is used in a pull request execution to create a version of the app. It utilizes the `vtex` CLI to generate a stable version with the `vtex deploy`

## Parameters

| Name          | Type   | Label                                       | Description                                                                                                                               | Default Value                               | Required |
| ------------- | ------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- |
| deployCommand | string | Command to execute in the process of deploy | You can pass the script to run example: `projex vtex run "vtex deploy --force"` use projex to approve all prompts of vtex in the pipeline | '"projex vtex run \"vtex deploy --force\""' | true     |

## Example

Deploy:

```yaml
- task: VtexPullRequestDeploy@1
  displayName: 'VTEX Pull Request Deploy'
  inputs:
    deployCommand: "projex vtex run 'npm run deploy'"
```
