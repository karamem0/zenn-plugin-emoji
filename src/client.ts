//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import Anthropic from '@anthropic-ai/sdk';
import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import OpenAI, { AzureOpenAI } from 'openai';
import path from 'path';
import {
  ChatClient,
  ChatRequestArray,
  ChatResponseArray
} from './type';

dotenv.config({ path: [ '.env', '.env.local' ], quiet: true });

export function createChatClient(): ChatClient {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIAgent(new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    }));
  }
  if (
    process.env.AZURE_OPENAI_API_KEY &&
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.OPENAI_API_VERSION
  ) {
    return new OpenAIAgent(new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.OPENAI_API_VERSION,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT
    }));
  }
  if (
    process.env.AZURE_CLIENT_ID &&
    process.env.AZURE_CLIENT_SECRET &&
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_TENANT_ID &&
    process.env.OPENAI_API_VERSION
  ) {
    return new OpenAIAgent(new AzureOpenAI({
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
    }));
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicAgent(new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    }));
  }
  throw new Error('Cannot create an instance of OpenAI');
}

class OpenAIAgent implements ChatClient {

  private readonly openai: OpenAI;

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async chatCompletion(items: ChatRequestArray): Promise<ChatResponseArray> {
    if (process.env.OPENAI_MODEL_NAME == null) {
      throw new Error('Model name is required');
    }
    const completion = await this.openai.chat.completions.create({
      max_completion_tokens: 16384,
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
    const choice = completion.choices[0];
    if (choice?.finish_reason === 'length') {
      throw new Error('The response was truncated because it exceeded the maximum number of tokens');
    }
    const content = choice?.message?.content;
    if (content == null) {
      throw new Error('No content in the response');
    }
    return JSON.parse(content).value as ChatResponseArray;
  }

}

class AnthropicAgent implements ChatClient {

  private readonly anthropic: Anthropic;

  constructor(anthropic: Anthropic) {
    this.anthropic = anthropic;
  }

  async chatCompletion(items: ChatRequestArray): Promise<ChatResponseArray> {
    if (process.env.ANTHROPIC_MODEL_NAME == null) {
      throw new Error('Model name is required');
    }
    const messages = await this.anthropic.messages.create({
      max_tokens: 16384,
      messages: [
        {
          content: JSON.stringify({ value: items }),
          role: 'user'
        }
      ],
      model: process.env.ANTHROPIC_MODEL_NAME,
      output_config: {
        format: {
          schema: {
            additionalProperties: false,
            properties: {
              value: {
                items: {
                  additionalProperties: false,
                  properties: {
                    emoji: { type: 'string' },
                    file: { type: 'string' },
                    reason: { type: 'string' }
                  },
                  required: [ 'file', 'emoji', 'reason' ],
                  type: 'object'
                },
                type: 'array'
              }
            },
            required: [ 'value' ],
            type: 'object'
          },
          type: 'json_schema'
        }
      },
      system: await readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8')
    });
    if (messages.stop_reason === 'max_tokens') {
      throw new Error('The response was truncated because it exceeded the maximum number of tokens');
    }
    const content = messages.content.find((item) => item.type === 'text');
    if (content == null) {
      throw new Error('No content in the response');
    }
    return JSON.parse(content.text).value as ChatResponseArray;
  }

}
