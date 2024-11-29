<h1 align="center">
 <br>
  VTEX IO Azure Pipeline CI/CD
  <br>
</h1>

This project is a VTEX IO app that provides a set of tasks to automate the CI/CD process in the VTEX IO platform.

## Features

- Push messages in the thread of the pull request.
- Create a pull request in the specified repository with the changes of the current pull request.
- Implement the logic to complete the pull request and initiate the release process using the `projex` CLI.
- Handle exceptions and errors in the tasks and generate error messages in the pull request thread.
- Set up the core settings of the tasks, including installing `projex`, `vtex`, and `yarn` in the pipeline.
- Implement the logic to log in to the VTEX account using the `apiKey` and `apiToken` in the pipeline. These parameters are required to execute the tasks and are passed as inputs to the task.

# Available tasks

- [VtexPullRequestPublish](./tasks/vtex/pullRequest/publish/README.md)
- [VtexPublish](./tasks/vtex/publish/README.md)
- [GitRelease](./tasks/git/release/README.md)
- [VtexDeploy](./tasks/vtex/deploy/README.md)
- [GitPullRequestRelease](./tasks/git/pullRequest/release/README.md)
- [VtexPullRequestDeploy](./tasks/vtex/pullRequest/deploy/README.md)
- [VtexLogin](./tasks/vtex/login/README.md)
- [ProjectSetupDependencies](./tasks/project/setupDependencies/README.md)
- [GitPullRequestMergeIntoBranch](./tasks/git/pullRequest/mergeIntoBranch/README.md)

# Installation

You can install the extension to your Azure DevOps organization from Marketplace:
[VTEX IO CI/CD Utilities](https://marketplace.visualstudio.com/items?itemName=MaikRestrepo.vtex-io-ci-cd)

You may need to add **Contribute to pull requests** permission to your **Project Collection Build Service Accounts** from project -> repository -> **Security**.

![Permissions](screenshots/screen3.png)

### Development and contribution

To contribute to this project, follow these steps:

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Maik3345/azure-devops-vtex-extension
cd azure-devops-vtex-extension
```

2. Install the project dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

This command will start the development server and allow you to make changes to the tasks.

4. Update the version of task.json and vss-extension.json whenever you make changes to the tasks.

5. Build the extension:

```bash
npm run build
```
