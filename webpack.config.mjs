//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import CopyPlugin from 'copy-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

export default {
  'entry': './src/index.ts',
  'output': {
    'clean': true,
    'filename': 'index.js',
    'path': path.resolve(import.meta.dirname, 'dist')
  },
  'target': 'node',
  'mode': 'production',
  'externals': [
    nodeExternals()
  ],
  'resolve': {
    'extensions': [ '.ts', '.js' ]
  },
  'module': {
    'rules': [
      {
        'test': /\.ts$/,
        'exclude': /node_modules/,
        'loader': 'babel-loader'
      }
    ]
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
  ]
};
