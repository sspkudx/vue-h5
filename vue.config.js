const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** 页面标题 */
const PAGE_TITLE = 'Vue Project';

const VUE_STYLE_USAGES = ['vue-modules', 'vue', 'normal-modules', 'normal'];

/** Add global style-resource for less file */
const addStyleResource = rule => {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                // global fonts, mixins and less functions
                path.resolve(__dirname, 'src/assets/styles/less/global.less'),
            ],
        });
};

module.exports = defineConfig(() => {
    return {
        transpileDependencies: true,
        lintOnSave: 'error',
        devServer: {
            port: 3027,
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        chainWebpack(config) {
            VUE_STYLE_USAGES.forEach(type => {
                addStyleResource(config.module.rule('less').oneOf(type));
            });

            config
                .plugin('html')
                .tap(args => {
                    const [htmlPluginConfiguration] = args;
                    return [
                        {
                            ...htmlPluginConfiguration,
                            title: PAGE_TITLE,
                            template: path.resolve(__dirname, 'index.html'),
                            favicon: path.resolve(__dirname, 'favicon.ico'),
                        },
                        ...args.slice(1),
                    ];
                })
                .end();
        },
    };
});
