import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { post, request } from './network/http';
import './api/rem';
import 'normalize.css'; // 初始化css
import messages from './locales';
import { isBeta, setChainConfig, TRON } from './api/util';
import globalMixin from './mixin';
import { localChainConfig } from '@/config';
import VueLazyLoad from 'vue-lazyload';

const TronWeb = require('./api/TronWeb');
const fullNode = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const solidityNode = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const eventServer = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const privateKey =
    '138a22c03039e688daa2b7c785d1e8d6b9375d4413e6ea82471b1e7a61701a9d';
const customTronWeb = new TronWeb(
  fullNode,
  solidityNode,
  eventServer,
  privateKey
);
customTronWeb.setHeader({ 'TRON-PRO-API-KEY': '1355e44a-205d-4264-b4f6-76a3515aaec4' });
console.log(customTronWeb, 'customTronWeb');
console.log(customTronWeb.address.fromHex('0x3083F7eD267DcA41338de3401c4E054dB2A1cD2f'), 'TronAddress');

const development = process.env.NODE_ENV === 'development';
Vue.config.devtools = development;
Vue.prototype.$request = request; // 网络请求
Vue.prototype.$post = post;
Vue.config.productionTip = false; // 开发环境提示
Vue.mixin(globalMixin);
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png',
  loading: 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png',
  attempt: 2
});
if (!development) {
  console.log = () => {};
}

// 国际化
const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : store.state.lang;
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages
});
const network = isBeta ? 'beta' : 'main';
store.commit('changeLang', locale);
localStorage.setItem('locale', locale);

async function getConfig(network, refresh) {
  try {
    let chainConfig;
    if (network === 'beta') {
      const tempLocalData = localStorage.getItem('localBetaChainConfig') && JSON.parse(localStorage.getItem('localBetaChainConfig')) || localChainConfig;
      chainConfig = tempLocalData.sort((a, b) => a.sort - b.sort);
    } else {
      const tempLocalData = localStorage.getItem('localChainConfig') && JSON.parse(localStorage.getItem('localChainConfig')) || localChainConfig;
      chainConfig = tempLocalData.sort((a, b) => a.sort - b.sort);
    }
    // TODO: 测试数据后面要修改
    const tempSwapChainConfig = chainConfig.filter(item => item.swap == 1 || item.chain === TRON);
    setChainConfig(tempSwapChainConfig);
    !refresh && new Vue({
      i18n,
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
    // /api/chain/config
    const res = await request({ url: '/chain/configs', method: 'get' });
    if (res.code === 1000 && res.data) {
      // TODO: 测试数据后面要修改
      const tempData = res.data.filter(item => item.swap == 1 || item.chain === TRON);
      console.log(tempData, 'tempData');
      setChainConfig(tempData);
      network === 'beta' ? localStorage.setItem('localBetaChainConfig', JSON.stringify(tempData)) : localStorage.setItem('localChainConfig', JSON.stringify(tempData));
    } else {
      setTimeout(() => {
        getConfig(network, true);
      }, 10000);
    }
  } catch (e) {
    console.error(e, 'error');
  }
}
getConfig(network);
