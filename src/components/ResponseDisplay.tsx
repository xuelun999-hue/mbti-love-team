'use client'

import { Response } from '@/types'
import { getMBTIType } from '@/lib/mbti-data'

interface ResponseDisplayProps {
  responses: Response[]
  consultationType: 'specific' | 'comprehensive'
}

export default function ResponseDisplay({ responses, consultationType }: ResponseDisplayProps) {
  console.log('ResponseDisplay收到的props:', { responses, consultationType })
  
  if (!responses || responses.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-yellow-800">正在處理中...</h3>
          <p className="text-yellow-700 mt-2">
            未收到回覆數據。responses: {JSON.stringify(responses)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {consultationType === 'specific' ? '專屬建議' : 'MBTI軍團的綜合建議'}
      </h3>
      
      <div className={`grid gap-6 ${responses.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {responses.map((response, index) => {
          const mbtiType = response.mbti_type ? getMBTIType(response.mbti_type) : null
          
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4"
              style={{ borderLeftColor: getMBTIColor(response.mbti_type || '') }}
            >
              {mbtiType && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {mbtiType.name} ({mbtiType.id})
                    </h4>
                    <span className="text-sm text-gray-500">
                      {mbtiType.nickname}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {mbtiType.description}
                  </p>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {response.response_text}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {mbtiType?.relationship_tips.slice(0, 2).map((tip, tipIndex) => (
                    <span
                      key={tipIndex}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      💡 {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          重新諮詢
        </button>
      </div>
    </div>
  )
}

function getMBTIColor(mbtiType: string): string {
  const colors: Record<string, string> = {
    'INTJ': '#4C63D2', // 深藍
    'INTP': '#5B9BD5', // 藍色
    'ENTJ': '#C5504B', // 紅色
    'ENTP': '#F79646', // 橙色
    'INFJ': '#9BBB58', // 綠色
    'INFP': '#8064A2', // 紫色
    'ENFJ': '#F366A0', // 粉紅
    'ENFP': '#FFD966', // 黃色
    'ISTJ': '#70AD47', // 深綠
    'ISFJ': '#A5A5A5', // 灰色
    'ESTJ': '#E15759', // 紅橙
    'ESFJ': '#FF9999', // 淺紅
    'ISTP': '#92D050', // 亮綠
    'ISFP': '#DDA0DD', // 淡紫
    'ESTP': '#FFC000', // 金黃
    'ESFP': '#FF69B4', // 熱粉
  }
  
  return colors[mbtiType] || '#6B7280'
}