import { createHash } from 'crypto'
import fsExtra from 'fs-extra'
import fg from 'fast-glob'
import dayjs from 'dayjs'
import { Plugin } from 'vite'

const { readFileSync, writeFileSync, copySync } = fsExtra

export function metaPlugin(metaFilePath = 'public/meta.json', distFilePath = 'dist/meta.json') {
  const apply: Plugin['apply'] = (config, { command }) => {
    return command === 'build' // 仅打包环境调用
  }
  return {
    name: 'generate-meta-file',
    apply,
    async closeBundle() {
      const projectFiles = (
        await fg(['src/**/*', 'public/**/*', 'static/**/*'], {
          dot: true,
          ignore: [metaFilePath],
          absolute: true, // 使用绝对路径确保稳定性
        })
      ).sort()
      const hash = createHash('sha256', { outputLength: 32 })
      for (const file of projectFiles) {
        const content = readFileSync(file, 'utf-8')
          .replace(/\r\n/g, '\n') // 统一换行符
          .trim() // 去除首尾空白
        hash.update(file + content) // 包含文件名确保唯一性
      }
      let metaFileData = {
        currentHash: '',
        currentBuildTime: '',
        lastHash: '',
        lastBuildTime: '',
      }
      try {
        const res = readFileSync(metaFilePath, 'utf-8')
        metaFileData = JSON.parse(res)
      } catch (err) {
        if (err instanceof Error) {
          if ('code' in err && err.code === 'ENOENT') {
            console.log('Meta file not found, creating a new one.')
          } else {
            console.error('Failed to JSON.parse meta file')
          }
        } else {
          console.error('Unknown error occurred:', err)
        }
      }

      const metaData = {
        currentHash: hash.digest('hex'),
        currentBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        lastHash: metaFileData.currentHash,
        lastBuildTime: metaFileData.currentBuildTime,
      }
      writeFileSync(metaFilePath, JSON.stringify(metaData, null, 2))
      console.log('Meta file generated:', JSON.stringify(metaData))
      copySync(metaFilePath, distFilePath)
    },
  }
}
