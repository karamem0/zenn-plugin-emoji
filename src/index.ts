#!/usr/bin/env node

//
// Copyright (c) 2024 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { AzureOpenAI, OpenAI } from 'openai';
import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';

dotenv.config({ path: ['.env', '.env.local'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createOpenAI(): OpenAI {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  if (
    process.env.AZURE_OPENAI_API_KEY
    && process.env.AZURE_OPENAI_ENDPOINT
    && process.env.OPENAI_API_VERSION
  ) {
    return new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.OPENAI_API_VERSION,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT
    });
  }
  if (
    process.env.AZURE_CLIENT_ID
    && process.env.AZURE_CLIENT_SECRET
    && process.env.AZURE_OPENAI_ENDPOINT
    && process.env.AZURE_TENANT_ID
    && process.env.OPENAI_API_VERSION
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
}

program
  .version(process.env.npm_package_version)
  .argument('<files...>', 'The target files')
  .option('-u, --update', 'Update the target files')
  .action(async (files: string[], option: { update: boolean }) => {
    const prompt = await fs.promises.readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8');
    const openai = createOpenAI();
    files.forEach(async (file) => {
      try {
        const text = await fs.promises.readFile(file, 'utf-8');
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: 'system',
                content: prompt
              },
              {
                role: 'user',
                content: text
              }
            ],
            model: process.env.OPENAI_MODEL_NAME,
            response_format: {
              type: 'json_object'
            }
          }
        );
        const content = JSON.parse(completion.choices[0].message.content);
        console.log(`${file}: ${content.emoji} ${content.reason}`);
        if (option.update) {
          await fs.promises.writeFile(file, text.replace(/emoji: ".*"/u, `emoji: "${content.emoji}"`), 'utf-8');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`${file}: ${error.message}`);
        }
      }
    });
  })
  .parse(process.argv);
