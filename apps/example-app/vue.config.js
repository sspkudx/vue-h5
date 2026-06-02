const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** Navigate to root path */
const toRoot = (rootPath = '') => {
    return path.resolve(__dirname, `../../${rootPath}`);
};

const requiredPackages = Object.freeze(
    ['shared'].map(packageName => {
        return {
            alias: `@my-app/${packageName}`,
            srcPath: toRoot(`packages/${packageName}/src`),
            distPath: toRoot(`packages/${packageName}/dist`),
        };
    })
);

const setAllRequiredPackages = (config, isDev = false) => {
    return requiredPackages.reduce((conf, item) => {
        // 开发环境指向源码目录（支持热更新）
        // 生产环境指向构建后的dist目录
        const targetPath = isDev ? item.srcPath : item.distPath;
        return conf.resolve.alias.set(item.alias, targetPath).end().end();
    }, config);
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
    const isDev = process.env.NODE_ENV === 'development';

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
            setAllRequiredPackages(config, isDev)
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
                        // css-module hash
                        localIdentName: '[local]__[hash:base64]',
                        exportLocalsConvention(name) {
                            // home-view__text--red → homeView__text_red
                            const camel = name
                                .replace(/--/g, '_') // 先把 -- 换成 _
                                .replace(/-([a-z])/g, (_, char) => char.toUpperCase()); // 驼峰化 -
                            return [name, camel];
                        },
                    },
                },
            },
        },
    };
});
