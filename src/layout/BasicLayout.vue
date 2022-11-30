<template>
  <div :class="isDapp && 'cont_shadow'" class="main-cont">
    <HeaderBar
      v-if="isDapp"
      :address="fromAddress"
      :current-account="currentAccount"
      :show-connect="showConnect"
      :header-color="typeBoolean && '#6EB6A9' || '#ffffff'"
      :wallet-type="walletType"
      @changeChainId="changeChainId"
      @disConnect="disConnect"
      @switchPlugin="walletType=''"
      @derivedAddress="derivedAddress"
      @swapClick="swapClick"
      @transferClick="transferClick"
      @vaultsClick="vaultsClick"
      @poolClick="poolClick"
      @airdropClick="airdropClick"
      @l1FarmClick="l1FarmClick"
      @l2FarmClick="l2FarmClick">
      <div v-loading="loading" v-if="isDapp && (showSign || !address || !walletType)" class="connect-item">
        <div v-if="!walletType || !address" class="wallet-cont size-36 font-500">
          <div class="mb-3 font-bold">{{ $t("tips.tips12") }}</div>
          <div class="wallet-item d-flex align-items-center">
            <div v-for="(item, index) in providerList" :key="index" class="item-detail mb-3 cursor-pointer d-flex align-items-center" @click="connectProvider(item.provider)">
              <span class="icon-cont ml-2">
                <img :src="item.src" alt="">
              </span>
              <span class="ml-2 size-28 font-bold">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="showSign" class="sign-btn cursor-pointer" @click="derivedAddress">{{ $t("tips.tips11") }}</div>
      </div>
      <keep-alive v-else include="swap">
        <router-view />
      </keep-alive>
    </HeaderBar>
  </div>
</template>

<script>
import { HeaderBar } from '../components';
import { ETHNET, MAIN_INFO, NULS_INFO } from '@/config';
import nerve from 'nerve-sdk-js';
import { supportChainList, getCurrentAccount, TRON } from '@/api/util';
import MetaMask from '@/assets/image/metamask.svg';
import Nabox from '@/assets/image/nabox_wallet.svg';
import TrustWallet from '@/assets/image/trustwallet.svg';
import Tokenpocket from '@/assets/image/Tokenpocket.jpg';
import Mathwallet from '@/assets/image/mathwallet.svg';
import binancechain from '@/assets/image/binancechain.svg';
import OKEx from '@/assets/image/metax.jpg';
import safepal from '@/assets/image/safepal.svg';
import coin98 from '@/assets/image/coin98.svg';
import bitkeep from '@/assets/image/bitkeep.jpg';
import tronLinkWallet from '@/assets/image/tronLink.png';
import ONTO from '@/assets/image/ONTO.jpg';
import TronLinkApi, { generateTronAddress } from '@/api/tronLink';

const ethers = require('ethers');

function getAccountList() {
  return JSON.parse(localStorage.getItem('accountList')) || [];
}
const MetaMaskProvider = 'ethereum';
const NaboxProvider = 'NaboxWallet';
const OKExProvider = 'okexchain';
const BSCProvider = 'BinanceChain';
const ONTOProvider = 'onto';
const TRONProvider = 'tronWeb';
export default {
  name: 'BasicLayout',
  components: { HeaderBar },
  data() {
    this.providerList = [
      { name: 'MetaMask', src: MetaMask, provider: MetaMaskProvider },
      { name: 'Nabox', src: Nabox, provider: NaboxProvider },
      { name: 'TronLink', src: tronLinkWallet, provider: TRONProvider },
      { name: 'Trust Wallet', src: TrustWallet, provider: MetaMaskProvider },
      { name: 'TokenPocket', src: Tokenpocket, provider: MetaMaskProvider },
      { name: 'MathWallet', src: Mathwallet, provider: MetaMaskProvider },
      { name: 'Binance Wallet', src: binancechain, provider: BSCProvider },
      { name: 'OKX Wallet', src: OKEx, provider: OKExProvider },
      { name: 'SafePal', src: safepal, provider: MetaMaskProvider },
      { name: 'Coin98', src: coin98, provider: MetaMaskProvider },
      { name: 'BitKeep', src: bitkeep, provider: MetaMaskProvider },
      { name: 'ONTO Wallet', src: ONTO, provider: ONTOProvider }
    ];
    return {
      tabList: [
        {
          option: 'Swap',
          name: 'swap',
          disabled: false
        }, {
          option: 'Layer2',
          name: 'transfer',
          disabled: false
        }, {
          option: 'Liquidity',
          name: 'liquidity',
          disabled: false
        }, {
          option: 'Vaults',
          name: 'vaults',
          disabled: false
        }
      ],
      currentIndex: 0,
      address: '',
      provider: '',
      loading: false, // 加载
      walletType: localStorage.getItem('walletType'), // 钱包类型（metamask）
      // isDapp: true,
      fromChainId: '',
      orderList: [], // 订单列表
      flag: false,
      timer: null,
      nerveTo: true,
      showType: 'Swap'
    };
  },
  computed: {
    fromNetwork() {
      return this.$store.state.network;
    },
    fromAddress() {
      const currentAccount = getCurrentAccount(this.address);
      this.$store.commit('changeFromAddress', currentAccount && !this.showSign ? currentAccount.address[this.fromNetwork] || currentAccount.address[this.chainNameToId[this.fromNetwork]] || currentAccount.address[this.nativeId] : '');
      return currentAccount && !this.showSign ? currentAccount.address[this.fromNetwork] || currentAccount.address[this.chainNameToId[this.fromNetwork]] || currentAccount.address[this.nativeId] : '';
    },
    currentAccount() {
      return this.$store.getters.currentAccount;
    },
    typeBoolean() {
      return window.location.hash.indexOf('vaults') > -1;
    },
    hashType() {
      return window.location.hash.split('/')[1];
    }
  },
  watch: {
    address: {
      immediate: true,
      handler(val) {
        if (!val) return '';
        // !this.$store.state.isDapp && this.getOrderList(val);
        const currentAccount = getCurrentAccount(val);
        const config = JSON.parse(sessionStorage.getItem('config'));
        const chainLength = config && Object.keys(config).length;
        const addressListLength = currentAccount ? Object.keys(currentAccount.address).length : 0;
        // console.log(chainLength, currentAccount, addressListLength, !chainLength || chainLength !== addressListLength, '!chainLength || chainLength !== addressListLength');
        this.$store.commit('changeFromAddress', val);
        this.$store.commit('changeShowConnect', false);
        this.$store.commit('changeShowSign', !chainLength || chainLength !== addressListLength);
      }
    }
  },
  created() {
    this.initData();
    this.initConnect(true, this.walletType);
    if (this.address && getCurrentAccount(this.address)) {
      this.refreshWallet();
      // this.getOrderList()
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.refreshWallet();
      }, 300000);
    }
    // FIXME: 取消tab-bar展示
    // if (!tempData || tempData && !tempData.isTabbarSwap) {
    //   this.initConnect();
    //   if (this.address && getCurrentAccount(this.address)) {
    //     this.refreshWallet();
    //     // this.getOrderList()
    //     if (this.timer) clearInterval(this.timer);
    //     this.timer = setInterval(() => {
    //       this.refreshWallet();
    //     }, 300000);
    //   }
    // } else {
    //   this.$store.commit('changeDapp', true);
    //   this.$store.commit('changeNetwork', tempData.chain);
    //   const accountList = [
    //     {
    //       pub: tempData.publicKey,
    //       address: tempData.addressDict
    //     }
    //   ];
    //   this.address = tempData.addressDict[tempData.chain];
    //   localStorage.setItem('accountList', JSON.stringify(accountList));
    // }
  },
  mounted() {
    window.scrollTo(0, 0);
    window.addEventListener('message', this.messageListener);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.messageListener);
    this.timer && clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    async initData() {
      let tempData;
      if (typeof window._naboxAccount === 'string') {
        tempData = window._naboxAccount && JSON.parse(window._naboxAccount);
      } else {
        tempData = window._naboxAccount;
      }
      if (!localStorage.getItem('walletType')) {
        sessionStorage.removeItem('network');
      } else {
        this.walletType = localStorage.getItem('walletType');
      }
      if (!tempData && !localStorage.getItem('hackBoolean')) {
        localStorage.removeItem('accountList');
        localStorage.setItem('hackBoolean', 'true');
      }
      if (this.isMobile && localStorage.getItem('walletType') && localStorage.getItem('walletType') === 'NaboxWallet') {
        localStorage.setItem('walletType', 'ethereum');
        this.walletType = 'ethereum';
      }
      console.log(tempData, '==_naboxAccount==');
      const config = sessionStorage.getItem('config') && JSON.parse(sessionStorage.getItem('config')) || [];
      if (tempData && Object.keys(config).length === Object.keys(tempData.addressDict).length) {
        const accountList = [
          {
            pub: tempData.publicKey,
            address: tempData.addressDict
          }
        ];
        if (this.fromNetwork !== 'NULS' && this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'TRON') {
          const tempChain = Object.keys(config).indexOf(tempData.chain) === -1 ? 'NERVE' : tempData.chain;
          this.$store.commit('changeNetwork', tempChain);
          this.address = tempData.addressDict[tempChain];
        } else {
          this.$store.commit('changeNetwork', this.fromNetwork);
          this.address = tempData.addressDict[this.fromNetwork];
        }
        if (tempData.chain === 'TRON') {
          localStorage.setItem('walletType', 'tronWeb');
          this.walletType = 'tronWeb';
        } else {
          localStorage.setItem('walletType', 'ethereum');
          this.walletType = 'ethereum';
        }
        localStorage.setItem('accountList', JSON.stringify(accountList));
      }
    },
    messageListener(e) {
      if (e.data.message && (e.data.message.action === 'accountsChanged' || e.data.message.action === 'setNode' || e.data.message.action === 'connectWeb' || e.data.message.action === 'disconnectWeb' || e.data.message.action === 'disconnect' || e.data.message.action === 'connect')) {
        if (this.fromNetwork === TRON) {
          if (!window.tronLink.ready || e.data.message.action === 'disconnect') {
            localStorage.removeItem('walletType');
            window.location.reload();
          } else if ((e.data.message.data && e.data.message.data.address) || e.data.message.action === 'setNode' || e.data.message.action === 'connectWeb' || e.data.message.action === 'disconnectWeb' || e.data.message.action === 'connect' || e.data.message.action === 'accountsChanged') {
            window.location.reload();
          }
        }
      }
    },
    toUrl(type) {
      switch (type) {
        case 'twitter':
          this.isMobile ? window.location.href = 'https://twitter.com/naboxwallet' : window.open('https://twitter.com/naboxwallet');
          break;
        case 'telegram':
          this.isMobile ? window.location.href = 'https://t.me/naboxcommunity' : window.open('https://t.me/naboxcommunity');
          break;
        case 'Discord':
          this.isMobile ? window.location.href = 'https://discord.gg/mQVXZJXMkn' : window.open('https://discord.gg/mQVXZJXMkn');
          break;
        case 'medium':
          this.isMobile ? window.location.href = 'https://medium.com/@naboxwallet' : window.open('https://medium.com/naboxwallet');
          break;
        default:
          return false;
      }
    },
    // 五分钟一次
    refreshWallet() {
      this.$request({
        url: '/wallet/refresh',
        data: {
          pubKey: getCurrentAccount(this.address).pub
        }
      });
    },
    // 获取订单列表
    async getOrderList(val) {
      this.flag = true;
      const params = {
        address: val
      };
      const res = await this.$request({
        url: '/swap/list',
        data: params
      });
      if (res.code === 1000) {
        this.orderList = res.data;
      }
    },
    toOrderDetail(id) {
      const orderId = id;
      this.$router.push({ path: '/orderDetail', query: { orderId }});
    },
    initConnect(isInit, provider) {
      if (!provider) {
        this.loading = false;
        return;
      }
      if (provider === 'tronWeb') {
        if (!window[provider].ready) {
          !isInit && this.$message.warning(this.$t('tips.tips56'));
          setTimeout(() => {
            this.address = window[provider].defaultAddress.base58 || '';
          }, 100);
          return;
        }
        if (window[provider].defaultAddress.base58) {
          this.address = window[provider].defaultAddress.base58;
          this.$store.commit('changeNetwork', TRON);
          this.walletType = provider;
          localStorage.setItem('walletType', 'tronWeb');
        }
      } else {
        this.initMetamask(provider);
      }
    },
    // 初始化metamask wallet provider address
    async initMetamask(provider) {
      const walletType = localStorage.getItem('walletType') || provider;
      this.walletType = provider;
      this.wallet = window[walletType];
      this.fromChainId = this.wallet.chainId.toString().startWith('0x') ? this.wallet.chainId : `0x${Number(this.wallet.chainId).toString(16)}`;
      this.address = this.wallet.selectedAddress || this.wallet.address;
      if (!this.address) {
        await this.requestAccounts();
      }
      this.fromChainId = this.wallet.chainId.toString().startWith('0x') ? this.wallet.chainId : `0x${Number(this.wallet.chainId).toString(16)}`;
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      const chain = tempSupportChainList.find(v => v[ETHNET] === this.fromChainId);
      if (!sessionStorage.getItem('network')) {
        this.$store.commit('changeNetwork', chain && chain.value || 'NERVE');
      } else {
        this.$store.commit('changeNetwork', sessionStorage.getItem('network'));
      }
      this.$store.commit('changeNativeId', chain && chain.nativeId || 1);
      this.provider = new ethers.providers.Web3Provider(window[walletType]);
      this.listenAccountChange();
      this.listenNetworkChange();
    },
    // 获取地址信息
    async requestAccounts() {
      const res = await this.wallet.request({ method: 'eth_requestAccounts' });
      if (res.length) {
        this.address = res[0];
      }
    },
    // 监听账户改变
    listenAccountChange() {
      this.wallet.on('accountsChanged', (accounts) => {
        console.log(accounts, '===accounts-changed===');
        if (accounts.length && this.walletType) {
          this.address = accounts[0];
          window.location.reload();
        } else {
          this.address = '';
          // this.$store.commit('changeShowConnect', true);
        }
      });
    },
    disConnect() {
      localStorage.removeItem('accountList');
      localStorage.removeItem('walletType');
      sessionStorage.removeItem('network');
      this.$store.commit('changeShowSign', true);
      // this.$store.commit('changeShowConnect', true);
      window.location.hash.indexOf('swap') === -1 && this.$router.push({ path: '/' });
      this.address = '';
      this.walletType = '';
    },
    // 监听网络改变
    listenNetworkChange() {
      this.wallet.on('chainChanged', (chainId) => {
        if (chainId && this.walletType) {
          const tempChainId = chainId.toString().startWith('0x') ? chainId : `0x${Number(chainId).toString(16)}`;
          const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
          const chain = tempSupportChainList.find(v => v[ETHNET] === tempChainId);
          this.$store.commit('changeNetwork', chain && chain.value || 'NERVE');
          window.location.reload();
        }
      });
    },
    async connectProvider(provider) {
      const tempProvider = this.isMobile && provider !== 'tronWeb' ? 'ethereum' : provider;
      if (!window[tempProvider]) {
        this.$message({ message: this.$t('tips.tips55'), type: 'warning' });
        return;
      }
      // this.walletType = tempProvider;
      localStorage.setItem('walletType', tempProvider);
      await this.initConnect(false, provider);
    },
    async syncAccount(pub, accounts, chainList) {
      const addressList = [];
      chainList.forEach(v => {
        addressList.push({
          chain: v,
          address: accounts[v] || accounts[this.chainNameToId[v]]
        });
      });
      const res = await this.$request({
        url: '/wallet/sync',
        data: { pubKey: pub, addressList }
      });
      return res.code === 1000;
    },
    // 通过调用metamask签名，派生多链地址
    async derivedAddress() {
      this.loading = true;
      const config = JSON.parse(sessionStorage.getItem('config'));
      const networkList = Object.values(config).filter(item => item.chainType === 2).map(item => item.nativeId);
      const chainList = Object.values(config).filter(item => item.chainType === 2).map(item => item.chain);
      try {
        // if (!this.address) {
        //   await this.requestAccounts();
        // }
        let account, pub;
        if (this.walletType === 'tronWeb') {
          const tron = new TronLinkApi();
          const message = 'Generate L2 Address';
          pub = await tron.getPubBySign(message);
          const address = ethers.utils.computeAddress(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + pub), 33));
          const addressMap = {};
          for (const item of networkList) {
            addressMap[item] = address;
          }
          account = {
            address: addressMap
          };
        } else {
          if (!this.address.startsWith('0x')) {
            if (!window.nabox) {
              throw 'Nabox not found';
            }
            pub = await window.nabox.getPub({
              address: this.address
            });
            const address = ethers.utils.computeAddress(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + pub), 33));
            const addressMap = {};
            for (const item of networkList) {
              addressMap[item] = address;
            }
            account = {
              address: addressMap
            };
          } else {
            const jsonRpcSigner = this.provider.getSigner();
            const message = 'Generate L2 Address';
            const signature = await jsonRpcSigner.signMessage(message);
            const msgHash = ethers.utils.hashMessage(message);
            const msgHashBytes = ethers.utils.arrayify(msgHash);
            const recoveredPubKey = ethers.utils.recoverPublicKey(
              msgHashBytes,
              signature
            );
            const addressMap = {};
            for (const item of networkList) {
              addressMap[item] = this.address;
            }
            account = {
              address: addressMap
            };
            if (recoveredPubKey.startsWith('0x04')) {
              const compressPub = ethers.utils.computePublicKey(
                recoveredPubKey,
                true
              );
              pub = compressPub.slice(2);
            } else {
              throw 'sign error';
            }
          }
        }
        account.pub = pub;
        const { chainId, assetId, prefix } = MAIN_INFO;
        const {
          chainId: NULSChainId,
          assetId: NULSAssetId,
          prefix: NULSPrefix
        } = NULS_INFO;
        // 根据公钥获取NERVE和NULS的地址
        if (Object.keys(config).indexOf('NERVE') !== -1) {
          chainList.push('NERVE');
          account.address.NERVE = nerve.getAddressByPub(
            chainId,
            assetId,
            pub,
            prefix
          );
        }
        if (Object.keys(config).indexOf('NULS') !== -1) {
          chainList.push('NULS');
          account.address.NULS = nerve.getAddressByPub(
            NULSChainId,
            NULSAssetId,
            pub,
            NULSPrefix
          );
        }
        if (this.walletType === 'tronWeb') {
          account.address.TRON = this.address;
        } else {
          account.address.TRON = generateTronAddress(pub);
        }
        const accountList = getAccountList();
        const existIndex = accountList.findIndex(v => v.pub === account.pub);
        // 原来存在就替换，找不到就push
        if (existIndex > -1) {
          accountList[existIndex] = account;
        } else {
          accountList.push(account);
        }
        if (!(accountList.find(account => Object.keys(account.address).find(item => account.address[item] === this.address)))) {
          this.$message({
            type: 'warning',
            message: this.$t('tips.tips52')
          });
          this.loading = false;
          return false;
        }
        const syncRes = await this.syncAccount(pub, account.address, chainList);
        if (syncRes) {
          localStorage.setItem('accountList', JSON.stringify(accountList));
          // 重新计算fromAddress
          const address = this.address;
          // this.switchNetwork(address);
          this.address = '';
          // this.showSign = true;
          this.$store.commit('changeShowSign', false);
          setTimeout(() => {
            this.address = address;
          }, 16);
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('tips.tips19'),
            offset: 30
          });
        }
      } catch (e) {
        console.log(e, 'error');
        this.$message({
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          type: 'warning',
          offset: 30
        });
      }
      this.loading = false;
    },
    changeChainId(chainId) {
      this.fromChainId = chainId;
    },
    swapClick() {
      // this.showType = "Swap";
      this.$router.push({ path: '/swap' });
    },
    transferClick() {
      this.showType = 'Transfer';
      this.$router.push({ path: '/transfer' });
    },
    poolClick() {
      this.showType = 'Pool';
      this.$router.push({ path: '/liquidityPool' });
    },
    vaultsClick() {
      this.showType = 'Vaults';
      this.$router.push({ path: '/vaults' });
    },
    airdropClick() {
      this.showType = 'Airdrop';
      this.$router.push({ path: '/airdrop' });
    },
    l1FarmClick() {
      this.showType = 'L1Farm';
      this.$router.push({ path: '/l1farm' });
    },
    l2FarmClick() {
      this.showType = 'L2Farm';
      this.$router.push({ path: '/l2farm' });
    },
    crossOut() {
      if (this.isDapp) {
        this.showType = 'Transfer';
        this.nerveTo = false;
      } else {
        this.currentIndex = 1;
        this.nerveTo = false;
      }
    },
    crossIn() {
      if (this.isDapp) {
        this.showType = 'Transfer';
        this.nerveTo = true;
      } else {
        this.currentIndex = 1;
        this.nerveTo = true;
      }
    },
    switchNetwork(address) {
      console.log(address, 'address ');
      // 连接插件时如果是nuls、nerve设置network为nuls/nerve
      if (!address.startsWith('0x')) {
        let network;
        if (address.startsWith('tNULS') || address.startsWith('NULS')) {
          network = 'NULS';
        } else {
          network = 'NERVE';
        }
        this.$store.commit('changeNetwork', network);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.main-cont {
  //width: 100%;
  background-color: #FFFFFF;
  color: #333333;
  font-weight: 400;
  &::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
  }
}
@media screen and (min-width: 1000px) {
  .main-cont {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0px !important;
      height: 0px !important;
    }
  }
  .cont_shadow {
    border: 2px solid #ebf0f3;
    height: 1560px;
    box-shadow: 0 3px 29px 0 #f2f3f5;
  }
}
.tab-cont {
  --top: 40px;
  position: fixed;
  //height: 100px;
  left: 0;
  right: 0;
  //top: 0;
  background-color: #FFFFFF;
  padding: 0 69px 23px 69px;
  padding-top: var(--top) !important; /* 兼容非刘海屏 */
  padding-top: calc(constant(safe-area-inset-top) + var(--top)) !important; /* 标准刘海屏 */
  padding-top: calc(env(safe-area-inset-top) + var(--top)) !important; /* 兼容 ios11 */
  border-bottom: 1px solid #A2D1C9;
  .tab-item {
    cursor: pointer;
    position: relative;
  }
}
.vaults-color {
  background-color: #6EB6A9;
  color: #FFFFFF;
  //border-bottom: 2px solid #A2D1C9;
  z-index: 1;
  .active {
    position: relative;
    &:after {
      content: '';
      position: absolute;
      height: 6px;
      width: 86px;
      border-radius: 3px;
      background-color: #FFFFFF;
      left: 50%;
      bottom: -70%;
      transform: translate(-50%, -50%);
    }
  }
}
.active {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    height: 6px;
    width: 102px;
    background-color: #333333;
    left: 50%;
    bottom: -70%;
    transform: translate(-50%, -50%);
  }
}
.position-cont {
  --top: 40px;
  height: 60px;
  //height: calc(env(safe-area-inset-top) / 2 + 108px);
  padding-top: var(--top) !important; /* 兼容非刘海屏 */
  padding-top: calc(constant(safe-area-inset-top + var(--top))) !important; /* 标准留海屏 */
  padding-top: calc(env(safe-area-inset-top) + var(--top)) !important; /* 兼容 ios11 */
}
.connect-item {
  height: 700px;
  display: flex;
  justify-content: center;
  background-color: #FFFFFF;
}
.connect-btn {
  width: 670px;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  color: #FFFFFF;
  text-align: center;
  background-color: #6EB6A9;
  border-radius: 20px;
  margin-top: 100px;
}
.sign-btn {
  width: 670px;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  color: #FFFFFF;
  text-align: center;
  background-color: #6EB6A9;
  border-radius: 20px;
  margin-top: 100px;
}
.wallet-cont {
  padding: 0 30px;
  width: 100%;
  .wallet-item {
    flex-wrap: wrap;
    box-sizing: border-box;
    .item-detail {
      box-sizing: border-box;
      width: 50%;
      height: 80px;
      border-radius: 40px;
      border: 2px solid transparent;
      &:hover {
        border: 2px solid #6EB6A9;
      }
      .icon-cont {
        height: 55px;
        width: 55px;
        border-radius: 10px;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .follow-cont {
    margin-top: 300px;
    .follow-item {
      display: flex;
      align-items: center;
      width: 230px;
      margin-bottom: 15px;
      span {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
