# `ProjectSetupDependencies`

[Back to home](../../../README.md)

## Description

This task sets up dependencies and utilities for the project. It checks the directory, installs necessary packages, and installs VTEX and Projex CLI tools.

## Parameters

This task does not require any input parameters.

## Example

Use the task in your pipeline:

```yaml
- task: ProjectSetupDependencies@1
  displayName: 'Setup Dependencies'
```
