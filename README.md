# zenn-plugin-emoji

[![.github/workflows/workflow.yml](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/workflow.yml/badge.svg)](https://github.com/karamem0/zenn-plugin-emoji/actions/workflows/workflow.yml)
[![License](https://img.shields.io/github/license/karamem0/zenn-plugin-emoji.svg)](https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE)

[Zenn](https://zenn.dev/) のアイキャッチ絵文字を記事の内容から生成するためのプラグインです。

## 使用方法

*このプラグインでは OpenAI の GPT を使用しますが環境は提供していません。OpenAI または Azure OpenAI Service の環境をあらかじめご用意ください。*

1. パッケージをインストールします。

    ```
    npm install @karamem0/zenn-plugin-emoji
    ```

1. `.env` または `.env.local` ファイルを作成し以下の環境変数を設定します。

    |キー名|説明|OpenAI|Azure OpenAI Service|
    |-|-|-|-|
    |OPENAI_API_KEY|OpenAI の API キー|Y||
    |OPENAI_API_VERSION|OpenAI の API バージョン (`2024-05-01` など)||Y|
    |OPENAI_MODEL_NAME|OpenAI の場合はモデル名、Azure OpenAI Serviceの場合はデプロイ名|Y|Y|
    |AZURE_OPENAI_API_KEY|Azure OpenAI Service の API キー||Y|
    |AZURE_OPENAI_ENDPOINT|Azure OpenAI Service のエンドポイント||Y|

    **OpenAI の例**

    ```
    OPENAI_API_KEY=<your-openai-api-key>
    OPENAI_MODEL_NAME=<your-openai-model-name>
    ```

    **Azure OpenAI Service の例**

    ```
    AZURE_OPENAI_ENDPOINT=https://<your-aoai-resoure-name>.openai.azure.com
    AZURE_OPENAI_API_KEY=<your-aoai-api-key>
    OPENAI_API_VERSION=<your-aoai-api-version>
    OPENAI_MODEL_NAME=<your-aoai-deployment-name>
    ```

1. コマンドを実行します。

    ```
    npx zenn-emoji articles/* -u
    ```

## オプション

|短い名前|長い名前|説明|
|-|-|-|
|`-u`|`--update`|対象のファイルを更新します。|
