import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        browser: 'readonly',
        console: 'readonly',
        document: 'readonly',
        ChromeUtils: 'readonly',
        Components: 'readonly',
      },
    },
  },
];
