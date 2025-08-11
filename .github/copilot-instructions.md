# Azure DevOps VTEX Extension - AI Assistant Instructions

## Project Overview

This is a **dual-purpose Azure DevOps extension** that provides both work item management capabilities and specialized pipeline tasks for VTEX IO development workflows. The extension targets VTEX IO developers and DevOps engineers working with the VTEX ecommerce platform.

## Architecture & Key Components

### Dual Build System
- **Node.js Target**: Azure DevOps pipeline tasks (`tasks/`) compiled for server-side execution
- **Web Target**: Work item extension (`src/extension/`) compiled for browser environment
- **Webpack Dual Config**: `webpack.config.js` handles both targets simultaneously

### Task Structure Pattern
```
tasks/
├── vtex/           # VTEX-specific operations (login, deploy, publish)
├── git/            # Git operations (releases, PR management)
├── project/        # Project setup (dependencies, configuration)
└── shared/         # Common utilities, models, services
```

### Extension Manifest
- `vss-extension.json`: Defines all task contributions and work item extensions
- Each task must be registered in the `contributions` array with unique IDs
- Tasks reference their directories via `properties.name`

## Critical Development Patterns

### Task Development
1. **Task Definition**: Each task requires `task.json` with Azure DevOps schema
2. **UUID Management**: Every task needs a unique UUID in `task.json.id`
3. **Version Strategy**: Tasks have independent versioning (Major.Minor.Patch)
4. **Execution Target**: All tasks use `Node16` execution environment

### Shared Services Architecture
- **Azure Connection**: `tasks/shared/services/azureConnection.ts` - handles DevOps API authentication
- **Pull Request Services**: Centralized PR operations (create, complete, threads)
- **Error Handling**: Standardized error reporting via PR threads using `pullRequestThread()`

### VTEX Integration Patterns
- **projex CLI Wrapper**: All VTEX commands use `projex vtex run "command"` pattern
- **Default Commands**: 
  - Publish: `projex vtex run "vtex publish --yes --force"`
  - Deploy: `projex vtex run "vtex deploy --force"`
- **Authentication Flow**: VtexLogin task must run before other VTEX operations

## Build & Development Workflow

### Build Commands
```bash
npm run build                    # Full build + package extension
npm run build:dev               # Development build with debug info
npm run package:extension       # Create VSIX package using tfx-cli
```

### Extension Size Limits
- **Critical**: Azure DevOps extensions have 50MB size limit
- **Common Issue**: `node_modules` in task directories causes build failures
- **Solution**: Use `.vscodeignore` to exclude `tasks/**/node_modules`

### Version Management
- **Extension Version**: `vss-extension.json.version` (semantic versioning)
- **Task Versions**: Individual `task.json.version` objects
- **Sync Script**: `updateVersion.js` updates all versions simultaneously

## Task Implementation Standards

### Required Imports
```typescript
import * as tl from 'azure-pipelines-task-lib'
import { TaskResult } from 'azure-pipelines-task-lib/task'
```

### Error Handling Pattern
```typescript
try {
  const result = await operationThatMightFail()
  tl.setResult(TaskResult.Succeeded, 'Operation completed')
} catch (error) {
  // Report to PR thread if available
  await pullRequestThread(connection, `Error: ${error.message}`)
  tl.setResult(TaskResult.Failed, error.message)
}
```

### Input Validation Pattern
```typescript
const requiredInput = tl.getInput('inputName', true)  // Required
const optionalInput = tl.getInput('optionalName', false) || 'default'
```

## VTEX-Specific Knowledge

### Pipeline Flow
1. **Setup**: ProjectSetupDependencies (installs projex, vtex, yarn)
2. **Auth**: VtexLogin (authenticates with VTEX APIs)
3. **Operations**: Deploy/Publish tasks
4. **Release**: Git release tasks with version management

### projex Integration
- **CLI Wrapper**: projex provides environment management for VTEX commands
- **Release Detection**: Uses commit message patterns ([major], [minor], [patch])
- **Label Management**: Automated PR labeling via `projex pull-request labels suggest`

## Common Gotchas

### Build Issues
- **spawn EBADF Error**: Usually caused by `node_modules` in task directories
- **Extension Size**: Monitor dist size, exclude unnecessary files via `.vscodeignore`
- **TypeScript Targets**: Tasks use CommonJS, extension uses UMD

### Task Registration
- **Missing Contributions**: New tasks must be added to `vss-extension.json.contributions`
- **Path Alignment**: Task `name` property must match actual directory structure
- **Webpack Entries**: New tasks need webpack entry points in `webpack.config.js`

### Azure DevOps Context
- **Pipeline Context**: Tasks run in Azure DevOps agent environment
- **PR Context**: Some tasks require pull request context (git tasks)
- **Variable Groups**: Sensitive data (API keys) should use Azure DevOps variable groups

## Testing & Debugging

### Local Testing
- Use `npm run build:dev:debug` for development builds with source maps
- Test individual tasks by examining their `dist/` output
- Extension can be side-loaded for testing work item functionality

### Pipeline Testing
- Create test pipelines with minimal task configurations
- Use Azure DevOps variable groups for credentials in test environments
- Monitor task output logs for debugging information

## File Organization Rules

- **Task Logic**: Each task's main file named after the task (e.g., `login.ts` for VtexLogin)
- **Shared Code**: Common functionality goes in `tasks/shared/`
- **Documentation**: Each task requires README.md with usage examples
- **Icons**: 128x128 PNG format for task icons

This codebase emphasizes modularity, standardized error handling, and tight integration with both Azure DevOps and VTEX platforms. Always test extension size limits and ensure proper task registration when adding new functionality.

---

## 🎯 Palabras Clave que Activan los Flujos de Trabajo

**INSTRUCCIÓN PARA COPILOT:** Cuando detectes cualquiera de estas palabras clave en el prompt del usuario, activa automáticamente las instrucciones correspondientes sin necesidad de que el usuario las mencione explícitamente:

### 📋 Pull Request y Control de Versiones

**Palabras clave:** `"pr"` | `"pull request"` | `"crear pr"` | `"generar pr"`  
**→ ACTIVAR:** [pull-request-autofill.instructions.md](./instructions/pull-request/pull-request-autofill.instructions.md)  
**Acción:** Automatiza la generación del contenido de Pull Request basándose en el template y el historial de cambios de la rama actual, incluyendo título con formato Conventional Commits

**Palabras clave:** `"commit"` | `"conventional commit"` | `"formato commit"` | `"mensaje commit"`  
**→ ACTIVAR:** [conventional-commit.instructions.md](./instructions/pull-request/conventional-commit.instructions.md)  
**Acción:** Aplica las reglas de Conventional Commits 1.0.0 para estructurar mensajes de commit consistentes

### 📚 Documentación General

**Palabras clave:** `"doc"` | `"documentación"` | `"generar docs"` | `"crear documentación"`  
**→ ACTIVAR:** [documentation.instructions.md](./instructions/documentation/documentation.instructions.md)  
**Acción:** Genera documentación detallada en la carpeta docs con diagramas Mermaid, actualiza README.md y crea enlaces de navegación

### 🏪 Documentación VTEX IO

**Palabras clave:** `"doc vtex"` | `"doc vtex io"` | `"vtex documentation"` | `"documentación vtex"`  
**→ ACTIVAR:** [documentation-vtex-io.instructions.md](./instructions/documentation/documentation-vtex-io.instructions.md)  
**Acción:** Especializada en documentación para proyectos VTEX IO, incluyendo componentes, props, configuración, APIs y rutas admin

### 🧪 QA y Testing

**Palabras clave:** `"qa"` | `"qa-hu"` | `"resumen qa"` | `"testing guide"` | `"qa guide"`  
**→ ACTIVAR:** [qa-hu-guide.instructions.md](./instructions/backlog/qa-hu-guide.instructions.md)  
**Acción:** Genera resumen estructurado para QA con casos de prueba, puntos críticos y regresiones a verificar

**Palabras clave:** `"coverage"` | `"test-coverage"` | `"cobertura"` | `"sonar quality gate"` | `"cobertura tests"`  
**→ ACTIVAR:** [test-coverage.instructions.md](./instructions/unit-testing/test-coverage.instructions.md)  
**Acción:** Mejora sistemáticamente la cobertura de tests hasta alcanzar el 87% requerido por SonarQube Quality Gate B-2

---

### 🤖 Para Copilot: Reglas de Activación Automática

1. **Detecta las palabras clave** en el prompt del usuario (sin importar mayúsculas/minúsculas)
2. **Activa automáticamente** las instrucciones del archivo correspondiente
3. **Sigue las instrucciones específicas** del archivo `.instructions.md` referenciado
4. **No requieras** que el usuario mencione explícitamente las instrucciones
5. **Ejecuta la tarea** según el flujo definido en las instrucciones específicas
