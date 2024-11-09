import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: ['**/build/**', '**/dist/**', 'src/generated/graphql.ts'],
  },
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      'prisma/**/*.{js,mjs,cjs,ts}',
      '__tests__/**/*.{js,mjs,cjs,ts}',
    ],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // enable jest rules on test files
    files: ['__tests__/**/*.{js,mjs,cjs,ts}'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  {
    // enable rules on all files
    rules: {
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-undef': 'off',
    },
  },
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
]
