# TODO アプリ

Vue.js 3で構築されたモダンなTODO管理アプリケーション

## 機能

- TODOの追加・編集・削除
- 完了/未完了の切り替え
- 優先度設定（高・中・低）
- フィルタリング（全て/未完了/完了済み）
- LocalStorageによるデータ永続化
- レスポンシブデザイン

## 技術スタック

- Vue.js 3
- Vite
- Vitest（ユニットテスト）
- ESLint + Prettier（静的テスト）

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションを確認できます。

## スクリプト

### 開発

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run preview      # ビルド結果のプレビュー
```

### テスト

```bash
npm run test         # ユニットテスト実行
npm run test:ui      # Vitest UI起動
npm run test:coverage # テストカバレッジレポート生成
```

### 静的テスト

```bash
npm run lint         # ESLintチェック
npm run lint:fix     # ESLint自動修正
npm run format       # Prettierフォーマット実行
```

## プロジェクト構造

```
my-todo/
├── src/
│   ├── App.vue              # メインコンポーネント
│   ├── main.js              # エントリーポイント
│   ├── style.css            # グローバルスタイル
│   └── __tests__/
│       └── App.test.js      # ユニットテスト
├── index.html               # HTMLテンプレート
├── vite.config.js           # Vite設定
├── .eslintrc.js             # ESLint設定
├── .prettierrc              # Prettier設定
└── package.json
```

## 使い方

1. テキスト入力欄に新しいTODOを入力
2. 優先度を選択（デフォルトは「中」）
3. 「追加」ボタンをクリックまたはEnterキーで追加
4. TODOをダブルクリックで編集モードに入る
5. チェックボックスで完了/未完了を切り替え
6. フィルタボタンで表示を絞り込み
7. 「削除」ボタンでTODOを削除

## テストについて

### ユニットテスト

Vitestを使用して以下の機能をテストしています：

- TODO追加・削除・編集
- 完了状態の切り替え
- 優先度設定
- フィルタリング機能
- LocalStorage連携

テストカバレッジ目標：主要メソッド80%以上

### 静的テスト

- ESLint: Vue 3推奨設定でコード品質をチェック
- Prettier: 一貫したコードフォーマットを維持

## ライセンス

MIT
