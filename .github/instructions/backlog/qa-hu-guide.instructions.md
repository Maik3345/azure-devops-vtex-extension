# Copilot Customization: Resumen QA en Markdown Plano

## Objetivo

Automatizar la generación de un resumen estructurado y profesional en formato markdown plano, para que QA pueda entender qué se modificó y cómo probarlo. El resultado debe ser fácil de copiar y pegar en la historia de usuario.

---

## Instrucción para Copilot

1. **Analiza los cambios de la rama**
   - Usa `git diff origin/master...HEAD` y/o los mensajes de commit para identificar funcionalidades, flujos y archivos modificados.
   - Determina el problema resuelto y la nueva funcionalidad implementada.

2. **Genera el resumen para QA**
   - Usa el siguiente formato, sin bloques de código ni metadatos, solo texto plano markdown:

### 🎯 Problema Resuelto

Breve descripción del problema o necesidad que se soluciona.

### ⚙️ Funcionalidad Implementada

- Lista de nuevas funcionalidades, mejoras o cambios principales.
- Detalles de flujos o comportamientos relevantes.

### 🧪 Casos de Prueba para QA

#### Caso 1: [Nombre descriptivo]
1. Paso a paso para reproducir el caso.
2. ✅ Verificación esperada.

(Repite para cada caso relevante)

### 🔍 Puntos Críticos a Verificar

- Lista de aspectos técnicos, timings, persistencia, UX/UI, etc.

### 🚫 Regresiones a Verificar

- Comportamientos previos que no deben romperse.
- Funcionalidades que deben conservarse.

---

3. **Formato final**
   - Entrega el contenido en markdown plano, sin bloques de código, para facilitar el copiado en la HU.
   - Usa frases claras, listas y títulos para que QA lo lea y use rápidamente.

---

## Ejemplo de prompt para Copilot

> Analiza los cambios realizados en la rama actual y genera un resumen profesional para QA en markdown plano (sin bloques de código), siguiendo el formato con secciones de problema resuelto, funcionalidad implementada, casos de prueba, puntos críticos y regresiones. El resultado debe ser fácil de copiar y pegar en la historia de usuario.

---

Este archivo sirve como guía para Copilot y el equipo, facilitando que cada historia de usuario tenga una descripción útil y lista para QA sobre los cambios y su validación.