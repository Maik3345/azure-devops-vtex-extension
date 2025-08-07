# Copilot Customization: Pull Request Template Auto-fill

## Objective
Automatizar la generación del contenido de Pull Request (PR) usando GitHub Copilot, basándose en el template de PR y el historial de cambios de la rama actual.

## Instrucción para Copilot

1. **Lee el archivo de template de Pull Request**
   - Ubicación típica: `.github/pull_request_template.md` o similar.
   - Extrae las secciones y los comentarios guía del template.

2. **Obtén el historial de cambios de la rama actual**
   - Usa comandos de git como `git diff` y `git log` para identificar los cambios realizados respecto a la rama base (por ejemplo, `master` o `main`).
   - Resume los cambios principales: archivos modificados, nuevas funcionalidades, refactorizaciones, tests agregados, etc.

3. **Rellena el template de PR automáticamente**
   - Para cada sección del template, utiliza la información del diff y los mensajes de commit para generar un resumen claro y conciso.
   - Ejemplo de correspondencia:
     - "What problem is this solving?": Resume el objetivo principal de los cambios detectados.
     - "How to test it?": Sugiere pasos de prueba basados en los archivos y funcionalidades modificadas.
     - "Screenshots or example usage": Indica si aplica o no, según el tipo de cambio.
     - "Describe alternatives you've considered": Si no hay alternativas en los commits, indica "No aplica".
     - "Related to / Depends on": Si hay referencias a issues o dependencias en los commits, inclúyelas.
     - "How does this PR make you feel?": Sugiere agregar un gif de Giphy.

4. **Genera el título del Pull Request usando Conventional Commits**
   - Haz referencia al archivo `./conventional-commit.instructions.md` para entender el estándar de nomenclatura.
   - Basándote en los cambios analizados, genera un título que siga el formato: `<type>[optional scope]: <description>`
   - Tipos recomendados: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`, `ci:`, `build:`
   - Incluye scope si es relevante (ej: `feat(api):`, `fix(ui):`)

5. **Formato de salida**
   - Genera un archivo `.md` que contenga:
     - **Título sugerido para el PR** siguiendo el estándar de Conventional Commits
     - **Contenido del template rellenado** en markdown, siguiendo la estructura del template
   - No incluir formato adicional fuera del markdown del template.

## Ejemplo de flujo automatizado

1. Detectar el template de PR.
2. Leer las especificaciones de Conventional Commits desde `./conventional-commit.instructions.md`.
3. Ejecutar `git diff origin/master...HEAD` para obtener los cambios.
4. Analizar los mensajes de commit recientes con `git log`.
5. Generar el título del PR siguiendo el estándar de Conventional Commits.
6. Generar el contenido de cada sección del template usando la información anterior.
7. Crear un archivo `.md` con el título sugerido y el contenido completo del template.
8. Presentar el resultado listo para usar en el Pull Request.

## Ejemplo de prompt para Copilot

"Lee el archivo de template de Pull Request y las especificaciones de Conventional Commits (./conventional-commit.instructions.md). Usando el historial de cambios de la rama actual (git diff y git log), genera un archivo .md que contenga: 1) el título sugerido para el PR siguiendo el estándar de Conventional Commits, y 2) el contenido completo del template rellenado en markdown. El resultado debe estar listo para usar directamente en el Pull Request."

---

Este archivo sirve como guía para personalizar Copilot y automatizar la generación de Pull Requests informativos y consistentes.
