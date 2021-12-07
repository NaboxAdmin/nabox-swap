import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router';
import store from './store';
import {post, request} from './api/https'
// import 'lib-flexible/flexible.js';
import './api/rem';
import 'normalize.css'; // 初始化css
import messages from './locales';
import {hashLinkList, isBeta} from "./api/util";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import globalMixin from './mixin';
import './plugins/vant';
import { Loading } from 'vant';
import {networkOrigin, networkRpc, addressNetworkOrigin} from "./api/util";

const development = process.env.NODE_ENV === "development"
Vue.config.devtools = development;
if (!development) {
    console.log = () => {};
}

Vue.prototype.$request = request; // 网络请求
Vue.prototype.$post = post;
Vue.config.productionTip = false; // 开发环境提示
Vue.mixin(globalMixin);
Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(Loading);
let tempData, locale;
if (typeof window._naboxAccount === 'string') {
    tempData = window._naboxAccount && JSON.parse(window._naboxAccount);
} else {
    tempData = window._naboxAccount;
}
if (tempData && tempData.language) {
    locale = tempData.language === 'EN' ? 'en' : 'cn';
} else {
    locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : store.state.lang;
}
// 国际化
// const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : store.state.lang;
store.commit('changeLang', locale);
localStorage.setItem("locale", locale);
const i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages
});
const network = isBeta ? "beta" : "main";

async function getConfig(network) {
    try {
        const res = await request({url: "/api/chain/config", method: "get", network});
        let config = {};
        if (res.data && res.data.length) {
            res.data.map(v => {
                const mainInfo = v.mainAsset;
                config[v.chain] = {
                    chain: v.chain,
                    chainId: mainInfo ? mainInfo.chainId : "",
                    assetId: mainInfo ? mainInfo.assetId : "",
                    prefix: v.prefix,
                    symbol: mainInfo ? mainInfo.symbol : "",
                    decimals: mainInfo ? mainInfo.decimals : "",
                    assets: v.assets,
                    config: v.configs,
                    apiUrl: v.apiUrl,
                    chainType: v.chainType
                }
            });
            // chainType: 2 以太系
            const supportChainList = res.data.map(item => {
                if (item.chainType === 1) {
                    return {
                        ...item,
                        label: item.chain,
                        value: item.chain,
                        SwftChain: item.chain,
                        chainId: item.mainAsset.chainId || "",
                        assetId: item.mainAsset.assetId || "",
                        decimals: item.mainAsset.decimals || "",
                        hashLink: item.txUrl,
                        addressLink: addressNetworkOrigin[item.chain],
                        symbol: item.mainAsset.symbol || "",
                    };
                } else if (item.chainType === 2) {
                    return {
                        label: item.chain,
                        value: item.chain,
                        chain: item.chain,
                        chainName: item.chainName,
                        chainType: item.chainType,
                        icon: item.icon,
                        symbol: item.mainAsset.symbol || "",
                        ropsten: `0x${Number(item.nativeId).toString(16)}`,
                        SwftChain: item.chain,
                        homestead: `0x${Number(item.nativeId).toString(16)}`,
                        chainId: item.mainAsset.chainId || "",
                        assetId: item.mainAsset.assetId || "",
                        decimals: item.mainAsset.decimals || "",
                        rpcUrl: item.apiUrl,
                        // rpcUrl: networkRpc[item.chain],
                        origin: networkOrigin[item.chain],
                        hashLink: item.txUrl,
                        addressLink: addressNetworkOrigin[item.chain]
                    }
                }
            });
            // console.log(supportChainList, 'supportChainList')
            sessionStorage.setItem("supportChainList", JSON.stringify(supportChainList));
        }
        sessionStorage.setItem("config", JSON.stringify(config));
    } catch (e) {
        console.error(e, "获取链配置失败");
    }
    new Vue({
        i18n,
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
}
getConfig(network);
