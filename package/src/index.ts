#!/usr/bin/env node

//
// Copyright (c) 2024 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { AzureOpenAI, OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';

dotenv.config({ path: ['.env', '.env.local'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .version(process.env.npm_package_version)
  .argument('<files...>', 'The target files')
  .option('-u, --update', 'Update the target files')
  .action(async (files: string[], option: { update: boolean }) => {
    const prompt = await fs.promises.readFile(path.join(__dirname, 'skills/skprompt.txt'), 'utf-8');
    const openai = process.env.OPENAI_API_KEY
      ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
      : new AzureOpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: process.env.OPENAI_API_VERSION,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT
      });
    files.forEach(async (file) => {
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
      console.log(`${file}: ${content.emoji}`);
      if (option.update) {
        await fs.promises.writeFile(file, text.replace(/emoji: ".*"/u, `emoji: "${content.emoji}"`), 'utf-8');
      }
    });
  })
  .parse(process.argv);
