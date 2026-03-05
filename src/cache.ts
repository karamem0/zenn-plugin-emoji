//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { ChatResponseArray } from './type';

const cacheFile = path.join(tmpdir(), 'zenn-plugin-emoji.json');

export async function readCacheFile(): Promise<ChatResponseArray> {
  try {
    return JSON.parse(await readFile(cacheFile, 'utf-8'));
  } catch {
    return [];
  }
}

export async function writeCacheFile(value: ChatResponseArray): Promise<void> {
  await writeFile(cacheFile, JSON.stringify(value), 'utf-8');
}
