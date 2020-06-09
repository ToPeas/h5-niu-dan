const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV !== 'development'

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: ['https://cdn.staticfile.org/vue/2.6.10/vue.min.js'],
}

module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       vue$: 'vue/dist/vue.esm.browser.min.js',
  //       '@': resolve('src'),
  //       '@/assets': resolve('src/assets'),
  //     },
  //   },
  //   plugins: [
  //     new webpack.DefinePlugin({
  //       'process.env.NODE_ENV': JSON.stringify(process.env.VUE_APP_API),
  //     }),
  //   ],
  // },
  configureWebpack: (config) => {
    if (isProduction) config.externals = cdn.externals

    if (isProduction) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              // warnings: false, // 若打包错误，则注释这行
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log'],
            },
          },
          sourceMap: false,
          parallel: true,
        })
      )

      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false, // 删除原文件
        })
      )
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
  },
  lintOnSave: false,
}
