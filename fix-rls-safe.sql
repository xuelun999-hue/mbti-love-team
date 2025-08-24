-- 安全的RLS修復 - 檢查後再創建

-- 為所有表啟用 RLS (如果尚未啟用)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 刪除可能存在的舊政策，然後重新創建
DROP POLICY IF EXISTS "Allow public read access" ON mbti_types;
DROP POLICY IF EXISTS "Allow public insert consultations" ON consultations;
DROP POLICY IF EXISTS "Allow read own consultations" ON consultations;
DROP POLICY IF EXISTS "Allow public insert responses" ON responses;
DROP POLICY IF EXISTS "Allow public read responses" ON responses;
DROP POLICY IF EXISTS "Allow public insert users" ON users;
DROP POLICY IF EXISTS "Allow read own user" ON users;

-- 重新創建所有政策
CREATE POLICY "Allow public read access" ON mbti_types FOR SELECT USING (true);

CREATE POLICY "Allow public insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own consultations" ON consultations FOR SELECT USING (true);

CREATE POLICY "Allow public insert responses" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read responses" ON responses FOR SELECT USING (true);

CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own user" ON users FOR SELECT USING (true);