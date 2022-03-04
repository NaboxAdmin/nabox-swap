import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { post, request } from './network/http';
import './api/rem';
import 'normalize.css'; // 初始化css
import messages from './locales';
import { isBeta, setChainConfig } from './api/util';
import globalMixin from './mixin';
import { localChainConfig } from '@/config';

const development = process.env.NODE_ENV === 'development';
Vue.config.devtools = development;
Vue.prototype.$request = request; // 网络请求
Vue.prototype.$post = post;
Vue.config.productionTip = false; // 开发环境提示
Vue.mixin(globalMixin);

if (!development) {
  console.log = () => {};
}
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
    setChainConfig(chainConfig);
    !refresh && new Vue({
      i18n,
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
    const res = await request({ url: '/api/chain/config', method: 'get' });
    if (res.code === 1000 && res.data) {
      setChainConfig(res.data);
      network === 'beta' ? localStorage.setItem('localBetaChainConfig', JSON.stringify(res.data)) : localStorage.setItem('localChainConfig', JSON.stringify(res.data));
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
