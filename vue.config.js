const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const path = require('path');
const shell = require('shelljs');
shell.cp(process.cwd() + '/config/' + process.env.BUILD_ENV + '.js', process.cwd() + '/src/config.js');
console.log('use config file : ' + process.cwd() + '/config/' + process.env.BUILD_ENV + '.js');
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'));
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));
    }
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'element-ui': 'ELEMENT',
      // 'axios': 'axios',
      'vant': 'vant',
      'ethers': 'ethers',
      'web3': 'Web3',
      'vue-i18n': 'VueI18n'
    };
  },
  devServer: {
    port: 8001,
    host: '0.0.0.0',
    compress: true,
    disableHostCheck: true, // webpack4.0 开启热更新
    https: false, // https: {type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: { // 配置跨域处理
      '/nabox-api': {
        // target: 'http://192.168.1.204:8083', // 周维
        target: 'http://nabox_api.zhoulijun.top', // 测试环境
        // target: 'https://api.v2.nabox.io/', // 主网环境
        // target: 'http://jl5i9jz7.xiaomy.net', // 远程环境
        changeOrigin: true // 是否跨域
      }
    }
  }
};
