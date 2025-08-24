import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@/lib/openai'

export async function GET() {
  try {
    console.log('測試OpenAI連接...')
    
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: '請簡短回覆：你好',
      maxTokens: 50,
    })

    console.log('OpenAI回應:', text)

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI連接正常',
      response: text
    })

  } catch (error) {
    console.error('OpenAI錯誤:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知錯誤',
      details: error
    }, { status: 500 })
  }
}