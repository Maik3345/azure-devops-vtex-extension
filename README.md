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

# Pipeline Templates

This extension provides YAML pipeline templates to simplify your CI/CD workflows for VTEX IO projects. These templates are organized in a logical order to support the full development lifecycle:

## Available Templates and Usage Order

1. **[Beta Generation (1.beta.yml)](./docs/azure-devops/1.beta.yml)** - First step in the CI/CD process
   - Creates a beta version of your VTEX IO app for testing
   - Runs when a pull request is created
   - Publishes app with beta tag and creates a release tag

2. **[Publication (2.publish.yml)](./docs/azure-devops/2.publish.yml)** - Second step for production release
   - Publishes your VTEX IO app to production
   - Typically runs after PR is merged to main branch
   - Handles authentication and publication to VTEX IO

3. **[Deployment & Release (3.deploy-release.yml)](./docs/azure-devops/3.deploy-release.yml)** - Final step
   - Deploys the published app to production workspace
   - Creates a Git release with updated version number
   - Updates changelog and finalizes the release process

### How to Use

1. Add these YAML files to your Azure DevOps pipeline configuration
2. Configure the required parameters (account, email, apiKey, etc.)
3. Set up appropriate triggers for each pipeline stage

For example, to set up a beta release pipeline:

```yaml
# azure-pipelines.yml
trigger: none

pr:
  branches:
    include:
      - main

extends:
  template: docs/azure-devops/beta-example.yml
  parameters:
    account: 'your-vtex-account'
    email: '$(VTEX_EMAIL)'
    apiKey: '$(VTEX_API_KEY)'
    apiToken: '$(VTEX_API_TOKEN)'
    environment: 'development'
```

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
