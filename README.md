# zenn-plugin-emoji

[![.github/workflows/trigger-on-main.yml](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/trigger-on-main.yml/badge.svg)](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/trigger-on-main.yml)
[![License](https://img.shields.io/github/license/karamem0/zenn-plugin-emoji.svg)](https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE)

[Zenn](https://zenn.dev/) のアイキャッチ絵文字を記事の内容から生成するためのプラグインです。

## 事前準備

*このプラグインでは OpenAI の GPT を使用しますが環境は提供していません。OpenAI または Azure OpenAI Service の環境をあらかじめご用意ください。また、このプラグインを実行したことによるいかなる損害も責任を負いません。*

Zenn の GitHub 連携を行っているリポジトリにパッケージをインストールします。

```
npm install @karamem0/zenn-plugin-emoji
```

`.env` または `.env.local` ファイルを作成し以下の環境変数を設定します。

|キー名|説明|OpenAI|Azure OpenAI Service (API キー)|Azure OpenAI Service (Entra ID アプリケーション)|
|-|-|-|-|-|
|OPENAI_API_KEY|OpenAI の API キー|X|||
|OPENAI_API_VERSION|OpenAI の API バージョン (`2024-05-01` など)||X|X|
|OPENAI_MODEL_NAME|OpenAI の場合はモデル名、Azure OpenAI Serviceの場合はデプロイ名|X|X|X|
|AZURE_OPENAI_API_KEY|Azure OpenAI Service の API キー||X||
|AZURE_OPENAI_ENDPOINT|Azure OpenAI Service のエンドポイント||X|X|
|AZURE_CLIENT_ID|Entra ID アプリケーションのクライアント ID|||X|
|AZURE_CLIENT_SECRET|Entra ID アプリケーションのクライアント シークレット|||X|
|AZURE_TENANT_ID|Entra ID アプリケーションのテナント ID|||X|

以下に OpenAI および Azure OpenAI Service 環境ごとの設定例を示します。

- **OpenAI の例**

    ```
    OPENAI_API_KEY=<your-openai-api-key>
    OPENAI_MODEL_NAME=<your-openai-model-name>
    ```

- **Azure OpenAI Service (API キー) の例**

    ```
    AZURE_OPENAI_API_KEY=<your-aoai-api-key>
    AZURE_OPENAI_ENDPOINT=https://<your-aoai-resoure-name>.openai.azure.com
    OPENAI_API_VERSION=<your-aoai-api-version>
    OPENAI_MODEL_NAME=<your-aoai-deployment-name>
    ```

- **Azure OpenAI Service (Entra ID アプリケーション) の例**

    Entra ID アプリケーションに対して **Cognitive Services OpenAI User** のロールの割り当てが必要です。

    ```
    AZURE_CLIENT_ID=<your-app-client-id>
    AZURE_CLIENT_SECRET=<your-app-client-secret>
    AZURE_TENANT_ID=<your-app-tenant-id>
    AZURE_OPENAI_ENDPOINT=https://<your-aoai-resoure-name>.openai.azure.com
    OPENAI_API_VERSION=<your-aoai-api-version>
    OPENAI_MODEL_NAME=<your-aoai-deployment-name>
    ```

## 使用方法

### アイキャッチ絵文字を生成する

既定ではアイキャッチ絵文字が存在しないファイルを対象にします。オプションを付けない場合はコンソールに結果のみを表示しファイルは更新しません。

```bash
npx zenn-emoji articles/*
articles/ebd6b7f4e118f3.md: 💻 プログラミングを学ぶというテーマからコンピュータをイメージしました。
```

### 生成したアイキャッチ絵文字でファイルを更新する

`-u` オプションを付けることで生成したアイキャッチ絵文字でファイルを更新します。

```bash
npx zenn-emoji articles/* -u
```

### 前回の結果でファイルを更新する

`-l` オプションを付けることで前回の実行結果でファイルを更新します。すぐにファイルを更新せずに結果を確認してから更新する場合におすすめです。

```bash
npx zenn-emoji articles/*       # 生成結果を確認して
npx zenn-emoji articles/* -u -l # ファイルを更新する
```

### すべてのファイルを対象にする

`-f` オプションを付けることでアイキャッチ絵文字が存在するファイルも対象にします。

```bash
npx zenn-emoji articles/* -f
articles/1d7a517be7f801.md: ⏳ 非同期処理という言葉から時間の経過をイメージしました。
articles/261cbfd985d9b8.md: 🌐 AIというテーマから、世界中に広がる技術の可能性をイメージしました。
articles/ebd6b7f4e118f3.md: 💻 プログラミングというテーマから、コンピュータをイメージしました。
```

## オプション

|短い名前|長い名前|説明|
|-|-|-|
|`-u`|`--update`|対象のファイルを更新します。|
|`-l`|`--use-last-exec`|前回の実行結果を使用します。|
|`-f`|`--force`|アイキャッチ絵文字が設定されているファイルの更新を強制します。|
|`-q`|`--quiet`|メッセージの表示を抑制します。|
