//
// Copyright (c) 2024-2025 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readFile, writeFile } from 'fs/promises';
import { ChatResponseArray } from './type';
import path from 'path';
import { tmpdir } from 'os';

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
