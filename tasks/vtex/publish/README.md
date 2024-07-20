# `VtexPublish`

[Back to home](../../../README.md)

## Description

This task is used in a standard pipeline execution to create a stable version of the app using the `vtex` CLI and the `vtex publish` command.

> **Note:** If you want to publish a beta version of the app, make sure to include the beta version in the `manifest.json` or `package.json` file.

## Parameters

| Name           | Type   | Label                                        | Description                                                                                                                                      | Default Value                                      | Required |
| -------------- | ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------- |
| apiKey         | string | VTEX API KEY                                 | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section.                                  | ""                                                 | true     |
| apiToken       | string | VTEX API TOKEN                               | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section.                                | ""                                                 | true     |
| email          | string | VTEX EMAIL                                   | Pass any email, example cicd@hotmail.com                                                                                                         | ""                                                 | true     |
| account        | string | VTEX ACCOUNT                                 | The account name of the VTEX store                                                                                                               | ""                                                 | true     |
| publishCommand | string | Command to execute in the process of publish | You can pass the script to run example: `projex vtex run "vtex publish --yes --force"` use projex to approve all prompts of vtex in the pipeline | '"projex vtex run \"vtex publish --yes --force\""' | true     |

## Example

Beta publish:

```yaml
- task: VtexPublish@0
  displayName: 'VTEX Publish'
  inputs:
    apiKey: $(apiKey
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
    publishCommand: "projex vtex run 'npm run publish'"
```
