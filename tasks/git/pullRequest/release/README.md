# `GitPullRequestRelease`

[Back to home](../../../../README.md)

## Description

This task works in the existing pull request only. It merges the pull request to the target branch and creates a release version with a tag. The task uses the `projex` CLI to create the release with the command `projex git release`.

To determine the type of release, the task relies on the pull request title. The title must have one of the following formats: `[minor]`, `[major]`, or `[patch]`.

To ignore the creation of a beta or the publish release, you can use `[no-beta]` or `[no-publish]` in the title.

## Parameters

| Name             | Type    | Label                                     | Description                                                                                                                                                                                     | Default Value | Required |
| ---------------- | ------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| devBranch        | string  | Branch to integrate the changes           | Specify the branch where the changes will be integrated. By default, this is set to "develop".                                                                                                  | "develop"     | false    |
| beta             | boolean | Create a beta release                     | Set this to true if you want to create a beta release. By default, this is set to false.                                                                                                        | false         | false    |
| mergeIntoDevelop | boolean | Merge the release into the develop branch | Set this to true if you want to automatically create a pull request to merge the changes into the specified branch. By default, this is set to true, this only works if the beta option is true | true          | false    |

## Example

Beta release with default branch `develop`:

```yaml
- task: GitPullRequestRelease@0
  displayName: 'Git Pull Request Release'
  inputs:
    beta: true
```

Beta release with custom branch:

```yaml
- task: GitPullRequestRelease@0
  displayName: 'Git Pull Request Release'
  inputs:
    beta: true
    devBranch: 'custom-branch'
```

Beta release without merging into the develop branch:

```yaml
- task: GitPullRequestRelease@0
  displayName: 'Git Pull Request Release'
  inputs:
    beta: true
    mergeIntoDevelop: false
```

Normal release to master:

```yaml
- task: GitPullRequestRelease@0
  displayName: 'Git Pull Request Release'
```
