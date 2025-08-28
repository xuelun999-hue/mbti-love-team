// 清理環境變量中的空格和換行符
export function cleanApiKey(key: string | undefined): string {
  if (!key) return ''
  return key.replace(/\s/g, '')
}

// 設置清理後的環境變量
const originalKey = process.env.AI_GATEWAY_API_KEY
if (originalKey) {
  const cleanKey = cleanApiKey(originalKey)
  console.log('清理API Key:', { 
    原始長度: originalKey.length, 
    清理後長度: cleanKey.length,
    前10字符: cleanKey.substring(0, 10)
  })
  process.env.AI_GATEWAY_API_KEY = cleanKey
}