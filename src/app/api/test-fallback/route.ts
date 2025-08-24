import { NextResponse } from 'next/server'
import { getMBTIType } from '@/lib/mbti-data'

export async function POST(request: Request) {
  try {
    const { problem_text, target_mbti, user_mbti } = await request.json()
    
    // 基於MBTI數據的規則引擎回覆 (無需API)
    const responses = generateRuleBasedResponses(problem_text, target_mbti, user_mbti)
    
    return NextResponse.json({
      consultation_id: crypto.randomUUID(),
      responses,
      consultation_type: 'comprehensive',
      note: '使用基於規則的回覆系統 (無需AI API)'
    })

  } catch (error) {
    return NextResponse.json({
      error: '處理請求時發生錯誤',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 })
  }
}

function generateRuleBasedResponses(problem: string, targetMbti?: string, userMbti?: string) {
  const selectedTypes = ['INTJ', 'ENFP', 'ISFJ', 'ESTP']
  
  return selectedTypes.map(typeId => {
    const mbtiType = getMBTIType(typeId)
    if (!mbtiType) return null

    // 基於MBTI特質生成建議
    let advice = `作為${mbtiType.name}，我建議你：\n\n`
    
    if (problem.includes('告白') || problem.includes('表白')) {
      advice += mbtiType.id.includes('E') 
        ? '直接表達你的感受，真誠是最重要的。'
        : '先建立更深的情感連接，然後選擇合適的時機。'
    } else if (problem.includes('冷淡') || problem.includes('不理')) {
      advice += mbtiType.id.includes('F') 
        ? '試著理解對方的感受，可能有其他原因。給予空間但保持關心。'
        : '分析情況，直接溝通了解問題所在。'
    } else {
      advice += '根據情況分析，' + mbtiType.relationship_tips[0]
    }
    
    advice += '\n\n記住：' + mbtiType.relationship_tips.slice(0, 2).join('，') + '。'

    return {
      consultation_id: crypto.randomUUID(),
      mbti_type: typeId,
      response_text: advice,
      response_type: 'comprehensive',
      ai_model: 'rule-based'
    }
  }).filter(Boolean)
}