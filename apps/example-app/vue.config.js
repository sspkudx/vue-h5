const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/**
 * 导航到根目录路径
 * @param {string} [rootPath=''] - 相对根目录的子路径，默认为空字符串
 * @returns {string} 解析后的绝对路径
 * @description 根据当前文件所在目录构建指向项目根目录的相对路径
 */
const toRoot = (rootPath = '') => {
    return path.resolve(__dirname, `../../${rootPath}`);
};

/**
 * 必需的包配置数组
 * @type {Array<{alias: string, srcPath: string, distPath: string}>}
 * @description 定义项目中必需的包及其路径映射
 */
const requiredPackages = Object.freeze(
    ['shared'].map(packageName => {
        return {
            alias: `@my-app/${packageName}`,
            srcPath: toRoot(`packages/${packageName}/src`),
            distPath: toRoot(`packages/${packageName}/dist`),
        };
    })
);

/**
 * 设置所有必需的包别名路径
 * @param {import('webpack-chain').Config} config - webpack-chain 配置对象
 * @param {boolean} [isDev=false] - 是否为开发环境，默认为 false
 * @returns {import('webpack-chain').Config} 更新后的 webpack-chain 配置对象
 */
const setAllRequiredPackages = (config, isDev = false) => {
    return requiredPackages.reduce((conf, item) => {
        // 开发环境指向源码目录（支持热更新）
        // 生产环境指向构建后的dist目录
        const targetPath = isDev ? item.srcPath : item.distPath;
        return conf.resolve.alias.set(item.alias, targetPath).end().end();
    }, config);
};

/**
 * 获取 HtmlWebpackPlugin 的新配置
 * @param {Object} [defaultConfig={}] - 默认配置对象
 * @returns {Object} 更新后的 HtmlWebpackPlugin 配置
 */
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

/**
 * 判断是否为生产环境
 * @type {boolean}
 * @description 根据 NODE_ENV 环境变量判断是否为生产环境
 */
const isProduction = /prod/i.test(process.env?.NODE_ENV ?? '');

/**
 * 新版本的 babel-loader 路径
 * @type {string}
 * @description 指向根目录下的 babel-loader 路径
 */
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
