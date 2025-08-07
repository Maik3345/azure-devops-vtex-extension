# Instrucción para Documentación de Componentes VTEX IO

**Importante:**  
Cuando generes la documentación de un componente, debes consultar y aplicar los lineamientos generales definidos en `./documentation.instructions.md`. Posteriormente, aplica los lineamientos y ejemplos específicos de este archivo para proyectos VTEX IO.

## ¿Cómo se debe usar esta instrucción?

1. Consulta primero el archivo `documentation.instructions.md` y aplica sus lineamientos generales.
2. Si el proyecto es VTEX IO (tiene `manifest.json` y `store/interfaces.json`), complementa la documentación siguiendo las instrucciones, ejemplos y formatos de este archivo.
3. La documentación generada debe reflejar ambos contextos.
4. Si el proyecto contiene carpetas especiales (`node`, `graphql`, `admin`), sigue los lineamientos específicos para cada una descritos abajo.
5. Se deberá generar un archivo .md por cada componente en el archivo interfaces.json, siguiendo el formato y ejemplos proporcionados, ya que la idea es que cada componente tenga su propia documentación detallada, si el proyecto no tiene la carpeta `store` o el archivo `interfaces.json`, entonces se generará documentación de los componentes que hay en la carpeta `src`.

## Objetivo

Establecer una guía clara y estructurada para la documentación de componentes y servicios en proyectos VTEX IO, asegurando que se incluyan tanto los aspectos técnicos de los componentes, como la integración y configuración en el tema VTEX y documentación de servicios adicionales.

## Lineamientos generales

- Para proyectos NO VTEX IO, sigue únicamente los lineamientos generales establecidos en `documentation.instructions.md`.
- Para proyectos VTEX IO, aplica estos lineamientos adicionales.

## Identificación de proyectos VTEX IO

Un proyecto se considera VTEX IO si cumple con ambos requisitos:

- Contiene el archivo `manifest.json` en la raíz.
- Existe la carpeta `store` con el archivo `interfaces.json`.

## Documentación de Script en el archivo README.md

Si el proyecto es VTEX IO, valida que los scripts que se tienen en alguna de las sesiones del `README.md` contenga los scripts necesarios para el correcto funcionamiento del proyecto. Por ejemplo:

```bash
prepare --> para preparar el proyecto antes de publicar, se usa en devops y permite hacer tareas previas a la publicación
publish --> para publicar el proyecto en VTEX IO, se usa en devops y permite hacer tareas previas a la publicación
deploy --> para desplegar el proyecto en VTEX IO, se usa en devops y permite hacer tareas previas al despliegue
```

Si el proyecto no tienes estos scripts en el package.json entonces los scripts que deben de existir son:

```bash
vtex publish --> para publicar el proyecto en VTEX IO
vtex deploy --> para desplegar el proyecto en VTEX IO
```

Para ambos escenarios, asegúrate de que el `README.md` contenga una sección clara que explique cómo usar estos scripts y qué hacen y por defecto se debe tener el comando `vtex link` para enlazar el proyecto en el entorno de desarrollo.

## Documentación de Props de Componentes

Para cada componente:

1. Analiza las props que recibe el componente.
2. Documenta cada prop en una tabla, usando el siguiente formato:

   | Prop name | Type | Default value | Description |
   | --------- | ---- | ------------- | ----------- |
   | nombre    | tipo | valor         | descripción |

3. Incluye una tabla por cada grupo de props relevante (por ejemplo, atributos condicionales o agrupados por funcionalidad).
4. En cada propiedad, detalla:
   - Nombre
   - Tipo
   - Valor por defecto (si aplica)
   - Breve descripción de su función

## Sección de Configuración

Incluye una sección titulada `## Configuration` en la documentación de cada componente VTEX IO, explicando cómo importar y configurar el componente en el tema. Ejemplo de estructura a seguir:

## Configuration

1. Importa la app del componente en las dependencias de tu tema en el archivo `manifest.json`:

**Nota:** Usa los valores reales de `vendor`, `name` y `version` del `manifest.json` del componente.

```json
"dependencies": {
  "vendor.nombre-componente": "x.x"
}
```

2. Agrega la interfaz a tu app en el archivo `interfaces.json`:

```json
{
  "nombre-interfaz": {
    "props": {
      // ...propiedades del componente...
    }
  }
}
```

Adapta los nombres y propiedades según corresponda a tu componente.

## Documentación de la carpeta node

Si existe la carpeta raíz `node` y el archivo `node/service.json`:

- Genera un archivo llamado `apis.md` en la documentación.
- Incluye una tabla con los endpoints REST definidos en `service.json`.
- La tabla debe contener: Route name, Path, Tipo de endpoint (GET, POST, etc. si es posible), Público/privado.
- Si el proyecto tiene lógica relevante, incluye diagramas de flujo o de arquitectura siguiendo los lineamientos principales.

Ejemplo de tabla:

| Route name       | Path                                            | Method | Public |
| ---------------- | ----------------------------------------------- | ------ | ------ |
| getState         | /\_v1/pco-marketplace/getState-middleware-front | GET    | true   |
| skuBindingSeller | /\_v1/sku-binding/:skuId                        | GET    | true   |
| getSpecification | /\_v1/getSpecification/:id                      | GET    | true   |

## Documentación de la carpeta graphql

Si existe la carpeta raíz `graphql`:

- Genera una sección o archivo con ejemplos de queries y mutations relevantes.
- Por cada método, agrega un ejemplo de cómo se llama con GraphQL.
- Documenta la estructura y parámetros de cada query/mutation importante.

Ejemplo de sección:

### Example Query

```graphql
query {
  getCategoryMenu {
    categories {
      id
      name
      href
      slug
      icon
      parent
      styles
      showIconLeft
      showIconRight
      categoryId
      enable
    }
  }
}
```

## Documentación de la carpeta admin

Si existe la carpeta raíz `admin` y el archivo `routes.json`:

- Genera un archivo llamado `admin-routes.md` en la documentación.
- Incluye una tabla con las rutas administrativas disponibles.
- La tabla debe contener: Route key, Component, Path, Descripción (opcional, si se puede deducir del nombre/component).

Ejemplo de tabla:

| Route Key                             | Component                | Path                                      |
| ------------------------------------- | ------------------------ | ----------------------------------------- |
| admin.app.manage-category-menu        | CategoryMenuAdmin        | /admin/app/pco-admin/category-menu        |
| admin.app.manage-upload-brands        | UploadBrandsAdmin        | /admin/app/pco-admin/upload-brands        |
| admin.app.manage-delete-skus          | DeleteSkusAdmin          | /admin/app/manage-skus/delete-skus        |
| admin.app.manage-points-configuration | PointsConfigurationAdmin | /admin/app/pco-admin/points-configuration |

## Diagramas

- Utiliza diagramas de flujo, arquitectura o secuencia cuando sea relevante para explicar la lógica de Node, GraphQL o rutas admin.
- Los diagramas deben seguir el estilo y claridad definidos en la documentación principal.

## Resumen

- Siempre consulta primero los lineamientos generales del archivo base.
- Complementa con esta instrucción si el proyecto es VTEX IO.
- Documenta componentes, endpoints REST, GraphQL y rutas admin si existen en el proyecto.
- Usa tablas, ejemplos de código y diagramas cuando corresponda siguiendo los ejemplos anteriores.
- Valida la sesión de scripts en el `README.md` para asegurar que se incluyan los necesarios para VTEX IO.

---
