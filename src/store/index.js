import Vue from 'vue';
import Vuex from 'vuex';
import { getCurrentAccount } from '@/api/util';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        network: sessionStorage.getItem('network') || 'Ethereum',
        fromNetwork: '',
        fromAddress: '',
        showConnect: true,
        showSign: false,
        isDapp: true,
        lang: 'en'
    },
    mutations: {
        changeNetwork(state, data) {
            state.network = data;
            sessionStorage.setItem("network", data);
        },
        changeFromNetwork(state, data) {
            state.fromNetwork = data;
        },
        changeFromAddress(state, data) {
            state.fromAddress = data;
        },
        changeShowConnect(state, data) {
            state.showConnect = data;
        },
        changeShowSign(state, data) {
            state.showSign = data;
        },
        changeDapp(state, data) {
            state.isDapp = data;
        },
        changeLang(state, data) {
            state.lang = data;
            localStorage.setItem('locale', data);
        }
    },
    getters: {
        currentAccount(state) {
            if(!state.fromAddress) return null;
            return getCurrentAccount(state.fromAddress);
        }
    }
})
