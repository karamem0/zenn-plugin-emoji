//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readCacheFile, writeCacheFile } from './cache';
import { readFile, writeFile } from 'fs/promises';
import { ConsoleLogger } from './console';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { callOpenAI } from './openai';
import { chunk } from './utils';
import { glob } from 'glob';
import { program } from 'commander';
import { z } from 'zod';

type CommandOptions = {
  force?: boolean,
  update?: boolean,
  cache?: boolean,
  quiet?: boolean,
  batchSize?: number,
  mcpServer?: boolean
};

const version = process.env.npm_package_version ?? '0.0.0';

async function processMcpServer(): Promise<void> {
  const server = new McpServer({
    name: 'zenn-plugin-emoji',
    version
  });
  server.registerTool(
    'generate-emoji',
    {
      description: 'Generate the most suitable eye-catching emoji (one character) for articles on Zenn (https://zenn.dev)',
      inputSchema: {
        file: z.string().describe('The file path of the markdown file'),
        text: z.string().describe('The content of the markdown file')
      }
    },
    async (value) => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await callOpenAI([ value ]))
          }
        ]
      };
    });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function processCommand(files: string[], options: CommandOptions): Promise<void> {
  const { force, update, cache, quiet, batchSize } = options;
  const logger = new ConsoleLogger(quiet ?? false);
  const caches = await readCacheFile();
  if (files.length === 0) {
    files = glob.sync('articles/*.md');
    logger.log('No files specified. Using default files: articles/*.md');
  }
  await Promise.all(await Promise.all(files
    .map(async (file) => {
      try {
        return {
          file,
          text: await readFile(file, 'utf-8')
        };
      } catch (error) {
        logger.error(`${file}: failed to read file\n${error instanceof Error ? error.message : error}`);
      }
    }))
    .then((items) => items.filter((item) => item != null))
    .then((items) => items.filter(({ text }) => force || /emoji: ""/u.test(text)))
    .then((items) => items.map(({ file, text }) => ({
      file,
      text,
      ...caches.find((item) => item.file === file)
    })))
    .then(async (items) => {
      const values = await Promise.all(
        chunk(items.filter(({ emoji }) => !cache || emoji == null), batchSize ?? 10)
          .map(async (items) => {
            try {
              return callOpenAI(items);
            } catch (error) {
              logger.error(`failed to call OpenAI API\n${error instanceof Error ? error.message : error}`);
              return [];
            }
          }));
      return items.map((item) => ({
        ...item,
        ...values.flat().find((value) => value.file === item.file)
      }));
    })
    .then((items) => items.filter((item): item is Required<typeof item> => item.emoji != null && item.reason != null))
    .then((items) => items
      .map(async ({ file, text, emoji, reason }) => {
        try {
          logger.log(`${file}: ${emoji} ${reason}`);
          if (update) {
            await writeFile(file, text.replace(/emoji: ".*"/u, `emoji: "${emoji}"`), 'utf-8');
          }
          return {
            file,
            emoji,
            reason
          };
        } catch (error) {
          logger.error(`${file}: failed to write file\n${error instanceof Error ? error.message : error}`);
        }
      })))
    .then((items) => items.filter((item) => item != null))
    .then(async (items) => !cache && await writeCacheFile(items))
    .catch((error) => logger.error(error instanceof Error ? error.message : error));
}

program
  .version(version)
  .argument('[files...]', 'The target files')
  .option('-f, --force', 'Force to update the target files')
  .option('-u, --update', 'Update the target files')
  .option('-c, --cache', 'Reuse cached results from last execution')
  .option('-q, --quiet', 'Suppress output messages', false)
  .option('-b, --batch-size <number>', 'Set the batch size', '10')
  .addOption(program
    .createOption('-s, --mcp-server', 'Launch MCP server')
    .default(false)
    .conflicts([ 'force', 'update', 'cache', 'quiet', 'batchSize' ]))
  .action(async (files: string[], options: CommandOptions) => {
    const { mcpServer } = options;
    if (mcpServer) {
      await processMcpServer();
    } else {
      await processCommand(files, options);
    }
  })
  .parse(process.argv);
