import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'build']),
  {
    files: ['**/*.{ts,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      'plugin:prettier/recommended',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...js.configs.recommended.languageOptions.globals,
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
