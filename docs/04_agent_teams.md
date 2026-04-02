# CONSIDERED JAPAN — Agent Teams 仕様

## 全体構成

```
[Orchestrator]（毎朝8時 cron起動）
      │
      ├─→ [Collector Agent]   収集 → JSON
      │
      ├─→ [Curator Agent]     選別・優先度付け → 候補リスト
      │
      ├─→ [Writer Agent]      英日コンテンツ生成 → 下書き
      │
      └─→ [Publisher Agent]   Notionへ投稿 → オーナーに通知
```

---

## Orchestrator

**役割**: 各Agentを順番に呼び出し、結果をつなぐ司令塔

```typescript
// agents/orchestrator.ts
// 毎朝8時にcronで実行
// 1. Collector起動 → 収集結果を受け取る
// 2. Curator起動 → 優先度付き候補リストを受け取る
// 3. Writer起動 → コンテンツ下書きを受け取る
// 4. Publisher起動 → Notionに投稿
// 5. エラーがあれば通知
```

---

## Collector Agent

**役割**: ブランド情報を自動収集

**監視対象**:
```
ブランド公式サイト（新着商品ページ）
  └── nonnative, COMOLI, Graphpaper, Markaware, etc.

Instagram公開投稿
  └── 各ブランド公式アカウント
  └── ハッシュタグ: #ドメスティックブランド #日本製

業界ニュース
  └── FASHIONSNAP
  └── WWD Japan

セレクトショップ新着
  └── BEAMS, SHIPS, United Arrows（日本のブランド入荷情報）
```

**使用ツール**: WebFetch, WebSearch

**出力フォーマット**:
```json
[
  {
    "brand": "COMOLI",
    "item": "Silk Noil Shirt",
    "url": "https://...",
    "image_url": "https://...",
    "category": "Tops",
    "season": "SS26",
    "source": "official_site",
    "collected_at": "2026-04-01T08:00:00Z"
  }
]
```

---

## Curator Agent

**役割**: 収集結果をフィルタリングし優先度を付ける

**フィルタリング基準**:
```
除外:
  - 既に掲載済みのアイテム（Notion DBと照合）
  - コアブランドリスト外のブランド
  - 重複情報

優先度UP:
  - 新シーズン初登場アイテム
  - 限定・コラボ
  - 海外からの需要が高そうなカテゴリ（コート、シャツ、バッグ）
  - 在庫希少サイン（売り切れ情報など）
```

**出力**: 優先度付き候補リスト（上位5件）

---

## Writer Agent

**役割**: 選ばれた候補の英日コンテンツを生成

**生成物**:
```
1. 本文（英語 300〜500 words）
   - ブランドの哲学・背景
   - アイテムの素材・ディテール解説
   - なぜ今これを取り上げるか

2. 本文（日本語 200〜400字）
   - 英語の翻訳ではなく並列表現

3. Instagram caption（英語 3案）

4. X投稿（英語 3案）

5. 画像候補URL一覧（5〜10枚）
   - ブランド公式サイトから収集

6. Slug提案（URL用）
```

**プロンプト指針**:
```
- ハイプな言葉を使わない
- 素材・製法・背景を重視
- 読者は日本ファッションを深く知りたい30〜45歳
- CONSIDERED（考えられた）というブランド名を体現するトーン
```

---

## Publisher Agent

**役割**: NotionにコンテンツをAPIで投稿

**処理**:
```
1. Notion Season Picks DBに新規ページ作成
   - Status: "Review"
   - 全プロパティをセット
   - 本文をpage contentとして追加
   - 画像候補を一覧表示（オーナーが選べるよう）

2. オーナーへ通知
   - メール or Slack（設定による）
   - 「X件のコンテンツがレビュー待ちです」
```

---

## オーナーの承認フロー（モバイル）

```
通知受信
    ↓
Notionアプリを開く
    ↓
Season Picks DB → Status = "Review" のページを開く
    ↓
内容確認 + 画像候補から1枚選択
    ↓
必要なら本文を微調整
    ↓
Status → "Published" に変更
    ↓
1時間以内にサイトに自動反映（ISR）
```

---

## 実行スケジュール

```
毎朝 08:00  Orchestrator起動（Collector → Curator）
毎朝 09:00  Writer起動（収集結果をもとにコンテンツ生成）
毎朝 09:30  Publisher起動（Notionに下書き投稿 + 通知）

毎週月曜    週間サマリーレポート生成
毎月1日     月次パフォーマンスレポート
```

---

## 実装ファイル構成（予定）

```
agents/
├── orchestrator.ts    # メインエントリーポイント
├── collector.ts       # 情報収集ロジック
├── curator.ts         # フィルタリング・優先度付け
├── writer.ts          # コンテンツ生成プロンプト
├── publisher.ts       # Notion API投稿
└── types.ts           # 共通型定義
```
