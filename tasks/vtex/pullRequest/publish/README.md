# `VtexPullRequestPublish`

[Back to home](../../../../README.md)

## Description

This task is used in a pull request execution to create a version of the app. It utilizes the `vtex` CLI to generate a stable version with the `vtex publish` command. Additionally, it uses the `projex` CLI to create a release with the `projex git release` command. The type of release is determined based on the pull request title, which should be formatted as `[minor]`, `[major]`, or `[patch]`. To skip the creation of a beta or the publish process, you can use `[no-beta]` or `[no-publish]` in the title. It's important to note that this task does not make changes in the repository; it only creates the app version in the pipeline without pushing the changes to the repository.

## Parameters

| Name         | Type    | Label                                                                   | Description                                                                                                       | Default Value | Required |
| ------------ | ------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| apiKey       | string  | VTEX API KEY                                                            | You can get the API KEY from the VTEX admin panel, go to the account settings and then to the API keys section.   | ""            | true     |
| apiToken     | string  | VTEX API TOKEN                                                          | You can get the API TOKEN from the VTEX admin panel, go to the account settings and then to the API keys section. | ""            | true     |
| email        | string  | VTEX EMAIL                                                              | Pass any email, example cicd@hotmail.com                                                                          | ""            | true     |
| account      | string  | VTEX ACCOUNT                                                            | The account name of the VTEX store                                                                                | ""            | true     |
| forcePublish | boolean | Execute the vtex publish command with the --force flag                  | This flag will force the publish command of vtex with the --force flag.                                           | false         | false    |
| deploy       | boolean | Execute the command vtex deploy --force before the vtex publish command | This flag will execute the vtex deploy command with the --force flag before the vtex publish command.             | false         | false    |
| beta         | boolean | Generate a beta version of the app                                      | This flag will generate a beta version of the app.                                                                | false         | false    |

## Example

Normal publish with deploy:

```yaml
- task: VtexPullRequestPublish@0
  displayName: 'VTEX Pull Request Publish'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
    forcePublish: true
    deploy: true
```

Beta publish:

```yaml
- task: VtexPullRequestPublish@0
  displayName: 'VTEX Pull Request Publish'
  inputs:
    apiKey: $(apiKey)
    apiToken: $(apiToken)
    email: $(email)
    account: $(account)
    forcePublish: true
    beta: true
```
