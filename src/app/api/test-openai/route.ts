import { NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import '@/lib/clean-env'

const openaiClient = openai({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
})

export async function GET() {
  try {
    console.log('測試Anthropic連接...')
    
    const { text } = await generateText({
      model: openaiClient('openai/gpt-3.5-turbo'),
      prompt: '請簡短回覆：你好',
    })

    console.log('Anthropic回應:', text)

    return NextResponse.json({
      status: 'success',
      message: 'Anthropic連接正常',
      response: text
    })

  } catch (error) {
    console.error('Anthropic錯誤:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知錯誤',
      details: error
    }, { status: 500 })
  }
}