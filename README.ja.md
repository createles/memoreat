# Memoreat

[ [English Documentation](README.md) ]

Memoreatは、食事の記録、カロリー、栄養情報をトラッキングし、振り返りを通じてマインドフルな食事を促すコンテナ化された食事記録アプリケーションです。PostgreSQLデータベースと共にDockerを使用してパッケージ化されており、モダンなフルスタックアプリケーションのコンテナ化を実践しています。

## 主な機能

- **食事の記録**: 食べ物の名前、カロリー、マクロ栄養素、個人的な振り返りを記録します。
- **ダッシュボード**: 栄養摂取量の視覚的なサマリーを提供します。
- **履歴**: 過去の食事記録と思い出を表示します。

## 技術スタック

- **フロントエンド/バックエンド**: Next.js (App Router, Server Actions)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: PostgreSQL, Prisma ORM
- **コンテナ化**: Docker (マルチステージビルド), Docker Compose

## 前提条件

- [Docker](https://docs.docker.com/get-docker/) のインストール
- [Docker Compose](https://docs.docker.com/compose/install/) のインストール

## 始め方

### 1. リポジトリのクローン
```bash
git clone <your-repo-url>
cd memoreat
```

### 2. 環境変数の設定
ルートディレクトリに `.env` ファイルを作成し、必要な変数を追加します:
```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=memoreatdb
DATABASE_URL="postgresql://myuser:mypassword@db:5432/memoreatdb?schema=public"
```

### 3. ローカル開発環境
ホットリロード付きの開発モードでアプリを実行するには:
```bash
docker-compose up
```
アプリケーションは [http://localhost:3000](http://localhost:3000) でアクセス可能になります。

### 4. 本番環境デプロイ
最適化された本番用コンテナをビルドして実行するには:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```
これはマルチステージのDockerfileを利用してイメージサイズを最小限に抑え、サービスをバックグラウンドで開始します。

## データベース管理
データはDockerボリューム（`postgres-data`）に永続化されます。データベースをリセットする必要がある場合は:
```bash
docker-compose down -v
```

## CI/CD
このプロジェクトでは、mainブランチへのマージ時にDockerイメージを自動的にビルドしてレジストリにプッシュするGitHub Actionsを使用しています。
