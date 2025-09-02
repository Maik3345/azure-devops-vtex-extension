import * as SDK from 'azure-devops-extension-sdk'
import { IExtensionContext } from 'azure-devops-extension-sdk'
import { WorkItemCommentService } from './WorkItemCommentService'

export interface IWorkItemContext {
  workItemId?: number
  id?: number
  workItem?: {
    id: number
  }
}

/**
 * Clase principal que maneja la inicialización de la extensión
 */
class Program {
  static context: IExtensionContext

  /**
   * Inicializa y ejecuta la extensión
   */
  public static async run(): Promise<void> {
    try {
      // Inicializar el SDK
      SDK.init({
        applyTheme: true,
        loaded: false,
      })

      // Esperar a que el SDK esté listo
      await SDK.ready()
      console.log('SDK is ready, registering contribution...')

      // Guardar el contexto de la extensión
      Program.context = SDK.getExtensionContext()
      console.log('Extension context:', Program.context)

      // Registrar la acción para el menú contextual
      SDK.register('work-item-add-branch-info-action', () => {
        const service = new WorkItemCommentService()
        return {
          // Este método se ejecuta cuando el usuario hace clic en la acción del menú
          execute: async (context: IWorkItemContext): Promise<void> => {
            console.log('Execute method called with context:', context)
            try {
              await service.execute(context)
            } catch (error) {
              console.error('Error executing action:', error)
            }
          },
        }
      })

      // Notificar que la carga se ha completado correctamente
      await SDK.notifyLoadSucceeded()
      console.log('SDK load succeeded')
    } catch (error) {
      console.error('Error initializing extension:', error)
    }
  }
}

// Iniciar la extensión
Program.run()
