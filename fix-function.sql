-- 修復函數 search_path 警告

-- 刪除舊函數
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 重新創建函數，設置安全的 search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 重新創建觸發器
DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;

CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();