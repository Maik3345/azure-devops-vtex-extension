# `GitPullRequestMergeIntoBranch`

[Back to home](../../../../README.md)

## Description

This task creates a pull request to merge changes into a specified branch and automatically merges it. It retrieves the branch information and Azure connection details, then uses these to create and merge the pull request.

## Parameters

| Name    | Type   | Label                         | Description                                                                                   | Default Value | Required |
| ------- | ------ | ----------------------------- | --------------------------------------------------------------------------------------------- | ------------- | -------- |
| branch  | string | Branch to integrate the changes | Pass the branch to integrate the changes automatically, by default is develop                 | "develop"     | false    |

## Example

Merge changes into the default branch `develop`:

```yaml
- task: GitPullRequestMergeIntoBranch@1
  displayName: 'Git Pull Request Merge Into Branch'
  inputs:
    branch: 'develop'
```

Merge changes into a custom branch:

```yaml
- task: GitPullRequestMergeIntoBranch@1
  displayName: 'Git Pull Request Merge Into Branch'
  inputs:
    branch: 'custom-branch'
```
