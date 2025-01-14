const { version: corejs } = require('core-js/package.json');

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs,
                targets: {
                    node: 'current',
                    browsers: ['> 1%', 'last 2 versions', 'not dead'],
                },
            },
        ],
        [
            '@babel/preset-typescript',
            {
                allExtensions: true,
                isTSX: true,
            },
        ],
    ],
    plugins: ['@vue/babel-plugin-jsx'],
};
