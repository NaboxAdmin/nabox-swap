<template>
  <div>
    <!-- :style="{'background-color': headerColor}"-->
    <div class="header-cont">
      <div class="logo-cont">
        <img src="@/assets/image/SwapBoxBeta.svg" alt="">
      </div>
      <div class="address-cont d-flex align-items-center">
        <div class="address-detail pl-2 pr-2" v-if="!showConnect && !showSign && address">
          <div class="d-flex align-items-center cursor-pointer" @click.stop="showDropClick">
            <span class="chain-icon">
              <img :src="getPicture(currentChain)" @error="pictureError" alt="">
            </span>
<!--            <div class="icon-drop ml-2">-->
<!--              <img src="../../assets/image/drop_down_active.png" alt="">-->
<!--            </div>-->
          </div>
          <div class="space-cont"/>
          <div class="d-flex" @click="addressClick">
            <span class="text-90 size-30 cursor-pointer mr-1 text-primary">{{ superLong(address) }}</span>
            <span v-if="showLoading" class="box_loading">
              <img src="@/assets/image/loading.svg" alt="">
            </span>
          </div>
<!--          <div class="network-list size-28 d-flex direction-column" v-if="showDropList">-->
<!--            <span class="mt-2 cursor-pointer"-->
<!--                  v-for="(item, index) in l1ChainList"-->
<!--                  @click="chainClick(item)"-->
<!--                  :class="{'active_chain': item.chainName === currentChain}"-->
<!--                  :key="index">-->
<!--              {{ item.chainName }}-->
<!--            </span>-->
<!--          </div>-->
        </div>
        <template>
          <div class="header-icon_position" v-if="!address"/>
          <div class="header-icon cursor-pointer" v-else @click="showClick">
            <svg t="1626839125971" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1764" width="16" height="16"><path d="M1097.142857 146.285714H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714zM1097.142857 585.142857H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714zM1097.142857 1024H73.142857a73.142857 73.142857 0 0 1 0-146.285714h1024a73.142857 73.142857 0 0 1 0 146.285714z" fill="#333333" p-id="1765"></path></svg>
          </div>
        </template>
      </div>
    </div>
    <div class="position-cont" />
    <div class="main-cont" :class="{'p-3': isSwap}">
      <slot/>
      <Pop :show="showPop"
           :disabled="currentChain === 'NERVE' || currentChain === 'NULS'"
           @swapClick="swapClick"
           @transferClick="transferClick"
           @poolClick="poolClick"
           @vaultsClick="vaultsClick"/>
      <pop-up :prevent-boo="false" :show="showAccount">
        <div class="address-detail_pop">
          <div class="customer-p">
            <div class="icon-cont d-flex justify-content-end">
            <span class="cursor-pointer" @click="showAccount=false">
              <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"></path></svg>
            </span>
            </div>
            <div class="account-cont mt-4">
              <div class="account-info_pop">
                <span class="size-32 flex-1"><span class="font-bold">L1: </span>{{ superLong(address) }}</span>
                <div>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="toBrowser(fromNetwork, address)">
                  <svg t="1626845948779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2998" width="16" height="16"><path d="M971.034483 576.264828a52.965517 52.965517 0 0 0-52.965517 52.965517v271.183448a17.655172 17.655172 0 0 1-17.655173 17.655173h-776.827586a17.655172 17.655172 0 0 1-17.655173-17.655173v-776.827586a17.655172 17.655172 0 0 1 17.655173-17.655173h270.830345a52.965517 52.965517 0 0 0 0-105.931034H123.586207A123.586207 123.586207 0 0 0 0 123.586207v776.827586A123.586207 123.586207 0 0 0 123.586207 1024h776.827586a123.586207 123.586207 0 0 0 123.586207-123.586207v-271.183448a52.965517 52.965517 0 0 0-52.965517-52.965517z" fill="#656A7D" p-id="2999"></path><path d="M953.37931 0h-233.754482a52.965517 52.965517 0 0 0 0 105.931034h123.586206L462.212414 486.929655a52.965517 52.965517 0 0 0 37.428965 90.394483 53.318621 53.318621 0 0 0 37.428966-15.536552L918.068966 180.788966v123.586206a52.965517 52.965517 0 0 0 105.931034 0V70.62069a70.62069 70.62069 0 0 0-70.62069-70.62069z" fill="#656A7D" p-id="3000"></path></svg>
                </span>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="copy(address)">
                  <svg t="1626840038256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2793" width="16" height="16"><path d="M637.631045 268.991045h-519.641791A117.683582 117.683582 0 0 0 0 386.368955v519.641791a117.989254 117.989254 0 0 0 117.683582 117.989254h519.641791a117.683582 117.683582 0 0 0 117.377911-117.683582v-519.641791a117.37791 117.37791 0 0 0-117.072239-117.683582z m25.676418 637.325373a25.98209 25.98209 0 0 1-25.676418 25.982089h-519.641791a25.98209 25.98209 0 0 1-26.287761-25.982089v-519.641791a25.98209 25.98209 0 0 1 25.982089-25.676418h519.641791a25.98209 25.98209 0 0 1 25.676418 25.676418z" fill="#656A7D" p-id="2794"></path><path d="M906.316418 0H404.403582a117.989254 117.989254 0 0 0-117.683582 117.683582v28.733134h91.701493v-28.733134a25.98209 25.98209 0 0 1 25.982089-25.982089h501.912836a25.98209 25.98209 0 0 1 25.982089 25.982089v501.912836a25.98209 25.98209 0 0 1-25.982089 25.982089h-28.733134v91.701493h28.733134a117.989254 117.989254 0 0 0 117.683582-117.683582V117.683582A117.989254 117.989254 0 0 0 906.316418 0z" fill="#656A7D" p-id="2795"></path></svg>
                </span>
                  <span class="icon_pop ml-4 cursor-pointer"  @click.stop="disConnect">
                  <svg t="1626845988453" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3167" width="16" height="16"><path d="M821.32629 141.016949a46.489104 46.489104 0 1 0-58.886199 72.523003 402.905569 402.905569 0 1 1-503.012107 0A46.489104 46.489104 0 0 0 201.471568 141.016949a495.883777 495.883777 0 1 0 619.854722 0z" fill="#EC7E62" p-id="3168"></path><path d="M511.398929 381.520581a46.489104 46.489104 0 0 0 46.489104-46.489104V46.489104a46.489104 46.489104 0 0 0-92.978208 0v288.542373a46.489104 46.489104 0 0 0 46.489104 46.489104z" fill="#EC7E62" p-id="3169"></path></svg>
                </span>
                </div>
              </div>
              <div class="text-left mt-5 size-36 font-bold">{{ currentChainAsset && currentChainAsset.balance }} {{ currentChainAsset && currentChainAsset.symbol }}</div>
            </div>
            <div class="account-cont mt-4">
              <div class="account-info_pop">
                <span class="size-32"><span class="font-bold">L2: </span><span class="size-32">{{ currentAccount && superLong(currentAccount.address.NERVE) || '' }}</span></span>
                <div class="d-flex align-items-center">
                  <span class="icon_pop ml-4 cursor-pointer" @click="toBrowser('NERVE', currentAccount.address.NERVE)">
                    <svg t="1626845948779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2998" width="16" height="16"><path d="M971.034483 576.264828a52.965517 52.965517 0 0 0-52.965517 52.965517v271.183448a17.655172 17.655172 0 0 1-17.655173 17.655173h-776.827586a17.655172 17.655172 0 0 1-17.655173-17.655173v-776.827586a17.655172 17.655172 0 0 1 17.655173-17.655173h270.830345a52.965517 52.965517 0 0 0 0-105.931034H123.586207A123.586207 123.586207 0 0 0 0 123.586207v776.827586A123.586207 123.586207 0 0 0 123.586207 1024h776.827586a123.586207 123.586207 0 0 0 123.586207-123.586207v-271.183448a52.965517 52.965517 0 0 0-52.965517-52.965517z" fill="#656A7D" p-id="2999"></path><path d="M953.37931 0h-233.754482a52.965517 52.965517 0 0 0 0 105.931034h123.586206L462.212414 486.929655a52.965517 52.965517 0 0 0 37.428965 90.394483 53.318621 53.318621 0 0 0 37.428966-15.536552L918.068966 180.788966v123.586206a52.965517 52.965517 0 0 0 105.931034 0V70.62069a70.62069 70.62069 0 0 0-70.62069-70.62069z" fill="#656A7D" p-id="3000"></path></svg>
                  </span>
                  <span class="icon_pop ml-4 cursor-pointer" @click.stop="copy(currentAccount.address.NERVE)">
                    <svg t="1626840038256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2793" width="16" height="16"><path d="M637.631045 268.991045h-519.641791A117.683582 117.683582 0 0 0 0 386.368955v519.641791a117.989254 117.989254 0 0 0 117.683582 117.989254h519.641791a117.683582 117.683582 0 0 0 117.377911-117.683582v-519.641791a117.37791 117.37791 0 0 0-117.072239-117.683582z m25.676418 637.325373a25.98209 25.98209 0 0 1-25.676418 25.982089h-519.641791a25.98209 25.98209 0 0 1-26.287761-25.982089v-519.641791a25.98209 25.98209 0 0 1 25.982089-25.676418h519.641791a25.98209 25.98209 0 0 1 25.676418 25.676418z" fill="#656A7D" p-id="2794"></path><path d="M906.316418 0H404.403582a117.989254 117.989254 0 0 0-117.683582 117.683582v28.733134h91.701493v-28.733134a25.98209 25.98209 0 0 1 25.982089-25.982089h501.912836a25.98209 25.98209 0 0 1 25.982089 25.982089v501.912836a25.98209 25.98209 0 0 1-25.982089 25.982089h-28.733134v91.701493h28.733134a117.989254 117.989254 0 0 0 117.683582-117.683582V117.683582A117.989254 117.989254 0 0 0 906.316418 0z" fill="#656A7D" p-id="2795"></path></svg>
                  </span>
                </div>
              </div>
              <div class="text-left mt-3 size-36 font-bold">{{ nerveChainAsset && nerveChainAsset.balance || 0 }} {{ nerveChainAsset && nerveChainAsset.symbol }}</div>
            </div>
          </div>
          <div class="tab_bar d-flex align-items-center size-30 mt-5 ml-4">
            <span class="cursor-pointer" :class="{'active': orderType === 3}"  @click="getOrderList(fromAddress)">Swap{{ lang === 'cn' && $t("popUp.popUp5") || '' }}</span>
            <span class="ml-3 cursor-pointer" :class="{'active': orderType === 1}" @click="getTxOrderList(fromAddress)">L1{{ lang === 'cn' && $t("popUp.popUp5") || '' }}</span>
            <span class="ml-3 cursor-pointer" :class="{'active': orderType === 2}"  @click="getL2OrderList(fromAddress)">L2{{ lang === 'cn' && $t("popUp.popUp5") || '' }}</span>
          </div>
          <div class="customer-p pt-1">
            <div class="order-list mt-3" v-loading="orderLoading">
              <div class="fix-cont">
                <div class="d-flex align-items-center mb-3 cursor-pointer"
                     @click="linkToUrl(item.fromHash || item.txHash || item.hash, item)"
                     v-for="(item, index) in orderList"
                     :key="item.id">
                  <template>
                    <span class="w-240 text-primary" v-if="orderType===3">{{ item.type === 2 ? $t("popUp.popUp3") : $t("popUp.popUp4") }}</span>
                    <span class="w-240 text-primary" v-else-if="orderType===2">
                      {{ item.type === 1 ? $t("popUp.popUp1") + 'L2' : item.type === 2 ? $t("popUp.popUp2") + 'L2' : item.type===3 ? $t("popUp.popUp7") : item.type===4 ? $t("popUp.popUp6") : item.type === 5 ? $t("popUp.popUp8") : "" }}
                    </span>
                    <span class="w-240 text-primary" v-else>{{ superLong(item.hash) }}</span>
                  </template>
                  <span>{{ item.createTime }}</span>
                  <span class="status-icon">
                    <!--L2网络订单-->
                    <i class="el-icon-loading" style="color: #6EB6A9" v-if="orderType === 2 && item.status === 0"/>
                    <i class="el-icon-success" style="color: #6EB6A9" v-if="orderType === 2 && item.status === 1"/>
                    <i class="el-icon-error" style="color: #eb7d62" v-if="orderType === 2 && item.status === -1"/>
                    <!--L1网络订单-->
                    <i class="el-icon-loading" style="color: #6EB6A9" v-if="orderType === 1 && item.status === 0"/>
                    <i class="el-icon-success" style="color: #6EB6A9" v-if="orderType === 1 && item.status === 1"/>
                    <i class="el-icon-error" style="color: #eb7d62" v-if="orderType === 1 && item.status === -1"/>
                    <!--swap订单-->
                    <i class="el-icon-loading" style="color: #6EB6A9" v-if="orderType === 3 && item.status !== 5 && item.status !== 4"/>
                    <i class="el-icon-success" style="color: #6EB6A9" v-else-if="orderType === 3 && item.status === 4"/>
                    <i class="el-icon-error" style="color: #eb7d62" v-else-if="orderType === 3 && item.status === 5"/>
                </span>
                </div>
                <div class="text-center size-28 mb-3" v-if="orderList.length === 0">No Data</div>
              </div>
            </div>
          </div>
        </div>
      </pop-up>
    </div>
  </div>
</template>

<script>
import Pop from "../Pop/Pop";
import PopUp from "../PopUp/PopUp";
import {ETHNET} from "@/config";
import {addressNetworkOrigin, copys, divisionDecimals, hashLinkList, supportChainList, tofix} from "../../api/util";

const lang = localStorage.getItem("locale") || 'cn'

const linkList = {
  Ethereum: 'https://etherscan.io/tx/',
  BSC: 'https://bscscan.com/tx/',
  Heco: 'https://hecoinfo.com/tx/',
  OKEcChain: 'https://www.oklink.com/okexchain/tx/',
  NULS: 'https://nulscan.io/transaction/info?hash=',
  Nerve: 'https://scan.nerve.network/transaction/info?hash='
}

export default {
  name: "HeaderBar",
  props: {
    // showConnect: {
    //   type: Boolean,
    //   default: false
    // },
    address: String,
    // currentAccount: {
    //   type: Object,
    //   default: () => null
    // },
    headerColor: {
      type: String,
      default: "#ffffff"
    }
  },
  components: { Pop, PopUp },
  data() {
    return {
      showPop: false,
      showAccount: false,
      supportChainList: supportChainList,
      currentChain: this.$store.state.network, // 当前所选则的链
      showDropList: false, // 下拉菜单
      orderList: [], // 订单列表
      orderType: 3, // 当前选择的订单类型
      // fromAddress: '',
      currentChainAsset: null, // 当前选择的链上的主资产信息
      nerveChainAsset: null, // nerve链上的主资产信息/L2
      orderLoading: false,
      lang: '',
      showLoading: false,
      statusTimer: null
    }
  },
  created() {
    if (this.statusTimer) clearInterval(this.statusTimer);
    this.currentAccount && this.initAssetInfo();
    this.getOrderStatus(this.fromAddress);
    this.statusTimer = setInterval(() => {
      this.getOrderStatus(this.fromAddress);
    }, 15000);
  },
  watch: {
    '$store.state.network': {
      handler(val) {
        this.currentChain = val
      }
    },
    "$store.state.lang": {
      handler(val) {
        this.lang = val
      },
      immediate: true,
      deep: true
    },
    currentChain(val) {
      if (val) {
        this.$store.commit("changeNetwork", val);
        this.initAssetInfo();
      }
    },
    orderType(val) {
      this.orderList = [];
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
          // this.fromAddress = val;
          this.$store.commit('changeFromAddress', val);
          this.initAssetInfo();
        }
      }
    }
  },
  computed: {
    isSwap() {
      return window.location.hash.indexOf('swap') > -1;
    },
    isMobile() {
      return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    },
    isNerveTo() {
      return window.location.hash.indexOf('transfer') > -1;
    },
    l1ChainList() {
      const tempList = supportChainList.filter(chain => chain.label !== "NULS" && chain.label !== "NERVE");
      // const tempList = supportChainList;
      return tempList.map(chain => ({
        chainId: chain[ETHNET],
        rpcUrls: chain.rpcUrl ? [chain.rpcUrl[ETHNET]] : [],
        chainName: chain.value,
        nativeCurrency: {
          name: chain.value,
          symbol: chain.symbol,
          decimals: chain.decimals,
        },
        blockExplorerUrls: [chain.origin]
      }));
    }
  },
  methods: {
    toBrowser(network, address) {
      this.isMobile ? window.location.href = addressNetworkOrigin[network || this.fromNetwork] + address || this.address : window.open(addressNetworkOrigin[network || this.fromNetwork] + address || this.address);
    },
    copy(val) {
      if (!val) return;
      copys(val);
      this.$toast(this.$t("tips.tips13"))
    },
    showDropClick() {
      this.showDropList = !this.showDropList;
      // console.log(this.showDropList);
    },
    // 断开连接
    disConnect() {
      this.showAccount = false;
      this.$emit('disConnect')
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
      // if (chain.chainName === "NULS" || chain.chainName === "NERVE") {
      //   this.currentChain = chain.chainName;
      //   this.$store.commit('changeNetwork', chain.chainName);
      //   return;
      // }
      this.showDropList = false;
      // window.ethereum && window.ethereum.request({
      //   method: "wallet_switchEthereumChain",
      //   params: [
      //     {
      //       chainId: chain.chainId
      //     }
      //   ]
      // }).then(() => {
      //   this.currentChain = chain.chainName;
      //   this.$store.commit('changeNetwork', chain.chainName);
      // }).catch(err => {
      //   this.$message({
      //     message: err.message,
      //     offset: 30,
      //     type: "warning"
      //   })
      // });
      if (chain.chainName !== 'Ethereum') {
        window.ethereum && window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chain]
        }).then((res) => {
          console.log(res, 'res')
          this.currentChain = chain.chainName;
          window.location.reload();
          this.$store.commit('changeNetwork', chain.chainName);
        }).catch(err => {
          console.log(err)
          this.$message({
            message: err.message,
            offset: 30,
            type: "warning"
          })
        });
      } else {
        window.ethereum && window.ethereum.request({
          method: "wallet_switchEthereumChain",
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
            message: err.message,
            offset: 30,
            type: "warning"
          })
        });
      }
    },
    // 获取异构链交易信息
    async getTxOrderList(val) {
      this.flag = true;
      this.orderLoading = true;
      this.orderType = 1;
      const params = {
        address: val,
        chain: this.currentChain,
        pageNumber: 1,
        pageSize: 5
      }
      let res = await this.$request({
        url: '/tx/coin/list',
        data: params
      });
      if (res.code === 1000 && res.data) {
        this.orderList = res.data.records.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          }
        });
      }
      this.orderLoading = false;
    },
    // 获取swap订单列表
    async getOrderList(val) {
      this.flag = true;
      this.orderLoading = true;
      this.orderType = 3;
      const params = {
        address: val
      }
      let res = await this.$request({
        url: '/swap/get/list',
        data: params
      });
      if (res.code === 1000) {
        this.orderList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          }
        });
      }
      this.orderLoading = false;
    },
    async getOrderStatus(val) {
      this.flag = true;
      const params = {
        address: val
      }
      let res = await this.$request({
        url: '/swap/get/list',
        data: params
      });
      if (res.code === 1000 && res.data) {
        if (res.data.length > 0) {
          this.showLoading = res.data.some(item => item.status < 4);
        } else {
          this.showLoading = false;
        }
      } else {
        this.showLoading = false;
      }
    },
    // 获取L2订单列表
    async getL2OrderList() {
      this.orderType = 2;
      this.orderLoading = true;
      const address = this.currentAccount.address["NERVE"];
      const res = await this.$request({
        url: '/swap/lp/list',
        data: {
          address
        },
      });
      if (res.code === 1000) {
        this.orderList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          }
        });
      }
      this.orderLoading = false;
    },
    // 跳转查看当前的交易详情
    linkToUrl(hash, item) {
      if (this.orderType===2 || this.orderType === 1) {
        const chain = this.orderType === 2 ? 'NERVE' : this.currentChain;
        this.isMobile ? window.location.href = `${hashLinkList[chain]}${hash}` : window.open(`${hashLinkList[chain]}${hash}`);
      } else {
        this.toOrderDetail(item);
      }
    },
    // 订单详情
    toOrderDetail(item) {
      this.$router.push({ path: '/orderDetail', query: { txHash: item.txHash }});
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
    async getMainAssetInfo(assetInfo) {
      const {chain, address, assetId, chainId, contractAddress } = assetInfo;
      const data = {
        chain,
        address,
        chainId,
        assetId,
        contractAddress,
        refresh: true
      }
      const res = await this.$request({
        url: '/wallet/address/asset',
        data,
      });
      if (res.code === 1000) {
        res.data.balance = res.data && this.numberFormat(tofix(divisionDecimals(res.data.balance, res.data.decimals), 6 -1), 6, false);
        return res.data;
      }
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
        chain: "NERVE",
        address: this.currentAccount && this.currentAccount.address.NERVE || '',
        assetId: config && config["NERVE"].assetId,
        chainId: config && config["NERVE"].chainId,
        contractAddress: ''
      }
      this.currentChainAsset = await this.getMainAssetInfo(tempAsset);
      this.nerveChainAsset = await this.getMainAssetInfo(nerveAsset);
    }
  },
  mounted() {
    window.addEventListener("click", () => {
      if (this.showDropList) this.showDropList = false
    }, false);
  },
  beforeDestroy() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
      this.statusTimer = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import "HeaderBar.scss";
</style>