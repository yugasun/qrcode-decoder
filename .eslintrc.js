module.exports = {
    root: true,

    parserOptions: {
        sourceType: 'module',
    },

    env: {
        browser: true,
        es6: true,
        node: true,
    },

    extends: ['airbnb-base'],

    rules: {
        'no-shadow': [
            'error',
            {
                allow: ['state'],
            },
        ],
        // 'import/extensions': 'off',
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
            },
        ],
        'import/no-unresolved': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',

        // 4 行空格缩进
        indent: ['error', 4, { SwitchCase: 1 }],

        'max-len': ['error', { code: 150 }],

        'operator-linebreak': 0,
    },
};
