const fs = require('fs')
const path = require('path')

const findTaskJsonFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      findTaskJsonFiles(filePath, fileList)
    } else if (path.basename(filePath) === 'task.json') {
      fileList.push(filePath)
    }
  })
  return fileList
}

const updateVersion = (type) => {
  const tasksDir = path.join(__dirname, 'tasks')
  const taskJsonFiles = findTaskJsonFiles(tasksDir)

  taskJsonFiles.forEach((filePath) => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    if (data.version) {
      switch (type) {
        case 'major':
          data.version.Major += 1
          data.version.Minor = 0
          data.version.Patch = 0
          break
        case 'minor':
          data.version.Minor += 1
          data.version.Patch = 0
          break
        case 'patch':
          data.version.Patch += 1
          break
        default:
          console.error(
            'Invalid version type. Use "major", "minor", or "patch".'
          )
          return
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
      console.log(
        `Successfully updated ${filePath} to version ${data.version.Major}.${data.version.Minor}.${data.version.Patch}`
      )
    }
  })
}

const type = process.argv[2]
if (!type) {
  console.error('Please provide a version type: "major", "minor", or "patch".')
  process.exit(1)
}

updateVersion(type)
