# CONSIDERED JAPAN — 要件定義

## サイト構成

| ページ | パス | 目的 |
|--------|------|------|
| トップ | `/` | ヒーロー + 最新フィーチャー + ブランドストリップ |
| ブランド一覧 | `/brands` | キュレーション済みブランドインデックス |
| シーズン | `/season` | 季節ごとの注目ピック（Agentが収集、オーナーが選別） |
| 読み物 | `/journal` | ブランド哲学・職人・深掘りコンテンツ |
| 購入ガイド | `/buy-guide` | 海外から日本ブランドを買う方法 |

---

## 機能要件

### コンテンツ管理
- [ ] NotionをヘッドレスCMSとして使用
- [ ] Agent teamsがNotionに下書きを自動作成
- [ ] オーナーがモバイル（Notionアプリ）で承認
- [ ] Statusを「Published」に変更するとサイトに自動反映

### 多言語
- [ ] 全コンテンツに英語と日本語を併記
- [ ] 翻訳ではなく「並列表現」（同格）
- [ ] Agentが英日両方を生成

### 画像
- [ ] 2.40:1 シネマティックアスペクト比
- [ ] ホバー時にグレースケール→カラーのトランジション
- [ ] Agentが候補複数枚を提示、オーナーが選択

### SEO
- [ ] OGP / Twitter Card対応
- [ ] ブランド名・アイテム名での検索流入を狙う
- [ ] Y-3、CdG等の国際認知ブランドを入口に使う

---

## 非機能要件

| 項目 | 要件 |
|------|------|
| パフォーマンス | Vercel Edge、Core Web Vitals Green |
| デザイン | モノクロUI、写真だけが色を持つ |
| レスポンシブ | モバイルファースト |
| デプロイ | Vercel（git pushで自動デプロイ） |
| コスト | 月$50以下で運用可能 |

---

## Notionデータベース設計

### Season Picks DB

| プロパティ | タイプ | 説明 |
|-----------|-------|------|
| Title | Title | 英語タイトル |
| Brand | Select | ブランド名 |
| TitleJp | Text | 日本語タイトル |
| Slug | Text | URL用スラッグ |
| Tag | Select | NEW ARRIVAL / SEASON PICK / BRAND FOCUS |
| TagJp | Text | タグの日本語 |
| Image | URL | メイン画像URL |
| Date | Date | 掲載日 |
| Status | Select | Draft → Review → Published |

### Brands DB

| プロパティ | タイプ | 説明 |
|-----------|-------|------|
| Name | Title | ブランド名（英語） |
| NameJp | Text | ブランド名（日本語） |
| Since | Number | 設立年 |
| Category | Select | カテゴリ |
| OfficialUrl | URL | 公式サイト |
| InternationalShipping | Checkbox | 国際発送対応 |
| Status | Select | Draft / Published |

### Journal DB

| プロパティ | タイプ | 説明 |
|-----------|-------|------|
| Title | Title | 記事タイトル（英語） |
| TitleJp | Text | 記事タイトル（日本語） |
| Slug | Text | URL用スラッグ |
| Date | Date | 公開日 |
| Status | Select | Draft → Review → Published |

---

## Agent承認フロー

```
1. Agent が情報収集（毎朝8時）
2. Agent が英日コンテンツ生成
3. Agent が Notion に「Review」ステータスで下書き作成
   └── 写真候補5〜10枚を一覧で添付
4. オーナーにプッシュ通知
5. オーナーがNotionアプリで確認
   └── 写真1枚選択
   └── 必要なら本文を微調整
   └── Status → 「Published」に変更
6. サイトに自動反映（ISR / revalidate）
```
