## Description

### `vtex/pullRequest/beta`

This task is used in a pull request execution, this process creates a beta version of the app, this process uses the cli `vtex` to create the beta version with the command `vtex publish` and use the cli `projex` to create a beta release with the command `projex git release prerelease` making changes in the `manifest.json` or `package.json` file to set the beta version.

> **Note:** To use this task you need to grant the permission to the azure extension to write in the repository.

> **Note:** If you have a trigger associated to the pull request process you need to disabled the trigger to avoid the execution of the pipeline in a loop, only execute the build manually.

### `vtex/pullRequest/publish`

This task is used in a pull request execution, this process creates a version of the app, this process uses the cli `vtex` to create the stable version with the command `vtex publish`. and use the cli `projex` to create a release with the command `projex git release`, to determine the type of release the task use the pull request title to determine the type of release, the title must have the following format: `[minor]`, `[major]` or `[patch]`.

> **Note:** This task not make changes in the repository, only create the version of the app in the pipeline but the changes are not pushed to the repository.

### `vtex/publish`

This task is used in a standard pipeline execution, this process creates a version of the app, this process uses the cli `vtex` to create the stable version with the command `vtex publish`

> **Note:** If you need to publish a beta version of the app you need to have the beta version in the `manifest.json` or `package.json` file.
