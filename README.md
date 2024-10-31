# zenn-plugin-emoji

[![.github/workflows/workflow.yml](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/workflow.yml/badge.svg)](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/workflow.yml)
[![License](https://img.shields.io/github/license/karamem0/zenn-plugin-emoji.svg)](https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE)

[Zenn](https://zenn.dev/) のアイキャッチ絵文字を記事の内容から生成するためのプラグインです。

## 使用方法

*このプラグインでは OpenAI の GPT を使用しますが環境は提供していません。OpenAI または Azure OpenAI Service の環境をあらかじめご用意ください。また、このプラグインを実行したことによるいかなる損害も責任を負いません。*

1. Zenn の GitHub 連携を行っているリポジトリにパッケージをインストールします。

    ```
    npm install @karamem0/zenn-plugin-emoji
    ```

1. `.env` または `.env.local` ファイルを作成し以下の環境変数を設定します。

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

        ```
        AZURE_CLIENT_ID=<your-app-client-id>
        AZURE_CLIENT_SECRET=<your-app-client-secret>
        AZURE_TENANT_ID=<your-app-tenant-id>
        AZURE_OPENAI_ENDPOINT=https://<your-aoai-resoure-name>.openai.azure.com
        OPENAI_API_VERSION=<your-aoai-api-version>
        OPENAI_MODEL_NAME=<your-aoai-deployment-name>
        ```

        Entra ID アプリケーションに対して **Cognitive Services OpenAI User** のロールの割り当てが必要です。

1. コマンドを実行します。

    ```
    npx zenn-emoji articles/* -u
    ```

    既定ではアイキャッチ絵文字が空欄の場合のみ更新します。アイキャッチ絵文字が設定されているファイルも更新したい場合は `-f` オプションを追加してください。

## オプション

|短い名前|長い名前|説明|
|-|-|-|
|`-u`|`--update`|対象のファイルを更新します。|
|`-f`|`--force`|アイキャッチ絵文字が設定されているファイルの更新を強制します。|
