import { runCommand } from '../runCommand'

export const vtexPublish = async (command: string) => {
  return await runCommand(
    command,
    '.',
    `running ${command}`,
    false,
    0,
    false,
    true
  )
}

export const vtexDeploy = async (command: string) => {
  return await runCommand(
    command,
    '.',
    `running ${command}`,
    false,
    0,
    false,
    true
  )
}
