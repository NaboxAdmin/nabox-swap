<template>
  <div>
    <!-- :style="{'background-color': headerColor}"-->
    <div class="header-cont">
      <div class="logo-cont">
        <img src="@/assets/image/SwapBox.svg" alt="">
      </div>
      <div class="address-cont d-flex align-items-center">
        <div v-if="!showConnect && !showSign && address" class="address-detail pl-2 pr-2">
          <div class="d-flex align-items-center cursor-pointer" @click.stop="showDropClick">
            <span class="chain-icon">
              <img :src="getPicture(!isLiquidity && !isL2Farm && currentChain || 'NERVE')" alt="" @error="pictureError">
            </span>
            <div v-if="(!isLiquidity && !isL2Farm)" class="icon-drop ml-2">
              <img src="../../assets/image/drop_down_active.png" alt="">
            </div>
          </div>
          <div class="space-cont"/>
          <div class="d-flex" @click="addressClick">
            <span class="text-90 size-30 cursor-pointer mr-1 text-primary">{{ superLong(!isLiquidity && !isL2Farm && address || nerveAddress) }}</span>
            <span v-if="showLoading" class="box_loading">
              <img src="@/assets/image/loading.svg" alt="">
            </span>
          </div>
          <div v-if="showDropList" class="network-list size-28 d-flex direction-column">
            <span
              v-for="(item, index) in l1ChainList"
              :class="{'active_chain': item.chainName === currentChain}"
              :key="index"
              class="mt-2 cursor-pointer d-flex align-items-center"
              @click="chainClick(item)">
              <span class="chain-icon mr-2">
                <img :src="item.icon" alt="" @error="pictureError">
              </span>
              {{ item.chainName === 'OKExChain' && 'OEC' || item.chainName }}
            </span>
          </div>
        </div>
        <template>
          <div v-if="!address" class="header-icon_position"/>
          <div v-else class="header-icon cursor-pointer" @click="showClick">
            <svg t="1626839125971" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1764" width="16" height="16"><path d="M1097.142857 146.285714H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714zM1097.142857 585.142857H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714zM1097.142857 1024H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714z" fill="#333333" p-id="1765"/></svg>
          </div>
        </template>
      </div>
    </div>
    <div class="position-cont" />
    <div :class="[isVaults && 'bg-f0']" class="main-cont">
      <slot/>
      <Pop
        :show="showPop"
        @swapClick="swapClick"
        @transferClick="transferClick"
        @poolClick="poolClick"
        @vaultsClick="vaultsClick"
        @airdropClick="airdropClick"
        @l1FarmClick="l1FarmClick"
        @l2FarmClick="l2FarmClick"/>
      <pop-up :prevent-boo="false" :show.sync="showAccount">
        <div class="address-detail_pop">
          <div class="customer-p">
            <div class="icon-cont d-flex justify-content-end">
              <span class="cursor-pointer" @click="showAccount=false">
                <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"/></svg>
              </span>
            </div>
            <div class="account-cont mt-4">
              <div class="account-info_pop">
                <span class="size-32 flex-1"><span class="font-500">L1: </span>{{ superLong(address) }}</span>
                <div>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="toBrowser(fromNetwork, address)">
                    <svg t="1626845948779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2998" width="16" height="16"><path d="M971.034483 576.264828a52.965517 52.965517 0 0 0-52.965517 52.965517v271.183448a17.655172 17.655172 0 0 1-17.655173 17.655173h-776.827586a17.655172 17.655172 0 0 1-17.655173-17.655173v-776.827586a17.655172 17.655172 0 0 1 17.655173-17.655173h270.830345a52.965517 52.965517 0 0 0 0-105.931034H123.586207A123.586207 123.586207 0 0 0 0 123.586207v776.827586A123.586207 123.586207 0 0 0 123.586207 1024h776.827586a123.586207 123.586207 0 0 0 123.586207-123.586207v-271.183448a52.965517 52.965517 0 0 0-52.965517-52.965517z" fill="#656A7D" p-id="2999"/><path d="M953.37931 0h-233.754482a52.965517 52.965517 0 0 0 0 105.931034h123.586206L462.212414 486.929655a52.965517 52.965517 0 0 0 37.428965 90.394483 53.318621 53.318621 0 0 0 37.428966-15.536552L918.068966 180.788966v123.586206a52.965517 52.965517 0 0 0 105.931034 0V70.62069a70.62069 70.62069 0 0 0-70.62069-70.62069z" fill="#656A7D" p-id="3000"/></svg>
                  </span>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="copy(address)">
                    <svg t="1626840038256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2793" width="16" height="16"><path d="M637.631045 268.991045h-519.641791A117.683582 117.683582 0 0 0 0 386.368955v519.641791a117.989254 117.989254 0 0 0 117.683582 117.989254h519.641791a117.683582 117.683582 0 0 0 117.377911-117.683582v-519.641791a117.37791 117.37791 0 0 0-117.072239-117.683582z m25.676418 637.325373a25.98209 25.98209 0 0 1-25.676418 25.982089h-519.641791a25.98209 25.98209 0 0 1-26.287761-25.982089v-519.641791a25.98209 25.98209 0 0 1 25.982089-25.676418h519.641791a25.98209 25.98209 0 0 1 25.676418 25.676418z" fill="#656A7D" p-id="2794"/><path d="M906.316418 0H404.403582a117.989254 117.989254 0 0 0-117.683582 117.683582v28.733134h91.701493v-28.733134a25.98209 25.98209 0 0 1 25.982089-25.982089h501.912836a25.98209 25.98209 0 0 1 25.982089 25.982089v501.912836a25.98209 25.98209 0 0 1-25.982089 25.982089h-28.733134v91.701493h28.733134a117.989254 117.989254 0 0 0 117.683582-117.683582V117.683582A117.989254 117.989254 0 0 0 906.316418 0z" fill="#656A7D" p-id="2795"/></svg>
                  </span>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="disConnect">
                    <svg t="1626845988453" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3167" width="16" height="16"><path d="M821.32629 141.016949a46.489104 46.489104 0 1 0-58.886199 72.523003 402.905569 402.905569 0 1 1-503.012107 0A46.489104 46.489104 0 0 0 201.471568 141.016949a495.883777 495.883777 0 1 0 619.854722 0z" fill="#EC7E62" p-id="3168"/><path d="M511.398929 381.520581a46.489104 46.489104 0 0 0 46.489104-46.489104V46.489104a46.489104 46.489104 0 0 0-92.978208 0v288.542373a46.489104 46.489104 0 0 0 46.489104 46.489104z" fill="#EC7E62" p-id="3169"/></svg>
                  </span>
                </div>
              </div>
              <div class="text-left mt-3 size-36 font-500">{{ currentChainAvailable || 0 }} {{ currentChainSymbol }}</div>
            </div>
            <div class="account-cont mt-4">
              <div class="account-info_pop">
                <span class="size-32"><span class="font-500">L2: </span><span class="size-32">{{ currentAccount && superLong(currentAccount.address.NERVE) || '' }}</span></span>
                <div class="d-flex align-items-center">
                  <span class="icon_pop ml-4 cursor-pointer" @click="toBrowser('NERVE', currentAccount.address.NERVE)">
                    <svg t="1626845948779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2998" width="16" height="16"><path d="M971.034483 576.264828a52.965517 52.965517 0 0 0-52.965517 52.965517v271.183448a17.655172 17.655172 0 0 1-17.655173 17.655173h-776.827586a17.655172 17.655172 0 0 1-17.655173-17.655173v-776.827586a17.655172 17.655172 0 0 1 17.655173-17.655173h270.830345a52.965517 52.965517 0 0 0 0-105.931034H123.586207A123.586207 123.586207 0 0 0 0 123.586207v776.827586A123.586207 123.586207 0 0 0 123.586207 1024h776.827586a123.586207 123.586207 0 0 0 123.586207-123.586207v-271.183448a52.965517 52.965517 0 0 0-52.965517-52.965517z" fill="#656A7D" p-id="2999"/><path d="M953.37931 0h-233.754482a52.965517 52.965517 0 0 0 0 105.931034h123.586206L462.212414 486.929655a52.965517 52.965517 0 0 0 37.428965 90.394483 53.318621 53.318621 0 0 0 37.428966-15.536552L918.068966 180.788966v123.586206a52.965517 52.965517 0 0 0 105.931034 0V70.62069a70.62069 70.62069 0 0 0-70.62069-70.62069z" fill="#656A7D" p-id="3000"/></svg>
                  </span>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="copy(currentAccount.address.NERVE)">
                    <svg t="1626840038256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2793" width="16" height="16"><path d="M637.631045 268.991045h-519.641791A117.683582 117.683582 0 0 0 0 386.368955v519.641791a117.989254 117.989254 0 0 0 117.683582 117.989254h519.641791a117.683582 117.683582 0 0 0 117.377911-117.683582v-519.641791a117.37791 117.37791 0 0 0-117.072239-117.683582z m25.676418 637.325373a25.98209 25.98209 0 0 1-25.676418 25.982089h-519.641791a25.98209 25.98209 0 0 1-26.287761-25.982089v-519.641791a25.98209 25.98209 0 0 1 25.982089-25.676418h519.641791a25.98209 25.98209 0 0 1 25.676418 25.676418z" fill="#656A7D" p-id="2794"/><path d="M906.316418 0H404.403582a117.989254 117.989254 0 0 0-117.683582 117.683582v28.733134h91.701493v-28.733134a25.98209 25.98209 0 0 1 25.982089-25.982089h501.912836a25.98209 25.98209 0 0 1 25.982089 25.982089v501.912836a25.98209 25.98209 0 0 1-25.982089 25.982089h-28.733134v91.701493h28.733134a117.989254 117.989254 0 0 0 117.683582-117.683582V117.683582A117.989254 117.989254 0 0 0 906.316418 0z" fill="#656A7D" p-id="2795"/></svg>
                  </span>
                </div>
              </div>
              <div class="text-left mt-3 size-36 font-500">{{ nerveChainAvailable || 0 }} {{ nerveChainSymbol }}</div>
            </div>
          </div>
          <div class="tab_bar d-flex align-items-center size-30 mt-5 ml-4">
            <span :class="{'active': orderType === 3}" class="cursor-pointer" @click="getOrderList(fromAddress)">{{ $t('tips.tips33') }}</span>
            <span :class="{'active': orderType === 1}" class="ml-3 cursor-pointer" @click="getTxList()">{{ $t('tips.tips32') }}</span>
            <!--            <span :class="{'active': orderType === 2}" class="ml-3 cursor-pointer" @click="getL2OrderList(fromAddress)">L2{{ lang === 'cn' && $t("popUp.popUp5") || '' }}</span>-->
          </div>
          <div v-loading="orderLoading" class="customer-p pt-1">
            <div class="order-list mt-3">
              <div class="fix-cont">
                <div
                  v-for="item in orderList"
                  :key="item.orderId"
                  class="d-flex align-items-center mb-3 cursor-pointer space-between"
                  @click="linkToUrl(item.fromHash || item.txHash || item.hash, item)">
                  <template>
                    <span v-if="orderType===3" class="w-240 text-primary flex-1">{{ $t("navBar.navBar5") }}</span>
                    <span v-else class="w-240 text-primary flex-1 d-flex align-items-center">
                      <span class="mr-1 m-width">{{ superLong(item.txHash) }}</span>
                      <span class="sign">{{ item.type }}</span>
                    </span>
                  </template>
                  <span>{{ item.createTime }}</span>
                  <span class="status-icon">
                    <!--swap订单-->
                    <!--<i v-if="orderType === 3 && item.status !== 5 && item.status !== 4" class="el-icon-loading" style="color: #6EB6A9"/>
                    <i v-else-if="orderType === 3 && item.status === 4" class="el-icon-success" style="color: #6EB6A9"/>
                    <i v-else-if="orderType === 3 && item.status === 5" class="el-icon-error" style="color: #eb7d62"/>-->
                    <!--iswap订单-->
                    <template>
                      <i v-if="orderType === 3 && item.status === 3" class="el-icon-success" style="color: #6EB6A9"/>
                      <i v-if="orderType === 3 && item.status < 3" class="el-icon-loading" style="color: #6EB6A9"/>
                      <i v-if="orderType === 3 && item.status === 4" class="el-icon-error" style="color: #eb7d62"/>
                    </template>
                    <!--L1网络订单-->
                    <i v-if="orderType === 1 && item.status === 0" class="el-icon-loading" style="color: #6EB6A9"/>
                    <i v-if="orderType === 1 && item.status === 1" class="el-icon-success" style="color: #6EB6A9"/>
                    <i v-if="orderType === 1 && item.status === -1" class="el-icon-error" style="color: #eb7d62"/>
                    <!--L2网络订单-->
                    <i v-if="orderType === 2 && item.status === 0" class="el-icon-loading" style="color: #6EB6A9"/>
                    <i v-if="orderType === 2 && item.status === 1" class="el-icon-success" style="color: #6EB6A9"/>
                    <i v-if="orderType === 2 && item.status === -1" class="el-icon-error" style="color: #eb7d62"/>
                  </span>
                </div>
                <div v-if="orderList.length === 0" class="text-center size-28 mb-3">{{ $t('modal.modal3') }}</div>
              </div>
            </div>
          </div>
        </div>
      </pop-up>
    </div>
  </div>
</template>

<script>
import Pop from '../Pop/Pop';
import PopUp from '../PopUp/PopUp';
import { ETHNET } from '@/config';
import { copys, divisionDecimals, supportChainList, tofix } from '@/api/util';
import { MAIN_INFO } from '../../config';

// eslint-disable-next-line no-unused-vars
const lang = localStorage.getItem('locale') || 'cn';

export default {
  name: 'HeaderBar',
  components: { Pop, PopUp },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    address: String,
    headerColor: {
      type: String,
      default: '#ffffff'
    }
  },
  data() {
    return {
      showPop: false,
      showAccount: false,
      supportChainList: supportChainList,
      currentChain: this.$store.state.network, // 当前所选择的链
      showDropList: false, // 下拉菜单
      orderList: [], // 订单列表
      orderType: 3, // 当前选择的订单类型
      // fromAddress: '',
      currentChainAsset: null, // 当前选择的链上的主资产信息
      nerveChainAsset: null, // nerve链上的主资产信息/L2
      orderLoading: false,
      lang: '',
      showLoading: false,
      statusTimer: null,
      isSwap: false,
      isVaults: false,
      isLiquidity: false,
      isL2Farm: false,
      currentChainSymbol: '',
      nerveChainSymbol: '',
      currentChainAvailable: 0,
      nerveChainAvailable: 0,
      commonOrderList: [] // 普通交易
    };
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    },
    l1ChainList() {
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      const tempList = tempSupportChainList.filter(chain => chain.label !== 'NULS' && chain.label !== 'NERVE');
      return tempList.map(chain => ({
        chainId: chain[ETHNET],
        rpcUrls: chain.rpcUrl ? [chain.rpcUrl] : [],
        icon: chain.icon,
        chainName: chain.value,
        nativeCurrency: {
          name: chain.value,
          symbol: chain.symbol,
          decimals: chain.decimals
        },
        blockExplorerUrls: [chain.origin]
      }));
    },
    hashLinkList() {
      const hashLinkList = {};
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      tempSupportChainList.forEach(item => {
        hashLinkList[item.chain] = item.hashLink;
      });
      return hashLinkList;
    },
    addressNetworkOrigin() {
      const addressNetworkOrigin = {};
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      tempSupportChainList.forEach(chain => {
        addressNetworkOrigin[chain.chain] = chain.addressLink;
      });
      return addressNetworkOrigin;
    }
  },
  watch: {
    '$store.state.network': {
      handler(val) {
        this.currentChain = val;
      }
    },
    '$store.state.lang': {
      handler(val) {
        this.lang = val;
      },
      immediate: true,
      deep: true
    },
    '$store.state.isSwap': {
      handler(val) {
        this.isSwap = val;
      },
      immediate: true,
      deep: true
    },
    '$route.fullPath': {
      handler(val) {
        this.isSwap = window.location.hash.indexOf('swap') > -1;
        this.isVaults = window.location.hash.indexOf('farm') > -1;
        this.isL2Farm = window.location.hash.indexOf('l2farm') > -1;
        this.isLiquidity = window.location.hash.indexOf('liquidity') > -1;
        this.$store.commit('changeSwap', this.isSwap);
      },
      immediate: true,
      deep: true
    },
    currentChain(val) {
      if (val) {
        this.$store.commit('changeNetwork', val);
      }
    },
    currentChainAsset: {
      immediate: true,
      deep: true,
      handler(val) {
        this.currentChainAsset = val;
      }
    },
    address: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.$store.commit('changeFromAddress', val);
          this.initAssetInfo();
        }
      }
    }
  },
  created() {
    if (this.statusTimer) clearInterval(this.statusTimer);
    this.fromAddress && this.getOrderStatus(this.fromAddress);
    this.statusTimer = setInterval(() => {
      this.fromAddress && this.getOrderStatus(this.fromAddress);
    }, 5000);
  },
  mounted() {
    window.addEventListener('click', () => {
      if (this.showDropList) this.showDropList = false;
    }, false);
  },
  beforeDestroy() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
      this.statusTimer = null;
    }
  },
  methods: {
    toBrowser(network, address) {
      this.isMobile ? window.location.href = this.addressNetworkOrigin[network || this.fromNetwork] + address || this.address : window.open(this.addressNetworkOrigin[network || this.fromNetwork] + address || this.address);
    },
    copy(val) {
      if (!val) return;
      copys(val);
      this.$toast(this.$t('tips.tips13'));
    },
    showDropClick() {
      !this.isL2Farm && !this.isLiquidity && (this.showDropList = !this.showDropList);
    },
    // 断开连接
    disConnect() {
      this.showAccount = false;
      this.showPop = false;
      this.$emit('disConnect');
    },
    showClick() {
      this.showPop = !this.showPop;
    },
    addressClick() {
      this.showAccount = true;
      // this.getTxOrderList(this.fromAddress);
      this.getOrderList(this.fromAddress);
    },
    chainClick(chain) {
      if (this.currentChain === chain.chainName) return;
      delete chain['icon'];
      // if (chain.chainName === "NULS" || chain.chainName === "NERVE") {
      //   this.currentChain = chain.chainName;
      //   this.$store.commit('changeNetwork', chain.chainName);
      //   return;
      // }
      this.showDropList = false;
      if (chain.chainName !== 'Ethereum') {
        window.ethereum && window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chain]
        }).then((res) => {
          this.currentChain = chain.chainName;
          window.location.reload();
          this.$store.commit('changeNetwork', chain.chainName);
        }).catch(err => {
          console.log(err);
          this.$message({
            message: err.message || err,
            offset: 30,
            type: 'warning'
          });
        });
      } else {
        window.ethereum && window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chain.chainId
            }
          ]
        }).then(() => {
          this.currentChain = chain.chainName;
          this.$store.commit('changeNetwork', chain.chainName);
        }).catch(err => {
          this.$message({
            message: err.message || err,
            offset: 30,
            type: 'warning'
          });
        });
      }
    },
    // 获取普通交易列表
    getTxList(switchType = true) {
      this.orderType = switchType && 1;
      this.orderLoading = false;
      const tempL1List = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'))[this.fromNetwork] || [];
      const tempL2List = localStorage.getItem('l2HashList') && JSON.parse(localStorage.getItem('l2HashList')) || [];
      const allList = tempL1List.concat(tempL2List).filter(item => item.userAddress === this.fromAddress && (item.chain === this.fromNetwork || item.chain === 'NERVE'));
      this.orderList = [...(allList.sort((a, b) => b.createTimes - a.createTimes) || [])];
      // this.getTxStatus();
      // console.log(this.orderList.length, 'this.orderList');
    },
    // 获取异构链交易信息
    async getTxOrderList(val) {
      this.orderLoading = true;
      this.orderType = 1;
      const params = {
        address: val,
        chain: this.currentChain
      };
      const res = await this.$request({
        url: '/swap/lp/list',
        data: params
      });
      if (res.code === 1000 && res.data) {
        this.orderList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          };
        });
      }
      this.orderLoading = false;
    },
    // 获取swap订单列表
    async getOrderList(val) {
      try {
        this.orderList = [];
        this.$nextTick(() => {
          this.orderLoading = true;
        });
        this.orderType = 3;
        const params = {
          address: val,
          chain: this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/tx/query',
          data: params
        });
        if (res.code === 1000) {
          this.orderList = res.data.map(item => {
            return {
              ...item,
              createTime: this.formatTime(item.createTime)
            };
          });
        }
        this.orderLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.orderLoading = false;
      }
    },
    async getOrderStatus(val) {
      try {
        console.log('==getOrderStatus==');
        const commonTxList = await this.getTxStatus(); // 获取当前订单的状态
        const tempList = commonTxList.filter(item => item.userAddress === this.fromAddress && (item.chain === this.fromNetwork || item.chain === 'NERVE'));
        let swapTxList; // 获取当前订单的状态
        const params = {
          address: val,
          chain: this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/tx/query',
          data: params
        });
        if (res.code === 1000) {
          swapTxList = res.data;
        } else {
          swapTxList = [];
        }
        this.showLoading = tempList.some(item => item.status === 0) || swapTxList.some(item => item.status < 3);
      } catch (e) {
        console.log(e);
      }
    },
    async getTxStatus() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const tradeHashMap = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'));
      const tempL1List = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'))[this.fromNetwork] || [];
      const tempL2List = localStorage.getItem('l2HashList') && JSON.parse(localStorage.getItem('l2HashList')) || [];
      const allList = tempL1List.concat(tempL2List);
      const txList = [...(allList.sort((a, b) => b.balance - a.balance) || [])];
      // const tempList = txList.filter(item => item.status === 0 && item.userAddress === this.fromAddress);
      const l1Url = config && config[this.fromNetwork].apiUrl;
      const l2Url = config && config['NERVE'].apiUrl;
      if (txList.length !== 0) {
        const tempTxList = await Promise.all(txList.map(async tx => {
          if (tx.type === 'L1' && tx.status === 0) {
            const res = await this.$post(l1Url, 'eth_getTransactionReceipt', [tx.txHash]);
            if (res && res.result) {
              return {
                ...tx,
                status: res.result.status === '0x1' ? 1 : -1
              };
            }
          } else if (tx.type === 'L2' && tx.status === 0 && !tx.isPure) {
            const params = [MAIN_INFO.chainId, tx.txHash];
            const res = await this.$post(l2Url, 'getTx', params);
            const heterogeneousRes = await this.$post(l2Url, 'findByWithdrawalTxHash', params);
            if (res && res.result && heterogeneousRes && heterogeneousRes.result) {
              return {
                ...tx,
                status: res.result.status == '1' ? 1 : -1
              };
            }
          } else if (tx.type === 'L2' && tx.status === 0 && tx.isPure) {
            const params = [MAIN_INFO.chainId, tx.txHash];
            const res = await this.$post(l2Url, 'getTx', params);
            if (res && res.result) {
              return {
                ...tx,
                status: res.result.status == '1' ? 1 : -1
              };
            }
          }
          return { ...tx };
        }));
        const formatL1List = tempTxList.filter(item => item.type === 'L1');
        const formatL2List = tempTxList.filter(item => item.type === 'L2');
        const formatTradeHashMap = {
          ...tradeHashMap
        };
        formatTradeHashMap[this.fromNetwork] = formatL1List;
        localStorage.setItem('l2HashList', JSON.stringify(formatL2List));
        localStorage.setItem('tradeHashMap', JSON.stringify(formatTradeHashMap));
        this.orderType === 1 && this.getTxList();
        return tempTxList;
      }
      return [];
    },
    // 获取L2订单列表
    async getL2OrderList() {
      this.orderType = 2;
      this.orderLoading = true;
      const address = this.currentAccount.address['NERVE'];
      const res = await this.$request({
        url: '/swap/lp/list',
        data: {
          address,
          chain: 'NERVE'
        }
      });
      if (res.code === 1000) {
        this.orderList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          };
        });
      }
      this.orderLoading = false;
    },
    // 跳转查看当前的交易详情
    linkToUrl(hash, item) {
      if (this.orderType === 1) {
        const chain = item.type === 'L2' ? 'NERVE' : this.currentChain;
        this.isMobile ? window.location.href = `${this.hashLinkList[chain]}${hash}` : window.open(`${this.hashLinkList[chain]}${hash}`);
      } else {
        this.toOrderDetail(item);
      }
    },
    // 订单详情
    toOrderDetail(item) {
      this.$router.push({ path: '/orderDetail', query: { orderId: item.orderId }});
    },
    swapClick() {
      this.$emit('swapClick');
      this.showPop = false;
    },
    transferClick() {
      this.$emit('transferClick');
      this.showPop = false;
    },
    poolClick() {
      this.$emit('poolClick');
      this.showPop = false;
    },
    vaultsClick() {
      this.$emit('vaultsClick');
      this.showPop = false;
    },
    airdropClick() {
      this.$emit('airdropClick');
      this.showPop = false;
    },
    l1FarmClick() {
      this.$emit('l1FarmClick');
      this.showPop = false;
    },
    l2FarmClick() {
      this.$emit('l2FarmClick');
      this.showPop = false;
    },
    async initAssetInfo() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const tempAsset = {
        chain: this.currentChain,
        address: this.address,
        assetId: config && config[this.currentChain].assetId,
        chainId: config && config[this.currentChain].chainId,
        contractAddress: ''
      };
      const nerveAsset = {
        chain: 'NERVE',
        address: this.currentAccount && this.currentAccount.address.NERVE || '',
        assetId: config && config['NERVE'].assetId,
        chainId: config && config['NERVE'].chainId,
        contractAddress: ''
      };
      let tempCurrentAvailable, tempNerveAvailable;
      this.currentChainSymbol = config[this.currentChain].symbol;
      this.nerveChainSymbol = config['NERVE'].symbol;
      if (this.currentChain === 'NERVE') {
        tempCurrentAvailable = await this.getNerveAssetBalance(nerveAsset);
        tempNerveAvailable = await this.getNerveAssetBalance(nerveAsset);
        this.currentChainAvailable = this.numberFormat(tofix(divisionDecimals(tempCurrentAvailable, config && config['NERVE'].decimals || 18), 6, -1), 6, false);
      } else if (this.currentChain === 'NULS') {
        tempCurrentAvailable = await this.getNulsAssetBalance(tempAsset);
        tempNerveAvailable = await this.getNerveAssetBalance(nerveAsset);
        this.currentChainAvailable = this.numberFormat(tofix(divisionDecimals(tempCurrentAvailable, config && config['NULS'].decimals || 18), 6, -1), 6, false);
      } else {
        tempCurrentAvailable = await this.getHeterogeneousAssetBalance(tempAsset);
        tempNerveAvailable = await this.getNerveAssetBalance(nerveAsset);
        this.currentChainAvailable = this.numberFormat(tofix(tempCurrentAvailable, 6, -1), 6, false);
      }
      this.nerveChainAvailable = this.numberFormat(tofix(divisionDecimals(tempNerveAvailable, config && config['NERVE'].decimals || 18), 6, -1), 6, false);
    }
  }
};
</script>

<style scoped lang="scss">
@import "HeaderBar.scss";
.bg-f0 {
  background-color: #F0F7F7 !important;
}
.m-width {
  min-width: 230px;
}
.sign {
  font-size: 16px;
  //margin-left: 13px;
  padding: 5px 11px;
  background: #E7F2F0;
  border-radius: 4px;
  text-align: center;
  //line-height: 26px;
  color: #6EB6A9;
}
</style>
