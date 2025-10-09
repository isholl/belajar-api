import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig({
  ignores: ['dist/**/*'],
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: {
    parser: tseslint.parser,
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': ['error'],
  },
})
