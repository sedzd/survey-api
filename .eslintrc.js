module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript/base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['filenames', 'unused-imports'],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'import/no-default-export': 'error',
        'unused-imports/no-unused-imports': 'error',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        'class-methods-use-this': 'off',
        'filenames/match-regex': [2, '^[0-9a-z-.]+$', true],
        'no-process-env': 'error',
        '@typescript-eslint/indent': 'off',
        'import/order': ['error', { 'newlines-between': 'always' }]
    },
    env: {
        'jest/globals': true
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [['src/*', './src/']],
                extensions: ['.ts', '.js', '.json']
            }
        }
    }
};
