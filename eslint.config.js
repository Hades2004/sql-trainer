import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSecurity from 'eslint-plugin-security';
import pluginSonarJs from 'eslint-plugin-sonarjs'; // Added SonarJS
import globals from 'globals'; // We'll still need this for 'jest'

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // Security plugin configuration
  {
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      ...pluginSecurity.configs.recommended.rules,
    },
  },

  // Import plugin configuration
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      ...pluginImport.configs.recommended.rules,
      'import/order': [
        'error',
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
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
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
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Configuration for files that might use Node.js globals
  {
    files: ['src/i18n.js', '*.config.js', 'vite.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
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
      'react/prop-types': 'error',
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

  // SonarJS plugin configuration
  {
    files: ['src/**/*.{js,jsx}'], // Apply to main source files
    plugins: {
      sonarjs: pluginSonarJs,
    },
    rules: {
      ...pluginSonarJs.configs.recommended.rules,
      'sonarjs/prefer-single-boolean-return': 'off', // Disabled globally
      // Example: Adjust cognitive complexity threshold if default (15) is too low/high
      // 'sonarjs/cognitive-complexity': ['warn', 20],
      // Example: Disable a rule if not desired
      // 'sonarjs/no-duplicate-string': 'off',
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
      'no-unused-vars': 'off', // Often prefer to allow unused vars in tests
    },
  },

  // Prettier config must be last
  prettierConfig,
];
