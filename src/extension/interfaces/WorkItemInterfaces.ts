
/**
 * Interfaz para el servicio del formulario de elemento de trabajo
 */
export interface IWorkItemFormService {
    isDirty: () => Promise<boolean>;
    refresh: () => Promise<void>;
}

/**
 * Interfaz para el contexto de trabajo
 */
export interface IWorkItemContext {
    workItemId?: number;
    id?: number;
    workItem?: {
        id: number;
    };
}

/**
 * Interfaz para las opciones del diálogo de comentarios
 */
export interface ICommentDialogOptions {
    title: string;
    content: string;
    buttons: {
        id: string;
        text: string;
        primary?: boolean;
    }[];
    width: number;
    height: number;
    getDialogResult: () => string;
}

/**
 * Interfaz para el servicio de diálogo
 */
export interface IDialogService {
    openDialog: (options: ICommentDialogOptions) => Promise<string | null>;
    openMessageDialog: (message: string) => Promise<void>;
}
