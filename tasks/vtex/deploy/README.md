# `VtexDeploy`

[Back to home](../../../README.md)

## Description

This task is used in a standard pipeline execution to create a stable version of the app using the `vtex` CLI and the `vtex deploy` command.

You can pass the flag `beta` to generate a beta version of the app, if this flag is not passed, the task will generate a stable version of the app to make the deploy

## Parameters

| Name          | Type   | Label                                       | Description                                                                                                                               | Default Value                               | Required |
| ------------- | ------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- |
| deployCommand | string | Command to execute in the process of deploy | You can pass the script to run example: `projex vtex run "vtex deploy --force"` use projex to approve all prompts of vtex in the pipeline | '"projex vtex run \"vtex deploy --force\""' | true     |

## Example

Normal deploy:

```yaml
- task: VtexDeploy@0
  displayName: 'VTEX Deploy'
  inputs:
    deployCommand: "projex vtex run 'npm run deploy'"
```
