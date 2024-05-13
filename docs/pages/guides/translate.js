const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

// 获取当前目录
const currentDir = process.cwd()

// 遍历当前目录下的所有文件
fs.readdir(currentDir, (err, files) => {
  if (err) {
    console.error(err)
    return
  }

  files.forEach((file) => {
    if (file.endsWith('.en-US.mdx')) {
      // 构建目标文件名
      const newFile = file.replace('.en-US.mdx', '.es-ES.mdx')

      //   const lines = fs.readFileSync(file, 'utf-8').split('\n')
      //   lines.splice(4, 0, '<WorkingInProgress />')
      //   const updatedLines = lines.join('\n')

      // 拷贝文件并重命名
      copyFile(file, newFile)
        .then(() => console.log(`Copied ${file} to ${newFile}`))
        .catch((err) => console.error(err))
    }
  })
})
