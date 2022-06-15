module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'max-len': ['error', { code: 130 }],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
  },
  // to support tsconfig paths
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
