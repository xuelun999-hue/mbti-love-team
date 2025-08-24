import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { getMBTIType, getAllMBTITypes } from '@/lib/mbti-data'
import { supabase } from '@/lib/supabase'
import { Consultation, Response } from '@/types'

export async function POST(request: NextRequest) {
  // 添加 CORS 頭
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    console.log('API被調用，處理諮詢請求...')
    
    const consultation: Consultation = await request.json()
    console.log('收到的諮詢數據:', consultation)
    
    const { problem_text, target_mbti, user_mbti, consultation_type } = consultation

    if (!problem_text) {
      return NextResponse.json({ error: '請提供問題描述' }, { status: 400, headers })
    }

    const consultationId = crypto.randomUUID()
    let responses: Response[] = []

    if (consultation_type === 'specific') {
      const response = await generateSpecificResponse(
        problem_text, 
        target_mbti, 
        user_mbti, 
        consultationId
      )
      responses = [response]
    } else {
      responses = await generateComprehensiveResponse(
        problem_text, 
        target_mbti, 
        user_mbti, 
        consultationId
      )
    }

    try {
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          id: consultationId,
          problem_text,
          target_mbti,
          user_mbti,
          consultation_type,
          status: 'completed'
        })
        .select()
        .single()

      if (consultationError) {
        console.error('Supabase consultation error:', consultationError)
      }

      for (const response of responses) {
        const { error: responseError } = await supabase
          .from('responses')
          .insert({
            consultation_id: consultationId,
            mbti_type: response.mbti_type,
            response_text: response.response_text,
            response_type: response.response_type,
            ai_model: response.ai_model
          })

        if (responseError) {
          console.error('Supabase response error:', responseError)
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    console.log('準備返回響應，responses數量:', responses.length)
    
    const result = {
      consultation_id: consultationId,
      responses,
      consultation_type
    }
    
    console.log('返回結果:', result)
    
    return NextResponse.json(result, { headers })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: '內部服務器錯誤',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    )
  }
}

async function generateSpecificResponse(
  problem: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response> {
  // 處理未知MBTI的情況
  const mbtiType = targetMbti && targetMbti !== 'unknown' ? getMBTIType(targetMbti) 
                 : userMbti && userMbti !== 'unknown' ? getMBTIType(userMbti) 
                 : null
  
  if (!mbtiType) {
    // 如果沒有具體MBTI類型，使用綜合建議模式
    const responses = await generateComprehensiveResponse(problem, targetMbti, userMbti, consultationId)
    return responses[0] || {
      consultation_id: consultationId || '',
      mbti_type: 'comprehensive',
      response_text: '請提供更多信息以獲得更精準的建議。',
      response_type: 'specific',
      ai_model: 'gpt-3.5-turbo'
    }
  }

  const prompt = createMBTIPrompt(problem, mbtiType.id, targetMbti, userMbti)

  const { text } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt,
    temperature: 0.7,
    maxTokens: 1000,
  })

  return {
    consultation_id: consultationId || '',
    mbti_type: mbtiType.id,
    response_text: text,
    response_type: 'specific',
    ai_model: 'gpt-4o'
  }
}

async function generateComprehensiveResponse(
  problem: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response[]> {
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  const responses: Response[] = []

  for (const typeId of selectedTypes) {
    const prompt = createMBTIPrompt(problem, typeId, targetMbti, userMbti)

    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt,
        temperature: 0.7,
        maxTokens: 800,
      })

      responses.push({
        consultation_id: consultationId || '',
        mbti_type: typeId,
        response_text: text,
        response_type: 'comprehensive',
        ai_model: 'gpt-3.5-turbo'
      })
    } catch (error) {
      console.error(`Error generating response for ${typeId}:`, error)
    }
  }

  return responses
}

function createMBTIPrompt(
  problem: string,
  respondingMbti: string,
  targetMbti?: string,
  userMbti?: string
): string {
  const mbtiType = getMBTIType(respondingMbti)
  if (!mbtiType) throw new Error(`Unknown MBTI type: ${respondingMbti}`)

  const targetType = targetMbti && targetMbti !== 'unknown' ? getMBTIType(targetMbti) : null
  const userType = userMbti && userMbti !== 'unknown' ? getMBTIType(userMbti) : null

  return `你是一位${mbtiType.name}(${mbtiType.id})性格的戀愛諮詢師，具有以下特質：
- 性格描述：${mbtiType.description}
- 優點：${mbtiType.strengths.join('、')}
- 戀愛風格：${mbtiType.love_style}
- 關係建議：${mbtiType.relationship_tips.join('、')}

用戶的情感問題：
${problem}

${userType ? `用戶的MBTI類型：${userType.name}(${userType.id})` : userMbti === 'unknown' ? '用戶的MBTI類型：未知' : ''}
${targetType ? `對象的MBTI類型：${targetType.name}(${targetType.id})` : targetMbti === 'unknown' ? '對象的MBTI類型：未知' : ''}

請以${mbtiType.nickname}的身份，根據你的性格特質和價值觀，給出溫暖、實用且具體的戀愛建議。回覆應該：
1. 體現你的性格特點和思維方式
2. 提供具體可行的建議
3. 語氣溫暖友善，充滿同理心
4. 控制在200-300字內
5. 使用繁體中文回覆`
}