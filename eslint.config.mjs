// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'eslint.config.mjs'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // reglas TS sintácticas
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommendedTypeChecked], // 👈 type-aware ON
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'], // 👈 clave
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module', // 👈 matchea "NodeNext"
      },
      globals: { ...globals.node, ...globals.jest },
    },
  },
  eslintPluginPrettierRecommended,
);
