# プロジェクト記憶: TODOアプリ

## プロジェクト概要

Vue.js 3で構築されたTODO管理アプリケーション。静的テスト（ESLint/Prettier）とユニットテスト（Vitest）の自動化を実装済み。

## 技術スタック

- **フロントエンド**: Vue.js 3（Composition APIではなくOptions API使用）
- **ビルドツール**: Vite 5
- **テストフレームワーク**: Vitest + Vue Test Utils
- **静的解析**: ESLint + Prettier
- **データ永続化**: LocalStorage

## プロジェクト構造

```
my-todo/
├── src/
│   ├── App.vue              # メインコンポーネント（Single File Component）
│   ├── main.js              # Vueアプリケーションエントリーポイント
│   ├── style.css            # グローバルスタイル
│   └── __tests__/
│       └── App.test.js      # ユニットテスト（全主要機能カバー）
├── index.html               # Vite用HTMLテンプレート
├── vite.config.js           # Vite設定（Vitestの設定も含む）
├── .eslintrc.js             # ESLint設定（Vue 3推奨）
├── .prettierrc              # Prettier設定
├── package.json             # 依存関係とスクリプト
└── README.md                # ユーザー向けドキュメント
```

## 重要な設計判断

### なぜOptions APIを使用したか
- 元々CDN版Vue.jsからの移行だったため、既存コードとの互換性を重視
- シンプルなアプリケーションなので、Options APIで十分
- 今後Composition APIに移行する場合は、リファクタリングを検討

### データモデル
```javascript
{
  id: timestamp,           // Date.now()で生成
  text: string,           // TODOのテキスト
  completed: boolean,     // 完了状態
  priority: 'high' | 'medium' | 'low',  // 優先度
  createdAt: timestamp    // 作成日時
}
```

### LocalStorage永続化
- キー: `'todos'`
- 値: JSON文字列化されたTODO配列
- 保存タイミング: 追加・削除・編集・完了切り替え・優先度変更の各操作後
- 読み込みタイミング: コンポーネントのmounted時

## コーディング規約

### Vue.js
- Single File Component形式（.vue）
- Options API使用
- コンポーネント名: ケバブケース（HTML）、パスカルケース（JS）
- イベントハンドラ: `@click`、`@keyup.enter`などのショートハンド使用

### JavaScript
- セミコロンなし（Prettier設定）
- シングルクォート使用
- アロー関数の括弧: 引数1つの場合は省略（`avoid`）

### CSS
- クラス名: ケバブケース
- BEM記法は使用せず、シンプルな命名
- 優先度の色: 高=赤(#ef4444)、中=黄(#f59e0b)、低=緑(#10b981)

## テストポリシー

### カバレッジ目標
- 主要メソッド: 80%以上
- 重要機能（addTodo、deleteTodo、toggleComplete等）: 100%

### テスト対象
- ✅ TODO追加（通常/空入力/優先度付き）
- ✅ TODO削除
- ✅ TODO編集
- ✅ 完了状態の切り替え
- ✅ 優先度設定
- ✅ フィルタリング（全て/未完了/完了済み）
- ✅ カウント機能
- ✅ LocalStorage連携

### テスト実行
```bash
npm run test              # 全テスト実行
npm run test:ui           # Vitest UI（推奨）
npm run test:coverage     # カバレッジレポート
```

## 開発ワークフロー

1. **開発開始**
   ```bash
   npm install
   npm run dev
   ```

2. **コード変更後**
   ```bash
   npm run lint          # 静的テスト
   npm run test          # ユニットテスト
   ```

3. **本番ビルド**
   ```bash
   npm run build
   npm run preview       # ビルド結果確認
   ```

## 今後の改修時の注意事項

### 機能追加時
1. src/App.vueにロジックを追加
2. src/__tests__/App.test.jsにテストケースを追加
3. テストが通ることを確認してからコミット

### コンポーネント分割を検討すべきタイミング
- App.vueが500行を超えた場合
- 新機能（例: カテゴリ機能、タグ機能）を追加する場合
- 推奨分割案:
  - TodoItem.vue（個別TODO表示）
  - TodoInput.vue（入力フォーム）
  - TodoFilter.vue（フィルタボタン）

### Composition APIへの移行を検討すべきタイミング
- 複数コンポーネント間での状態共有が必要になった場合
- ロジックの再利用性を高めたい場合
- TypeScriptを導入する場合

## 既知の制約・トレードオフ

### LocalStorageの制限
- 容量: 通常5-10MB（ブラウザ依存）
- セキュリティ: クライアントサイドのみ、暗号化なし
- 同期: 同一ブラウザ内でのみ共有、デバイス間同期なし

### 現在実装していない機能
- バックエンド連携
- ユーザー認証
- 複数デバイス間の同期
- カテゴリ/タグ機能
- 期限設定
- 並び替え機能
- インポート/エクスポート
- E2Eテスト（ユーザー希望により未実装）
- CI/CD（ユーザー希望により未実装）

## 技術的負債

現時点ではなし。クリーンな状態で開始。

## 参考資料

- [Vue.js 3 公式ドキュメント](https://ja.vuejs.org/)
- [Vite 公式ドキュメント](https://ja.vitejs.dev/)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

## バージョン履歴

### v1.0.0 (2025-12-24)
- 初回リリース
- 基本機能実装（追加・削除・編集・完了・優先度・フィルタリング）
- Vite + Vue.js 3へ移行
- テスト自動化実装（静的テスト + ユニットテスト）
