import * as SDK from "azure-devops-extension-sdk";

/**
 * Clase para manejar diálogos
 * Enfoque actualizado: Minimizar el uso de diálogos y solo usarlos para informar errores
 */
export class DialogService {
    /**
     * Obtiene el servicio de diálogo de Azure DevOps
     */
    private async getDialogService(): Promise<any> {
        try {
            return await SDK.getService<any>("ms.vss-web.dialog-service");
        } catch (error) {
            console.error("Error obteniendo el servicio de diálogo:", error);
            throw error;
        }
    }

    /**
     * Muestra un mensaje en un diálogo
     * Para uso en notificaciones informativas que no interrumpan el flujo de trabajo
     */
    public async showMessageDialog(message: string): Promise<void> {
        try {
            const dialogService = await this.getDialogService();
            await dialogService.openMessageDialog(message);
        } catch (error) {
            console.error("Error al mostrar el diálogo:", error);
            // Fallback a console.log en vez de alert para no interrumpir
            console.log("Mensaje:", message);
        }
    }

    /**
     * Muestra un mensaje de error en un diálogo
     * Este método sí se mantiene para notificar errores
     */
    public async showErrorDialog(error: Error | string, errorDetails?: string): Promise<void> {
        try {
            const message = typeof error === 'string' ? error : error.message || "Error desconocido";
            const details = errorDetails ? `\n\nDetalles técnicos para soporte: ${errorDetails}` : '';
            
            const dialogService = await this.getDialogService();
            await dialogService.openMessageDialog(`Error: ${message}${details}`);
        } catch (dialogError) {
            console.error("No se pudo mostrar el diálogo de error:", dialogError);
            
            // Fallback a console.error
            console.error(`Error: ${typeof error === 'string' ? error : error.message || "Error desconocido"}${errorDetails ? `\nDetalles: ${errorDetails}` : ''}`);
        }
    }

    /**
     * Muestra una notificación de éxito
     * Método para informar al usuario sobre operaciones exitosas sin interrumpir el flujo
     */
    public async showSuccess(message: string): Promise<void> {
        // Solo registramos en consola por defecto, sin diálogos
        console.log("Operación exitosa:", message);
    }

    /**
     * Ejecuta una acción directamente sin confirmación
     * @param action Función a ejecutar
     * @param errorHandler Manejador de errores opcional
     */
    public async executeAction<T>(
        action: () => Promise<T>,
        successMessage?: string,
        errorHandler?: (error: any) => Promise<void>
    ): Promise<T | null> {
        try {
            // Ejecutar la acción directamente sin confirmación
            const result = await action();
            
            // Si hay un mensaje de éxito, mostrarlo sin interrumpir
            if (successMessage) {
                await this.showSuccess(successMessage);
            }
            
            return result;
        } catch (error) {
            // Manejar el error con el manejador personalizado o mostrar diálogo de error
            if (errorHandler) {
                await errorHandler(error);
            } else {
                // Convertir el error a un tipo compatible con showErrorDialog
                const errorMessage = error instanceof Error ? error : String(error);
                await this.showErrorDialog(errorMessage);
            }
            return null;
        }
    }

    /**
     * Obtiene un valor del usuario sin diálogo (para compatibilidad con código existente)
     * En la nueva implementación, estos valores deberían venir de formularios o configuración
     */
    public getInputValue(defaultValue: string = ""): string {
        return defaultValue;
    }
}
