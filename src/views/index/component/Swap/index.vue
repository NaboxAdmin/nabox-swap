<template>
  <div class="swap-cont" :class="!isDapp && 'p-4'" v-loading="showLoading">
    <div :class="!isDapp && 'swap-info'">
      <div class="d-flex align-items-center space-between text-90 size-28">
        <div>{{ $t("swap.swap1") }}<span class="size-20 sign" v-if="chooseFromAsset">{{ chooseFromAsset.mainNetwork }}</span></div>
        <div>{{ $t("swap.swap4") }}：
          <span class="text-3a" v-if="balanceLoading"><i class="el-icon-loading"/></span>
          <span class="text-3a" v-else-if="available">{{ available | numberFormat }}</span>
          <span class="text-3a" v-else>--</span>
<!--          <span class="word-break">{{ (available || 0.0) | numberFormat }}</span>-->
        </div>
      </div>
      <div class="input-cont mt-2">
        <template>
          <div class="size-28 cursor-pointer text-90 font-bold"
               v-if="!chooseFromAsset"
               @click.stop="openModal('send')">{{ $t('swap.swap12') }}（{{ $t('swap.swap13') }}）</div>
          <div class="coin-cont cursor-pointer d-flex align-items-center" @click.stop="openModal('send')" v-else>
            <div class="image-cont">
              <img :src="getPicture(chooseFromAsset.symbolImg)" @error="pictureError" alt="">
            </div>
            <div class="d-flex align-items-center space-between direction-column size-30 ml-1">
              <span class="font-bold">{{ chooseFromAsset.symbolImg }}</span>
            </div>
          </div>
        </template>
        <div class="icon-cont" @click.stop="openModal('receive')">
          <img src="../../../../assets/image/drop_down.png" alt="">
        </div>
        <div class="space-cont"/>
        <div class="input-item align-items-center d-flex flex-1">
          <input class="flex-1"
                 placeholder="0.00"
                 @input="fromAmountInput"
                 @focus="amountFocus('from')"
                 v-model="fromAmount">
          <span class="text-primary size-28 cursor-pointer" @click="maxAmount">{{ $t("swap.swap3") }}</span>
        </div>
      </div>
      <div class="text-red mt-2 ml-2 size-28" v-if="amountMsg">{{ amountMsg }}</div>
      <div class="down-icon" @click="switchAssetClick">
        <img v-if="switchAsset" src="@/assets/image/switch.png" alt="">
        <img v-else src="@/assets/image/swap.png" alt="">
      </div>
      <div class="d-flex mt-05 align-items-center space-between text-90 size-28">
        <div>{{ $t("swap.swap2") }}<span class="size-20 sign" v-if="chooseToAsset">{{ chooseToAsset.mainNetwork }}</span></div>
      </div>
      <div class="input-cont mt-2">
        <template>
          <div class="size-28 cursor-pointer text-90 font-bold"
               @click.stop="openModal('receive')"
               v-if="!chooseToAsset">{{ $t('swap.swap12') }}（{{ $t('swap.swap13') }}）</div>
          <div class="coin-cont cursor-pointer d-flex align-items-center" @click.stop="openModal('receive')" v-else>
            <div class="image-cont">
              <img :src="getPicture(chooseToAsset.symbolImg)" @error="pictureError">
            </div>
            <div class="d-flex align-items-center space-between direction-column size-30 ml-1">
              <span class="font-bold">{{ chooseToAsset.symbolImg }}</span>
            </div>
          </div>
        <div class="icon-cont" @click.stop="openModal('receive')">
          <img src="../../../../assets/image/drop_down.png" alt="">
        </div>
        </template>
        <div class="space-cont"/>
        <div class="input-item align-items-center d-flex flex-1">
          <input class="flex-1"
                 placeholder="0.00"
                 @input="toAmountInput"
                 @focus="amountFocus('to')"
                 v-model="toAmount">
        </div>
      </div>
    </div>
    <div class="swap-info d-flex direction-column">
      <template>
        <div class="d-flex space-between size-28">
          <span class="text-90">{{ $t("swap.swap5") }}</span>
          <span class="text-3a" v-if="currentPlatform">1{{ chooseFromAsset && chooseFromAsset.symbol }} ≈ {{ currentPlatform && currentPlatform.swapRate }} {{ chooseToAsset && chooseToAsset.symbol }}</span>
          <span v-else>--</span>
        </div>
      </template>
      <template>
        <div class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap6") }}</span>
          <span class="text-3a"  v-if="currentPlatform && currentPlatform.fee"><span v-if="!!Number(transferFee)">{{ transferFee | numberFormat }}{{ chooseFromAsset && chooseFromAsset.symbol }}</span> {{ !!Number(transferFee) && '+' || '' }} {{ currentPlatform.fee }}{{chooseToAsset && chooseToAsset.symbol}}</span>
          <span class="text-3a" v-else>--</span>
        </div>
      </template>
      <div class="d-flex space-between size-28 mt-3">
        <span class="text-90">{{ $t("swap.swap20") }}</span>
        <span class="text-3a" v-if="currentPlatform && currentPlatform.minReceive">
          {{ currentPlatform.minReceive | numberFormat }}{{ chooseToAsset && chooseToAsset.symbol }}
        </span>
        <span class="text-3a" v-else>--</span>
      </div>
      <div class="d-flex space-between size-28 mt-3">
        <span class="text-90">{{ $t("swap.swap7") }}</span>
        <span class="text-3a d-flex">
          <span class="d-flex" v-if="currentPlatform && currentPlatform.platform">
            <span class="sign size-22 mr-1" v-if="currentPlatform && currentPlatform.isBest">{{ $t("swap.swap19") }}</span>
            <span class="d-flex align-items-center cursor-pointer" @click="showPop=true">
              <span class="coin-icon_small">
                <img v-if="currentPlatform && currentPlatform.platform === 'NaboxPool'" src="@/assets/image/Nabox.png" alt="">
                <img v-if="currentPlatform && currentPlatform.platform === 'swft'" src="@/assets/image/swft.png" alt="">
              </span>{{ currentPlatform.platform }}
            </span>
          </span>
          <span v-else>--</span>
          </span>
      </div>
      <div class="btn size-30 cursor-pointer" :class="!canNext && 'opacity_btn'" @click="nextStep">{{ $t("swap.swap8") }}</div>
<!--      <button @click="test">test</button>-->
    </div>
    <div class="order-list" v-if="!isDapp">
      <div class="list-item">
        <div class="size-36 font-bold">{{ $t('swap.swap11') }}</div>
        <div class="size-28 mt-5 d-flex align-items-center space-between"
             v-if="orderList.length > 0"
             v-for="(item, index) in orderList"
             @click="toOrderDetail(item)"
             :key="item.id">
          <span>{{ item.amount }} {{ item.symbol  }} {{ $t('swap.swap14') }} {{ item.swapSuccAmount }} {{ item.swapSymbol }}</span>
          <span>{{ item.createTime }}</span>
          <template>
            <i class="el-icon-loading" style="color: #6EB6A9" v-if="item.status !== 5 && item.status !== 4"/>
            <i class="el-icon-success" style="color: #6EB6A9" v-else-if="item.status === 4"/>
            <i class="el-icon-error" style="color: #eb7d62" v-else-if="item.status === 5"/>
          </template>
<!--          <span v-if="index===0" class="order-icon">-->
<!--                  <svg t="1626399518824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1288" width="17" height="17"><path d="M709.570095 118.362074a37.044619 37.044619 0 0 1-16.865843-3.614109A424.657824 424.657824 0 0 0 630.059694 90.352729 37.64697 37.64697 0 0 1 650.539646 18.974073a543.923426 543.923426 0 0 1 74.992765 27.406994 37.64697 37.64697 0 0 1-15.962316 71.981007zM870.699128 859.8568a38.550498 38.550498 0 0 1-24.696413-9.035273 37.948146 37.948146 0 0 1-2.710582-53.308109 426.163703 426.163703 0 0 0 63.24691-96.376244 37.64697 37.64697 0 1 1 67.764547 32.828158 518.624662 518.624662 0 0 1-74.089238 112.940911 37.345794 37.345794 0 0 1-29.515224 12.950557z m113.543262-265.03467h-3.614109a37.64697 37.64697 0 0 1-33.731685-40.959904q1.807055-20.781128 1.807054-41.562255a430.68134 430.68134 0 0 0-6.324691-73.788062 37.64697 37.64697 0 1 1 74.390413-12.649382A517.721135 517.721135 0 0 1 1023.997591 511.998795c0 16.263491 0 32.526982-2.409407 48.489298a37.64697 37.64697 0 0 1-37.345794 34.334037z m-60.235152-282.201689a37.345794 37.345794 0 0 1-32.526983-18.672897 451.763643 451.763643 0 0 0-70.475128-90.352729A37.64697 37.64697 0 1 1 873.40971 150.587881a508.685862 508.685862 0 0 1 82.522158 107.218571 37.345794 37.345794 0 0 1-13.854085 51.19988 34.936388 34.936388 0 0 1-18.974073 3.614109zM673.429004 995.687069a37.64697 37.64697 0 0 1-12.649382-72.884534 473.448298 473.448298 0 0 0 60.235152-28.009346 37.64697 37.64697 0 1 1 36.442267 65.656316A493.024722 493.024722 0 0 1 686.379561 993.880014a38.851673 38.851673 0 0 1-12.950557 1.807055zM511.998795 1023.997591a511.998795 511.998795 0 0 1 0-1023.997591 37.64697 37.64697 0 0 1 0 75.29394 436.704855 436.704855 0 0 0-69.872776 867.687371l-9.938801-16.263492a37.64697 37.64697 0 0 1 64.752789-38.851673l47.284595 79.209226A37.345794 37.345794 0 0 1 511.998795 1023.997591z" fill="#333333" p-id="1289"></path><path d="M680.356046 667.405488a37.044619 37.044619 0 0 1-21.383479-6.927042L490.31414 542.116371a38.249322 38.249322 0 0 1-15.962315-30.117576V227.3877a37.64697 37.64697 0 0 1 75.293941 0v264.733495l152.394935 106.61622a37.64697 37.64697 0 0 1-21.684655 68.668073z" fill="#333333" p-id="1290"></path></svg>-->
<!--                </span>-->
          </div>
          <div class="text-center mt-3 size-28" v-if="orderList.length === 0">{{ $t('swap.swap15') }}</div>
        </div>
      </div>
    <CoinModal :show-modal.sync="showModal"
           :modal-type="modalType"
           :coin-list="dialogCoinList"
           :from-chain="chooseFromAsset && chooseFromAsset.symbol || ''"
           :from-asset="chooseFromAsset"
           :to-asset="chooseToAsset"
           :from-address="fromAddress"
           :from-network="fromNetwork"
           :support-advanced="chooseFromAsset && chooseFromAsset.isSupportAdvanced === 'Y' || false"
           @select="selectCoin"
    />
    <pop-modal :show="showPop" :custom-class="true">
      <div class="route-cont">
        <div class="header-cont size-36 font-bold mt-2">
          {{ $t('swap.swap7') }}
          <div class="back-icon cursor-pointer" @click="showPop=false">
            <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"></path></svg>
          </div>
        </div>
        <div class="route-item cursor-pointer"
             @click="routeClick(item)"
             :class="{active_choose: item.isChoose}"
             v-for="(item, index) in platformList">
          <div class="d-flex h-86 direction-column flex-1">
            <div class="size-28">
              <span class="text-90">{{ $t('swap.swap17') }}</span>
<!--              {{ this.chooseToAsset.symbol }}-->
              <span class="text-3a ml-3">{{ item.minReceive }}{{ item.asset && item.asset.symbol }}</span>
            </div>
            <div class="d-flex size-28 mt-23">
              <span class="text-90 mr-3">{{ $t('swap.swap18') }}</span>
              <div class="d-flex align-items-center">
                <div class="route-icon" v-if="item.platform === 'NaboxPool'">
                  <img src="@/assets/image/Nabox.png" alt="">
                </div>
                <div class="route-icon" v-if="item.platform === 'swft'">
                  <img src="@/assets/image/swft.png" alt="">
                </div>
                <span class="size-26">{{ item.platform }}</span>
                <span class="sign size-22" v-if="item.isBest">{{ $t('swap.swap19') }}</span>
              </div>
            </div>
          </div>
          <div class="success-icon" v-if="item.isChoose">
            <img src="@/assets/image/choose.png" alt="">
          </div>
        </div>
      </div>
    </pop-modal>
  </div>
</template>

<script>
import CoinModal from "./Modal/CoinModal";
import PopUp from "../../../../components/PopUp/PopUp";
// import CoinModal from "@/components/Modal/Modal";
// import Modal from "../Pool/Modal/Modal";
import {
  debounce,
  Division,
  divisionDecimals,
  Minus,
  Plus,
  supportChainList,
  Times,
  timesDecimals,
  tofix
} from "@/api/util";
import {ETransfer} from "@/api/api";
import {NULS_INFO} from "@/config";

export const valideNetwork = supportChainList.map(v => {
  return v.SwftChain
});
export const networkToChain = {};
valideNetwork.map(v=> {
  const chain = supportChainList.filter(item => item.SwftChain === v)[0]
  networkToChain[v] = {
    chain: chain.value,
    chainId: chain.chainId,
    assetId: chain.assetId
  }
});
const swftFeeRate = 0.001;
export default {
  name: "Swap",
  // keep-alive: true,
  components: {
    CoinModal,
    'pop-modal': PopUp
  },
  data() {
    this.getFeeDebounce = debounce(this.getStableTransferFee, 500);
    return {
      showModal: false,
      showLoading: false,
      modalType: '',
      supportList: [],
      transferFee: 0, // 发送交易需要消耗的手续费
      dialogCoinList: [], // 模态框展示的列表
      fromCoinList: [],
      coinList: [], // 当前支持的币
      chooseFromAsset: null, // 当前选择的资产
      chooseToAsset: null, // 需要兑换的资产
      available: 0, // 当前可用余额
      fromAmount: '', // 需要兑换的数量
      toAmount: '', // 兑换数量
      min: '', // 最小兑换数量
      max: '', // 最大兑换数量
      amount: '',
      swapRate: '', // 兑换汇率
      amountMsg: '', // 提示
      feeLoading: false, // 手续费加载
      withdrawFee: '', // 提现需要的手续费
      fee: '', // swft收取的手续费
      estimatedAmount: '', // 扣除手续费过后预计收到的资产数量
      rateLoading: false, // 汇率加载
      isFirstRequest: false, // 是否为第一次请求
      times: 10000, // 轮询时间
      feeTimer: null,
      rateTimer: null,
      amountTimer: null,
      focusType: '',
      orderList: [],
      stableFromAsset: null,
      stableToAsset: null,
      stableFee: '', // 稳定币兑换手续费
      stableFeeLoading: false,
      orderTimer: null,
      balanceRequest: true,
      balanceLoading: false, // 余额加载
      showPop: false,
      lpCoinList: [], // nerve上面的流动性池子
      currentFromLpBalance: null, // 当前选择的from的稳定币余额
      currentToLpBalance: null, // 当前选择的to的稳定币余额
      checkLpBalanceBoo: true,
      checkLpStableFeeBoo: true,
      currentPlatform: null, // 当前最优平台
      platformList: [], // 当前可选择的swapPlatform
      platformConfig: ['NaboxPool', 'swft'],
      lpCountFull: true,
      switchAsset: false
    }
  },
  created() {
    // setTimeout 0 不然获取不到地址
    setTimeout(() => {
      this.getOrderList(this.$store.state.fromAddress);
      this.getCoins();
    }, 0);
    this.getLiquidityInfo(); // 获取当前池子的余额
    if (!this.$store.state.isDapp) {
      this.orderTimer = setInterval(() => {
        this.getOrderList(this.$store.state.fromAddress);
      }, 20000);
    }
  },
  computed: {
    canNext() {
      if (this.stableFromAsset && this.stableToAsset) {
        return !(!this.fromAmount ||
            !this.toAmount ||
            !this.chooseFromAsset ||
            !this.chooseToAsset ||
            !this.stableFee ||
            this.stableFeeLoading ||
            this.amountMsg);
      } else {
        return !(!this.fromAmount ||
            !this.toAmount ||
            !this.chooseFromAsset ||
            !this.chooseToAsset ||
            !this.swapRate ||
            this.feeLoading ||
            this.amountMsg);
      }
    }
  },
  watch: {
    chooseFromAsset: {
      immediate: true,
      handler(val) {
        if (val) {
          this.fromAmount = '';
          this.toAmount = '';
          // this.stableFromAsset && this.getBalance(val);
        }
        // this.getExchangeRate();
      },
      deep: true
    },
    currentPlatform: {
      handler(val) {
        if (val && val.platform === 'swft') {
          this.checkAmount();
        } else if (val && val.platform === 'NaboxPool') {
          this.amountMsg = val.errorMsg || '';
          !val.errorMsg && this.checkStableFee();
        }
      },
      deep: true
    },
    chooseToAsset: {
      immediate: true,
      handler(val) {
        if (val) {
          this.toAmount = '';
          !this.stableFromAsset && !this.stableToAsset && this.getExchangeRate();
        }
      },
      deep: true
    },
    fromNetwork() {
      this.getCoins();
      this.reset();
    },
    fromAddress() {
      this.getCoins();
      this.reset();
    },
    fromAmount: {
      handler(newVal, oldVal) {
        if (newVal && !isNaN(newVal)) {
          const decimals = 8;
          const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
          if (patrn.exec(newVal) || newVal === "") {
            this.fromAmount = newVal;
          } else {
            this.fromAmount = oldVal;
          }
        } else {
          this.fromAmount = "";
          this.amountMsg = "";
        }
      },
      deep: true
    },
    toAmount: {
      handler(newVal, oldVal) {
        // debugger;
        if (newVal) {
          this.checkLpBalance();
          const decimals = 8;
          const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
          if (patrn.exec(newVal) || newVal === "") {
            this.toAmount = newVal;
          } else {
            this.toAmount = oldVal;
          }
        } else {
          this.toAmount = "";
        }
      },
      deep: true
    },
    stableFee: {
      handler(val) {
        if (this.stableFromAsset && this.stableToAsset && this.toAmount && this.fromAmount && this.currentPlatform && this.currentPlatform.platform === 'NaboxPool') {
          // this.currentPlatform.fee = val;
          if (this.focusType==='from') {
            this.toAmount = Minus(this.fromAmount, val);
          } else {
            this.fromAmount = Plus(this.toAmount, val);
          }
          this.checkStableFee();
        } else {
          if (this.focusType==='from') {
            this.toAmount = Minus(this.fromAmount, this.withdrawFee || 0);
          } else {
            this.fromAmount = Plus(this.toAmount, this.withdrawFee || 0);
          }
        }
      },
      deep: true
    },
    swapRate: {
      handler(val) {
        if (this.currentPlatform && this.currentPlatform.platform !== 'NaboxPool') {
          if (this.focusType === 'from') {
            this.toAmount = this.numberFormat(this.formatFloat(Times(val, this.fromAmount)), 8, true);
          } else if (this.focusType === 'to') {
            this.fromAmount = this.numberFormat(this.formatFloat(Division(this.toAmount, val)), 8, true);
          }
        }
      }
    }
  },
  methods: {
    // 同连切换资产
    async switchAssetClick() {
      if (!this.switchAsset) return false;
      if (this.chooseToAsset.isSupportAdvanced !== 'Y') {
        this.$toast('tips.tips23');
      }
      const tempFromAsset = { ...this.chooseFromAsset };
      const tempToAsset = { ...this.chooseToAsset };
      const tempToAmount = this.toAmount;
      const tempFromAmount = this.fromAmount;
      this.chooseToAsset = { ...tempFromAsset };
      this.chooseFromAsset = { ...tempToAsset };
      this.currentPlatform = null;
      await this.getBalance(this.chooseFromAsset, true);
      await this.getExchangeRate();
      this.fromAmountInput();
    },
    // 选择最优路径
    routeClick(platform) {
      this.currentPlatform = platform;
      for (let item of this.platformList) {
        item.isChoose = item.platform === platform.platform;
      }
      this.showPop = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo() {
      const res = await this.$request({
        method: "get",
        url: '/swap/usdn/info'
      });
      if (res.code === 1000 && res.data) {
        this.lpCoinList = res.data.lpCoinList;
      }
    },
    // 获取订单列表
    async getOrderList(val) {
      this.flag = true;
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
            createTime: this.formatTime(item.createTime),
            amount: divisionDecimals(item.amount, item.decimal),
            swapSuccAmount: item.swapSuccAmount && divisionDecimals(item.swapSuccAmount, item.swapDecimal) || 0,
          }
        });
      }
    },

    toOrderDetail(item) {
      this.$router.push({ path: '/orderDetail', query: { txHash: item.txHash }});
    },
    amountFocus(type) {
      this.focusType = type;
    },
    async openModal(type) {
      if (type === 'send') {
        this.dialogCoinList = this.supportList.filter(v => v.chain === this.fromNetwork && v.isSupportAdvanced === 'Y');
      } else {
        this.dialogCoinList = this.supportList
      }
      this.modalType = type;
      this.showModal = true;
    },
    reset() {
      this.chooseFromAsset = null;
      this.chooseToAsset = null;
      this.fromAmount = '';
      this.toAmount = '';
      this.swapRate = '';
      this.amount = '';
      this.available = '';
      this.transferFee = '';
      this.withdrawFee = '';
    },
    // 下一步
    nextStep() {
      if (!this.canNext) return false;
      const { currentPlatform, stableFromAsset, stableToAsset, chooseFromAsset, chooseToAsset, fromAmount, toAmount, swapRate, fromAddress, fromNetwork, amount, fee, withdrawFee, estimatedAmount, transferFee, stableFee } = this;
      const pairAddress = stableFromAsset && stableToAsset && this.chooseFromAsset && this.chooseFromAsset.pairAddress || '';
      const tempParams = {
        address: fromAddress,
        fromAsset: chooseFromAsset,
        toAsset: chooseToAsset,
        fromNetwork,
        fromAmount,
        toAmount,
        swapRate,
        amount,
        fee,
        withdrawFee,
        estimatedAmount,
        transferFee,
        stableFee,
        pairAddress,
        stableFromAsset,
        stableToAsset,
        currentPlatform,
        decimals: this.chooseFromAsset.decimals,
        contractAddress: this.chooseFromAsset.contractAddress
      }
      const params = encodeURIComponent(JSON.stringify(tempParams));
      window.sessionStorage.setItem('swapInfo', JSON.stringify(tempParams));
      this.$router.push({path: '/confirmOrder', query: { orderInfo: params }});
    },
    // 获取swft支持的闪兑列表
    async getCoins() {
      const assetConfig = JSON.parse(sessionStorage.getItem('config'));
      const mainAssetSymbol = assetConfig[this.fromNetwork].symbol;
      const res = await this.$request({
        url: "/swap/exchange/coins",
        data: {
          chain: this.fromNetwork || '',
          address: this.fromAddress
        }
      });
      if (res.code === 1000) {
        const coins = res.data.filter(v => valideNetwork.indexOf(v.mainNetwork) > -1);
        coins.map((v, index) => {
          const chain = networkToChain[v.mainNetwork];
          v.chain = chain.chain;
          v.balance = divisionDecimals(v.balance, v.decimals);
          v.symbol = v.coinCode; // .split("(")[0]
          v.symbolImg = v.coinCode.split("(")[0]
          v.contractAddress = v.contact;
        });
        this.supportList = coins.sort((a, b) => a.symbol > b.symbol ? 1 : -1);
        this.chooseFromAsset = this.supportList.find(item => item.symbolImg === mainAssetSymbol);
        this.chooseFromAsset && await this.getBalance(this.chooseFromAsset);
      }
    },
    // 当前选择的币
    async selectCoin({ coin, type }) {
      this.showModal = false;
      switch (type) {
        case 'send':
          if (this.feeTimer) {
            clearInterval(this.feeTimer);
            this.feeTimer = null;
          }
          if (this.rateTimer) {
            clearInterval(this.rateTimer);
            this.rateTimer = null;
          }
          this.balanceRequest = true;
          this.chooseFromAsset = coin;
          this.stableFromAsset = coin.supportMemo;
          await this.getBalance(coin);
          // this.amountTimer = setInterval(async () => {
          //   await this.getBalance(this.chooseFromAsset);
          // }, this.times);
          await this.getTransferFee();
          // this.feeTimer = setInterval(async () => {
          //   await this.getTransferFee(false);
          // }, this.times);
          if (this.chooseToAsset) {
            if (this.chooseToAsset.mainNetwork === this.chooseFromAsset.mainNetwork) {
              this.switchAsset = true;
            }
            // this.chooseToAsset = null;
            this.currentPlatform = null;
            await this.getExchangeRate();
            this.withdrawFee = await this.getSwapFee(); // 提现手续费
            // this.swapRate = '';
            // this.withdrawFee = '';
          }
          break;
        case 'receive': // 选择接受资产
          if (this.rateTimer) {
            clearInterval(this.rateTimer);
            this.rateTimer = null;
          }
          this.chooseToAsset = coin;
          this.stableToAsset = coin.supportMemo;
          if (this.stableToAsset && this.stableFromAsset && this.fromAmount) {
            this.$nextTick(() => {
              this.toAmount = this.fromAmount;
              this.stableFee = '';
              this.getStableTransferFee();
            });
          }
          if (this.chooseFromAsset) {
            if (this.chooseToAsset.mainNetwork === this.chooseFromAsset.mainNetwork) {
              this.switchAsset = true;
            }
          }
          if (this.fromAmount) {
            this.toAmount = this.swapRate ? this.formatFloat(Times(this.swapRate, this.fromAmount)) : "";
          }
          await this.getExchangeRate();
          // this.setRateTimer();
          this.withdrawFee = await this.getSwapFee(); // 提现手续费
          this.fee = Times(this.fromAmount || 0, swftFeeRate).toFixed(); // swft 收取手续费 0.001
          await this.fromAmountInput();
          break;
        default:
          return false;
      }
    },
    // 获取稳定币交易的手续费
    async getStableTransferFee() {
      this.stableFeeLoading = true;
      const params = {
        fromChain: this.fromNetwork,
        toChain: this.chooseToAsset && this.chooseToAsset.mainNetwork,
        pairAddress: this.chooseFromAsset && this.chooseFromAsset.pairAddress,
        contractAddress: this.chooseFromAsset && this.chooseFromAsset.contractAddress,
        amount: this.fromAmount && timesDecimals(this.fromAmount, this.chooseFromAsset.decimals),
        auth: '1561ced6ef90f5d60ce669ba'
      }
      const res = this.fromAmount && await this.$request({
        methods: 'post',
        url: '/swap/cross/fee',
        data: params
      });
      if (res.code === 1000 && res.data) {
        this.stableFee = this.chooseFromAsset && divisionDecimals(res.data.fee, this.chooseFromAsset.decimals);
        // this.checkStableFee();
        this.stableFeeLoading = false;
        await this.checkLpBalance();
        // 获取当前支持的兑换平台
        this.platformList = this.platformConfig.map(item => ({
          asset: this.chooseToAsset || '',
          platform: item,
          isBest: item === 'NaboxPool',
          fee: this.getPlatformFee(item, this.stableFee),
          minReceive: (Minus(this.fromAmount, this.getPlatformFee(item)) < 0) ? '0' : Minus(this.fromAmount, this.getPlatformFee(item, this.stableFee)),
          swapRate: item === 'NaboxPool' ? 1 : this.swapRate
        }));
        if (this.lpCountFull) {
          this.currentPlatform = this.getBestPlatform(this.platformList)
        } else {
          this.currentPlatform = this.getBestPlatform(this.platformList, this.lpCountFull)
        }
        if (this.currentPlatform && this.currentPlatform.platform === 'swft') {
          this.checkAmount();
        }
      } else {
        this.checkStableFee();
        this.stableFeeLoading = false;
        return ''
      }
    },
    // 刷新汇率
    setRateTimer() {
      this.rateTimer = setInterval(async () => {
        if (this.chooseFromAsset && this.chooseToAsset) {
          await this.getExchangeRate(false);
        } else {
          clearInterval(this.rateTimer);
          this.timer = null;
        }
      }, this.times);
    },
    // 获取钱包余额
    async getBalance(asset, clickBoo=false) {
      if (this.balanceRequest || clickBoo) {
        this.balanceLoading = true;
      }
      if (this.$store.state.network === "NERVE" || this.$store.state.network === "NULS") {
        const params = {
          chain: this.fromNetwork,
          address: this.fromAddress,
          chainId: asset.chainId,
          assetId: asset.assetId,
          contractAddress: asset.contractAddress
        };
        // 关注资产
        await this.$request({
          url: "/wallet/address/asset/focus",
          data: {
            focus: true,
            ...params,
          },
        });
        await this.getAssetInfo(params);
      } else {
        try {
          const transfer = new ETransfer();
          if (asset.contractAddress) {
            const tempAvailable = await transfer.getERC20Balance(asset.contractAddress, asset.decimals, this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
          } else {
            const tempAvailable = await transfer.getEthBalance(this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
          }
        } catch (e) {
          this.available = 0;
          this.$message({
            message: this.$t("tips.tips2"),
            type: "warning",
            duration: 1000,
            offset: 30
          });
        }
      }
      this.balanceLoading = false;
      this.balanceRequest = false;
    },
    // nerve nuls链上获取资产信息
    async getAssetInfo(params) {
      const res = await this.$request({
        url: "/wallet/address/asset",
        data: {
          refresh: true,
          ...params,
        },
      });
      if (res.code === 1000) {
        this.available = divisionDecimals(res.data.balance, res.data.decimals);
      }
    },
    // 计算发送交易消耗的手续费
    async getTransferFee(firstRequest=true) {
      let fee = 0;
      if (firstRequest) this.feeLoading = true;
      if (this.$store.state.network !== "NERVE" && this.$store.state.network !== "NULS") {
        if (!this.chooseFromAsset.contractAddress) {
          const transfer = new ETransfer();
          // const res = await this.$request({
          //   url: '/asset/gasprice',
          //   data: {
          //     chain: this.chooseFromAsset.mainNetwork || '',
          //     isToken: !!this.chooseFromAsset.contact
          //   }
          // });
          const gasLimit = !!this.chooseFromAsset.contact && "150000" || "21000";
          fee = await transfer.getGasPrice(gasLimit);
        }
      } else {
        const { chainId, assetId } = this.chooseFromAsset;
        if (this.$store.state.network === "NULS" && chainId === NULS_INFO.chainId && assetId === NULS_INFO.assetId) {
          fee = 0.001
        }
      }
      this.feeLoading = false;
      this.isFirstRequest = false;
      console.log(fee, '==fee==');
      this.transferFee = tofix(fee, 8, -1);
    },
    // 最大
    maxAmount() {
      this.focusType = 'from';
      if (this.stableToAsset && this.stableFromAsset) {
        if (this.chooseFromAsset && this.available !== "0") {
          this.fromAmount = this.numberFormat(tofix(this.available, 8, -1), 8, true);
          this.toAmount = this.numberFormat(tofix(Minus(this.fromAmount, this.stableFee || 0), 8, -1), 8, true);
          this.getFeeDebounce();
        }
      } else {
        if (this.chooseFromAsset && this.available != "0") {
          this.fromAmount = this.numberFormat(tofix(Minus(this.available, this.transferFee || 0), 8, -1), 8, true);
          this.amount = this.numberFormat(tofix(Minus(this.available, this.transferFee || 0), 8, -1), 8, true);
        }
        if (this.swapRate && this.available !== "0") {
          this.toAmount = this.numberFormat(tofix(Times(this.fromAmount, this.swapRate), 8, -1), 8, true);
        }
        this.chooseToAsset && this.fromAmountInput();
        this.chooseToAsset && this.checkAmount();
      }
    },

    async fromAmountInput() {
      // debugger
      this.amount = this.fromAmount;
      if (this.stableFromAsset && this.stableToAsset) {
        if (this.fromAmount) {
          // this.lpCountFull = true;
          await this.getFeeDebounce();
          this.stableFeeLoading = false;
          if (this.stableFee && this.currentPlatform && this.currentPlatform.platform === 'NaboxPool') {
            this.toAmount = Minus(this.fromAmount, this.stableFee);
          } else if(this.stableFee && this.currentPlatform && this.currentPlatform.platform !== 'NaboxPool') {
            this.toAmount = Minus(this.fromAmount, this.withdrawFee);
          } else {
            this.toAmount = this.fromAmount;
          }
        } else {
          this.toAmount = '';
          this.stableFee = '';
          this.currentPlatform = null;
        }
      } else {
        if (this.chooseFromAsset && !isNaN(Number(this.fromAmount)) && Number(this.fromAmount)) {
          // await this.getExchangeRate(true);
          // if (this.chooseFromAsset && Minus(Plus(this.fromAmount, this.transferFee), this.available) > 0) {
          //   this.amountMsg = `${this.chooseFromAsset.symbol}${this.$t("tips.tips20")}`;
          // } else {
          //   this.amountMsg = '';
          // }
          this.amount = this.formatFloat(this.fromAmount);
          if (this.focusType === 'from') {
            this.toAmount = this.swapRate ?
                this.numberFormat(this.formatFloat(Minus(Times(this.swapRate, this.amount), this.withdrawFee || 0) < 0 ? 0
                :
                Minus(Times(this.swapRate, this.amount), this.withdrawFee || 0) ), 8, true) : "";
          }
          this.platformList = ['swft'].map(item => ({
            platform: item,
            isBest: true,
            fee: this.withdrawFee,
            minReceive: Minus(Times(this.fromAmount, this.swapRate), this.withdrawFee),
            swapRate: this.swapRate,
            isChoose: true
          }));
          this.currentPlatform = this.getBestPlatform(this.platformList);
          // if (this.chooseToAsset) {
          //   this.platformList.push(swftPlatform);
          //   this.currentPlatform = swftPlatform;
          //   this.checkAmount();
          // }
        } else {
          this.toAmount = "";
          this.currentPlatform = null;
        }
      }
    },

    toAmountInput() {
      if (this.stableToAsset && this.stableFromAsset) { // 稳定币
        if (this.toAmount) {
          this.fromAmount = Plus(this.toAmount, this.stableFee || 0);
          this.getFeeDebounce();
          this.fromAmountInput();
          this.checkAmount();
          this.checkLpBalance();
        } else {
          this.fromAmount = '';
          this.stableFee = '';
        }
      } else {
        if (this.chooseToAsset) {
          this.fromAmount = this.swapRate ? this.numberFormat(tofix(Division(Plus(this.toAmount, this.withdrawFee), this.swapRate), 8, -1), 8, true) : "";
          this.amount = this.fromAmount;
          this.fromAmountInput();
          const transformFeeAmount = Times(this.fee, this.swapRate); // swft收取的手续费转换为to资产数量
          this.estimatedAmount = Minus(this.toAmount, Plus(transformFeeAmount, this.withdrawalFee)).toFixed();
          this.checkAmount();
        } else {
          this.toAmount = "";
        }
      }
    },
    // 获取平台的手续费
    getPlatformFee(platform, stableFee = 0) {
      let tempFee;
      switch (platform) {
        case 'NaboxPool':
          tempFee = stableFee;
          break;
        case 'swft':
          tempFee = this.withdrawFee || 0;
          break;
        default:
          tempFee = 0;
      }
      return tempFee || 0
    },
    // 检查稳定币池子是否足够
    async checkLpBalance() {
      const toNetwork = this.chooseToAsset && this.chooseToAsset.mainNetwork;
      const currentLpAsset = this.lpCoinList.find(item => item.chain === toNetwork);
      const currentLpBalance = currentLpAsset && divisionDecimals(currentLpAsset.balance, currentLpAsset.decimals);
      if (this.toAmount && Minus(currentLpBalance, 0) >= 0) {
        this.lpCountFull = Minus(this.toAmount, currentLpBalance) <= 0;
      }
    },
    // 切换当前选择的平台
    getBestPlatform(platformList, isFull = true) {
      if (platformList.length === 0) return false;
      if (isFull) {
        const tempList = platformList.reduce((p, v) => p.minReceive < v.minReceive ? v : p);
        this.platformList.forEach(item => {
          if (item.platform === tempList.platform) {
            item.isBest = true;
            item.isChoose = true;
          } else {
            item.isBest = false;
            item.isChoose = false;
          }
        });
        return platformList.reduce((p, v) => p.minReceive < v.minReceive ? v : p)
      } else {
        const tempList = platformList.filter(item => item.platform !== 'NaboxPool');
        const tempPlatform = platformList.find(item => item.platform !== 'NaboxPool');
        this.platformList.forEach(item => {
          if (item.platform === tempPlatform.platform) {
            item.isBest = true;
            item.isChoose = true;
          } else {
            item.isBest = false;
            item.isChoose = false;
            item.errorMsg = this.$t('swap.swap27')
          }
        });
        return tempPlatform;
      }
    },
    // 检查稳定币手续费是否足够
    checkStableFee() {
      if (!this.chooseFromAsset || !this.chooseToAsset) return false;
      // console.log(Minus(Plus(this.fromAmount, 0), this.available) > 0, (Minus(this.fromAmount, this.stableFee) <= 0), "checkStableFee")
      if (Minus(Plus(this.fromAmount, 0), this.available) > 0) { // 余额不足
        this.amountMsg = this.chooseFromAsset.symbol + this.$t("tips.tips20");
      } else if (!(Minus(Plus(this.fromAmount, 0), this.available) > 0) && (Minus(this.fromAmount, this.stableFee) <= 0)) { // 最小兑换数量
        this.amountMsg = `${this.$t("tips.tips3")}${Plus(this.stableFee, 0)}`;
      } else {
        // this.checkLpBalance();
        this.amountMsg = "";
      }
    },

    formatFloat(float) {
      if (!float) return "";
      const _float = parseFloat(float);
      if (_float===0) {
        return 0
      }
      return tofix(float, 8)
    },
    checkAmount() {
      if (!this.min || !this.max) return;
      let msg = "";
      if (this.chooseFromAsset && Minus(Plus(this.fromAmount, this.transferFee), this.available || 0) > 0) {
        msg = `${this.chooseFromAsset.symbol}${this.$t("tips.tips9")}`;
      } else if (Minus(Times(this.fromAmount, this.swapRate), this.withdrawFee) < 0) {
        msg = `${this.$t('swap.swap29')}${this.numberFormat(this.formatFloat(Division(this.withdrawFee, this.swapRate), 2), 2)}${this.chooseFromAsset.symbol}${this.$t('swap.swap30')}`;
      } else if (Minus(this.fromAmount, this.min) < 0 ) {
        msg = this.$t("tips.tips3") + this.min
      } else if (Minus(this.fromAmount, this.max) > 0) {
        msg = this.$t("tips.tips4") + this.max
      }
      this.amountMsg = msg;
    },
    // 通过fromCoin toCoin查询兑换汇率
    async getExchangeRate(firstRequest=true) {
      if (!this.chooseFromAsset || !this.chooseToAsset) return false;
      if (firstRequest) this.rateLoading = true;
      const res = await this.$request({
        url: "/swap/swft/base",
        data: {
          depositCoinCode: this.chooseFromAsset.coinCode,
          receiveCoinCode: this.chooseToAsset && this.chooseToAsset.coinCode || '',
        },
      });
      if (res.code === 1000) {
        this.max = res.data.depositMax;
        this.min = res.data.depositMin;
        this.swapRate = this.numberFormat(tofix(res.data.instantRate, 6));
        if (this.currentPlatform && this.currentPlatform.platform === 'swft') {
          if (this.focusType==='from') {
            this.toAmount = this.swapRate ?
                this.numberFormat(this.formatFloat(Minus(Times(this.swapRate, this.amount), this.withdrawFee || 0) < 0 ? 0
                    :
                    Minus(Times(this.swapRate, this.amount), this.withdrawFee || 0) ), 8, true) : "";
            // this.toAmount = this.fromAmount ? this.numberFormat(tofix(Times(this.swapRate, this.fromAmount), 8, 1), 8, true) : "";
          } else if (this.focusType==='to') {
            this.fromAmount = this.swapRate ? this.numberFormat(tofix(Division(Plus(this.toAmount, this.withdrawFee), this.swapRate), 8, -1), 8, true) : "";
            this.amount = this.fromAmount;
            // this.fromAmount = this.toAmount ? this.numberFormat(tofix(Division(this.toAmount, this.swapRate), 8, 1), 8, true) : "";
          }
          this.checkAmount();
        }
      } else {
        this.$message({
          type: 'warning',
          message: res.msg,
          offset: 30
        });
      }
      this.isFirstRequest = false;
      this.rateLoading = false;
    },
    // 获取手续费
    async getSwapFee() {
      this.feeLoading = true;
      const res = await this.$request({
        url: '/swap/swft/fee',
        data: {
          coinCode: this.chooseToAsset && this.chooseToAsset.coinCode
        }
      });
      if (res.code === 1000) {
        this.feeLoading = false;
        return res.data && res.data[0] && res.data[0].chainFee;
      }
      return ''
    }
  },
  beforeDestroy() {
    if (this.rateTimer) clearInterval(this.rateTimer);
    if (this.feeTimer) clearInterval(this.feeTimer);
    if (this.amountTimer) clearInterval(this.amountTimer);
    if (this.orderTimer) clearInterval(this.orderTimer);
    this.rateTimer = null;
    this.feeTimer = null;
    this.amountTimer = null;
    this.orderTimer = null;
  }
}
</script>

<style lang="scss" scoped>
@import "./index";
</style>