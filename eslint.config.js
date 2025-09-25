// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended, // TypeScript support
      react.configs.recommended, // React rules
      reactHooks.configs.recommended
    ],
    rules: {
      ...prettier.configs.recommended.rules // Prettier integration
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]);
