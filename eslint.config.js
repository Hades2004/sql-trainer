import globals from 'globals'; // We'll still need this for 'jest'
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginImport from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base ESLint recommended rules (includes common ECMAScript globals like es2021)
  js.configs.recommended,

  // Import plugin configuration
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      ...pluginImport.configs.recommended.rules,
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/prefer-default-export': 'off', // Prefer named exports
      'import/no-unresolved': 'off', // Turning off for now, can be noisy with some setups
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.cjs'],
        },
      },
    },
  },

  // Global configuration for JS/JSX files
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        // Explicitly add common browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        localStorage: 'readonly', // Added
        alert: 'readonly', // Added
        // Node.js globals (like process) can be added specifically for files that need them
        // or if the project uses Node.js features in client-side bundles (less common for 'process' itself)
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Configuration for files that might use Node.js globals like i18n.js
  {
    files: ['src/i18n.js', '*.config.js', 'vite.config.js'], // Add other config files if necessary
    languageOptions: {
      globals: {
        process: 'readonly', // Added process here
        ...globals.node, // Add other common Node.js globals for these files
      },
    },
  },

  // React specific configurations
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
    },
    rules: {
      ...(pluginReact.configs.recommended
        ? pluginReact.configs.recommended.rules
        : {}),
      ...(pluginReact.configs['jsx-runtime']
        ? pluginReact.configs['jsx-runtime'].rules
        : {}),
      ...(pluginReactHooks.configs.recommended
        ? pluginReactHooks.configs.recommended.rules
        : {}),
      ...(pluginJsxA11y.configs.recommended
        ? pluginJsxA11y.configs.recommended.rules
        : {}),

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Jest/testing specific configurations
  {
    files: ['**/*.test.js', '**/*.test.jsx', 'src/setupTests.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  prettierConfig, // Add prettierConfig as the last element
];
