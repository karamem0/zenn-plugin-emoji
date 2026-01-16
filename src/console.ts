//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

export class ConsoleLogger {

  private formatter = new Intl.DateTimeFormat(
    'ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  );

  constructor(private quiet: boolean) {}

  public error(message?: string): void {
    if (!this.quiet) {
      console.error(`[${this.formatter.format(new Date())}] ${message}`);
    }
  }

  public log(message?: string): void {
    if (!this.quiet) {
      console.log(`[${this.formatter.format(new Date())}] ${message}`);
    }
  }

}
