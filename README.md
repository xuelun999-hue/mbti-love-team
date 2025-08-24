# MBTI戀愛軍團 💕

一個基於MBTI性格分析的戀愛諮詢平台，使用 Vercel AI SDK 和 Supabase 構建。

## 功能特色

- 🎯 **個性化諮詢**: 根據用戶和對象的MBTI類型提供針對性建議
- 🤖 **AI驅動**: 使用GPT-4為不同MBTI性格提供專業建議
- 🎨 **直觀界面**: 美觀易用的用戶界面
- 📊 **雙重模式**: 支持特定MBTI建議和綜合建議
- 💾 **數據存儲**: 使用Supabase存儲諮詢記錄

## 技術棧

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Vercel AI SDK, OpenAI GPT-4
- **後端**: Next.js API Routes
- **數據庫**: Supabase (PostgreSQL)
- **部署**: Vercel

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境配置

創建 `.env.local` 文件並添加以下環境變量：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 數據庫設置

在Supabase中執行 `supabase-schema.sql` 文件來創建所需的數據表和數據。

### 4. 運行開發服務器

```bash
npm run dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看應用。

## 使用說明

1. **輸入問題**: 在表單中詳細描述你的情感問題
2. **選擇MBTI**: 可選填你和對象的MBTI類型
3. **選擇諮詢類型**:
   - **綜合建議**: 獲得多種MBTI視角的全面建議
   - **特定建議**: 根據具體MBTI類型提供針對性建議
4. **獲取建議**: 點擊按鈕後等待AI生成專業建議

## 項目結構

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── api/            # API 路由
│   ├── globals.css     # 全局樣式
│   ├── layout.tsx      # 根佈局
│   └── page.tsx        # 首頁
├── components/         # React 組件
│   ├── ConsultationForm.tsx
│   └── ResponseDisplay.tsx
├── lib/               # 工具函數和配置
│   ├── mbti-data.ts   # MBTI 類型數據
│   └── supabase.ts    # Supabase 客戶端
└── types/             # TypeScript 類型定義
    └── index.ts
```

## MBTI 類型支持

支持全部 16 種 MBTI 人格類型：

### 分析師 (NT)
- INTJ (建築師)
- INTP (邏輯學家)  
- ENTJ (指揮官)
- ENTP (辯論家)

### 外交官 (NF)
- INFJ (提倡者)
- INFP (調停者)
- ENFJ (主人公)
- ENFP (競選者)

### 守護者 (SJ)
- ISTJ (物流師)
- ISFJ (守衛者)
- ESTJ (總經理)
- ESFJ (執政官)

### 探險家 (SP)
- ISTP (鑒賞家)
- ISFP (探險家)
- ESTP (企業家)
- ESFP (娛樂家)

## 部署

### Vercel 部署

1. 將項目推送到 GitHub
2. 連接到 Vercel
3. 設置環境變量
4. 部署

### Supabase 設置

1. 創建 Supabase 項目
2. 執行 SQL schema
3. 獲取 URL 和 API Key
4. 更新環境變量

## 注意事項

- 確保 OpenAI API Key 有足夠的配額
- Supabase 免費層有使用限制
- 建議數據存儲是可選的，即使數據庫連接失敗，AI 功能依然可用

## 貢獻

歡迎提交 Pull Request 和 Issue！

## 許可證

MIT License