import Vue from 'vue';
// import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router';
import store from './store';
import { post, request } from './network/http';
import './api/rem';
import 'normalize.css'; // 初始化css
import messages from './locales';
import { isBeta } from './api/util';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import globalMixin from './mixin';
import './plugins/vant';
// import { Loading } from 'vant';

const development = process.env.NODE_ENV === 'development';
Vue.config.devtools = development;
Vue.prototype.$request = request; // 网络请求
Vue.prototype.$post = post;
Vue.config.productionTip = false; // 开发环境提示
Vue.mixin(globalMixin);
// Vue.use(VueI18n);
// Vue.use(ElementUI);
// Vue.use(Loading);
if (!development) {
  console.log = () => {};
}
// let tempData, locale;
// if (typeof window._naboxAccount === 'string') {
//   tempData = window._naboxAccount && JSON.parse(window._naboxAccount);
// } else {
//   tempData = window._naboxAccount;
// }
// if (tempData && tempData.language) {
//   locale = tempData.language === 'EN' ? 'en' : 'cn';
// } else {
//   locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : store.state.lang;
// }
// 国际化
const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : store.state.lang;
store.commit('changeLang', locale);
localStorage.setItem('locale', locale);
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages
});
const network = isBeta ? 'beta' : 'main';

async function getConfig(network) {
  try {
    const res = await request({ url: '/api/chain/config', method: 'get', network });
    const config = {};
    if (res.data && res.data.length) {
      res.data.map(v => {
        const mainInfo = v.mainAsset;
        config[v.chain] = {
          chain: v.chain,
          chainId: mainInfo ? mainInfo.chainId : '',
          assetId: mainInfo ? mainInfo.assetId : '',
          prefix: v.prefix,
          symbol: mainInfo ? mainInfo.symbol : '',
          decimals: mainInfo ? mainInfo.decimals : '',
          assets: v.assets,
          config: v.configs,
          apiUrl: v.apiUrl,
          chainType: v.chainType
        };
      });
      // chainType: 2 以太系
      const supportChainList = res.data.map(item => {
        if (item.chainType === 1) {
          return {
            ...item,
            label: item.chain,
            value: item.chain,
            SwftChain: item.chain,
            chainId: item.mainAsset && item.mainAsset.chainId || '',
            assetId: item.mainAsset && item.mainAsset.assetId || '',
            decimals: item.mainAsset && item.mainAsset.decimals || '',
            hashLink: `${item.scanUrl}transaction/info?hash=`,
            addressLink: `${item.scanUrl}address/info?address=`,
            symbol: item.mainAsset.symbol || ''
          };
        } else if (item.chainType === 2) {
          return {
            label: item.chain,
            value: item.chain,
            chain: item.chain,
            chainName: item.chainName,
            chainType: item.chainType,
            icon: item.icon,
            symbol: item.mainAsset && item.mainAsset.symbol || '',
            ropsten: `0x${Number(item.nativeId).toString(16)}`,
            SwftChain: item.chain,
            homestead: `0x${Number(item.nativeId).toString(16)}`,
            chainId: item.mainAsset && item.mainAsset && item.mainAsset.chainId || '',
            assetId: item.mainAsset && item.mainAsset.assetId || '',
            decimals: item.mainAsset && item.mainAsset.decimals || '',
            rpcUrl: item.apiUrl,
            nativeId: item.nativeId || '',
            // rpcUrl: networkRpc[item.chain],
            origin: item.scanUrl,
            hashLink: `${item.scanUrl}tx/`,
            addressLink: `${item.scanUrl}address/`
          };
        }
      });
      sessionStorage.setItem('supportChainList', JSON.stringify(supportChainList));
    }
    const chains = Object.keys(config);
    if (!localStorage.getItem('tradeHashMap')) {
      const tradeHashMap = {};
      chains.forEach(chain => {
        tradeHashMap[chain] = [];
      });
      localStorage.setItem('tradeHashMap', JSON.stringify(tradeHashMap));
    }
    if (!localStorage.getItem('l2HashList')) {
      localStorage.setItem('l2HashList', JSON.stringify([]));
    }
    sessionStorage.setItem('config', JSON.stringify(config));
  } catch (e) {
    console.error(e, '获取链配置失败');
  }
  new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}
getConfig(network);
