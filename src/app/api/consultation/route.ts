import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { getMBTIType, getAllMBTITypes } from '@/lib/mbti-data'
import { supabase } from '@/lib/supabase'
import { Consultation, Response } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const consultation: Consultation = await request.json()
    
    const { problem_text, target_mbti, user_mbti, consultation_type } = consultation

    if (!problem_text) {
      return NextResponse.json({ error: '請提供問題描述' }, { status: 400 })
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

    return NextResponse.json({
      consultation_id: consultationId,
      responses,
      consultation_type
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '內部服務器錯誤' },
      { status: 500 }
    )
  }
}

async function generateSpecificResponse(
  problem: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response> {
  const mbtiType = targetMbti ? getMBTIType(targetMbti) : userMbti ? getMBTIType(userMbti) : null
  
  if (!mbtiType) {
    throw new Error('無法確定要諮詢的MBTI類型')
  }

  const prompt = createMBTIPrompt(problem, mbtiType.id, targetMbti, userMbti)

  const { text } = await generateText({
    model: openai('gpt-4o'),
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
        model: openai('gpt-4o'),
        prompt,
        temperature: 0.7,
        maxTokens: 800,
      })

      responses.push({
        consultation_id: consultationId || '',
        mbti_type: typeId,
        response_text: text,
        response_type: 'comprehensive',
        ai_model: 'gpt-4o'
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

  const targetType = targetMbti ? getMBTIType(targetMbti) : null
  const userType = userMbti ? getMBTIType(userMbti) : null

  return `你是一位${mbtiType.name}(${mbtiType.id})性格的戀愛諮詢師，具有以下特質：
- 性格描述：${mbtiType.description}
- 優點：${mbtiType.strengths.join('、')}
- 戀愛風格：${mbtiType.love_style}
- 關係建議：${mbtiType.relationship_tips.join('、')}

用戶的情感問題：
${problem}

${userType ? `用戶的MBTI類型：${userType.name}(${userType.id})` : ''}
${targetType ? `對象的MBTI類型：${targetType.name}(${targetType.id})` : ''}

請以${mbtiType.nickname}的身份，根據你的性格特質和價值觀，給出溫暖、實用且具體的戀愛建議。回覆應該：
1. 體現你的性格特點和思維方式
2. 提供具體可行的建議
3. 語氣溫暖友善，充滿同理心
4. 控制在200-300字內
5. 使用繁體中文回覆`
}