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
import { readFile, writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { program } from 'commander';

dotenv.config({ path: ['.env', '.env.local'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ChatResponse {
  emoji: string,
  reason: string
}

interface CommandOptions {
  force?: boolean,
  update?: boolean,
  useLastExec?: boolean
}

interface LastExecLogItem {
  file: string,
  emoji: string,
  reason: string
}

type LastExecLog = LastExecLogItem[];

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

async function callOpenAI(text: string): Promise<ChatResponse> {
  if (!openai) throw new Error('OpenAI is not initialized');
  if (!text) throw new Error('Text is required');
  const completion = await openai.chat.completions.create({
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
  });
  return JSON.parse(completion.choices[0].message.content) as ChatResponse;
}

async function readPrompt(): Promise<string> {
  return await readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8');
}

async function readLastExecLog(): Promise<LastExecLog> {
  try {
    return JSON.parse(await readFile(path.join(__dirname, 'lastexeclog.json'), 'utf-8'));
  } catch {
    return [];
  }
}

async function writeLastExecLog(value: LastExecLog): Promise<void> {
  await writeFile(path.join(__dirname, 'lastexeclog.json'), JSON.stringify(value), 'utf-8');
}

const openai = createOpenAI();
const prompt = await readPrompt();
const lastExecLog = await readLastExecLog();

program
  .version(process.env.npm_package_version)
  .argument('<files...>', 'The target files')
  .option('-f, --force', 'Force to update the target files')
  .option('-l, --use-last-exec', 'Use last executed values')
  .option('-u, --update', 'Update the target files')
  .action(async (files: string[], options: CommandOptions) => {
    const { force, update, useLastExec } = options;
    await Promise.all(await Promise.all(files
      .map(async (file) => {
        try {
          return {
            file,
            text: await readFile(file, 'utf-8')
          };
        } catch (error) {
          console.error(`${file}: failed to read file\n${error instanceof Error ? error.message : error}`);
        }
      }))
      .then(items => items.filter(({ text }) => force || /emoji: ""/u.test(text)))
      .then(async items => await Promise.all(items.map(async ({ file, text }) => {
        try {
          return {
            file,
            text,
            ...useLastExec
              ? lastExecLog.find(item => item.file === file)
              : await callOpenAI(text)
          };
        } catch (error) {
          console.error(`${file}: failed to call OpenAI API\n${error instanceof Error ? error.message : error}`);
        }
      })))
      .then(items => items.filter(({ emoji }) => emoji))
      .then(items => items.map(async ({ file, text, emoji, reason }) => {
        try {
          console.log(`${file}: ${emoji} ${reason}`);
          if (update) await writeFile(file, text.replace(/emoji: ".*"/u, `emoji: "${emoji}"`), 'utf-8');
          return {
            file,
            emoji,
            reason
          };
        } catch (error) {
          console.error(`${file}: failed to write file\n${error instanceof Error ? error.message : error}`);
        }
      })))
      .then(async items => !useLastExec && await writeLastExecLog(items))
      .catch(error => console.error(error instanceof Error ? error.message : error));
  })
  .parse(process.argv);
