# `VtexDeploy`

[Back to home](../../../README.md)

## Description

This task is used in a standard pipeline execution to create a stable version of the app using the `vtex` CLI and the `vtex deploy` command.

You can pass the flag `beta` to generate a beta version of the app, if this flag is not passed, the task will generate a stable version of the app to make the deploy

## Parameters

| Name     | Type    | Label                              | Description                                                                                                       | Default Value | Required |
| -------- | ------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| apiKey   | string  | VTEX API KEY                       | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section.   | ""            | true     |
| apiToken | string  | VTEX API TOKEN                     | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| email    | string  | VTEX EMAIL                         | Pass any email, example cicd@hotmail.com                                                                          | ""            | true     |
| account  | string  | VTEX ACCOUNT                       | The account name of the VTEX store                                                                                | ""            | true     |
| beta     | boolean | Generate a beta version of the app | This flag will generate a beta version of the app.                                                                | false         | false    |

## Example

Normal deploy:

```yaml
- task: VtexDeploy@0
  displayName: 'VTEX Deploy'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
```
