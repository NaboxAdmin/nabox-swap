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
    lang: 'en',
    isSwap: false,
    nativeId: '',
    showWalletList: false,
    wrongNetwork: false,
    showOrderModal: false,
    orderTypeIndex: 1
  },
  mutations: {
    changeNativeId(state, data) {
      state.nativeId = data;
    },
    changeNetwork(state, data) {
      state.network = data;
      sessionStorage.setItem('network', data);
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
    },
    changeSwap(state, data) {
      state.isSwap = data;
    },
    changeShowWalletList(state, data) {
      state.showWalletList = data;
    },
    changeWrongNetwork(state, data) {
      state.wrongNetwork = data;
    },
    changeShowOrderModal(state, data) {
      state.showOrderModal = data;
    },
    changeOrderTypeIndex(state, data) {
      state.orderTypeIndex = data;
    }
  },
  getters: {
    currentAccount(state) {
      if (!state.fromAddress) return null;
      return getCurrentAccount(state.fromAddress);
    }
  }
});
