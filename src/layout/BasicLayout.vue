<template>
    <div class="main-cont" :class="isDapp && 'cont_shadow'">
      <HeaderBar v-if="isDapp"
                 :address="fromAddress"
                 :current-account="currentAccount"
                 :show-connect="showConnect"
                 :header-color="typeBoolean && '#6EB6A9' || '#ffffff'"
                 @disConnect="disConnect"
                 @derivedAddress="derivedAddress"
                 @connectMetamask="connectMetamask"
                 @swapClick="swapClick"
                 @transferClick="transferClick"
                 @vaultsClick="vaultsClick"
                 @poolClick="poolClick">
        <div class="connect-item" v-loading="loading" v-if="isDapp && (showSign || showConnect || !fromAddress)">
          <div class="connect-btn" v-if="showConnect" @click="connectMetamask">{{ $t("tips.tips12") }}</div>
          <div class="sign-btn" v-else-if="!showConnect && showSign" @click="derivedAddress">{{ $t("tips.tips11") }}</div>
        </div>
        <keep-alive include="swap" v-else>
          <router-view />
        </keep-alive>
      </HeaderBar>
      <template v-else>
        <div class="tab-cont d-flex align-items-center space-between font-bold size-36"
             :class="{'vaults-color': true}">
          <div v-for="(item, index) in tabList"
               class="tab-item"
               :class="{'active': hashType===item.name}"
               @click="tabClick(index)"
               :key="index">{{ item.option }}</div>
        </div>
        <div class="position-cont" :class="{'vaults-color': true}"/>
<!--        <keep-alive>-->
          <router-view />
<!--        </keep-alive>-->
      </template>
    </div>
</template>

<script>
import {HeaderBar} from "../components";
import {ETHNET, MAIN_INFO, NULS_INFO} from "@/config";
import nerve from "nerve-sdk-js";
import {supportChainList} from "@/api/util";

const ethers = require("ethers");

function getAccountList() {
  return JSON.parse(localStorage.getItem("accountList")) || [];
}

function getCurrentAccount(address) {
  const accountList = getAccountList();
  const currentAccount = accountList.filter((item) => {
    return item.address.Ethereum === address;
  });
  return currentAccount[0] || null;
}

export default {
  name: "BasicLayout",
  components: { HeaderBar },
  data() {
    return {
      tabList: [
        {
          option: "Swap",
          name: 'swap',
          disabled: false
        }, {
          option: "Layer2",
          name: 'transfer',
          disabled: false
        }, {
          option: "Liquidity",
          name: 'liquidity',
          disabled: false
        }, {
          option: "Vaults",
          name: 'vaults',
          disabled: false
        }
      ], // 'Swap', 'Transfer', 'Pool', 'Vaults'
      currentIndex: 0,
      address: '', // 合约地址
      // showConnect: true, // 显示可连接钱包
      // showSign: true, // 显示派发多链地址
      provider: '',
      loading: false, // 加载
      walletType: sessionStorage.getItem("walletType") || 'metamask', // 钱包类型（metamask）
      // isDapp: true,
      fromChainId: '',
      orderList: [], // 订单列表
      flag: false,
      timer: null,
      nerveTo: true,
      showType: "Swap"
    }
  },
  created() {
    let tempData;
    if (typeof window._naboxAccount === 'string') {
      tempData = window._naboxAccount && JSON.parse(window._naboxAccount);
    } else {
      tempData = window._naboxAccount;
    }
    console.log(tempData, '==_naboxAccount==');
    if (!tempData || tempData && !tempData.isTabbarSwap) {
      this.initConnect();
      if (this.address && getCurrentAccount(this.address)) {
        this.refreshWallet();
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.refreshWallet()
        }, 300000);
      }
    } else {
      this.$store.commit('changeDapp', false);
      this.$store.commit('changeNetwork', tempData.chain);
      const accountList = [
        {
          pub: tempData.publicKey,
          address: tempData.addressDict
        }
      ];
      this.address = tempData.addressDict[tempData.chain];
      localStorage.setItem('accountList', JSON.stringify(accountList));
    }
  },
  computed: {
    fromNetwork() {
      return this.$store.state.network;
    },
    fromAddress() {
      const currentAccount = getCurrentAccount(this.address);
      this.$store.commit('changeFromAddress', currentAccount && !this.showSign ? currentAccount.address[this.fromNetwork] : "")
      return currentAccount && !this.showSign ? currentAccount.address[this.fromNetwork] : "";
    },
    currentAccount() {
      return this.$store.getters.currentAccount
    },
    typeBoolean() {
      return window.location.hash.indexOf('vaults') > -1 || window.location.hash.indexOf('liquidity') > -1
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
        const config = JSON.parse(sessionStorage.getItem("config"));
        const chainLength = config && Object.keys(config).length;
        const addressListLength = currentAccount ? Object.keys(currentAccount.address).length : 0;
        // this.showSign = !chainLength || chainLength !== addressListLength;
        this.$store.commit('changeFromAddress', val);
        this.$store.commit('changeShowSign', !chainLength || chainLength !== addressListLength);
      },
    },
    fromChainId: {
      immediate: true,
      handler(val) {
        if (!val) return;
        const sessionNetwork = sessionStorage.getItem("network");
        const NChains = ["NERVE", "NULS"];
        if (NChains.indexOf(sessionNetwork) > -1) return;
        const chain = supportChainList.filter(v => v[ETHNET] === val)[0];
        chain && this.$store.commit("changeNetwork", chain.value);
      }
    }
  },
  methods: {
    // 五分钟一次
    refreshWallet() {
      this.$request({
        url: '/wallet/refresh',
        data: {
          pubKey: getCurrentAccount(this.address).pub
        }
      });
    },
    tabClick(i) {
      switch (i) {
        case 0:
          this.currentIndex = 0;
          if (window.location.hash === '#/swap') return false;
          this.$router.push({ path: '/swap' });
          break;
        case 1:
          this.currentIndex = 1;
          if (window.location.hash === '#/transfer') return false;
          this.$router.push({ path: '/transfer' });
          break;
        case 2:
          this.currentIndex = 2;
          if (window.location.hash === '#/liquidity') return false;
          this.$router.push({ path: '/liquidity' });
          break;
        case 3:
          this.currentIndex = 3;
          if (window.location.hash === '#/vaults') return false;
          this.$router.push({ path: '/vaults' });
          break;
      }
    },
    // 获取订单列表
    async getOrderList(val) {
      this.flag = true;
      const params = {
        address: val
      }
      let res = await this.$request({
        url: '/swap/list',
        data: params
      });
      if (res.code === 1000) {
        this.orderList = res.data;
      }
    },
    toOrderDetail(id) {
      const orderId = id;
      this.$router.push({ path: '/orderDetail', query: { orderId }})
    },
    initConnect() {
      if (!this.walletType) {
        this.loading = false;
        return;
      }
      if (this.walletType === "metamask") {
        if (window.ethereum) {
          this.initMetamask();
        }
      } else if (this.walletType === "walletConnect") {
        // this.initWalletConnect();
      }
    },
    // 初始化metamask wallet provider address
    async initMetamask() {
      this.wallet = window.ethereum;
      // console.log(this.wallet.selectedAddress, 'this.wallet.selectedAddress');
      // console.log(this.wallet.chainId, 'this.wallet.chainId');
      this.fromChainId = this.wallet.chainId
      this.address = this.wallet.selectedAddress;
      if (!this.address) {
        await this.requestAccounts();
      }
      this.fromChainId = this.wallet.chainId;
      // console.log(this.wallet.chainId, 'this.wallet');
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      // this.showConnect = false;
      this.$store.commit('changeShowConnect', false);
      this.listenAccountChange();
      this.listenNetworkChange();
    },
    // 获取地址信息
    async requestAccounts() {
      const res = await this.wallet.request({ method: "eth_requestAccounts" });
      if (res.length) {
        this.address = res[0]
      }
    },
    //监听账户改变
    listenAccountChange() {
      this.wallet.on("accountsChanged", (accounts) => {
        console.log(accounts, "===accounts-changed===")
        if (accounts.length && this.walletType) {
          this.address = accounts[0];
          window.location.reload();
          // this.getBalance();
        } else {
          this.address = "";
          this.$store.commit('changeShowConnect', true);
        }
      });
    },
    disConnect() {
      localStorage.removeItem('accountList');
      sessionStorage.removeItem('walletType');
      sessionStorage.removeItem('network');
      this.$store.commit('changeShowSign', true);
      this.$store.commit('changeShowConnect', true);
      this.$router.push({ path: '/' });
      this.address = '';
    },
    //监听网络改变
    listenNetworkChange() {
      this.wallet.on("chainChanged", (chainId) => {
        if (chainId && this.walletType) {
          this.fromChainId = chainId;
          window.location.reload();
        }
      });
    },
    // 连接metamask钱包
    async connectMetamask() {
      if (!window.ethereum) {
        this.$message({
          message: this.$t("tips.tips1"),
          type: "warning",
          offset: 30,
        });
      } else {
        try {
          this.walletType = "metamask";
          sessionStorage.setItem("walletType", "metamask");
          await this.initMetamask();
        } catch (e) {
          this.$message({
            message: e.message,
            type: "warning",
            offset: 30,
          });
        }
      }
    },
    async syncAccount(pub, accounts) {
      const addressList = [];
      Object.keys(accounts).map((v) => {
        addressList.push({
          chain: v,
          address: accounts[v],
        });
      });
      const res = await this.$request({
        url: "/wallet/sync",
        data: { pubKey: pub, addressList },
      });
      return res.code === 1000;
    },
    // 通过调用metamask签名，派生多链地址
    async derivedAddress() {
      this.loading = true;
      try {
        if (!this.address) {
          await this.requestAccounts();
        }
        const jsonRpcSigner = this.provider.getSigner();
        let message = "Generate L2 Address";
        const signature = await jsonRpcSigner.signMessage(message);
        const msgHash = ethers.utils.hashMessage(message);
        const msgHashBytes = ethers.utils.arrayify(msgHash);
        const recoveredPubKey = ethers.utils.recoverPublicKey(
            msgHashBytes,
            signature
        );

        const account = {
          address: {
            Ethereum: this.address,
            BSC: this.address,
            Heco: this.address,
            OKExChain: this.address
          },
        };
        if (recoveredPubKey.startsWith("0x04")) {
          const compressPub = ethers.utils.computePublicKey(
              recoveredPubKey,
              true
          );
          const pub = compressPub.slice(2);
          account.pub = pub;
          const { chainId, assetId, prefix } = MAIN_INFO;
          const {
            chainId: NULSChainId,
            assetId: NULSAssetId,
            prefix: NULSPrefix,
          } = NULS_INFO;
          // console.log(NULSChainId, NULSAssetId, NULSPrefix, 55)
          // 根据公钥获取NERVE和NULS的地址
          account.address.NERVE = nerve.getAddressByPub(
              chainId,
              assetId,
              pub,
              prefix
          );
          account.address.NULS = nerve.getAddressByPub(
              NULSChainId,
              NULSAssetId,
              pub,
              NULSPrefix
          );
          const accountList = getAccountList();
          const existIndex = accountList.findIndex(v => v.pub === account.pub);
          // 原来存在就替换，找不到就push
          if (existIndex > -1) {
            accountList[existIndex] = account
          } else {
            accountList.push(account);
          }
          const syncRes = await this.syncAccount(pub, account.address);
          if (syncRes) {
            localStorage.setItem("accountList", JSON.stringify(accountList));
            // 重新计算fromAddress
            const address = this.address;
            this.address = "";
            // this.showSign = true;
            this.$store.commit('changeShowSign', true);
            setTimeout(()=> {
              this.address = address;
            }, 16)
          } else {
            this.$message({
              type: "warning",
              message: this.$t("tips.tips22"),
              offset: 30,
            });
          }
        }
      } catch (e) {
        // console.log(e, 556)
        this.address = "";
        this.$message({
          message: this.$t("tips.tips19"),
          type: "warning",
          offset: 30,
        });
      }
      this.loading = false;
    },
    swapClick() {
      // this.showType = "Swap";
      this.$router.push({ path: '/swap' })
    },
    transferClick() {
      // this.currentIndex = 1;
      // this.showType = "Transfer";
      // this.isDapp = false;
      this.$router.push({ path: '/transfer' })
    },
    poolClick() {
      // this.currentIndex = 2;
      this.showType = "Pool";
      // this.isDapp = false;
      this.$router.push({ path: '/liquidity' })
    },
    vaultsClick() {
      // this.currentIndex = 3;
      this.showType = "Vaults";
      this.$router.push({ path: '/vaults' })
      // this.isDapp = false;
    },
    crossOut() {
      if (this.isDapp) {
        this.showType = "Transfer";
        this.nerveTo = false;
      } else {
        this.currentIndex = 1;
        this.nerveTo = false;
      }
    },
    crossIn() {
      if (this.isDapp) {
        this.showType = "Transfer";
        this.nerveTo = true;
      } else {
        this.currentIndex = 1;
        this.nerveTo = true;
      }
    }
  },
  mounted() {
      window.scrollTo(0,0);
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style scoped lang="scss">
.main-cont {
  //width: 100%;
  background-color: #FFFFFF;
  color: #333333;
  font-weight: 400;
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
    box-shadow: 3px 3px 29px 3px rgba(178, 199, 217, 29%);
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
</style>