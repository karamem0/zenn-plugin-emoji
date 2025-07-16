//
// Copyright (c) 2024-2025 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readFile, writeFile } from 'fs/promises';
import path from 'path';

type CacheLogItem = {
  file: string,
  emoji: string,
  reason: string
};

type CacheLog = CacheLogItem[];

export async function readCacheLog(): Promise<CacheLog> {
  try {
    return JSON.parse(await readFile(path.join(__dirname, 'cache.json'), 'utf-8'));
  } catch {
    return [];
  }
}

export async function writeCacheLog(value: CacheLog): Promise<void> {
  await writeFile(path.join(__dirname, 'cache.json'), JSON.stringify(value), 'utf-8');
}
