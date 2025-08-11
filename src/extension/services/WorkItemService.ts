import { getClient } from 'azure-devops-extension-api'
import { GitRestClient } from 'azure-devops-extension-api/Git'
import {
  WorkItem,
  WorkItemExpand,
  WorkItemTrackingRestClient,
} from 'azure-devops-extension-api/WorkItemTracking'
import * as SDK from 'azure-devops-extension-sdk'
import { IWorkItemFormService } from '../interfaces/WorkItemInterfaces'

/**
 * Clase para trabajar con los servicios de elementos de trabajo
 */
export class WorkItemService {
  private workClient?: WorkItemTrackingRestClient
  private clientForm?: IWorkItemFormService
  private gitClient?: GitRestClient

  /**
   * Obtiene el servicio del formulario de elemento de trabajo
   */
  public async getFormService(): Promise<IWorkItemFormService> {
    if (!this.clientForm) {
      this.clientForm = await SDK.getService<IWorkItemFormService>(
        'ms.vss-work-web.work-item-form'
      )
    }
    return this.clientForm
  }

  /**
   * Obtiene el cliente de seguimiento de elementos de trabajo
   */
  public async getWorkClient(): Promise<WorkItemTrackingRestClient> {
    try {
      if (!this.workClient) {
        this.workClient = await getClient(WorkItemTrackingRestClient)
      }
      return this.workClient
    } catch (error) {
      console.error('Error getting work item tracking client:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw error
    }
  }

  /**
   * Obtiene el cliente Git REST para acceder a repositorios y pull requests
   */
  public async getGitClient(): Promise<GitRestClient> {
    try {
      if (!this.gitClient) {
        this.gitClient = await getClient(GitRestClient)
      }
      return this.gitClient
    } catch (error) {
      console.error('Error getting Git REST client:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw error
    }
  }

  /**
   * Añade un comentario a un elemento de trabajo
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @param comment Comentario a añadir (formateado en HTML)
   */
  public async addComment(
    workItemId: number,
    projectName: string,
    comment: string
  ): Promise<void> {
    try {
      const workClient = await this.getWorkClient()
      
      // Usar System.History con HTML para garantizar la correcta visualización
      // Agregar estilos básicos para mejorar la presentación
      const htmlComment = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${comment}
      </div>`
      
      const patchDocument = [
        {
          op: 'add',
          path: '/fields/System.History',
          value: htmlComment,
        },
      ]

      // Actualizar el elemento de trabajo para añadir el comentario
      await workClient.updateWorkItem(
        patchDocument,
        workItemId,
        projectName,
        false, // validateOnly
        false, // bypassRules
        false // suppressNotifications
      )

      // Refrescar el formulario si está disponible para mostrar el nuevo comentario
      const formService = await this.getFormService()
      if (!(await formService.isDirty())) {
        await formService.refresh()
      }
    } catch (error: any) {
      console.error('Error al añadir comentario con SDK:', error)
      if (error.serverError) {
        console.error('Error del servidor:', error.serverError)
      }
      throw error
    }
  }

  /**
   * Obtiene los detalles de un elemento de trabajo
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @param fields Campos específicos a obtener (opcional)
   * @param expand Opciones de expansión (por defecto incluye relaciones)
   * @returns Objeto WorkItem con los campos solicitados
   */
  public async getWorkItemDetails(
    workItemId: number,
    projectName: string,
    fields?: string[],
    expand: WorkItemExpand = WorkItemExpand.Relations
  ): Promise<WorkItem> {
    try {
      // Obtener el cliente de trabajo
      const workClient = await this.getWorkClient()

      // Obtener el work item con los parámetros especificados
      const workItem = await workClient.getWorkItem(
        workItemId,
        projectName,
        fields,
        undefined, // Versión no requerida
        expand
      )

      if (!workItem) {
        throw new Error(
          `No se encontró el elemento de trabajo con ID: ${workItemId}`
        )
      }

      // Asegurar que existe un array de relaciones si se solicitaron
      if (expand === WorkItemExpand.Relations) {
        workItem.relations = workItem.relations || []
      }

      return workItem
    } catch (error) {
      console.error(`Error al obtener el trabajo #${workItemId}:`, error)
      throw error
    }
  }

  /**
   * Obtiene el valor de un campo específico del elemento de trabajo
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @param fieldName Nombre del campo (ej. "System.IterationPath")
   * @returns Valor del campo solicitado
   */
  public async getWorkItemField<T>(
    workItemId: number,
    projectName: string,
    fieldName: string
  ): Promise<T | null> {
    try {
      // Si este campo se está solicitando como parte de otra operación,
      // podríamos optimizar más en el futuro con una caché
      const workItem = await this.getWorkItemDetails(
        workItemId,
        projectName,
        [fieldName],
        undefined // No necesitamos expandir relaciones
      )

      if (workItem?.fields && fieldName in workItem.fields) {
        return workItem.fields[fieldName] as T
      }

      return null
    } catch (error) {
      console.error(`Error al obtener el campo "${fieldName}":`, error)
      throw error
    }
  }

  /**
   * Obtiene múltiples campos de un elemento de trabajo en una sola llamada
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @param fieldNames Array con los nombres de los campos a obtener
   * @returns Objeto con los valores de los campos solicitados
   */
  public async getWorkItemFields<T extends Record<string, any>>(
    workItemId: number,
    projectName: string,
    fieldNames: string[]
  ): Promise<T | null> {
    try {
      // Obtener el work item con solo los campos específicos
      const workItem = await this.getWorkItemDetails(
        workItemId,
        projectName,
        fieldNames,
        undefined // No necesitamos expandir relaciones
      )

      if (!workItem?.fields) {
        return null
      }

      // Construir objeto de resultado con los campos solicitados
      const result = {} as T

      for (const fieldName of fieldNames) {
        if (fieldName in workItem.fields) {
          // Extraer solo el nombre del campo sin el prefijo (ej. "System.")
          const simpleName = fieldName.includes('.')
            ? fieldName.split('.').pop() || fieldName
            : fieldName

          result[simpleName as keyof T] = workItem.fields[fieldName]
        }
      }

      return result
    } catch (error) {
      console.error(
        `Error al obtener múltiples campos: ${fieldNames.join(', ')}:`,
        error
      )
      return null
    }
  }

  /**
   * Obtiene los pull requests asociados con un elemento de trabajo desde sus relaciones
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @returns Lista de pull requests asociados
   * @deprecated Use getWorkItemWithRelations instead for more efficient API usage
   */
  public async getLinkedPullRequests(
    workItemId: number,
    projectName: string
  ): Promise<
    {
      id: number
      title: string
      url: string
      status: string
      repositoryId?: string
    }[]
  > {
    try {
      console.log(
        `Buscando PRs para work item #${workItemId} (usando getWorkItemWithRelations)`
      )

      // Reutilizar el método que obtiene toda la información en una sola llamada
      const workItemInfo = await this.getWorkItemWithRelations(
        workItemId,
        projectName
      )

      // Devolver directamente los pull requests extraídos
      console.log(`Total PRs encontrados: ${workItemInfo.pullRequests.length}`)
      return workItemInfo.pullRequests
    } catch (error) {
      console.error('Error al obtener los PRs relacionados:', error)
      return []
    }
  }

  /**
   * Formatea un comentario con información del proyecto, rama sugerida y pull requests asociados
   * @param projectName Nombre del proyecto (ej: "Marketplace")
   * @param branchName Nombre de la rama sugerida (ej: "feature/sprint-14Q325/1234")
   * @param pullRequests Lista de pull requests asociados en formato simplificado
   * @returns Comentario formateado en HTML para Azure DevOps
   */
  public formatCommentWithPullRequests(
    projectName: string,
    branchName: string,
    pullRequests: { id: number; title: string; url?: string }[] = []
  ): string {
    // Crear el comentario directamente en HTML para asegurar la correcta visualización
    // ya que Azure DevOps puede tener problemas con el renderizado de Markdown
    let formattedComment = `<h2>🚀 ${projectName}</h2>
<ul>
  <li><strong>Rama sugerida:</strong> <code>${branchName}</code></li>
`;

    // Añadir los pull requests si existen
    if (pullRequests.length > 0) {
      formattedComment += `  <li><strong>Pull Requests:</strong>
    <ul>`;
      
      for (const pr of pullRequests) {
        // Usar la URL relativa del PR si está disponible, de lo contrario usar # para referencia local
        const href = pr.url ? pr.url : "#";
        
        formattedComment += `
      <li><a href="${href}" style="color: #0078d7;">#${pr.id}</a>: ${pr.title}</li>`;
      }
      
      formattedComment += `
    </ul>
  </li>`;
    }
    
    formattedComment += `
</ul>`;

    return formattedComment
  }

  /**
   * Obtiene un elemento de trabajo completo con sus campos y pull requests relacionados en una sola llamada
   * @param workItemId ID del elemento de trabajo
   * @param projectName Nombre del proyecto
   * @returns Objeto con el WorkItem completo y sus pull requests relacionados
   */
  public async getWorkItemWithRelations(
    workItemId: number,
    projectName: string
  ): Promise<{
    fields: Record<string, any>
    pullRequests: {
      id: number
      title: string
      url: string
      status: string
      repositoryId?: string
    }[]
  }> {
    try {
      // Obtener el work item con todas sus relaciones
      const workItem = await this.getWorkItemDetails(
        workItemId,
        projectName,
        undefined, // Obtener todos los campos
        WorkItemExpand.Relations // Incluir las relaciones
      )

      // Procesar las relaciones para obtener los pull requests
      let pullRequests: {
        id: number
        title: string
        url: string
        status: string
        repositoryId?: string
      }[] = []

      if (workItem.relations && workItem.relations.length > 0) {
        // Reutilizamos la lógica de extracción de pull requests
        const pullRequestRelations = workItem.relations.filter(
          (relation) =>
            relation.rel === 'ArtifactLink' &&
            relation.attributes?.name?.toLowerCase().includes('pull')
        )

        if (pullRequestRelations.length > 0) {
          // Base URL para construir los enlaces web a los pull requests
          const hostName = window.location.origin || 'https://dev.azure.com'
          const orgName = hostName.includes('dev.azure.com')
            ? hostName.split('/').pop() || projectName
            : projectName
          const baseUrl = `${hostName}/${orgName}/${projectName}`

          // Set para evitar duplicados
          const processedIds = new Set<number>()

          // Obtener el nombre del proyecto directamente de los campos del WorkItem
          let realProjectName = projectName;
          if (workItem.fields && workItem.fields['System.TeamProject']) {
            // Usar el campo System.TeamProject para obtener el nombre real del proyecto
            realProjectName = workItem.fields['System.TeamProject'];
            console.log(`Usando nombre de proyecto desde campos: ${realProjectName}`);
          } else if (workItem.url) {
            // Alternativa: extraer el ID del proyecto desde la URL del workItem
            const urlParts = workItem.url.split('/');
            // El formato es: https://dev.azure.com/orgName/projectId/_apis/...
            if (urlParts.length >= 5) {
              const projectId = urlParts[4];
              if (projectId && projectId !== '_apis') {
                // Si encontramos un ID válido, lo usamos como respaldo
                console.log(`Usando proyecto desde URL: ${projectId}`);
                realProjectName = projectId;
              }
            }
          }
          
          // Procesar cada relación de pull request
          for (const relation of pullRequestRelations) {
            try {
              const url = relation.url || ''
              let pullRequestId = 0

              // Extraer el ID del pull request
              if (url.includes('vstfs:///Git/PullRequestId/')) {
                // Intentar extraer ID usando varios métodos
                const parts = url.split('%2F')
                if (parts.length > 0) {
                  const idPart = parts[parts.length - 1]
                  if (!isNaN(parseInt(idPart))) {
                    pullRequestId = parseInt(idPart)
                  } else {
                    const matches = url.match(/(\d+)(?!.*\d)/)
                    if (matches && matches[1]) {
                      pullRequestId = parseInt(matches[1])
                    }
                  }
                }
              } else if (url.includes('pullRequests/')) {
                const matches = url.match(/pullRequests\/(\d+)/)
                if (matches && matches[1]) {
                  pullRequestId = parseInt(matches[1])
                }
              } else if (url.includes('%2f')) {
                const id = url.substring(url.lastIndexOf('%2f') + 3)
                pullRequestId = parseInt(id)
              } else if (url.includes('/')) {
                const id = url.substring(url.lastIndexOf('/') + 1)
                pullRequestId = parseInt(id)
              }

              // Validar ID y evitar duplicados
              if (
                pullRequestId <= 0 ||
                isNaN(pullRequestId) ||
                processedIds.has(pullRequestId)
              ) {
                continue
              }

              processedIds.add(pullRequestId)

              // Extraer el repositoryId de la URL
              let repositoryId = projectName
              if (url.includes('vstfs:///Git/PullRequestId/')) {
                // Formato: vstfs:///Git/PullRequestId/orgId%2FrepoId%2FprId
                const parts = url.split('%2F')
                if (parts.length >= 2) {
                  // El segundo componente después de la división por %2F es el repoId
                  repositoryId = parts[1]
                }
              }

              // Construir la URL relativa para el pull request
              const relativeUrl = `/${realProjectName}/_git/${repositoryId}/pullrequest/${pullRequestId}`

              // Determinar el estado y título
              let status = 'Desconocido'
              let title = `Pull Request #${pullRequestId}`

              if (relation.attributes) {
                // Título del PR
                if (relation.attributes.comment) {
                  title = relation.attributes.comment
                }

                // Estado del PR
                const name = relation.attributes.name || ''
                if (name.includes('Active') || name === 'Pull Request') {
                  status = 'Activo'
                } else if (name.includes('Closed')) {
                  status = 'Cerrado'
                } else if (name.includes('Completed')) {
                  status = 'Completado'
                } else if (name.includes('Abandoned')) {
                  status = 'Abandonado'
                }
              }

              pullRequests.push({
                id: pullRequestId,
                title,
                url: relativeUrl,
                status,
                repositoryId,
              })
            } catch (error) {
              console.error(`Error procesando relación PR:`, error)
              // Continuar con la siguiente relación
            }
          }
        }
      }

      // Devolver toda la información en un solo objeto
      return {
        fields: workItem.fields || {},
        pullRequests,
      }
    } catch (error) {
      console.error(
        `Error al obtener el work item con relaciones #${workItemId}:`,
        error
      )
      return {
        fields: {},
        pullRequests: [],
      }
    }
  }
}
