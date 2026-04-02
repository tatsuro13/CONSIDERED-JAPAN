# CONSIDERED JAPAN — Claude向け作業指示

## プロジェクト概要

日本のニッチファッションブランドを海外（英語圏）に発信するキュレーションサイト。
Next.js 15 + Notion CMS + Vercel + Claude Agent teams構成。

詳細: `docs/` ディレクトリを参照

## 重要ルール

- **gitはオーナーが管理する。commit/pushを提案・実行しない**
- コード変更後にgit操作を提案しない

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Notion API (`@notionhq/client`)
- Vercel

## 環境変数

`.env.local` に以下が必要（`.env.local.example`参照）:
```
NOTION_TOKEN=
NOTION_SEASON_DB_ID=
NOTION_BRANDS_DB_ID=
NOTION_JOURNAL_DB_ID=
```

## 起動

```bash
npm run dev   # → http://localhost:3000
npm run build # ビルド確認
```

## デザイン原則

- モノクロUI（色は写真のみ）
- 2.40:1 シネマティック画像比率
- 英日併記（翻訳ではなく並列・同格）
- 参考: Plus81 Magazine × AXIS Inc.

## ドキュメント

- `docs/01_concept.md`    — コンセプト・ビジネス定義
- `docs/02_requirements.md` — 要件定義
- `docs/03_architecture.md` — 技術アーキテクチャ
- `docs/04_agent_teams.md`  — Agent Teams仕様
- `docs/05_roadmap.md`      — ロードマップ
- `SETUP.md`                — セットアップ手順（Notion DB作成含む）

## 現在の優先タスク

1. Notionデータベース3つを作成（`SETUP.md`参照）
2. `.env.local`にDB IDを記入
3. 各ページをNotionデータに接続（ISR対応）
4. Vercelデプロイ
5. Agent teams実装（`docs/04_agent_teams.md`参照）
