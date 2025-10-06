import childProcess from 'child_process'
import dayjs from 'dayjs'
const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

try {
  const [, , commitTitle] = process.argv
  childProcess.execSync(
    `git pull && git add . && git commit -m "${commitTitle || now}" && git push`,
    {
      stdio: 'inherit',
    },
  )
} catch (error) {
  console.log('error: ', error)
}
