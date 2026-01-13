//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

export type ChatRequest = {
  file: string,
  text: string
};

export type ChatRequestArray = ChatRequest[];

export type ChatResponse = {
  file: string,
  emoji: string,
  reason: string
};

export type ChatResponseArray = ChatResponse[];
