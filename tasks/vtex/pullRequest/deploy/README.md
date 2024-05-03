# `VtexPullRequestDeploy`

[Back to home](../../../../README.md)

## Description

This task is used in a pull request execution to make the deploy process of the current app, Additionally, it uses the `projex` CLI to create a release with the `projex git release` command. The type of release is determined based on the pull request title, which should be formatted as `[minor]`, `[major]`, or `[patch]`, it only creates the app version in the pipeline without pushing the changes to the repository.

## Parameters

| Name     | Type   | Label          | Description                                                                                                       | Default Value | Required |
| -------- | ------ | -------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| apiKey   | string | VTEX API KEY   | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section.   | ""            | true     |
| apiToken | string | VTEX API TOKEN | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| email    | string | VTEX EMAIL     | Pass any email, example cicd@hotmail.com                                                                          | ""            | true     |
| account  | string | VTEX ACCOUNT   | The account name of the VTEX store                                                                                | ""            | true     |

## Example

Deploy:

```yaml
- task: VtexPullRequestDeploy@0
  displayName: 'VTEX Pull Request Deploy'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
```
