/**
 * The code function in TypeScript returns a string wrapped in triple backticks.
 * @param {string} text - The `text` parameter is a string that represents the code or text that you
 * want to format as a code block.
 * @returns The code function returns the input text wrapped in triple backticks.
 */
export function code(text: string, type: string = 'bash') {
  return `
  \`\`\`${type}
  ${text}
  \`\`\`
  `
}

export const oneLineCode = (text: string) => {
  return `\`${text}\``
}
