const path = require('path');
const shell = require('shelljs');
shell.cp(process.cwd() + '/config/' + process.env.BUILD_ENV + '.js', process.cwd() + '/src/config.js');
console.log('use config file : ' + process.cwd() + '/config/' + process.env.BUILD_ENV + '.js');
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'));
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
        // target: 'http://nabox_api.zhoulijun.top', // 测试环境
        // target: 'https://api.v2.nabox.io/', // 主网环境
        target: 'http://4fh8268956.qicp.vip/', // 主网环境
        changeOrigin: true // 是否跨域
      }
    }
  }
};
