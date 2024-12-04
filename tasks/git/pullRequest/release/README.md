# `GitRelease`

[Back to home](../../../../README.md)

## Description

The task uses the `projex` CLI to create the release with the command `projex git release stable` or `projex git release` if the beta parameter is set to true.

To determine the type of release `projex` use the list of commits without release in the current branch with the standard of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Parameters

## Parameters

| Name                | Type    | Label                                                                 | Description                                                                                           | Default Value | Required |
| ------------------- | ------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------- | -------- |
| beta      | boolean | Pass this flag to make a beta release                            | true          | false    |

## Example

Beta release with default branch `develop`:

```yaml
- task: GitRelease@0
  displayName: 'Git Release'
```
