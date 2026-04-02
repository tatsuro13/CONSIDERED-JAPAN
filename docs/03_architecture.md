# CONSIDERED JAPAN — 技術アーキテクチャ

## 技術スタック

| 層 | 技術 | 理由 |
|----|------|------|
| フロントエンド | Next.js 15 (App Router) | SEO◎、ISR対応、Vercel親和性 |
| スタイリング | Tailwind CSS | 高速開発、デザイントークン管理 |
| CMS | Notion API | モバイル承認、Agent書き込み容易 |
| デプロイ | Vercel | git pushで自動デプロイ |
| 自動化 | Claude Code Agent teams | コンテンツ収集・生成・投稿 |
| 言語 | TypeScript | 型安全、Notion APIレスポンス型定義 |

---

## プロジェクト構成

```
CONSIDERED JAPAN/
├── app/
│   ├── layout.tsx              # ルートレイアウト（Nav + Footer）
│   ├── globals.css             # グローバルスタイル・デザイントークン
│   ├── page.tsx                # トップページ
│   ├── brands/
│   │   └── page.tsx            # ブランド一覧
│   ├── season/
│   │   ├── page.tsx            # シーズンピック一覧
│   │   └── [slug]/page.tsx     # 個別記事（未作成）
│   ├── journal/
│   │   ├── page.tsx            # 読み物一覧
│   │   └── [slug]/page.tsx     # 個別記事（未作成）
│   └── buy-guide/
│       └── page.tsx            # 購入ガイド
├── components/
│   └── Nav.tsx                 # ナビゲーション（スティッキー、モバイル対応）
├── lib/
│   └── notion.ts               # Notion API クライアント & データ取得関数
├── agents/                     # Agent teams（未作成）
│   ├── orchestrator.ts         # 司令塔
│   ├── collector.ts            # 情報収集
│   ├── writer.ts               # コンテンツ生成
│   └── publisher.ts            # Notionへ投稿
├── docs/                       # ドキュメント
├── .env.local                  # 環境変数（gitignore）
├── .env.local.example          # 環境変数テンプレート
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## デザインシステム

### カラーパレット
```css
--ink:    #111111   /* 本文・見出し */
--paper:  #F8F8F6   /* 背景 */
--muted:  #888888   /* 補足テキスト */
--border: #E0E0E0   /* 区切り線 */
```
UIは完全モノクロ。色は写真のみが持つ。

### タイポグラフィ
```
英語: Helvetica Neue → sans-serif
日本語: Hiragino Kaku Gothic ProN

ラベル: 10px / tracking 0.2em / uppercase
本文英: 14px / leading-relaxed / tracking-wide
本文日: 14px / leading-relaxed / letter-spacing 0.05em
```

### 画像
```
アスペクト比: 2.40:1（シネマティック）
デフォルト: grayscale
ホバー: grayscale → color（transition 700ms）
```

### 日英併記
```html
<!-- 英語が先、日本語が直下 -->
<p class="bilingual-en">Brand text in English</p>
<p class="bilingual-jp">日本語テキスト</p>
```

---

## Notion → Next.js データフロー

```
Notion DB（Published）
    ↓ notion.ts（Server Component内で呼び出し）
    ↓ ISR revalidate: 3600（1時間キャッシュ）
Next.js Page
    ↓
Vercel Edge
```

### ISR設定（各ページに追加予定）
```typescript
export const revalidate = 3600; // 1時間
```

---

## 環境変数

```bash
NOTION_TOKEN=           # Integration Secret
NOTION_SEASON_DB_ID=    # Season Picks DB ID
NOTION_BRANDS_DB_ID=    # Brands DB ID
NOTION_JOURNAL_DB_ID=   # Journal DB ID
```

---

## デプロイ

```
git push → Vercel 自動ビルド → https://considered-japan.vercel.app
```

カスタムドメイン設定予定: `considered-japan.com`（未取得）
