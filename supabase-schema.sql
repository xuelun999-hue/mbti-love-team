-- MBTI 戀愛軍團數據庫架構

-- 用戶表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE,
  username TEXT UNIQUE
);

-- MBTI 類型表
CREATE TABLE mbti_types (
  id TEXT PRIMARY KEY, -- 如 'INTJ', 'ENFP' 等
  name TEXT NOT NULL, -- 完整名稱如 '建築師'
  nickname TEXT, -- 暱稱如 '策劃師'
  description TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  love_style TEXT,
  ideal_partner TEXT[],
  relationship_tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 諮詢記錄表
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  problem_text TEXT NOT NULL,
  target_mbti TEXT REFERENCES mbti_types(id),
  user_mbti TEXT REFERENCES mbti_types(id),
  consultation_type TEXT CHECK (consultation_type IN ('specific', 'comprehensive')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 回覆表
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id),
  mbti_type TEXT REFERENCES mbti_types(id),
  response_text TEXT NOT NULL,
  response_type TEXT CHECK (response_type IN ('specific', 'comprehensive')),
  ai_model TEXT DEFAULT 'gpt-4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入 16 種 MBTI 類型基礎數據
INSERT INTO mbti_types (id, name, nickname, description, strengths, weaknesses, love_style, ideal_partner, relationship_tips) VALUES
('INTJ', '建築師', '策劃師', '具有想像力和戰略性的思想家，一切皆在計劃中。', 
 ARRAY['獨立', '有創造力', '堅定', '果斷', '勤奮', '開放的心態'], 
 ARRAY['傲慢', '過度分析', '討厭高度結構化的環境', '厭惡規則和指導方針'],
 '深度而有意義的關係，重視智力連接',
 ARRAY['ENFP', 'ENTP', 'INFJ', 'INFP'],
 ARRAY['給予足夠的個人空間', '欣賞他們的獨立性', '進行深入的對話']),
 
('INTP', '邏輯學家', '思想家', '具有創新性的發明者，對知識有著止不住的渴望。',
 ARRAY['邏輯性強', '客觀', '有創造力', '誠實', '直接', '理性'],
 ARRAY['缺乏耐心', '不敏感', '心不在焉', '厭惡規則'],
 '需要智力刺激和理解的伴侶',
 ARRAY['ENTJ', 'ESTJ', 'INFJ', 'INTJ'],
 ARRAY['尊重他們的思考時間', '提供智力挑戰', '保持開放的溝通']),
 
('ENTJ', '指揮官', '領導者', '大膽，富有想像力，意志強大的領導者。',
 ARRAY['高效', '精力充沛', '自信', '意志堅強', '戰略思維', '有魅力'],
 ARRAY['不耐煩', '傲慢', '冷酷', '缺乏同理心'],
 '尋找能夠挑戰他們並與之並肩作戰的伴侶',
 ARRAY['INFP', 'INTP', 'ENFP', 'ENTP'],
 ARRAY['支持他們的野心', '保持智力上的平等', '給予誠實的反饋']),

('ENTP', '辯論家', '發明家', '聰明又好奇的思想家，不能抗拒智力上的挑戰。',
 ARRAY['知識淵博', '思維敏捷', '原創性', '優秀的頭腦風暴者', '有魅力'],
 ARRAY['容易爭論', '不敏感', '不寬容', '難以專注'],
 '喜歡充滿活力和刺激的關係',
 ARRAY['INFJ', 'INTJ', 'ENFJ', 'INFP'],
 ARRAY['參與他們的辯論', '保持關係的新鮮感', '給予智力刺激']),

('INFJ', '提倡者', '諮詢師', '安靜而神秘，同時鼓舞他人的理想主義者。',
 ARRAY['有創造力', '富有洞察力', '鼓舞人心', '果斷', '堅定', '利他主義'],
 ARRAY['敏感', '極其隱私', '完美主義', '總是需要有事情做'],
 '深刻而有意義的關係，重視情感連接',
 ARRAY['ENTP', 'ENFP', 'INTJ', 'INTP'],
 ARRAY['尊重他們的敏感性', '提供情感支持', '耐心傾聽']),

('INFP', '調停者', '夢想家', '詩意，善良，利他主義，總是熱衷於幫助正義事業。',
 ARRAY['理想主義', '忠誠', '開放的心態', '有創造力', '熱情', '個性鮮明'],
 ARRAY['過於理想主義', '過於利他主義', '不切實際', '情緒化'],
 '尋找靈魂伴侶，重視真實性和深度',
 ARRAY['ENFJ', 'ENTJ', 'INFJ', 'ENFP'],
 ARRAY['支持他們的價值觀', '給予表達空間', '保持真誠']),

('ENFJ', '主人公', '教師', '有魅力，鼓舞人心的領導者，能夠使聽眾著迷。',
 ARRAY['寬容', '可靠', '有魅力', '利他主義', '天生的領導者'],
 ARRAY['過於理想主義', '過於敏感', '過度同情', '起伏不定'],
 '致力於幫助伴侶成長和發展',
 ARRAY['INFP', 'ISFP', 'INTP', 'INFJ'],
 ARRAY['表達感激', '支持他們的使命', '保持情感親密']),

('ENFP', '競選者', '激勵者', '熱情，有創造力，社交能力強，總是能找到微笑的理由。',
 ARRAY['熱情', '精力充沛', '有創造力', '社交技能', '友善', '溝通能力強'],
 ARRAY['缺乏專注力', '過度思考', '容易焦慮', '情緒波動'],
 '充滿冒險和成長的關係',
 ARRAY['INTJ', 'INFJ', 'INTP', 'ENFJ'],
 ARRAY['給予自由探索', '參與他們的興趣', '保持積極樂觀']),

('ISTJ', '物流師', '檢查員', '實用，注重事實的可靠性，值得信賴。',
 ARRAY['誠實', '直接', '意志堅強', '盡職盡責', '冷靜', '實用'],
 ARRAY['頑固', '不敏感', '總是按部就班', '不愛表達情感'],
 '傳統而穩定的關係',
 ARRAY['ESFP', 'ESTP', 'ISFP', 'ENFP'],
 ARRAY['尊重他們的傳統', '提供穩定感', '欣賞他們的可靠性']),

('ISFJ', '守衛者', '保護者', '溫暖，貼心的保護者，時刻準備保護愛的人。',
 ARRAY['支持性', '可靠', '有耐心', '想像力豐富', '觀察力強', '忠誠'],
 ARRAY['謙虛', '過度利他主義', '情感壓抑', '厭惡變化'],
 '以照顧和支持為中心的關係',
 ARRAY['ESFP', 'ISFP', 'ENFJ', 'ESTJ'],
 ARRAY['表達欣賞', '提供情感支持', '珍視他們的奉獻']),

('ESTJ', '總經理', '監督者', '出色的管理者，擅長管理事物或人員。',
 ARRAY['專注', '意志堅強', '直接', '誠實', '忠誠', '有耐心'],
 ARRAY['頑固', '不舒適的情況', '社交笨拙', '難以放鬆'],
 '傳統而結構化的關係',
 ARRAY['ISFP', 'INTP', 'ISFJ', 'INFP'],
 ARRAY['尊重他們的領導', '支持他們的目標', '保持忠誠']),

('ESFJ', '執政官', '供應商', '極有同情心，喜歡社交，受歡迎的團隊合作者。',
 ARRAY['強烈的實用技能', '盡職盡責', '忠誠', '敏感', '溫暖'],
 ARRAY['擔心社會地位', '不靈活', '勉強自己', '過於利他主義'],
 '以和諧和傳統為基礎的關係',
 ARRAY['ISFP', 'INFP', 'ISFJ', 'ISTJ'],
 ARRAY['表達感激', '參與社交活動', '提供情感支持']),

('ISTP', '鑒賞家', '工匠', '大膽而實際的實驗家，擅長使用各種工具。',
 ARRAY['樂觀', '精力充沛', '有創造力', '實用', '自發', '理性'],
 ARRAY['頑固', '不敏感', '隱私', '容易厭倦'],
 '自由而不拘束的關係',
 ARRAY['ESFJ', 'ESTJ', 'ISFJ', 'ENFJ'],
 ARRAY['給予獨立空間', '參與實際活動', '保持靈活性']),

('ISFP', '探險家', '藝術家', '靈活，迷人的藝術家，時刻準備探索新的可能性。',
 ARRAY['有魅力', '敏感', '想像力豐富', '熱情', '好奇', '適應性強'],
 ARRAY['過於敏感', '容易焦慮', '競爭力差', '起伏不定'],
 '真實而支持性的關係',
 ARRAY['ESFJ', 'ESTJ', 'ENFJ', 'ESFP'],
 ARRAY['尊重他們的價值觀', '提供情感支持', '給予創作空間']),

('ESTP', '企業家', '推銷員', '聰明，精力充沛，善於感知的人，真正享受生活。',
 ARRAY['大膽', '理性', '實用', '原創性', '感知力', '直接'],
 ARRAY['不敏感', '不耐煩', '承擔風險', '不結構化'],
 '活躍而刺激的關係',
 ARRAY['ISFJ', 'ISTJ', 'ISFP', 'INFJ'],
 ARRAY['保持活力', '參與冒險', '給予行動自由']),

('ESFP', '娛樂家', '表演者', '自發的，精力充沛，熱情的表演者，生活對他們來說絕不無聊。',
 ARRAY['大膽', '美學', '展示技巧', '實用', '觀察力'],
 ARRAY['敏感', '衝突迴避', '容易厭倦', '決策困難'],
 '充滿樂趣和自發性的關係',
 ARRAY['ISFJ', 'ISTJ', 'ISFP', 'INFJ'],
 ARRAY['參與他們的活動', '保持積極氛圍', '給予讚美']);

-- 創建觸發器以自動更新 updated_at 欄位
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();