import { NextRequest, NextResponse } from 'next/server'
import { getMBTIType } from '@/lib/mbti-data'
import { supabase } from '@/lib/supabase'
import { Consultation, Response } from '@/types'

export async function POST(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  let consultation: Consultation | null = null

  try {
    console.log('使用DeepSeek API處理諮詢請求...')
    
    consultation = await request.json()
    console.log('收到的諮詢數據:', consultation)
    
    const { problem_text, target_mbti, user_mbti, consultation_type } = consultation

    if (!problem_text) {
      return NextResponse.json({ error: '請提供問題描述' }, { status: 400, headers })
    }

    const consultationId = crypto.randomUUID()
    let responses: Response[] = []

    if (consultation_type === 'specific') {
      const response = await generateDeepSeekResponse(
        problem_text, 
        target_mbti || user_mbti || 'ENFP',
        target_mbti,
        user_mbti,
        consultationId
      )
      responses = [response]
    } else {
      responses = await generateComprehensiveDeepSeekResponse(
        problem_text, 
        target_mbti, 
        user_mbti, 
        consultationId
      )
    }

    // 嘗試保存到Supabase（可選）
    try {
      await supabase.from('consultations').insert({
        id: consultationId,
        problem_text,
        target_mbti,
        user_mbti,
        consultation_type,
        status: 'completed'
      })

      for (const response of responses) {
        await supabase.from('responses').insert({
          consultation_id: consultationId,
          mbti_type: response.mbti_type,
          response_text: response.response_text,
          response_type: response.response_type,
          ai_model: response.ai_model
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    console.log('DeepSeek處理完成，responses數量:', responses.length)
    
    const result = {
      consultation_id: consultationId,
      responses,
      consultation_type
    }
    
    return NextResponse.json(result, { headers })

  } catch (error) {
    console.error('DeepSeek API Error:', error)
    
    // 如果DeepSeek失敗，使用備用方案
    if (consultation) {
      try {
        console.log('DeepSeek失敗，使用備用規則引擎...')
        const fallbackResponses = generateRuleBasedResponses(
          consultation.problem_text, 
          consultation.target_mbti, 
          consultation.user_mbti
        )
        
        return NextResponse.json({
          consultation_id: crypto.randomUUID(),
          responses: fallbackResponses,
          consultation_type: consultation.consultation_type || 'comprehensive',
          note: '使用基於MBTI規則的回覆系統'
        }, { headers })
      } catch (fallbackError) {
        console.error('備用方案也失敗:', fallbackError)
      }
    }
    
    return NextResponse.json({
      error: 'DeepSeek服務暫時不可用，請稍後再試',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers })
  }
}

async function generateDeepSeekResponse(
  problem: string,
  mbtiType: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response> {
  const mbti = getMBTIType(mbtiType)
  if (!mbti) throw new Error(`Unknown MBTI type: ${mbtiType}`)

  const prompt = createMBTIPrompt(problem, mbti, targetMbti, userMbti)

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || '無法生成回覆'

  return {
    consultation_id: consultationId || '',
    mbti_type: mbtiType,
    response_text: text,
    response_type: 'specific',
    ai_model: 'deepseek-chat'
  }
}

async function generateComprehensiveDeepSeekResponse(
  problem: string,
  targetMbti?: string,
  userMbti?: string,
  consultationId?: string
): Promise<Response[]> {
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  const responses: Response[] = []

  for (const typeId of selectedTypes) {
    try {
      const response = await generateDeepSeekResponse(
        problem, typeId, targetMbti, userMbti, consultationId
      )
      response.response_type = 'comprehensive'
      responses.push(response)
    } catch (error) {
      console.error(`DeepSeek error for ${typeId}:`, error)
      // 如果DeepSeek失敗，使用規則引擎
      const fallbackResponse = generateRuleBasedResponse(problem, typeId, targetMbti, userMbti, consultationId)
      if (fallbackResponse) responses.push(fallbackResponse)
    }
  }

  return responses
}

function createMBTIPrompt(problem: string, mbti: any, targetMbti?: string, userMbti?: string): string {
  let prompt = `你是一位${mbti.name}(${mbti.id})性格的戀愛諮詢師。

性格特質：
- 描述：${mbti.description}
- 優點：${mbti.strengths.join('、')}
- 戀愛風格：${mbti.love_style}
- 關係建議：${mbti.relationship_tips.join('、')}

用戶的情感問題：${problem}`

  if (userMbti && userMbti !== 'unknown') {
    const userType = getMBTIType(userMbti)
    if (userType) prompt += `\n用戶MBTI：${userType.name}(${userType.id})`
  }

  if (targetMbti && targetMbti !== 'unknown') {
    const targetType = getMBTIType(targetMbti)
    if (targetType) prompt += `\n對象MBTI：${targetType.name}(${targetType.id})`
  }

  prompt += `\n\n請以${mbti.nickname}的身份，根據你的性格特質，給出溫暖實用的戀愛建議。回覆200-300字，使用繁體中文。`

  return prompt
}

function generateRuleBasedResponse(problem: string, typeId: string, targetMbti?: string, userMbti?: string, consultationId?: string) {
  const mbtiType = getMBTIType(typeId)
  if (!mbtiType) return null

  let advice = `作為${mbtiType.name}(${mbtiType.nickname})，我的建議是：\n\n`
  
  if (problem.includes('告白') || problem.includes('表白')) {
    advice += mbtiType.id.includes('E') 
      ? '大膽表達你的感受！真誠和直接往往最有效。'
      : '先加深你們的情感連接，當時機成熟時再表達心意。'
  } else if (problem.includes('冷淡') || problem.includes('不理') || problem.includes('少主動')) {
    advice += mbtiType.id.includes('F') 
      ? '試著理解對方的感受，給予空間但保持關心。'
      : '直接但溫和地溝通，了解是否有什麼困擾。'
  } else {
    advice += `根據我的${mbtiType.love_style}，建議你${mbtiType.relationship_tips[0]}。`
  }
  
  advice += `\n\n記住：${mbtiType.relationship_tips.slice(0, 2).join('，')}。`

  return {
    consultation_id: consultationId || '',
    mbti_type: typeId,
    response_text: advice,
    response_type: 'comprehensive',
    ai_model: 'rule-based-fallback'
  }
}

function generateRuleBasedResponses(problem: string, targetMbti?: string, userMbti?: string) {
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  
  return selectedTypes.map(typeId => 
    generateRuleBasedResponse(problem, typeId, targetMbti, userMbti)
  ).filter(Boolean) as Response[]
}