const path = require('path')
module.exports = {
  // 基本路径
  // baseUrl: "./"
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // 输出文件目录
  // outputDir: "service/dist",
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  // eslint-loader 是否在保存的时候检查  true
  lintOnSave: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {

  },
  configureWebpack: (config) => {
    config.resolve = {//配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue':'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname, './src/components')
      }
    }
  },
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: '@import "./src/styles/main.scss";'//4.0版本的需要将 data 改为 prependData
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see vuejs/vue-cli
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false,//  process.platform === "darwin"  编译完成是否打开网页
    host: "0.0.0.0",//指定使用地址，默认 localhost,0.0.0.0代表可以被外界访问
    // host: '127.0.0.1',
    port: 8080,//访问端口
    https: false,//编译失败时刷新页面
    hot: true,//开启热加载
    hotOnly: false,
    proxy: {
      "/api": {
          /* 目标代理服务器地址 */
          target: "http://192.168.31.203:8888", //
          /* 允许跨域 */
          changeOrigin: true,
          ws: false,
          pathRewrite: {
              "^/api": "/api"
          }
      }
    },
    overlay: {//全屏模式下是否显示脚本错误
      warnings: true,
      errors: true,
    },
    before: app => {

    }
  },
  // 第三方插件配置
  pluginOptions: {
  }
};