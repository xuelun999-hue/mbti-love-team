export interface MBTIType {
  id: string;
  name: string;
  nickname: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  love_style: string;
  ideal_partner: string[];
  relationship_tips: string[];
}

export interface Consultation {
  id?: string;
  user_id?: string;
  problem_text: string;
  target_mbti?: string;
  user_mbti?: string;
  consultation_type: 'specific' | 'comprehensive';
  status?: 'pending' | 'processing' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface Response {
  id?: string;
  consultation_id: string;
  mbti_type?: string;
  response_text: string;
  response_type: 'specific' | 'comprehensive';
  ai_model?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  created_at: string;
  updated_at: string;
}