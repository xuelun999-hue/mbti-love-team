'use client'

import { useState } from 'react'
import { getAllMBTITypes } from '@/lib/mbti-data'
import { Consultation } from '@/types'

interface ConsultationFormProps {
  onSubmit: (consultation: Consultation) => void
  isLoading: boolean
}

export default function ConsultationForm({ onSubmit, isLoading }: ConsultationFormProps) {
  const [problemText, setProblemText] = useState('')
  const [targetMbti, setTargetMbti] = useState('')
  const [userMbti, setUserMbti] = useState('')
  const [consultationType, setConsultationType] = useState<'specific' | 'comprehensive'>('comprehensive')
  
  const mbtiTypes = getAllMBTITypes()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!problemText.trim()) return

    const consultation: Consultation = {
      problem_text: problemText,
      target_mbti: targetMbti || undefined,
      user_mbti: userMbti || undefined,
      consultation_type: consultationType,
    }

    onSubmit(consultation)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        MBTI戀愛軍團 💕
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        分享你的情感煩惱，讓不同MBTI性格的專家為你提供建議
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
            你的情感煩惱或問題 *
          </label>
          <textarea
            id="problem"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="詳細描述你遇到的情感問題..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="userMbti" className="block text-sm font-medium text-gray-700 mb-2">
              你的MBTI類型 (選填)
            </label>
            <select
              id="userMbti"
              value={userMbti}
              onChange={(e) => setUserMbti(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">請選擇...</option>
              <option value="unknown">未知</option>
              {mbtiTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.id} - {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetMbti" className="block text-sm font-medium text-gray-700 mb-2">
              對象的MBTI類型 (選填)
            </label>
            <select
              id="targetMbti"
              value={targetMbti}
              onChange={(e) => setTargetMbti(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">請選擇...</option>
              <option value="unknown">未知</option>
              {mbtiTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.id} - {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            諮詢類型
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="comprehensive"
                checked={consultationType === 'comprehensive'}
                onChange={(e) => setConsultationType(e.target.value as 'comprehensive')}
                className="mr-2"
              />
              <span>綜合建議 - 獲得多種MBTI視角的全面建議</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="specific"
                checked={consultationType === 'specific'}
                onChange={(e) => setConsultationType(e.target.value as 'specific')}
                className="mr-2"
              />
              <span>特定建議 - 根據具體MBTI類型提供針對性建議</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !problemText.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? '正在生成建議...' : '獲取戀愛建議'}
        </button>
      </form>
    </div>
  )
}