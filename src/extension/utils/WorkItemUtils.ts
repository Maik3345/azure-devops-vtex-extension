import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemContext } from "../interfaces/WorkItemInterfaces";

/**
 * Clase con utilidades para trabajar con elementos de trabajo
 */
export class WorkItemUtils {
    /**
     * Extrae el ID del elemento de trabajo del contexto
     */
    public static getWorkItemId(context: IWorkItemContext): number | undefined {
        console.log("Getting work item ID from context:", context);
        
        let workItemId = context.workItemId || context.id;
        
        if (!workItemId && context.workItem) {
            console.log("Trying to get ID from context.workItem:", context.workItem);
            workItemId = context.workItem.id;
        }
        
        return workItemId;
    }

    /**
     * Obtiene información del proyecto actual
     */
    public static async getProjectInfo(): Promise<{ name: string; id: string }> {
        let projectName = "";
        let projectId = "";
        
        try {
            // Primero intentamos con getWebContext que es más fiable
            const webContext = SDK.getWebContext();
            
            if (webContext && webContext.project) {
                projectName = webContext.project.name || "";
                projectId = webContext.project.id || "";
            } else {
                // Fallback al servicio de proyecto
                const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
                const project = await projectService.getProject();
                
                if (project) {
                    projectName = project.name;
                    projectId = project.id;
                }
            }
        } catch (error) {
            console.error("Error getting project information:", error);
        }
        
        // Verificación adicional
        if (!projectName) {
            console.warn("Could not get project name, using a default value");
            projectName = "Proyecto predeterminado";
        }
        
        return { name: projectName, id: projectId };
    }

    /**
     * Crea un comentario predeterminado
     */
    public static createDefaultComment(projectName: string): string {
        return [
            `📈 Project: ${projectName}`,
            "",
            "🌴 Branch: hotfix/244977",
            "📫 Pull request: link",
            "💻 Workspace: link"
        ].join("\n");
    }

    /**
     * Obtiene texto para mostrar en un prompt
     */
    public static getPromptText(projectName: string): string {
        return "Introduzca su comentario:\n\n" +
            "Formato sugerido:\n" +
            "📈 Project: " + projectName + "\n" +
            "🌴 Branch: hotfix/244977\n" +
            "📫 Pull request: link\n" +
            "💻 Workspace: link";
    }
}
