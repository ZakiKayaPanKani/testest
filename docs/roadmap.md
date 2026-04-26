# ロードマップと Prompt 進捗

Artli の実装は段階的な Prompt 単位で進めています。本ドキュメントは各 Prompt の目的・現状・完了したものの要点を整理したものです。

関連ドキュメント:

- [Artli の前提思想と実装判断基準](./philosophy.md)
- [Prompt 6 設計仕様](./prompt6-spec.md)

---

## Prompt 1.2: UI を「次世代 pixiv」寄りに調整

商業 EC 的な印象を避け、投稿型 SNS に近い見え方に UI の方向性を合わせる調整。トップ / 作品一覧 / 作家一覧の全体トーンを整える段階。

## Prompt 2: 認証、ロール、ダッシュボード枠

- 認証の基本
- ロール（artist / developer）の区別
- ダッシュボードの枠組み（artist 用 / developer 用）

## Prompt 3: DB 導入、Prisma、モデル定義、seed

- Prisma の導入と schema 整備
- 主要モデル（Work / ArtistProfile / DeveloperProfile / License / Acquisition など）の定義
- 開発用 seed データの整備

## Prompt 4: 作家投稿 CRUD（公開 / 非公開） — 完了

artist ロールが自分の作品を**新規作成 / 一覧表示 / 編集 / ステータス管理**できるようにした段階。ステータスは `draft` / `private` / `public` を扱う。

重要な実装方針:

- 既存の **public pages を壊さない**
- 既存の **Prisma schema を壊さない**
- 既存の **License モデルを全面再設計しない**

これらを守ることで、以降の Prompt が安心して積み重ねられる基盤になっています。

## Prompt 5: 即時取得 + 取得履歴 + DL（プロト） — 完了

developer ロールが、公開作品を正規ルートで即時取得し、取得履歴と証跡 JSON を残せるようにした段階。

要点:

- **取得可能なのは developer ロールのみ**
- **public 作品のみ**が対象
- **consult を含まない作品のみ**即時取得可能
- 同一 developer による**重複取得は不可**
- 取得時に `workSnapshot` / `licenseSnapshot` を保存（後から条件が変わっても当時の内容が残る）
- 取得履歴から **JSON 証跡をダウンロード可能**
- 取得処理の **TOCTOU レースコンディションを修正済み**（unique 制約で解消）

## Prompt 6: 検索 / フィルタ最小 — 次の実装対象

`/works` 一覧ページに、作品を見つけやすくするための**最小限の検索・フィルタ**を追加する段階。あくまで発見性の向上が目的で、取得効率化や調達最適化ではありません。

設計の詳細は [Prompt 6 設計仕様](./prompt6-spec.md) を参照してください。
