#!/usr/bin/env node

//
// Copyright (c) 2024-2025 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readCacheLog, writeCacheLog } from './cache';
import { readFile, writeFile } from 'fs/promises';
import { callOpenAI } from './openai';
import { chunk } from './utils';
import { glob } from 'glob';
import { program } from 'commander';

type CommandOptions = {
  force?: boolean,
  update?: boolean,
  cache?: boolean,
  quiet?: boolean,
  batchSize?: number
};

async function processCommand(files: string[], options: CommandOptions): Promise<void> {
  const { force, update, cache, quiet, batchSize } = options;
  const cacheLog = await readCacheLog();
  if (files.length === 0) {
    files = glob.sync('articles/*.md');
    if (!quiet) {
      console.log('No files specified. Using default files: articles/*.md');
    }
  }
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
    .then((items) => items.filter((item) => item != null))
    .then((items) => items.filter(({ text }) => force || /emoji: ""/u.test(text)))
    .then((items) => items.map(({ file, text }) => ({
      file,
      text,
      ...(cache ? cacheLog.find((log) => log.file === file) : undefined)
    })))
    .then(async (items) => {
      const values = await Promise.all(
        chunk(items.filter(({ emoji }) => emoji == null), batchSize ?? 10)
          .map(async (batch) => {
            try {
              return callOpenAI(batch);
            } catch (error) {
              console.error(`failed to call OpenAI API\n${error instanceof Error ? error.message : error}`);
              return [];
            }
          }));
      return items.map((item) => ({
        ...item,
        ...(item.emoji == null ? values.flat().find((value) => value.file === item.file) : undefined)
      }));
    })
    .then((items) => items.filter((item): item is Required<typeof item> => item.emoji != null && item.reason != null))
    .then((items) => items
      .map(async ({ file, text, emoji, reason }) => {
        try {
          if (!quiet) {
            console.log(`${file}: ${emoji} ${reason}`);
          }
          if (update) {
            await writeFile(file, text.replace(/emoji: ".*"/u, `emoji: "${emoji}"`), 'utf-8');
          }
          return {
            file,
            emoji,
            reason
          };
        } catch (error) {
          console.error(`${file}: failed to write file\n${error instanceof Error ? error.message : error}`);
        }
      })))
    .then((items) => items.filter((item) => item != null))
    .then(async (items) => !cache && await writeCacheLog(items))
    .catch((error) => console.error(error instanceof Error ? error.message : error));
}

program
  .version(process.env.npm_package_version ?? '0.0.0')
  .argument('[files...]', 'The target files')
  .option('-f, --force', 'Force to update the target files')
  .option('-u, --update', 'Update the target files')
  .option('-c, --cache', 'Reuse cached results from last execution')
  .option('-q, --quiet', 'Suppress output messages', false)
  .option('-b, --batch-size <number>', 'Set the batch size', '10')
  .action(processCommand)
  .parse(process.argv);
