# `ProjectSetupDependencies`

[Back to home](../../../README.md)

## Description

This task sets up dependencies and utilities for the project. It checks the directory, installs necessary packages, and installs VTEX and Projex CLI tools.

## Parameters

| Name                | Type    | Label                                                                 | Description                                                                                           | Default Value | Required |
| ------------------- | ------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------- | -------- |
| checkDirectory      | boolean | Check if the directory contains the files to use the tasks in vtex io | If you don't need to check the directory, you can disable this option                                 | true          | false    |
| installProjex       | boolean | Install the CLI Projex                                                | If you don't need to install the Projex CLI, you can disable this option                              | true          | false    |
| installVtex         | boolean | Install the CLI Vtex                                                  | If you don't need to install the Vtex CLI, you can disable this option                                | true          | false    |
| installDependencies | boolean | Install the CLI Vtex                                                  | If you don't need to install the Vtex CLI, you can disable this option                                | true          | false    |

## Example

Use the task in your pipeline:

```yaml
- task: ProjectSetupDependencies@1
  displayName: 'Setup Dependencies'
```
