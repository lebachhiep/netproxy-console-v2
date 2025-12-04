// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { globalIgnores } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: path.resolve()
});

export default tseslint.config([
  globalIgnores(['dist', 'node_modules']),

  // Load old-style configs through compat so they work with ESLint 9
  ...compat.extends('plugin:react/recommended', 'plugin:react-hooks/recommended'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier
    },

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended // TypeScript
      // React + Hooks now loaded via compat above
    ],

    rules: {
      ...prettier.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    },

    settings: {
      react: { version: 'detect' }
    }
  }
]);
