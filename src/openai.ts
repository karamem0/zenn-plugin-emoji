//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import OpenAI, { AzureOpenAI } from 'openai';
import path from 'path';
import { ChatRequestArray, ChatResponseArray } from './type';

dotenv.config({ path: [ '.env', '.env.local' ], quiet: true });

let openai: OpenAI;

function createOpenAI(): OpenAI {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  if (
    process.env.AZURE_OPENAI_API_KEY &&
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.OPENAI_API_VERSION
  ) {
    return new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.OPENAI_API_VERSION,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT
    });
  }
  if (
    process.env.AZURE_CLIENT_ID &&
    process.env.AZURE_CLIENT_SECRET &&
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_TENANT_ID &&
    process.env.OPENAI_API_VERSION
  ) {
    return new AzureOpenAI({
      apiVersion: process.env.OPENAI_API_VERSION,
      azureADTokenProvider: getBearerTokenProvider(
        new ClientSecretCredential(
          process.env.AZURE_TENANT_ID,
          process.env.AZURE_CLIENT_ID,
          process.env.AZURE_CLIENT_SECRET
        ),
        'https://cognitiveservices.azure.com/.default'
      ),
      endpoint: process.env.AZURE_OPENAI_ENDPOINT
    });
  }
  throw new Error('Cannot create an instance of OpenAI');
}

export async function callOpenAI(items: ChatRequestArray): Promise<ChatResponseArray> {
  if (process.env.OPENAI_MODEL_NAME == null) {
    throw new Error('Model name is required');
  }
  if (openai == null) {
    openai = createOpenAI();
  }
  const completion = await openai.chat.completions.create({
    messages: [
      {
        content: await readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8'),
        role: 'system'
      },
      {
        content: JSON.stringify({ value: items }),
        role: 'user'
      }
    ],
    model: process.env.OPENAI_MODEL_NAME,
    response_format: {
      type: 'json_object'
    }
  });
  const content = completion.choices[0].message.content;
  if (content == null) {
    throw new Error('No content in the response');
  }
  return JSON.parse(content).value as ChatResponseArray;
}
