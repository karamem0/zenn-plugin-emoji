//
// Copyright (c) 2024-2025 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';

type CacheLogItem = {
  file: string,
  emoji: string,
  reason: string
};

type CacheLog = CacheLogItem[];

const cacheFile = path.join(tmpdir(), 'zenn-plugin-emoji.json');

export async function readCacheLog(): Promise<CacheLog> {
  try {
    return JSON.parse(await readFile(cacheFile, 'utf-8'));
  } catch {
    return [];
  }
}

export async function writeCacheLog(value: CacheLog): Promise<void> {
  await writeFile(cacheFile, JSON.stringify(value), 'utf-8');
}
