export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** index
  return `${size.toFixed(2)} ${unitArr[index]}`
}

export function goodTimeText(): string {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour <= 18 ? '下午好' : '晚上好'
}
