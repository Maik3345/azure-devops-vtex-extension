# Copilot Customization: Mejora de Cobertura de Tests para Quality Gate B-2 (SonarQube)

## Objetivo

Incrementar la cobertura de tests del proyecto hasta alcanzar al menos un 87%, cumpliendo con el Quality Gate B-2 de SonarQube, siguiendo un enfoque sistemático y de calidad.

## Estrategia Recomendada

1. **Analiza y optimiza los tests existentes**
   - Revisa los tests actuales para identificar casos no cubiertos, ramas no evaluadas o escenarios que puedan mejorarse.
   - Refactoriza y optimiza los tests para maximizar la cobertura sin duplicar pruebas triviales.

2. **Identifica áreas no cubiertas**
   - Utiliza herramientas de reporte de cobertura (por ejemplo, `npm run test:cov` o el reporte de SonarQube) para localizar archivos, funciones o ramas no cubiertas.
   - Prioriza módulos críticos y de negocio.

3. **Crea los tests faltantes**
   - Implementa tests adicionales solo para las áreas no cubiertas, asegurando que sean relevantes y de calidad.
   - Evita tests triviales o sin valor real para el negocio.

4. **Reporte de mejoras**
   - Al finalizar, genera un breve reporte que resuma:
     - Áreas cubiertas y archivos con mejoras significativas.
     - Tipos de tests agregados (unitarios, integración, etc.).
     - Porcentaje de cobertura alcanzado.

## Buenas Prácticas

- No inventes funcionalidades ni modifiques la lógica del código original.
- Enfócate únicamente en mejorar la cobertura de tests sobre la base existente.
- Prioriza la calidad y relevancia de los tests.

## Ejemplo de prompt para Copilot

> Mejora la cobertura de tests del proyecto hasta alcanzar al menos un 87% para poder cumplir con el Quality Gate B-2 de SonarQube. Sigue este enfoque:
> 
> 1. Analiza los tests existentes y optimízalos para maximizar la cobertura, identificando casos no cubiertos o posibles mejoras en los escenarios actuales.
> 2. Una vez optimizados los tests existentes, identifica las áreas del código que aún no están cubiertas y crea los tests faltantes necesarios para alcanzar el objetivo de cobertura.
> 3. Prioriza la calidad y relevancia de los tests, asegurando que sean significativos y no tests triviales solo para aumentar el porcentaje.
> 4. Al finalizar, genera un breve reporte de las áreas cubiertas y las mejoras realizadas.
> 
> No inventes funcionalidades ni modifiques la lógica del código original, enfócate únicamente en mejorar la cobertura de tests sobre la base existente.

---

Guarda este archivo en la raíz del proyecto o en la carpeta `.github` para que Copilot y tu equipo tengan siempre la referencia de cómo abordar la mejora de cobertura de tests de manera efectiva y alineada con los estándares de calidad.
