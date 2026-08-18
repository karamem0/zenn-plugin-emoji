//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export default {
  'entry': './src/index.ts',
  'externals': [
    nodeExternals()
  ],
  'mode': 'production',
  'module': {
    'rules': [
      {
        'exclude': /node_modules/,
        'loader': 'babel-loader',
        'test': /\.ts$/
      }
    ]
  },
  'output': {
    'clean': true,
    'filename': 'index.js',
    'path': path.resolve(import.meta.dirname, 'dist')
  },
  'plugins': [
    new webpack.BannerPlugin(
      {
        'banner': '#!/usr/bin/env node',
        'raw': true
      }
    ),
    new CopyPlugin({
      'patterns': [
        {
          'from': 'src/skills',
          'to': 'skills'
        }
      ]
    })
  ],
  'resolve': {
    'extensions': [ '.ts', '.js' ]
  },
  'target': 'node'
};
