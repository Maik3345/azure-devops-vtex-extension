# `GitPullRequestRelease`

[Back to home](../../../../README.md)

## Description

This task works in the existing pull request only. It merges the pull request to the target branch and creates a release version with a tag. The task uses the `projex` CLI to create the release with the command `projex git release`.

To determine the type of release `projex` use the list of commits without release in the current branch with the standard of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Parameters

The task does not require any input parameters.

## Example

```yaml
- task: GitPullRequestRelease@0
  displayName: 'Git Pull Request Release'
```
