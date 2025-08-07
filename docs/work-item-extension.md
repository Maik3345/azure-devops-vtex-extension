# Work Item Extension

## Overview

The Work Item Extension provides simplified functionality to add branch information comments directly to Azure DevOps work items. This extension adds context menu actions that generate branch names and create formatted comments with branch suggestions.

## Features

### Branch Name Generation
- Automatically generates branch names from work item titles
- Includes sprint/iteration information when available
- Sanitizes titles to create valid git branch names
- Supports configurable branch prefixes

### Comment Creation
- Creates HTML-formatted comments in work items
- Includes branch name suggestions
- Provides copy-to-clipboard functionality
- Uses simple browser dialogs for user interaction

## Architecture

```mermaid
%%{init: { "flowchart": { "defaultRenderer": "elk" } } }%%
flowchart TB
    classDef statementClass fill:#7f56d9,color:white,stroke:#5d3ba2,stroke-width:2px
    classDef conditionalClass fill:#da0063,color:white,stroke:#b0004e,stroke-width:2px
    classDef inicioClass fill:#00c2a8,color:white,stroke-width:2px,stroke:lightGreen
    classDef finClass fill:black,color:white,stroke-width:2px
    classDef amazonClass fill:#da0063,stroke:pink,color:white,stroke-width:2px

    start(("User clicks context menu")):::inicioClass
    validate{"Work item context available?"}:::conditionalClass
    generate["Generate branch name from title"]:::statementClass
    confirm{"User confirms action?"}:::conditionalClass
    create["Create HTML comment"]:::statementClass
    post["Post comment to work item"]:::amazonClass
    success(("Comment added successfully")):::finClass
    cancel(("Action cancelled")):::finClass

    start --> validate
    validate -->|Yes| generate
    validate -->|No| cancel
    generate --> confirm
    confirm -->|Yes| create
    confirm -->|No| cancel
    create --> post
    post --> success
```

## Implementation Details

### Core Service: WorkItemCommentService

The main service handles all work item interactions:

```typescript
export class WorkItemCommentService {
    private generateBranchName(title: string, iteration?: string): string
    private createBranchComment(branchName: string): string
    public async addBranchInformation(): Promise<void>
}
```

### Key Methods

#### `generateBranchName(title, iteration)`
- Sanitizes work item title for git branch naming
- Removes special characters and spaces
- Converts to kebab-case format
- Optionally includes sprint/iteration prefix

#### `createBranchComment(branchName)`
- Generates HTML-formatted comment
- Includes styled branch name display
- Provides copy-to-clipboard functionality
- Returns complete HTML string for Azure DevOps

#### `addBranchInformation()`
- Main entry point for the extension
- Validates work item context
- Orchestrates branch name generation and comment creation
- Handles user confirmation dialogs

## User Workflow

```mermaid
sequenceDiagram
    participant User
    participant Extension
    participant Azure DevOps
    participant WorkItem

    User->>Extension: Right-click work item
    Extension->>User: Show context menu
    User->>Extension: Click "Add Branch Info"
    Extension->>Azure DevOps: Get work item details
    Azure DevOps-->>Extension: Return work item data
    Extension->>Extension: Generate branch name
    Extension->>User: Show confirmation dialog
    User->>Extension: Confirm action
    Extension->>WorkItem: Create HTML comment
    Extension->>Azure DevOps: Post comment
    Azure DevOps-->>Extension: Confirm comment posted
    Extension->>User: Show success message
```

## Configuration

### Extension Manifest (`vss-extension.json`)

The extension is configured with the following contributions:

```json
{
  "contributions": [
    {
      "id": "work-item-menu",
      "type": "ms.vss-web.action",
      "targets": ["ms.vss-work-web.work-item-context-menu"],
      "properties": {
        "text": "Add Branch Information",
        "uri": "my-hub.html"
      }
    }
  ]
}
```

### Context Requirements

- Must be executed within Azure DevOps work item context
- Requires access to work item tracking services
- Uses browser-based dialogs for user interaction

## Error Handling

### Common Error Scenarios

1. **Work Item Context Missing**
   - Error: Cannot access work item details
   - Solution: Ensure extension runs in work item context

2. **API Connection Failures**
   - Error: Cannot post comment to work item
   - Solution: Verify Azure DevOps authentication

3. **Permission Issues**
   - Error: Insufficient permissions to modify work item
   - Solution: Ensure user has work item edit permissions

### Error Handling Pattern

```typescript
try {
    await this.addBranchInformation();
} catch (error) {
    console.error('Work item extension error:', error);
    alert(`Error: ${error.message}`);
}
```

## Testing

### Manual Testing Checklist

- [ ] Extension loads in Azure DevOps work item view
- [ ] Context menu appears on right-click
- [ ] Branch name generation works with various titles
- [ ] Comment creation includes proper HTML formatting
- [ ] User confirmation dialogs function correctly
- [ ] Comments are successfully posted to work items

### Browser Compatibility

- Supports modern browsers with ES6+ support
- Tested in Chrome, Edge, and Firefox
- Requires Azure DevOps Extension SDK compatibility

## Development Guidelines

### Simple Dialog Pattern

Always use browser-native dialogs instead of Azure DevOps Dialog Service:

```typescript
// ✅ Correct approach
const confirmed = confirm("Add branch information to work item?");
if (confirmed) {
    await this.processBranchInfo();
}

// ❌ Avoid complex dialog services
// const dialogService = await SDK.getService(CommonServiceIds.DialogService);
```

### HTML Comment Structure

Comments should follow this structure:

```html
<div style="font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px;">
    <strong>Suggested Branch Name:</strong><br/>
    <code style="background: #e1e1e1; padding: 2px 4px; border-radius: 3px;">
        {branchName}
    </code>
</div>
```

## Future Enhancements

### Planned Features

- Custom branch naming templates
- Integration with git providers
- Bulk branch name generation
- Branch creation automation

### Architecture Considerations

- Keep extension lightweight and focused
- Maintain compatibility with Azure DevOps updates
- Use progressive enhancement for advanced features
- Ensure graceful degradation for unsupported scenarios
