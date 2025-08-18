# Copilot Customization: Generación de Documentación Detallada

## Objetivo

Automatizar la generación de documentación en la carpeta `docs` del proyecto, creando archivos `.md` para cada caso de uso o funcionalidad existente, siguiendo estas reglas:

### Para cada archivo de documentación generado:

- Incluye una breve explicación del caso de uso o funcionalidad.
- Agrega diagramas en Mermaid de los siguientes tipos según corresponda: flujo, secuencia, arquitectura, datos y componentes.
- Añade explicaciones complementarias para cada diagrama.
- No inventes información ni agregues funcionalidades que no existan en el proyecto.

### Para el archivo `README.md` principal:

- Incluye un resumen de la documentación generada.
- Agrega enlaces directos a cada archivo `.md` en la carpeta `docs` para facilitar la navegación.
- Si no existe, crea una sección clara y organizada con los comandos necesarios para:
  - Ejecutar el proyecto.
  - Correr los tests.
  - Realizar el build.
- Mejora la estructura y experiencia de usuario del README si detectas oportunidades.

### 🧩 Encabezado introductorio del README.md

Al inicio del archivo `README.md`, incluye un encabezado con las siguientes características:

- Un título principal (`#`) que identifique claramente el nombre del proyecto o aplicación.
- Una serie de badges informativos que resuman aspectos clave del proyecto, como:
  - Plataforma o tecnología principal (por ejemplo, VTEX IO, Node.js, React, etc.).
  - Versión actual del proyecto.
  - Estado del build, cobertura de tests u otras métricas relevantes.
- Una descripción breve y clara (1 a 3 párrafos) que explique:
  - El propósito general de la aplicación.
  - Su funcionalidad principal o casos de uso.
  - Público objetivo o contexto de uso (si aplica).
