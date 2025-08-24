import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'MBTI戀愛軍團 API is running' 
  })
}

export async function POST() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'POST method available' 
  })
}