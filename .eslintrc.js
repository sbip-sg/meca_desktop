module.exports = {
  extends: ['erb', 'plugin:prettier/recommended'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'default-param-last': 'off',
    'import/no-import-module-exports': 'off',
    'no-useless-catch': 'off',
    'no-console': 'off',
    'camelcase': 'off',
    'no-else-return': 'off',
    'consistent-return': 'off',
    'no-use-before-define': 'off',
    'no-await-in-loop': 'off',
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/jsx-props-no-spreading": "off",
    "react/destructuring-assignment": "off",
    'no-plusplus': "off",
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      }
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  plugins: ['only-warn'],
};
