import { accessSync } from 'fs'
import { join, parse, resolve } from 'path'

export const MANIFEST_FILE_NAME = 'manifest.json'
export const PACKAGE_FILE_NAME = 'package.json'

const fileExists = (filePath: string) => {
  try {
    accessSync(filePath)
    return true
  } catch (err) {
    return false
  }
}

export const getAppRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  const cwd = process.cwd()
  const { root: rootDirName } = parse(cwd)

  const find = (dir: string): any => {
    const manifestPath = join(dir, MANIFEST_FILE_NAME)
    const packagePath = join(dir, PACKAGE_FILE_NAME)

    if (fileExists(manifestPath) || fileExists(packagePath)) {
      return dir
    } else {
      if (dir === rootDirName) {
        throw new Error(
          "Manifest or package file doesn't exist or is not readable. Please make sure you're in the app's directory or add the required files in the root folder of the app."
        )
      }
      return find(resolve(dir, '..'))
    }
  }

  return find(cwd)
}
