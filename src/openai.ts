//
// Copyright (c) 2024-2025 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import OpenAI, { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { readFile } from 'fs/promises';

dotenv.config({ path: [ '.env', '.env.local' ], quiet: true });

type ChatResponse = {
  emoji: string,
  reason: string
};

const openai: OpenAI = (() => {
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
      azureADTokenProvider: getBearerTokenProvider(
        new ClientSecretCredential(
          process.env.AZURE_TENANT_ID,
          process.env.AZURE_CLIENT_ID,
          process.env.AZURE_CLIENT_SECRET
        ),
        'https://cognitiveservices.azure.com/.default'
      ),
      apiVersion: process.env.OPENAI_API_VERSION,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT
    });
  }
  throw new Error('Cannot create an instance of OpenAI');
})();

export async function callOpenAI(userMessage: string): Promise<ChatResponse> {
  if (process.env.OPENAI_MODEL_NAME == null) {
    throw new Error('Model name is required');
  }
  if (userMessage == null) {
    throw new Error('User message is required');
  }
  const systemMessage = await readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8');
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: userMessage
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
  return JSON.parse(content) as ChatResponse;
}
