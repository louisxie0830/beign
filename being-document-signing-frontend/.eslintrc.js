module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: ['plugin:vue/recommended', 'prettier', 'plugin:prettier/recommended'],
    // required to lint *.vue files
    plugins: ['vue', 'prettier'],
    // add your custom rules here
    rules: {
        'vue/require-default-prop': 0,
        'vue/require-prop-types': 0,
        'vue/max-attributes-per-line': 0,
        'vue/html-self-closing': 0,
        'prettier/prettier': 0,
        'no-console': process.env.DEPLOY_ENV === 'prod' ? 'error' : 'off',
        'no-debugger': process.env.DEPLOY_ENV === 'prod' ? 'error' : 'off'
    }
};
