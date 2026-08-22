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
            // workspace 包（@my-app/*）无需手工 alias：
            // 各包 package.json 的 exports 带 "development" 条件指向 src，
            // webpack dev 模式默认解析 development 条件（源码热更新），
            // 生产构建解析 import 条件（exports -> dist），
            // 可顺带验证 exports 配置的正确性；构建顺序由 scripts/build.sh 保证（先 packages 后 apps）
            config
                .entry('app')
                .clear()
                .add(path.resolve(__dirname, 'src', 'main.ts'))
                .end()
                // 配置 .ts & .tsx 文件使用 babel-loader + ts-loader
                // （不声明 @vue/cli-plugin-babel / @vue/cli-plugin-typescript，
                // babel/ts 处理完全由本配置接管，避免插件默认规则冲突与 thread-loader 兼容问题）
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
