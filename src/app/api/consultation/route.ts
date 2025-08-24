import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { getMBTIType, getAllMBTITypes } from '@/lib/mbti-data'
import { supabase } from '@/lib/supabase'
import { Consultation, Response } from '@/types'
import '@/lib/clean-env'

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
    
    // 如果OpenAI失敗，使用內置備用方案
    try {
      console.log('OpenAI失敗，使用備用規則引擎...')
      const fallbackResponses = generateRuleBasedResponses(
        consultation?.problem_text || '', 
        consultation?.target_mbti, 
        consultation?.user_mbti
      )
      
      console.log('備用方案生成了', fallbackResponses.length, '個回覆')
      
      return NextResponse.json({
        consultation_id: consultationId,
        responses: fallbackResponses,
        consultation_type: consultation?.consultation_type || 'comprehensive',
        note: '使用基於MBTI規則的回覆系統'
      }, { headers })
      
    } catch (fallbackError) {
      console.error('備用方案也失敗:', fallbackError)
    }
    
    return NextResponse.json(
      { 
        error: '服務暫時不可用，請稍後再試',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: '請檢查API密鑰配置或嘗試其他AI服務'
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
    ai_model: 'gpt-3.5-turbo'
  }
}

async function generateComprehensiveResponse(
  problem: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response[]> {
  console.log('開始生成綜合回覆...')
  
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  const responses: Response[] = []

  for (const typeId of selectedTypes) {
    console.log(`正在生成 ${typeId} 的回覆...`)
    const prompt = createMBTIPrompt(problem, typeId, targetMbti, userMbti)

    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        prompt,
        temperature: 0.7,
        maxTokens: 800,
      })
      
      console.log(`${typeId} 生成成功，長度: ${text.length}`)

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

  console.log(`綜合回覆生成完成，總數: ${responses.length}`)
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

function generateRuleBasedResponses(problem: string, targetMbti?: string, userMbti?: string) {
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  
  return selectedTypes.map(typeId => {
    const mbtiType = getMBTIType(typeId)
    if (!mbtiType) return null

    // 基於MBTI特質生成建議
    let advice = `作為${mbtiType.name}(${mbtiType.nickname})，我的建議是：\n\n`
    
    if (problem.includes('告白') || problem.includes('表白')) {
      advice += mbtiType.id.includes('E') 
        ? '大膽表達你的感受！真誠和直接往往最有效。選擇一個輕鬆的環境，自然地分享你的想法。'
        : '先加深你們的情感連接。通過更多深入的對話了解彼此，當時機成熟時再表達心意。'
    } else if (problem.includes('冷淡') || problem.includes('不理') || problem.includes('少主動')) {
      advice += mbtiType.id.includes('F') 
        ? '試著站在對方角度思考，可能有工作壓力或其他困擾。給予理解和空間，但也要表達你的關心。'
        : '直接但溫和地溝通。問問是否有什麼困擾，或者你是否做了什麼讓對方不舒服的事。'
    } else {
      advice += `根據我的${mbtiType.love_style}，建議你${mbtiType.relationship_tips[0]}。`
    }
    
    advice += `\n\n記住：${mbtiType.relationship_tips.slice(0, 2).join('，')}。`
    
    if (targetMbti && targetMbti !== 'unknown') {
      const targetType = getMBTIType(targetMbti)
      if (targetType) {
        advice += `\n\n針對${targetType.name}類型的對象，特別注意：${targetType.relationship_tips[0]}。`
      }
    }

    return {
      consultation_id: crypto.randomUUID(),
      mbti_type: typeId,
      response_text: advice,
      response_type: 'comprehensive',
      ai_model: 'rule-based-engine'
    }
  }).filter(Boolean) as Response[]
}