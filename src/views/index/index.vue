<template>
    <div class="main-cont" v-loading="loading">
<!--      <div class="btn size-30" @click="connectMetamask" v-if="showConnect">{{ address || 'createMask' }}</div>-->
<!--      <div class="btn size-30" @click="derivedAddress" v-else-if="showSign">派发多链地址</div>-->
<!--      <template v-if="!isDapp && !showConnect && !showSign">-->
      <template v-if="!isDapp">
        <div class="tab-cont d-flex align-items-center space-between font-bold size-36"
             :class="{'vaults-color': currentIndex === 2 || currentIndex === 3}">
          <div v-for="(item, index) in tabList"
               class="tab-item"
               :class="{'active': index===currentIndex, 'disabled': item.disabled}"
               @click="tabClick(index)"
               :key="index">{{ item.option }}</div>
        </div>
        <div class="position-cont"/>
        <div class="tab-detail_cont">
          <template v-if="currentIndex===0">
            <Swap :from-address="fromAddress"
                  :from-network="fromNetwork"
                  :show-connect="showConnect"
                  @connectMetamask="connectMetamask"
                  @derivedAddress="derivedAddress"/>
            <div class="order-list">
              <div class="list-item">
                <div class="size-36 font-bold">{{ $t('swap.swap11') }}</div>
                <div class="size-28 mt-5 d-flex align-items-center space-between"
                     v-if="orderList.length > 0"
                     v-for="(item, index) in orderList"
                     @click="toOrderDetail(item.id)"
                     :key="item.id">
                  <span>{{ item.fromAmount }} {{ item.fromSymbol  }} {{ $t('swap.swap14') }} {{ item.toAmount }} {{ item.toSymbol }}</span>
                  <span v-if="index===0" class="order-icon">
                  <svg t="1626399518824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1288" width="17" height="17"><path d="M709.570095 118.362074a37.044619 37.044619 0 0 1-16.865843-3.614109A424.657824 424.657824 0 0 0 630.059694 90.352729 37.64697 37.64697 0 0 1 650.539646 18.974073a543.923426 543.923426 0 0 1 74.992765 27.406994 37.64697 37.64697 0 0 1-15.962316 71.981007zM870.699128 859.8568a38.550498 38.550498 0 0 1-24.696413-9.035273 37.948146 37.948146 0 0 1-2.710582-53.308109 426.163703 426.163703 0 0 0 63.24691-96.376244 37.64697 37.64697 0 1 1 67.764547 32.828158 518.624662 518.624662 0 0 1-74.089238 112.940911 37.345794 37.345794 0 0 1-29.515224 12.950557z m113.543262-265.03467h-3.614109a37.64697 37.64697 0 0 1-33.731685-40.959904q1.807055-20.781128 1.807054-41.562255a430.68134 430.68134 0 0 0-6.324691-73.788062 37.64697 37.64697 0 1 1 74.390413-12.649382A517.721135 517.721135 0 0 1 1023.997591 511.998795c0 16.263491 0 32.526982-2.409407 48.489298a37.64697 37.64697 0 0 1-37.345794 34.334037z m-60.235152-282.201689a37.345794 37.345794 0 0 1-32.526983-18.672897 451.763643 451.763643 0 0 0-70.475128-90.352729A37.64697 37.64697 0 1 1 873.40971 150.587881a508.685862 508.685862 0 0 1 82.522158 107.218571 37.345794 37.345794 0 0 1-13.854085 51.19988 34.936388 34.936388 0 0 1-18.974073 3.614109zM673.429004 995.687069a37.64697 37.64697 0 0 1-12.649382-72.884534 473.448298 473.448298 0 0 0 60.235152-28.009346 37.64697 37.64697 0 1 1 36.442267 65.656316A493.024722 493.024722 0 0 1 686.379561 993.880014a38.851673 38.851673 0 0 1-12.950557 1.807055zM511.998795 1023.997591a511.998795 511.998795 0 0 1 0-1023.997591 37.64697 37.64697 0 0 1 0 75.29394 436.704855 436.704855 0 0 0-69.872776 867.687371l-9.938801-16.263492a37.64697 37.64697 0 0 1 64.752789-38.851673l47.284595 79.209226A37.345794 37.345794 0 0 1 511.998795 1023.997591z" fill="#333333" p-id="1289"></path><path d="M680.356046 667.405488a37.044619 37.044619 0 0 1-21.383479-6.927042L490.31414 542.116371a38.249322 38.249322 0 0 1-15.962315-30.117576V227.3877a37.64697 37.64697 0 0 1 75.293941 0v264.733495l152.394935 106.61622a37.64697 37.64697 0 0 1-21.684655 68.668073z" fill="#333333" p-id="1290"></path></svg>
                </span>
                </div>
                <div class="text-center mt-3 size-28" v-if="orderList.length === 0">{{ $t('swap.swap15') }}</div>
              </div>
            </div>
          </template>
        </div>
        <Transfer v-if="currentIndex===1"
                  :current-account="currentAccount"
                  :nerveTo="nerveTo"
                  :from-network="fromNetwork"
                  :from-address="fromAddress"/>
        <Pool v-if="currentIndex===2"
              @crossIn="crossIn"
              @crossOut="crossOut"
              :from-address="fromAddress"
              :from-network="fromNetwork"
              :current-account="currentAccount"/>
        <Vaults v-if="currentIndex===3"
                @crossIn="crossIn"
                @crossOut="crossOut"
                :from-address="fromAddress"
                :from-network="fromNetwork"
                :current-account="currentAccount"/>
      </template>
<!--      <template v-if="isDapp && !showConnect && !showSign">-->
      <template v-if="false">
        <header-bar :address="fromAddress"
                    :current-account="currentAccount"
                    :show-connect="showConnect"
                    :header-color="(showType==='Pool' || showType==='Vaults') && '#6EB6A9' || '#ffffff'"
                    @disConnect="disConnect"
                    @derivedAddress="derivedAddress"
                    @connectMetamask="connectMetamask"
                    @swapClick="swapClick"
                    @transferClick="transferClick"
                    @vaultsClick="vaultsClick"
                    @poolClick="poolClick">
          <div :class="{'p-3': showType === 'Swap'}">
            <div class="bg-white"  :class="{'swap-wrapper': showType === 'Swap' || showType === 'Transfer'}">
              <Swap :is-dapp="isDapp"
                    v-if="showType==='Swap'"
                    :from-network="fromNetwork"
                    :from-address="fromAddress"
                    :show-connect="showConnect"
                    :show-sign="showSign"
                    @connectMetamask="connectMetamask"
                    @derivedAddress="derivedAddress"/>
              <Transfer v-if="showType==='Transfer'"
                        :is-dapp="isDapp"
                        :current-account="currentAccount"
                        :nerveTo="nerveTo"
                        :from-network="fromNetwork"
                        :from-address="fromAddress"/>
              <Pool v-if="showType==='Pool'"
                    @crossIn="crossIn"
                    @crossOut="crossOut"
                    :from-address="fromAddress"
                    :from-network="fromNetwork"
                    :current-account="currentAccount"/>
              <Vaults v-if="showType==='Vaults'"
                      @crossIn="crossIn"
                      @crossOut="crossOut"
                      :from-address="fromAddress"
                      :from-network="fromNetwork"
                      :current-account="currentAccount"/>
            </div>
          </div>
        </header-bar>
      </template>
    </div>
</template>

<script>
import {Pool, Swap, Transfer, Vaults} from "./component";
import {HeaderBar} from "@/components";
import {ETHNET, MAIN_INFO, NULS_INFO} from "@/config";
import nerve from "nerve-sdk-js";
import {supportChainList} from "../../api/util";

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
  name: "Index",
  keepAlive: true,
  data() {
    return {
      tabList: [
        {
          option: "Swap",
          disabled: false
        }, {
          option: "Transfer",
          disabled: false
        }, {
          option: "Pool",
          disabled: false
        }, {
          option: "Vaults",
          disabled: false
        }
      ], // 'Swap', 'Transfer', 'Pool', 'Vaults'
      currentIndex: 2,
      address: '', // 合约地址
      showConnect: true, // 显示可连接钱包
      showSign: true, // 显示派发多链地址
      provider: '',
      loading: false, // 加载
      walletType: sessionStorage.getItem("walletType") || 'metamask', // 钱包类型（metamask）
      isDapp: true,
      fromChainId: '',
      orderList: [], // 订单列表
      flag: false,
      timer: null,
      nerveTo: true,
      showType: "Swap"
    }
  },
  created() {
    this.initConnect();
    if (this.address && getCurrentAccount(this.address)) {
      this.refreshWallet();
      this.timer = setInterval(() => {
        this.refreshWallet()
      }, 300000);
    }
  },
  components: { Swap, HeaderBar, Pool, Vaults, Transfer },
  computed: {
    fromNetwork() {
      return this.$store.state.network;
    },
    fromAddress() {
      const currentAccount = getCurrentAccount(this.address);
      return currentAccount && !this.showSign ? currentAccount.address[this.fromNetwork] : "";
    },
    currentAccount() {
      return getCurrentAccount(this.address)
    }
  },
  watch: {
    address: {
      immediate: true,
      handler(val) {
        if (!val) return '';
        !this.isDapp && this.getOrderList(val);
        const currentAccount = getCurrentAccount(val);
        const config = JSON.parse(sessionStorage.getItem("config"));
        const chainLength = config && Object.keys(config).length;
        const addressListLength = currentAccount ? Object.keys(currentAccount.address).length : 0;
        // this.showSign = currentAccount ? false : true;
        this.showSign = !chainLength || chainLength !== addressListLength
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
    },
    fromNetwork: {
      handler(val) {
        if (val==="NERVE" || val==="NULS") {
          this.$set(this.tabList, 1, { option: "Transfer", disabled: true })
        }
      },
      immediate: true,
      deep: true
    }
  },
  activated() {
    // if (this.flag) {
    //   this.getOrderList(this.address);
    // }
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
      if (this.tabList[i]["disabled"]) return false;
      this.currentIndex = i;
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
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.showConnect = false;
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
          // this.getBalance();
        } else {
          this.address = "";
        }
      });
    },
    disConnect() {
      localStorage.removeItem('accountList');
      sessionStorage.removeItem('walletType');
      sessionStorage.removeItem('network');
      this.showConnect = true;
      this.showSign = true;
      this.address = '';
    },
    //监听网络改变
    listenNetworkChange() {
      this.wallet.on("chainChanged", (chainId) => {
        if (chainId && this.walletType) {
          this.fromChainId = chainId;
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
            offset: 30
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
        let message = "Derive Multi-chain Address";
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
        /* const config = JSON.parse(sessionStorage.getItem("config"));
        if (config.OKExChain) {
          account.address.OKExChain = this.address;
        } */
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
            this.showSign = true;
            setTimeout(()=> {
              this.address = address;
            }, 16)
          } else {
            this.$message({
              type: "warning",
              message: '派发失败',
              offset: 30
            });
          }
        }
      } catch (e) {
        // console.log(e, 556)
        this.address = "";
        this.$message({
          message: this.$t("tips.tips19"),
          type: "warning",
          offset: 30
        });
      }
      this.loading = false;
    },
    swapClick() {
      this.showType = "Swap";
    },
    transferClick() {
      // this.currentIndex = 1;
      this.showType = "Transfer";
      // this.isDapp = false;
    },
    poolClick() {
      // this.currentIndex = 2;
      this.showType = "Pool";
      // this.isDapp = false;
    },
    vaultsClick() {
      // this.currentIndex = 3;
      this.showType = "Vaults";
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
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style scoped lang="scss">
@import "./index.scss";
.disabled {
  opacity: 0.5;
}
</style>