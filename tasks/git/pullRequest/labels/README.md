# Git Pull Request Labels Task

## Overview

This Azure DevOps task automatically manages pull request labels using the `projex pull-request labels suggest` command. It intelligently suggests appropriate labels based on the changes in the pull request and applies them using the Azure DevOps API.

## Features

- **Automatic Label Suggestion**: Uses projex to analyze pull request changes and suggest relevant labels
- **Smart Label Management**: Avoids duplicate labels and can remove outdated ones
- **Custom Label Support**: Allows adding custom labels alongside suggested ones
- **Dry Run Mode**: Preview changes without actually applying them
- **Comprehensive Logging**: Detailed logging of all label operations

## Usage

### Basic Usage

```yaml
- task: GitPullRequestLabels@1
  displayName: 'Update Pull Request Labels'
```

### Advanced Configuration

```yaml
- task: GitPullRequestLabels@1
  displayName: 'Update Pull Request Labels'
  inputs:
    removeOutdatedLabels: true
    dryRun: false
    customLabels: 'urgent,needs-review,ready-for-deployment'
```

### Integration with VTEX Workflows

```yaml
trigger: none

pr:
  branches:
    include:
    - main
    - develop

jobs:
- job: LabelManagement
  displayName: 'Manage PR Labels'
  pool:
    vmImage: 'ubuntu-latest'
  
  steps:
  - task: SetupDependencies@1
    displayName: 'Setup Dependencies'
  
  - task: GitPullRequestLabels@1
    displayName: 'Auto-update PR Labels'
    inputs:
      removeOutdatedLabels: true
      customLabels: 'vtex-io,automated'
    condition: always() # Run even if previous steps fail
```

## Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `removeOutdatedLabels` | boolean | No | `true` | Remove labels from the pull request that are not in the suggested labels list |
| `dryRun` | boolean | No | `false` | Only show what labels would be added/removed without actually making changes |
| `customLabels` | string | No | `""` | Additional comma-separated labels to add beyond the suggested ones |

## Prerequisites

- **Projex CLI**: Must be installed and configured in the pipeline environment
- **Pull Request Context**: Task must be run within a pull request build context
- **Permissions**: Build service account must have permissions to modify pull request labels

## How It Works

1. **Execute Projex Command**: Runs `projex pull-request labels suggest --format csv` to get suggested labels
2. **Parse Results**: Extracts labels from the CSV output (e.g., `size:large,type:test,type:feature`)
3. **Get Current Labels**: Retrieves existing labels from the current pull request
4. **Calculate Changes**: Determines which labels to add or remove
5. **Apply Changes**: Uses Azure DevOps API to update pull request labels

## Example Output

The projex command typically returns labels like:
```
size:large,type:test,type:feature,scope:docs,scope:ci,scope:api,scope:tests,type:refactor,dependencies-updated
```

## Label Operations

The task performs intelligent label management:

### Adding Labels
- Adds suggested labels that don't already exist on the PR
- Adds custom labels specified in the `customLabels` parameter
- Skips labels that are already present to avoid duplicates

### Removing Labels (when `removeOutdatedLabels` is true)
- Removes existing labels that are not in the suggested labels list
- Preserves custom labels that were explicitly specified
- Provides detailed logging of removal operations

## Error Handling

- **Graceful Failures**: If individual label operations fail, the task continues with other operations
- **Detailed Logging**: Comprehensive logging helps troubleshoot issues
- **Context Validation**: Ensures task runs only in pull request context

## Example Pipeline Integration

```yaml
trigger: none

pr:
  branches:
    include:
    - main
    - develop

jobs:
- job: UpdateLabels
  displayName: 'Update PR Labels'
  pool:
    vmImage: 'ubuntu-latest'
  
  steps:
  - task: GitPullRequestLabels@1
    displayName: 'Auto-update PR Labels'
    inputs:
      removeOutdatedLabels: true
      customLabels: 'auto-generated'
    condition: always() # Run even if previous steps fail
```

## Troubleshooting

### Common Issues

1. **"This task must be run in the context of a pull request"**
   - Ensure the task runs only on pull request builds
   - Check that the build is triggered by a PR

2. **"Failed to establish Azure DevOps connection"**
   - Verify that the build service account has proper permissions
   - Ensure the System.AccessToken is available

3. **"projex command not found"**
   - Install projex CLI in a previous pipeline step
   - Ensure projex is in the PATH

### Debug Mode

Enable verbose logging by adding:
```yaml
- task: GitPullRequestLabels@1
  inputs:
    dryRun: true  # See what would happen without making changes
```

## Security Considerations

- Uses Azure DevOps system access token for API operations
- Requires minimal permissions (read/write access to pull requests)
- No sensitive data is logged or exposed

## Performance

- Lightweight operation with minimal API calls
- Batch operations where possible
- Efficient label comparison algorithms

## Version History

- **1.0.0**: Initial release with basic label management functionality
