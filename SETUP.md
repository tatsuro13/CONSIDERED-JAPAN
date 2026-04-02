# CONSIDERED JAPAN — セットアップガイド

## プロジェクト概要

日本のニッチファッションブランドを海外に発信するキュレーションサイト。
Next.js 15 + Notion CMS + Vercel構成。

---

## 現在の状態

- [x] Next.js プロジェクト作成済み（`/Users/osuka_t/works/others/CONSIDERED JAPAN`）
- [x] デザインシステム構築済み（Plus81 × AXIS テイスト、日英併記、シネマティック画像）
- [x] 全ページ骨格作成済み（/, /brands, /season, /journal, /buy-guide）
- [x] Notion API連携コード作成済み（`lib/notion.ts`）
- [x] `.env.local` にNOTION_TOKEN設定済み
- [ ] **Notion DB作成が未完了 ← ここから再開**

---

## Notion セットアップ（未完了）

### Notion Integration情報
- Integration名: `considered-japan`
- Token: `.env.local` に保存済み

### 作成が必要な3つのDB

#### ① Season Picks
Notionで「Full page」のTableを作成し、以下カラムを追加：

| カラム名 | タイプ |
|---------|-------|
| Title（デフォルト） | Title |
| Brand | Select（nonnative / COMOLI / Graphpaper / Markaware / Porter Classic / sacai / Y-3 / HYKE / Freshservice / EYEVAN / Kijima Takayuki / Comme des Garcons / Yohji Yamamoto） |
| TitleJp | Text |
| Slug | Text |
| Tag | Select（NEW ARRIVAL / SEASON PICK / BRAND FOCUS） |
| TagJp | Text |
| Image | URL |
| Date | Date |
| Status | Select（Draft / Review / Published） |

作成後：`•••` → `Add connections` → `considered-japan` を追加

#### ② Brands
| カラム名 | タイプ |
|---------|-------|
| Name（デフォルト） | Title |
| NameJp | Text |
| Since | Number |
| Category | Select |
| OfficialUrl | URL |
| InternationalShipping | Checkbox |
| Status | Select（Draft / Published） |

作成後：`•••` → `Add connections` → `considered-japan` を追加

#### ③ Journal
| カラム名 | タイプ |
|---------|-------|
| Title（デフォルト） | Title |
| TitleJp | Text |
| Slug | Text |
| Date | Date |
| Status | Select（Draft / Review / Published） |

作成後：`•••` → `Add connections` → `considered-japan` を追加

---

### DB IDの取得方法

各DBを開いてURLを確認：
```
https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                       これがDB ID（32文字）
```

取得したIDを `.env.local` に記入：
```
NOTION_SEASON_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_BRANDS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_JOURNAL_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## プロジェクト構成

```
/
├── app/
│   ├── layout.tsx        # ナビゲーション、フッター
│   ├── page.tsx          # トップページ（ヒーロー + フィーチャーグリッド）
│   ├── brands/page.tsx   # ブランド一覧
│   ├── season/page.tsx   # シーズンピック
│   ├── journal/page.tsx  # 読み物
│   └── buy-guide/page.tsx# 購入ガイド
├── components/
│   └── Nav.tsx           # ナビゲーション
├── lib/
│   └── notion.ts         # Notion API連携
├── .env.local            # 環境変数（gitignore済み）
└── .env.local.example    # 環境変数テンプレート
```

## デザイン方針

- **カラーパレット**: モノクロ（UIは白黒、色は写真のみ）
- **画像比率**: 2.40:1 シネマティック
- **言語**: 英日併記（同格、翻訳ではなく並列）
- **フォント**: sans-serif、ウェイトで階層
- **参考**: Plus81 Magazine × AXIS Inc.

## 次のステップ（DB完成後）

1. `.env.local` にDB IDを記入
2. `npm run dev` で動作確認
3. `lib/notion.ts` のデータ取得関数を各ページに組み込む
4. Agent teams（Collector / Writer / Publisher）の実装
5. Vercelデプロイ

## ブランドリスト

nonnative、COMOLI、Graphpaper、Markaware、Porter Classic、sacai、Y-3、HYKE、Freshservice、EYEVAN、Kijima Takayuki、Comme des Garçons、Yohji Yamamoto、Brahms

## 起動方法

```bash
cd "/Users/osuka_t/works/others/CONSIDERED JAPAN"
npm run dev
# → http://localhost:3000
```
