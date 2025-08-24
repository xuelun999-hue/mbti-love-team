'use client'

import { useState } from 'react'
import ConsultationForm from '@/components/ConsultationForm'
import ResponseDisplay from '@/components/ResponseDisplay'
import { Consultation, Response } from '@/types'

interface ConsultationResult {
  consultation_id: string
  responses: Response[]
  consultation_type: 'specific' | 'comprehensive'
}

export default function Home() {
  const [result, setResult] = useState<ConsultationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConsultation = async (consultation: Consultation) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('發送諮詢請求:', consultation)
      
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultation),
      })

      console.log('API回應狀態:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        console.error('API錯誤:', errorData)
        throw new Error(errorData.error || `請求失敗 (${response.status})`)
      }

      const data: ConsultationResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Consultation error:', error)
      setError(error instanceof Error ? error.message : '發生未知錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto">
        {!result ? (
          <ConsultationForm 
            onSubmit={handleConsultation} 
            isLoading={isLoading}
          />
        ) : (
          <ResponseDisplay 
            responses={result.responses}
            consultationType={result.consultation_type}
          />
        )}
        
        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    發生錯誤
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2024 MBTI戀愛軍團 - 基於人工智能的情感諮詢平台</p>
        <p className="mt-2">請注意：本平台提供的建議僅供參考，實際情況請根據具體狀況判斷</p>
      </footer>
    </main>
  )
}