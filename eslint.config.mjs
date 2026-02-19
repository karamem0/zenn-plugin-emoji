//
// Copyright (c) 2024-2026 karamem0
//
// This software is released under the MIT License.
//
// https://github.com/karamem0/zenn-plugin-emoji/blob/main/LICENSE
//

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
  js.configs.recommended,
  ts.configs.recommended,
  globalIgnores([
    'dist/**'
  ]),
  {
    'languageOptions': {
      'globals': {
        ...globals.node
      }
    },
    'plugins': {
      '@stylistic': stylistic,
      'perfectionist': perfectionist
    }
  },
  {
    'rules': {
      '@stylistic/array-bracket-spacing': [
        'error',
        'always',
        {
          'arraysInArrays': false
        }
      ],
      '@stylistic/arrow-parens': [
        'error',
        'always'
      ],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/brace-style': [
        'error',
        '1tbs'
      ],
      '@stylistic/comma-dangle': [
        'error',
        'never'
      ],
      '@stylistic/indent': [
        'error',
        2
      ],
      '@stylistic/indent-binary-ops': [
        'error',
        2
      ],
      '@stylistic/jsx-closing-bracket-location': [
        'error',
        'after-props'
      ],
      '@stylistic/jsx-first-prop-new-line': [
        'error',
        'multiline'
      ],
      '@stylistic/jsx-indent-props': [
        'error',
        2
      ],
      '@stylistic/jsx-max-props-per-line': [
        'error',
        {
          'maximum': 1
        }
      ],
      '@stylistic/jsx-tag-spacing': [
        'error',
        {
          'beforeSelfClosing': 'always'
        }
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
      '@stylistic/multiline-ternary': [
        'error',
        'never'
      ],
      '@stylistic/operator-linebreak': [
        'error',
        'after',
        {
          'overrides': {
            '&': 'before',
            '|': 'before'
          }
        }
      ],
      '@stylistic/padded-blocks': 'off',
      '@stylistic/quote-props': [
        'error',
        'consistent'
      ],
      '@stylistic/quotes': [
        'error',
        'single'
      ],
      '@stylistic/semi': [
        'error',
        'always'
      ],
      '@typescript-eslint/array-type': [
        'error',
        {
          'default': 'array'
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'varsIgnorePattern': '^_'
        }
      ],
      'dot-notation': [
        'error',
        {
          'allowPattern': '^[a-z]+(_[a-z]+)+$'
        }
      ],
      'key-spacing': [
        'error',
        {
          'afterColon': true
        }
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'no-alert': 'error',
      'no-console': [
        'warn',
        {
          'allow': [
            'error'
          ]
        }
      ],
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-var': 'error',
      'perfectionist/sort-imports': [
        'error',
        {
          'newlinesBetween': 'ignore',
          'newlinesInside': 'ignore',
          'partitionByNewLine': true,
          'type': 'natural'
        }
      ],
      'perfectionist/sort-interfaces': [
        'error',
        {
          'customGroups': [
            {
              'elementNamePattern': '^on.+',
              'groupName': 'callback'
            }
          ],
          'groups': [
            'unknown',
            'method',
            'callback'
          ],
          'newlinesBetween': 'ignore',
          'newlinesInside': 'ignore',
          'partitionByNewLine': true,
          'type': 'natural'
        }
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          'customGroups': [
            {
              'elementNamePattern': '^on.+',
              'groupName': 'callback'
            }
          ],
          'groups': [
            'shorthand-prop',
            'unknown',
            'multiline-prop',
            'callback'
          ],
          'newlinesBetween': 'ignore',
          'newlinesInside': 'ignore',
          'partitionByNewLine': true,
          'type': 'natural'
        }
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          'customGroups': [
            {
              'elementNamePattern': '^on.+',
              'groupName': 'callback'
            }
          ],
          'groups': [
            'unknown',
            'method',
            'callback'
          ],
          'newlinesBetween': 'ignore',
          'newlinesInside': 'ignore',
          'partitionByNewLine': true,
          'type': 'natural'
        }
      ],
      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'never',
          'asyncArrow': 'always',
          'named': 'never'
        }
      ]
    }
  }
);
