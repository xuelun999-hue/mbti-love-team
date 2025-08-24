import { openai as createOpenAI } from '@ai-sdk/openai'

// 清理API Key中的換行符和空格
const rawApiKey = process.env.OPENAI_API_KEY || ''
const apiKey = rawApiKey.replace(/\s/g, '')

console.log('原始API Key長度:', rawApiKey.length)
console.log('清理後API Key長度:', apiKey.length)
console.log('API Key前10個字符:', apiKey.substring(0, 10))

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set')
}

export const openai = createOpenAI({
  apiKey: apiKey
})