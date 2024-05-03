# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.20] - 2024-05-02

### Added

- feat: ✨ add the task to deploy a app

## [1.9.19] - 2024-04-30

- feat: ✨ refactor git and vtex task

## [1.9.17] - 2024-04-30

### Changed

- feat: :sparkles: create a tasks for make the publish, release and beta and publish in a pr ([21f517a0](https://github.com/Maik3345/azure-devops-vtex-extension/commit/21f517a0e98c7f139d81321089afd26dd4e11dac))
- feat: :sparkles: add deploy option to vtex publish task ([358ec14d](https://github.com/Maik3345/azure-devops-vtex-extension/commit/358ec14de7e89a53c233771a39c06bf9230a491d))
- fix: :bug: fix the build of the app ([d025ea03](https://github.com/Maik3345/azure-devops-vtex-extension/commit/d025ea03460e72a9992160d9e23e5405d8557494))
- feat: :sparkles: define the logic for the flow to create the release from the pullrequest ([94bfd799](https://github.com/Maik3345/azure-devops-vtex-extension/commit/94bfd799d78d2d9841c72ba0934c1b3f56a0f0f1))
- feat: :sparkles: define the logic for the flow to publish the app in a normal pipeline flow ([e35bc608](https://github.com/Maik3345/azure-devops-vtex-extension/commit/e35bc6083363ee4f154724016ee99c8626bf1f74))
- feat: :sparkles: define the task to release, publish and pr publish ([bfc43133](https://github.com/Maik3345/azure-devops-vtex-extension/commit/bfc431332c064d0d725b9144ef51f9cc2cae4124))

## [1.6.0] - 2024-04-16

### Changed

- 🔄 update the release process to call the command `projex git update changelog` to write the `CHANGELOG.md` file wiuth the commit list of the current branch
- 🔄 update the tasks parameters, add `forcePublish` to allow the execution with the force flag in the `vtex publish` command

## [1.4.0] - 2024-02-16

## Changed

- 🔄 update the manifest information of the extension, add the repository link to github and tags

## [1.3.0] - 2024-02-14

## Added

- ✨ add the `devBranch` input to the tasks to specify the branch to make the pull request in the `VtexBuildBeta` task.

## [1.2.0] - 2024-02-14

## Changed

- 🔄 change the task icons and the screenshots of the extension

## [1.1.0] - 2024-02-14

## Added

- ✅ Create the task `VtexBuildRelease` and `VtexBuildBeta` to build the release and beta versions of the VTEX app.
- ✅ Implement the logic for:
  - Push messages in the thread of the pull request.
  - Create pull request in the specified repository with the changes of the current pull request
  - Create the logic for complete the pull request and make the release process with the cli `projex`
  - Create the logic to control the exceptions and errors in the task and generate the error message in the pull request thread.
  - Implement the step to setup the core settings of the tasks, install `projex`, `vtex` and `yarn install` in the pipeline.
  - Implement the logic for make the login in the VTEX account with the `apiKey` and `apiToken` in the pipeline, this parameters are required to execute the tasks and is passed in the input of the task.
