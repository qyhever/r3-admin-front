import dayjs from 'dayjs'

export const formatTime = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatDate = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
