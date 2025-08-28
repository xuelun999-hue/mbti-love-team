import { NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import '@/lib/clean-env'

export async function GET() {
  try {
    console.log('測試Anthropic連接...')
    
    const { text } = await generateText({
      model: anthropic('claude-3-haiku-20240307'),
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