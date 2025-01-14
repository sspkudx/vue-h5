const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** default page title */
const PAGE_TITLE = 'Vue Project';
/** is production environment */
const isProduction = /prod/i.test(process.env?.NODE_ENV ?? '');

module.exports = defineConfig(() => {
    return {
        transpileDependencies: isProduction,
        lintOnSave: 'error',
        devServer: {
            port: 1234,
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        css: {
            loaderOptions: {
                css: {
                    modules: {
                        auto(resourcePath) {
                            return resourcePath.includes('.module.');
                        },
                    },
                },
            },
        },
        chainWebpack(config) {
            // HTML 插件配置
            config
                .plugin('html')
                .tap(args => {
                    const [defaultConfiguration, ...rest] = args;
                    return [
                        {
                            ...defaultConfiguration,
                            title: PAGE_TITLE,
                            template: path.resolve(__dirname, 'index.html'),
                            favicon: path.resolve(__dirname, 'favicon.ico'),
                        },
                    ].concat(rest);
                })
                .end()
                // 配置 .tsx 文件使用 babel-loader 而不是 ts-loader
                .module.rule('tsx')
                .test(/\.tsx$/)
                .use('babel-loader')
                .loader('babel-loader')
                .end()
                .end()
                .end()
                .module.rule('jsx')
                .test(/\.jsx$/)
                .use('babel-loader')
                .loader('babel-loader')
                .end();
        },
    };
});
