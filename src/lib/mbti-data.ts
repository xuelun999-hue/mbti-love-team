import { MBTIType } from '@/types'

export const mbtiTypes: MBTIType[] = [
  {
    id: 'INTJ',
    name: '建築師',
    nickname: '策劃師',
    description: '具有想像力和戰略性的思想家，一切皆在計劃中。',
    strengths: ['獨立', '有創造力', '堅定', '果斷', '勤奮', '開放的心態'],
    weaknesses: ['傲慢', '過度分析', '討厭高度結構化的環境', '厭惡規則和指導方針'],
    love_style: '深度而有意義的關係，重視智力連接',
    ideal_partner: ['ENFP', 'ENTP', 'INFJ', 'INFP'],
    relationship_tips: ['給予足夠的個人空間', '欣賞他們的獨立性', '進行深入的對話']
  },
  {
    id: 'INTP',
    name: '邏輯學家',
    nickname: '思想家',
    description: '具有創新性的發明者，對知識有著止不住的渴望。',
    strengths: ['邏輯性強', '客觀', '有創造力', '誠實', '直接', '理性'],
    weaknesses: ['缺乏耐心', '不敏感', '心不在焉', '厭惡規則'],
    love_style: '需要智力刺激和理解的伴侶',
    ideal_partner: ['ENTJ', 'ESTJ', 'INFJ', 'INTJ'],
    relationship_tips: ['尊重他們的思考時間', '提供智力挑戰', '保持開放的溝通']
  },
  {
    id: 'ENTJ',
    name: '指揮官',
    nickname: '領導者',
    description: '大膽，富有想像力，意志強大的領導者。',
    strengths: ['高效', '精力充沛', '自信', '意志堅強', '戰略思維', '有魅力'],
    weaknesses: ['不耐煩', '傲慢', '冷酷', '缺乏同理心'],
    love_style: '尋找能夠挑戰他們並與之並肩作戰的伴侶',
    ideal_partner: ['INFP', 'INTP', 'ENFP', 'ENTP'],
    relationship_tips: ['支持他們的野心', '保持智力上的平等', '給予誠實的反饋']
  },
  {
    id: 'ENTP',
    name: '辯論家',
    nickname: '發明家',
    description: '聰明又好奇的思想家，不能抗拒智力上的挑戰。',
    strengths: ['知識淵博', '思維敏捷', '原創性', '優秀的頭腦風暴者', '有魅力'],
    weaknesses: ['容易爭論', '不敏感', '不寬容', '難以專注'],
    love_style: '喜歡充滿活力和刺激的關係',
    ideal_partner: ['INFJ', 'INTJ', 'ENFJ', 'INFP'],
    relationship_tips: ['參與他們的辯論', '保持關係的新鮮感', '給予智力刺激']
  },
  {
    id: 'INFJ',
    name: '提倡者',
    nickname: '諮詢師',
    description: '安靜而神秘，同時鼓舞他人的理想主義者。',
    strengths: ['有創造力', '富有洞察力', '鼓舞人心', '果斷', '堅定', '利他主義'],
    weaknesses: ['敏感', '極其隱私', '完美主義', '總是需要有事情做'],
    love_style: '深刻而有意義的關係，重視情感連接',
    ideal_partner: ['ENTP', 'ENFP', 'INTJ', 'INTP'],
    relationship_tips: ['尊重他們的敏感性', '提供情感支持', '耐心傾聽']
  },
  {
    id: 'INFP',
    name: '調停者',
    nickname: '夢想家',
    description: '詩意，善良，利他主義，總是熱衷於幫助正義事業。',
    strengths: ['理想主義', '忠誠', '開放的心態', '有創造力', '熱情', '個性鮮明'],
    weaknesses: ['過於理想主義', '過於利他主義', '不切實際', '情緒化'],
    love_style: '尋找靈魂伴侶，重視真實性和深度',
    ideal_partner: ['ENFJ', 'ENTJ', 'INFJ', 'ENFP'],
    relationship_tips: ['支持他們的價值觀', '給予表達空間', '保持真誠']
  },
  {
    id: 'ENFJ',
    name: '主人公',
    nickname: '教師',
    description: '有魅力，鼓舞人心的領導者，能夠使聽眾著迷。',
    strengths: ['寬容', '可靠', '有魅力', '利他主義', '天生的領導者'],
    weaknesses: ['過於理想主義', '過於敏感', '過度同情', '起伏不定'],
    love_style: '致力於幫助伴侶成長和發展',
    ideal_partner: ['INFP', 'ISFP', 'INTP', 'INFJ'],
    relationship_tips: ['表達感激', '支持他們的使命', '保持情感親密']
  },
  {
    id: 'ENFP',
    name: '競選者',
    nickname: '激勵者',
    description: '熱情，有創造力，社交能力強，總是能找到微笑的理由。',
    strengths: ['熱情', '精力充沛', '有創造力', '社交技能', '友善', '溝通能力強'],
    weaknesses: ['缺乏專注力', '過度思考', '容易焦慮', '情緒波動'],
    love_style: '充滿冒險和成長的關係',
    ideal_partner: ['INTJ', 'INFJ', 'INTP', 'ENFJ'],
    relationship_tips: ['給予自由探索', '參與他們的興趣', '保持積極樂觀']
  },
  {
    id: 'ISTJ',
    name: '物流師',
    nickname: '檢查員',
    description: '實用，注重事實的可靠性，值得信賴。',
    strengths: ['誠實', '直接', '意志堅強', '盡職盡責', '冷靜', '實用'],
    weaknesses: ['頑固', '不敏感', '總是按部就班', '不愛表達情感'],
    love_style: '傳統而穩定的關係',
    ideal_partner: ['ESFP', 'ESTP', 'ISFP', 'ENFP'],
    relationship_tips: ['尊重他們的傳統', '提供穩定感', '欣賞他們的可靠性']
  },
  {
    id: 'ISFJ',
    name: '守衛者',
    nickname: '保護者',
    description: '溫暖，貼心的保護者，時刻準備保護愛的人。',
    strengths: ['支持性', '可靠', '有耐心', '想像力豐富', '觀察力強', '忠誠'],
    weaknesses: ['謙虛', '過度利他主義', '情感壓抑', '厭惡變化'],
    love_style: '以照顧和支持為中心的關係',
    ideal_partner: ['ESFP', 'ISFP', 'ENFJ', 'ESTJ'],
    relationship_tips: ['表達欣賞', '提供情感支持', '珍視他們的奉獻']
  },
  {
    id: 'ESTJ',
    name: '總經理',
    nickname: '監督者',
    description: '出色的管理者，擅長管理事物或人員。',
    strengths: ['專注', '意志堅強', '直接', '誠實', '忠誠', '有耐心'],
    weaknesses: ['頑固', '不舒適的情況', '社交笨拙', '難以放鬆'],
    love_style: '傳統而結構化的關係',
    ideal_partner: ['ISFP', 'INTP', 'ISFJ', 'INFP'],
    relationship_tips: ['尊重他們的領導', '支持他們的目標', '保持忠誠']
  },
  {
    id: 'ESFJ',
    name: '執政官',
    nickname: '供應商',
    description: '極有同情心，喜歡社交，受歡迎的團隊合作者。',
    strengths: ['強烈的實用技能', '盡職盡責', '忠誠', '敏感', '溫暖'],
    weaknesses: ['擔心社會地位', '不靈活', '勉強自己', '過於利他主義'],
    love_style: '以和諧和傳統為基礎的關係',
    ideal_partner: ['ISFP', 'INFP', 'ISFJ', 'ISTJ'],
    relationship_tips: ['表達感激', '參與社交活動', '提供情感支持']
  },
  {
    id: 'ISTP',
    name: '鑒賞家',
    nickname: '工匠',
    description: '大膽而實際的實驗家，擅長使用各種工具。',
    strengths: ['樂觀', '精力充沛', '有創造力', '實用', '自發', '理性'],
    weaknesses: ['頑固', '不敏感', '隱私', '容易厭倦'],
    love_style: '自由而不拘束的關係',
    ideal_partner: ['ESFJ', 'ESTJ', 'ISFJ', 'ENFJ'],
    relationship_tips: ['給予獨立空間', '參與實際活動', '保持靈活性']
  },
  {
    id: 'ISFP',
    name: '探險家',
    nickname: '藝術家',
    description: '靈活，迷人的藝術家，時刻準備探索新的可能性。',
    strengths: ['有魅力', '敏感', '想像力豐富', '熱情', '好奇', '適應性強'],
    weaknesses: ['過於敏感', '容易焦慮', '競爭力差', '起伏不定'],
    love_style: '真實而支持性的關係',
    ideal_partner: ['ESFJ', 'ESTJ', 'ENFJ', 'ESFP'],
    relationship_tips: ['尊重他們的價值觀', '提供情感支持', '給予創作空間']
  },
  {
    id: 'ESTP',
    name: '企業家',
    nickname: '推銷員',
    description: '聰明，精力充沛，善於感知的人，真正享受生活。',
    strengths: ['大膽', '理性', '實用', '原創性', '感知力', '直接'],
    weaknesses: ['不敏感', '不耐煩', '承擔風險', '不結構化'],
    love_style: '活躍而刺激的關係',
    ideal_partner: ['ISFJ', 'ISTJ', 'ISFP', 'INFJ'],
    relationship_tips: ['保持活力', '參與冒險', '給予行動自由']
  },
  {
    id: 'ESFP',
    name: '娛樂家',
    nickname: '表演者',
    description: '自發的，精力充沛，熱情的表演者，生活對他們來說絕不無聊。',
    strengths: ['大膽', '美學', '展示技巧', '實用', '觀察力'],
    weaknesses: ['敏感', '衝突迴避', '容易厭倦', '決策困難'],
    love_style: '充滿樂趣和自發性的關係',
    ideal_partner: ['ISFJ', 'ISTJ', 'ISFP', 'INFJ'],
    relationship_tips: ['參與他們的活動', '保持積極氛圍', '給予讚美']
  }
]

export const getMBTIType = (id: string): MBTIType | undefined => {
  return mbtiTypes.find(type => type.id === id)
}

export const getAllMBTITypes = (): MBTIType[] => {
  return mbtiTypes
}