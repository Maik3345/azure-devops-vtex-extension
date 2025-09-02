import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
} from 'azure-devops-extension-api'
import {
  WorkItemTrackingRestClient,
  WorkItemTrackingServiceIds,
} from 'azure-devops-extension-api/WorkItemTracking'
import * as SDK from 'azure-devops-extension-sdk'

interface IWorkItemFormService {
  isDirty: () => Promise<boolean>
  refresh: () => Promise<void>
}

export class WorkItemCommentService {
  private workClient?: WorkItemTrackingRestClient
  private clientForm?: IWorkItemFormService

  private async getFormService(): Promise<IWorkItemFormService> {
    if (!this.clientForm) {
      this.clientForm = await SDK.getService<IWorkItemFormService>(
        WorkItemTrackingServiceIds.WorkItemFormService
      )
    }
    return this.clientForm
  }

  private async getWorkClient(): Promise<WorkItemTrackingRestClient> {
    try {
      if (!this.workClient) {
        console.log('Getting work item tracking client from SDK...')
        this.workClient = await getClient(WorkItemTrackingRestClient)
        console.log('Work item tracking client obtained successfully')
      }
      return this.workClient
    } catch (error) {
      console.error('Error getting work item tracking client:', error)
      throw error
    }
  }

  /**
   * Crea un comentario con información de la rama a utilizar
   * @param projectName Nombre del proyecto
   * @param branchName Nombre de la rama generada
   * @returns Texto del comentario formateado en HTML
   */
  private createBranchComment(projectName: string, branchName: string): string {
    return `🌴 Recommended branch: <strong>${branchName}</strong>`
  }
  /**
   * Extrae información de la iteración y genera el nombre de la rama
   * @param iteration Texto de la iteración
   * @param workItemId ID del elemento de trabajo
   * @param workItemType Tipo de elemento de trabajo
   * @returns Nombre de la rama formateado
   */
  private generateBranchName(
    iteration: string | null,
    workItemId: number,
    workItemType: string | null
  ): string {
    // Verificar si es un hotfix
    if (workItemType && workItemType.toLowerCase() === 'hotfix') {
      console.log(
        `Detectado tipo de trabajo: ${workItemType}, generando rama de hotfix`
      )
      return `hotfix/${workItemId}`
    }

    // Si no hay iteración, retornar un formato básico
    if (!iteration) {
      return `feature/workitem-${workItemId}`
    }

    console.log('Generating branch name from iteration:', iteration)

    // Variables para guardar la información extraída
    let sprint: string | null = null
    let quarter: string | null = null
    let year: string | null = null

    // Reemplazar / por \ para normalizar formatos
    const normalizedIteration = iteration.replace(/\//g, '\\')

    // Caso especial para "Marketplace\Sprint N"
    const marketplaceSprintRegex = /^Marketplace\\Sprint\s+(\d+)$/i
    const marketplaceMatch = normalizedIteration.match(marketplaceSprintRegex)

    if (marketplaceMatch) {
      const sprintNumber = marketplaceMatch[1]
      console.log(
        `Caso especial detectado para "Marketplace\\Sprint ${sprintNumber}"`
      )
      console.log(
        `Generando rama en formato simple: feature/sprint-${sprintNumber}/${workItemId}`
      )
      return `feature/sprint-${sprintNumber}/${workItemId}`
    }

    // Si no es un caso especial, continuar con la lógica de patrones
    console.log('No es un caso especial, evaluando patrones...')

    // Definir interfaces para mejorar el tipado
    interface PatternResult {
      quarter: string | null
      year: string | null
      sprint: string
      simple?: boolean
    }

    // Patrones para diferentes formatos - ordenados del más específico al más general
    const patterns = [
      // FORMATOS SIMPLES (evaluar primero para evitar coincidencias incorrectas)

      // Patrón 3: Formato simple exacto "Marketplace\Sprint 1" - sin trimestre ni año
      {
        regex: /^([^\\]*?)\\Sprint\s+(\d+)$/i, // ^ y $ aseguran que coincida con toda la cadena
        extract: (match: RegExpMatchArray): PatternResult => {
          console.log(
            'Coincidencia exacta del formato simple Marketplace\\Sprint N'
          )
          return {
            quarter: null,
            year: null,
            sprint: match[2],
            simple: true, // Indicador de formato simple
          }
        },
      },

      // FORMATOS COMPLETOS

      // Patrón 1: "Tribu Ecommerce\Marketplace\2025\Q3-2025\Sprint 14 - 2025"
      {
        regex:
          /.*\\(?:\d{4})\\Q(\d+)-(\d{4})\\Sprint\s+(\d+)(?:\s+-\s+\d{4})?/i,
        extract: (match: RegExpMatchArray): PatternResult => ({
          quarter: match[1], // Q3
          year: match[2], // 2025
          sprint: match[3], // 14
          simple: false,
        }),
      },

      // Patrón 2: Cualquier ruta que termine con "Q3-2025\Sprint 14"
      {
        regex: /.*Q(\d+)-(\d{4})\\Sprint\s+(\d+)/i,
        extract: (match: RegExpMatchArray): PatternResult => ({
          quarter: match[1],
          year: match[2],
          sprint: match[3],
          simple: false,
        }),
      },

      // PATRONES DE RESPALDO (evaluados al final)

      // Patrón 4: Formato simple general "cualquier cosa\Sprint 1" - sin trimestre ni año
      {
        regex: /.*\\Sprint\s+(\d+)/i,
        extract: (match: RegExpMatchArray): PatternResult => {
          console.log('Coincidencia general del formato simple con Sprint N')
          return {
            quarter: null,
            year: null,
            sprint: match[1],
            simple: true, // Indicador de formato simple
          }
        },
      },

      // Patrón 5: Solo extrae números después de Sprint (ej. "algo Sprint 5 algo" -> 5)
      {
        regex: /Sprint\s+(\d+)/i,
        extract: (match: RegExpMatchArray): PatternResult => {
          console.log(
            'Coincidencia básica: encontrado Sprint N en cualquier parte'
          )
          return {
            quarter: null,
            year: null,
            sprint: match[1],
            simple: true, // Indicador de formato simple
          }
        },
      },
    ]

    // Información detallada para depuración
    console.log(`Iteración normalizada: "${normalizedIteration}"`)

    // Probar cada patrón
    let patternIndex = 0
    for (const pattern of patterns) {
      patternIndex++
      const match = normalizedIteration.match(pattern.regex)
      if (match) {
        console.log(`Patrón #${patternIndex} coincidió: ${pattern.regex}`)
        console.log(`Grupos coincidentes:`, match)

        const result = pattern.extract(match)
        console.log(`Datos extraídos:`, result)

        const { quarter, year, sprint, simple } = result

        // Para formato simple (sin trimestre ni año) o cuando falta alguno de los datos
        if (simple) {
          console.log(`Formato simple detectado, omitiendo trimestre y año`)
          console.log(
            `Generando rama en formato simple: feature/sprint-${sprint}/${workItemId}`
          )
          return `feature/sprint-${sprint}/${workItemId}`
        }

        // Para formato completo, con trimestre y año
        // Verificación adicional: si quarter o year son null/undefined, usar formato simple
        if (!quarter || !year) {
          console.log(
            `Datos incompletos (Q: ${quarter}, Y: ${year}), usando formato simple`
          )
          console.log(
            `Generando rama en formato simple: feature/sprint-${sprint}/${workItemId}`
          )
          return `feature/sprint-${sprint}/${workItemId}`
        }

        // Obtener últimos dos dígitos del año (2025 -> 25)
        const shortYear = year.substring(2)
        console.log(
          `Generando rama en formato completo: feature/sprint-${sprint}Q${quarter}${shortYear}/${workItemId}`
        )
        return `feature/sprint-${sprint}Q${quarter}${shortYear}/${workItemId}`
      } else {
        console.log(`Patrón #${patternIndex} NO coincidió: ${pattern.regex}`)
      }
    }

    // Caso por defecto: si no coincide con ningún patrón conocido
    return `feature/workitem-${workItemId}`
  }

  /**
   * Ejecuta el servicio de comentarios - versión simplificada
   * @param context El contexto de ejecución
   */
  public async execute(context: any): Promise<void> {
    try {
      console.log('WorkItemCommentService.execute - Context:', context)

      // Obtener el cliente de trabajo
      const client = await this.getWorkClient()
      console.log('Work tracking client obtained')

      // Extraer el ID del elemento de trabajo del contexto
      let workItemId = context.workItemId || context.id
      console.log('Work item ID:', workItemId)

      if (!workItemId) {
        console.error(
          'No se pudo obtener el ID del elemento de trabajo del contexto:',
          context
        )

        if (context.workItem) {
          const id = context.workItem.id
          if (id) {
            console.log('ID encontrado en context.workItem:', id)
            workItemId = id
          }
        }

        if (!workItemId) {
          alert(
            'No se pudo obtener el ID del elemento de trabajo. Por favor, intente nuevamente desde un elemento de trabajo válido.'
          )
          return
        }
      }

      // Obtener información del proyecto
      let projectName = ''

      try {
        const webContext = SDK.getWebContext()
        console.log('Web context:', webContext)

        if (webContext && webContext.project) {
          console.log('Proyecto encontrado en webContext:', webContext.project)
          projectName = webContext.project.name || ''
          console.log(
            'Usando información de proyecto del webContext:',
            projectName
          )
        } else {
          console.log('No hay proyecto en webContext, usando projectService')
          const projectService = await SDK.getService<IProjectPageService>(
            CommonServiceIds.ProjectPageService
          )
          const project = await projectService.getProject()
          console.log('Project from service:', project)

          if (project) {
            projectName = project.name
            console.log(
              'Información de proyecto obtenida del servicio:',
              projectName
            )
          }
        }
      } catch (projError) {
        console.error('Error al obtener información del proyecto:', projError)
      }

      if (!projectName) {
        console.warn(
          'No se pudo obtener el nombre del proyecto, usando un valor predeterminado'
        )
        projectName = 'Proyecto predeterminado'
      }

      // Obtener información del work item para obtener iteración y tipo
      let iteration: string | null = null
      let workItemType: string | null = null

      try {
        const workItem = await client.getWorkItem(workItemId, projectName, [
          'System.IterationPath',
          'System.WorkItemType',
        ])
        iteration =
          (workItem.fields?.['System.IterationPath'] as string) || null
        workItemType =
          (workItem.fields?.['System.WorkItemType'] as string) || null

        console.log('Work Item Iteration:', iteration)
        console.log('Work Item Type:', workItemType)
      } catch (error) {
        console.warn(
          'No se pudo obtener información del work item, usando valores predeterminados:',
          error
        )
      }

      // Generar el nombre de la rama
      const branchName = this.generateBranchName(
        iteration,
        workItemId,
        workItemType
      )
      console.log('Rama generada:', branchName)

      // Mostrar prompt para que el usuario copie manualmente la rama
      prompt('Generated branch name. Copy it manually:', branchName)

      // Crear el comentario con la información de la rama
      const defaultComment = this.createBranchComment(projectName, branchName)

      // Añadir el comentario directamente sin solicitar confirmación
      try {
        console.log('Añadiendo comentario al elemento de trabajo:', workItemId)

        const patchDocument = [
          {
            op: 'add',
            path: '/fields/System.History',
            value: defaultComment,
          },
        ]

        console.log(
          `Actualizando elemento de trabajo ${workItemId} en proyecto "${projectName}"`
        )

        await client.updateWorkItem(
          patchDocument,
          workItemId,
          projectName,
          false,
          false,
          false
        )

        console.log('Comentario añadido exitosamente')

        // Refrescar el formulario
        const formService = await this.getFormService()
        if (!(await formService.isDirty())) {
          await formService.refresh()
        }

        console.log(
          `Comentario con información de rama añadido exitosamente al elemento de trabajo #${workItemId}`
        )
      } catch (error: any) {
        console.error('Error al añadir comentario:', error)
        throw error
      }
    } catch (error: any) {
      console.error('Error al añadir comentario:', error)

      const errorDetails = error.response
        ? `Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`
        : error.message || 'Error desconocido'

      console.error('Detalles del error:', errorDetails)
    }
  }
}
