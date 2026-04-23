const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** Navigate to root path */
const toRoot = (rootPath = '') => {
    return path.resolve(__dirname, `../../${rootPath}`);
};

/** Get a new configuration of HtmlWebpackPlugin */
const getHtmlPluginConfig = (defaultConfig = {}) => {
    const { templateParameters: oldTemplateParams = {} } = defaultConfig || {};
    return {
        ...defaultConfig,
        templateParameters: {
            ...oldTemplateParams,
            lang: 'zh-Hans',
        },
        template: path.resolve(__dirname, 'index.htm'),
        favicon: path.resolve(__dirname, 'favicon.ico'),
        title: 'example app',
    };
};

/** is production environment */
const isProduction = /prod/i.test(process.env?.NODE_ENV ?? '');
/** New Version babel loader */
const newBabelLoader = toRoot('node_modules/babel-loader/lib/index.js');

module.exports = defineConfig(() => {
    return {
        transpileDependencies: isProduction,
        lintOnSave: 'error',
        devServer: {
            port: 2000,
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        chainWebpack(config) {
            config
                .entry('app')
                .clear()
                .add(path.resolve(__dirname, 'src', 'main.ts'))
                .end()
                // 配置 .ts & .tsx 文件使用 babel-loader
                .module.rule('ts')
                .test(/\.m?tsx?$/)
                .use('babel-loader')
                .loader(newBabelLoader)
                .options({
                    // 关键：显式指向根目录 babel 配置
                    configFile: toRoot('babel.config.js'),
                })
                .end()
                .use('ts-loader')
                .loader('ts-loader')
                .options({
                    appendTsSuffixTo: [/\.vue$/],
                })
                .end()
                .end()
                .end()
                .module.rule('js')
                .test(/\.m?jsx?$/)
                .use('babel-loader')
                .loader(newBabelLoader)
                .options({
                    // 关键：显式指向根目录 babel 配置
                    configFile: toRoot('babel.config.js'),
                })
                .end()
                .end()
                .end()
                .resolve.extensions.merge(['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'])
                .end()
                .end()
                .plugin('html')
                .tap(args => {
                    const [defaultConf, ...rest] = args;
                    return [getHtmlPluginConfig(defaultConf), ...rest];
                })
                .end();
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
    };
});
