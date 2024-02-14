# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2024-02-14

## Changed

- change the task icons and the screenshots of the extension

## [1.1.0] - 2024-02-14

## Added

- Create the task `VtexBuildRelease` and `VtexBuildBeta` to build the release and beta versions of the VTEX app.
- Implement the logic for:
  - Push messages in the thread of the pull request.
  - Create pull request in the specified repository with the changes of the current pull request
  - Create the logic for complete the pull request and make the release process with the cli `projex`
  - Create the logic to control the exceptions and errors in the task and generate the error message in the pull request thread.
  - Implement the step to setup the core settings of the tasks, install `projex`, `vtex` and `yarn install` in the pipeline.
  - Implement the logic for make the login in the VTEX account with the `apiKey` and `apiToken` in the pipeline, this parameters are required to execute the tasks and is passed in the input of the task.
