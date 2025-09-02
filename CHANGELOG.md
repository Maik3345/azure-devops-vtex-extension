# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.17.0](https://github.com/Maik3345/azure-devops-vtex-extension/compare/v1.16.0...v1.17.0) - (2025-09-02)

### Features

* refactor and clean up message handling in vtex tasks ([#16](https://github.com/Maik3345/azure-devops-vtex-extension/pull/16)) ([224ef140](https://github.com/Maik3345/azure-devops-vtex-extension/commit/224ef14083f1548859f3693e2c8775bca8df56a4))


## [1.16.0](https://github.com/Maik3345/azure-devops-vtex-extension/compare/v1.15.0...v1.16.0) - (2025-08-18)

### Features

* **docs**: remove outdated instructions and update workflows, add doc generation guide ([#15](https://github.com/Maik3345/azure-devops-vtex-extension/pull/15)) ([a135ebc6](https://github.com/Maik3345/azure-devops-vtex-extension/commit/a135ebc6c40e6bcfa94cc8d6a724bdeaf1e099d3))


## [1.15.0](https://github.com/Maik3345/azure-devops-vtex-extension/compare/v1.14.0...v1.15.0) - (2025-08-11)

### Features

* add installation step for tfx-cli in publish workflow ([e71c355f](https://github.com/Maik3345/azure-devops-vtex-extension/commit/e71c355f66985c0764312007ba9b9269b6d06825))
* update extension packaging and publishing process in workflow ([e58e924d](https://github.com/Maik3345/azure-devops-vtex-extension/commit/e58e924d92869b459a1a3a2cb997218da286f563))
* add support for vs code engine version in package.json ([bf06931f](https://github.com/Maik3345/azure-devops-vtex-extension/commit/bf06931f9a7faa34f1f5e9c215c536d4cec713eb))
* add github action ([#14](https://github.com/Maik3345/azure-devops-vtex-extension/pull/14)) ([b1538cbb](https://github.com/Maik3345/azure-devops-vtex-extension/commit/b1538cbb3bd9c4288e095e4f68e58f6ab1898819))
* **extension**: enhance work item extension and add ai assistant instructions ([#13](https://github.com/Maik3345/azure-devops-vtex-extension/pull/13)) ([49fc977e](https://github.com/Maik3345/azure-devops-vtex-extension/commit/49fc977e4ac2cc6b0b4a193d7ca9772ed569d703))
* add changeorigintosourcebranch task for pipeline and pull request ([0c14750b](https://github.com/Maik3345/azure-devops-vtex-extension/commit/0c14750bca38e92d0a500e93a6850289afebde4a))

### Bug Fixes

* update token reference in publish step to use secrets ([437ba40d](https://github.com/Maik3345/azure-devops-vtex-extension/commit/437ba40de55d4c82c83d56a1c286a0a8b2aba0c3))

### Documentation

* add yaml pipeline templates for beta generation, publication, and deployment processes ([3de6f9e3](https://github.com/Maik3345/azure-devops-vtex-extension/commit/3de6f9e38b770a625788e8ff0821e2d93d020878))


## [1.14.0](https://github.com/Maik3345/azure-devops-vtex-extension/compare/v1.13.0...v1.14.0) - (2024-12-04)

### Features

* add beta release support in the release process ([2d2748e7](https://github.com/Maik3345/azure-devops-vtex-extension/commit/2d2748e7534a8bedd2aa8f2d4c5a55ee1ff08a27))

### Documentation

* update readme.md to include input parameters for setupdependencies task ([d6801864](https://github.com/Maik3345/azure-devops-vtex-extension/commit/d680186489954c6921a93496b8ccb0cc522a0f43))


## [1.13.0](https://github.com/Maik3345/azure-devops-vtex-extension/compare/v1.12.0...v1.13.0) - (2024-11-29)

### Features

* refactor in the login, setup dependencies and pull request process ([#12](https://github.com/Maik3345/azure-devops-vtex-extension/pull/12)) ([430136ee](https://github.com/Maik3345/azure-devops-vtex-extension/commit/430136eee1f569450868a2d1603d5c33bca3a566))

### Miscellaneous Chores

* update copyright information in the license file ([af57601c](https://github.com/Maik3345/azure-devops-vtex-extension/commit/af57601c0d1076b969660d6bfe2ddefc8a1fb27a))
* add mit license to the repository ([2b8efbc5](https://github.com/Maik3345/azure-devops-vtex-extension/commit/2b8efbc5b5381a70b2641f4b88b61d73175315d3))
* update the mergeintodevelop variable to use has boolean variable ([7aca61e3](https://github.com/Maik3345/azure-devops-vtex-extension/commit/7aca61e3672d1baabf1b53ea5bf7b9e42fa726d4))


## [1.11.0](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/branchCompare?baseVersion=GTv1.10.0&targetVersion=GTv1.11.0) - (2024-07-19)

### Features

- modify the publish and deploy process to pass the command to ecute in the process ([#37173](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/pullrequest/37173)) ([5a43dbb0](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/commit/5a43dbb055c4e23fcfc10eba81286dac5efc94d6))
- add gitrelease task for creating releases with projex cli ([4bce26a5](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/commit/4bce26a5cc90d7e1f1a648d950c9520f9c026f05))

### Miscellaneous Chores

- update vss-extension.json version to 1.10.0 ([43fb0a8a](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/commit/43fb0a8a76dbe543afc15f60342c6a733aa7577b))

## [1.10.0](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/branchCompare?baseVersion=GTv1.9.20&targetVersion=GTv1.10.0) - (2024-05-10)

### Features

- ✨ create the release and deploy task to use in pipeline ([d8f1c814](https://dev.azure.com/DevOpsPCO/Repositorio%20VTEX%20IO/_git/pco-azure-devops-vtex-extension-front/commit/d8f1c814780a4a94ae10aca15d259d43c120bcdc))

## [1.9.20] - 2024-05-02

## [1.9.18] - 2024-04-30

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
