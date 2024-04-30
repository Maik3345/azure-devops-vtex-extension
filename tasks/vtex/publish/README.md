# `VtexPublish`

[Back to home](../../../README.md)

## Description

This task is used in a standard pipeline execution to create a stable version of the app using the `vtex` CLI and the `vtex publish` command.

> **Note:** If you want to publish a beta version of the app, make sure to include the beta version in the `manifest.json` or `package.json` file.

## Parameters

| Name         | Type    | Label                                                                   | Description                                                                                                       | Default Value | Required |
| ------------ | ------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| apiKey       | string  | VTEX API KEY                                                            | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section.   | ""            | true     |
| apiToken     | string  | VTEX API TOKEN                                                          | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| email        | string  | VTEX EMAIL                                                              | Pass any email, example cicd@hotmail.com                                                                          | ""            | true     |
| account      | string  | VTEX ACCOUNT                                                            | The account name of the VTEX store                                                                                | ""            | true     |
| forcePublish | boolean | Execute the vtex publish command with the --force flag                  | This flag will force the publish command of vtex with the --force flag.                                           | false         | false    |
| deploy       | boolean | Execute the command vtex deploy --force before the vtex publish command | This flag will execute the vtex deploy command with the --force flag before the vtex publish command.             | false         | false    |

## Example

Normal publish with deploy:

```yaml
- task: VtexPublish@0
  displayName: 'VTEX Publish'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
    forcePublish: true
    deploy: true
```
