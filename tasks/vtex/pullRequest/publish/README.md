# `VtexPullRequestPublish`

[Back to home](../../../../README.md)

## Description

This task is used in a pull request execution to create a version of the app. It utilizes the `vtex` CLI to generate a stable version with the `vtex publish` command. It's important to note that this task does not make changes in the repository; it only creates the app version in the pipeline without pushing the changes to the repository.

## Parameters

| Name           | Type   | Label                                        | Description                                                                                                                                      | Default Value                                    | Required |
| -------------- | ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | -------- |
| publishCommand | string | Command to execute in the process of publish | You can pass the script to run example: `projex vtex run "vtex publish --yes --force"` use projex to approve all prompts of vtex in the pipeline | "projex vtex run \"vtex publish --yes --force\"" | true     |

## Example

Normal publish:

```yaml
- task: VtexPullRequestPublish@1
  displayName: 'VTEX Pull Request Publish'
  inputs:
    publishCommand: "projex vtex run 'npm run publish'"
```
