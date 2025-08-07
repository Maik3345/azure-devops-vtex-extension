/**
 * Clase para manejar las plantillas de diálogos
 */
export class DialogTemplates {
    /**
     * Obtiene el contenido HTML para el diálogo de comentarios
     * @param defaultComment Comentario predeterminado
     */
    public static getCommentDialogContent(defaultComment: string): string {
        return `
        <style>
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            textarea {
                width: 100%;
                min-height: 150px;
                padding: 8px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                resize: vertical;
                font-family: 'Segoe UI', sans-serif;
            }
            .help-text {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
                font-style: italic;
            }
            .buttons {
                display: flex;
                justify-content: flex-end;
                margin-top: 10px;
            }
            button {
                padding: 6px 12px;
                margin-left: 8px;
            }
            #resetButton {
                margin-right: auto;
            }
        </style>
        <div class="form-group">
            <label for="commentText">Comentario:</label>
            <textarea id="commentText" placeholder="Escribe tu comentario aquí...">${defaultComment}</textarea>
            <div class="help-text">Edita la información según sea necesario antes de enviar.</div>
            <div class="buttons">
                <button id="resetButton" onclick="document.getElementById('commentText').value = '${defaultComment.replace(/'/g, "\\'")}'; document.getElementById('commentText').focus(); document.getElementById('commentText').select();">Restaurar</button>
            </div>
        </div>
        <script>
            // Seleccionar todo el texto al cargar el diálogo
            window.addEventListener('DOMContentLoaded', function() {
                const textarea = document.getElementById('commentText');
                textarea.focus();
                textarea.select();
            });
        </script>
        `;
    }
}
