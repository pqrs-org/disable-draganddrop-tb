import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        browser: 'readonly',
        ChromeUtils: 'readonly',
        Components: 'readonly',
      },
    },
  },
];
