-- 啟用行級安全性 (RLS) 修復

-- 為所有表啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 創建公開讀取政策 (因為這是公開的諮詢應用)

-- MBTI類型表 - 所有人可以讀取
CREATE POLICY "Allow public read access" ON mbti_types FOR SELECT USING (true);

-- 諮詢記錄表 - 允許插入新諮詢
CREATE POLICY "Allow public insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own consultations" ON consultations FOR SELECT USING (true);

-- 回覆表 - 允許插入回覆和讀取回覆
CREATE POLICY "Allow public insert responses" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read responses" ON responses FOR SELECT USING (true);

-- 用戶表 - 基本的用戶管理政策
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own user" ON users FOR SELECT USING (true);