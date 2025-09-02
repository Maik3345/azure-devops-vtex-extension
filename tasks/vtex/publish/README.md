# `VtexPublish`

[Back to home](../../../README.md)

## Description

This task is used in a standard pipeline execution to create a stable version of the app using the `vtex` CLI and the `vtex publish` command.

> **Note:** If you want to publish a beta version of the app, make sure to include the beta version in the `manifest.json` or `package.json` file.

## Parameters

| Name           | Type   | Label                                        | Description                                                                                                                                      | Default Value                                      | Required |
| -------------- | ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------- |
| publishCommand | string | Command to execute in the process of publish | You can pass the script to run example: `projex vtex run "vtex publish --yes --force"` use projex to approve all prompts of vtex in the pipeline | '"projex vtex run \"vtex publish --yes --force\""' | true     |

## Example

Beta publish:

```yaml
- task: VtexPublish@1
  displayName: 'VTEX Publish'
  inputs:
    publishCommand: "projex vtex run 'npm run publish'"
```
