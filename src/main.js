import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { post, request } from './network/http';
import './api/rem';
import 'normalize.css'; // 初始化css
import messages from './locales';
import ElementUi from 'element-ui';
import { isBeta, setChainConfig } from './api/util';
import globalMixin from './mixin';
import { localChainConfig } from '@/config';
import VueLazyLoad from 'vue-lazyload';
import './assets/scss/element-variables.scss';
import enLocale from 'element-ui/lib/locale/lang/en';

Vue.use(ElementUi, { locale: enLocale });

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
    const tempSwapChainConfig = chainConfig.filter(item => item.swap == 1);
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
      const tempData = res.data.filter(item => item.swap == 1);
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
