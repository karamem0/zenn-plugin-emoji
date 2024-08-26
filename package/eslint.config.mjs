//
// Copyright (c) 2024 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  stylistic.configs['recommended-flat'],
  {
    'files': [
      '**/*.{js,mjs,cjs,ts}'
    ],
    'ignores': [
      'dist/'
    ],
    'languageOptions': {
      'globals': {
        ...globals.node,
        ...globals.jest
      }
    },
    'rules': {
      'sort-imports': 'error',
      '@stylistic/brace-style': [
        'error',
        '1tbs'
      ], '@stylistic/comma-dangle': [
        'error',
        'never'
      ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          'multiline': {
            'delimiter': 'comma',
            'requireLast': false
          },
          'singleline': {
            'delimiter': 'comma',
            'requireLast': false
          }
        }
      ],
      '@stylistic/quote-props': [
        'error',
        'consistent'
      ],
      '@stylistic/semi': [
        'error',
        'always'
      ]
    }
  }
];
