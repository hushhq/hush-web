import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

// Stub plugin for rules referenced in eslint-disable comments that come from
// frameworks this project does not use. Defining the rule as off suppresses
// "Definition for rule was not found" without altering source files.
const nextStubPlugin = {
  rules: {
    'no-img-element': { create: () => ({}) },
  },
};

const sharedLanguageOptions = {
  globals: {
    ...globals.browser,
    ...globals.node,
  },
};

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'dist-admin/',
      'node_modules/',
      'e2e/test-results/',
      'public/',
      'scripts/',
      'coverage/',
    ],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ...sharedLanguageOptions,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ...sharedLanguageOptions,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      // Stub avoids "Definition for rule was not found" for
      // eslint-disable comments left from a prior Next.js migration.
      '@next/next': nextStubPlugin,
    },
    // Use only the two classic hook-correctness rules; the v7 plugin's
    // recommended config also enables React Compiler rules which this
    // project does not opt into.
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'off',
    },
  },
);
