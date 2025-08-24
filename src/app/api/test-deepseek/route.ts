import { NextResponse } from 'next/server'
import { generateText } from 'ai'

export async function GET() {
  try {
    console.log('測試DeepSeek連接...')
    
    // 使用DeepSeek API (通過OpenAI兼容格式)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || 'test'}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: '請簡短回覆：你好' }
        ],
        max_tokens: 50
      })
    })

    const data = await response.json()
    console.log('DeepSeek回應:', data)

    if (response.ok) {
      return NextResponse.json({
        status: 'success',
        message: 'DeepSeek連接正常',
        response: data.choices?.[0]?.message?.content || '無回應'
      })
    } else {
      throw new Error(`DeepSeek API錯誤: ${data.error?.message || '未知錯誤'}`)
    }

  } catch (error) {
    console.error('DeepSeek錯誤:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知錯誤',
      note: 'DeepSeek需要API密鑰，可以免費註冊獲取'
    }, { status: 500 })
  }
}