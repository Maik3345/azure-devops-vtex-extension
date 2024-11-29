
# `VtexLogin`

[Back to home](../../../README.md)

## Description

This task is used to log in to VTEX using the `vtex` CLI.

## Parameters

| Name     | Type   | Label            | Description                                                                                           | Default Value | Required |
| -------- | ------ | ---------------- | ----------------------------------------------------------------------------------------------------- | ------------- | -------- |
| apiKey   | string | VTEX API KEY     | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| apiToken | string | VTEX API TOKEN   | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| email    | string | VTEX EMAIL       | Pass any email, example <cicd@hotmail.com>                                                              | ""            | true     |
| account  | string | VTEX ACCOUNT     | The account name of the VTEX store                                                                    | ""            | true     |

## Example

Login to VTEX:

```yaml
- task: VtexLogin@1
  displayName: 'VTEX Login'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
