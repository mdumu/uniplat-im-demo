const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const pro = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: (config) => {
        config.plugin('ignoreMoment').use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])

        config.plugin('lodash').use(webpack.ProvidePlugin, [{ _: 'lodash' }])
    },
    configureWebpack: (config) => {
        // 配置别名等放到这里

        // 用以解决在chrome sources中vue文件生成带hash而无法找准文件的问题
        if (!pro) {
            config.output.devtoolModuleFilenameTemplate = (info) => {
                const resPath = info.resourcePath
                if ((/\.vue$/.test(resPath) && !/type=script/.test(info.identifier)) || /node_modules/.test(resPath)) {
                    return `webpack:///${resPath}?${info.hash}`
                }
                return `webpack:///${resPath.replace('./src', 'my-code/src')}`
            }
        } else {
            config.plugins.push(
                new CompressionPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    minRatio: 0.8, // 只有压缩好这个比率的资产才能被处理
                    deleteOriginalAssets: false,
                })
            )
        }
    },
})
