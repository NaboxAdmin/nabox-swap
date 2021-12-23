<template>
  <div>
    <div v-loading="showApproveLoading" v-if="showApproveLoading" class="position-fixed_loading"/>
    <div v-loading="showLoading" v-if="!showOrderDetail" :class="!isDapp && 'p-3'" class="swap-cont">
      <div :class="!isDapp && 'swap-info'">
        <div class="size-30 mb-3 d-flex align-items-center space-between">
          <span class="text-3a font-500">{{ $t('navBar.navBar5') }}</span>
          <span class="slippage-cont" @click="showSlippage=true">
            <img src="@/assets/image/slippage.png" alt="">
          </span>
        </div>
        <div class="d-flex align-items-center space-between text-90 size-28">
          <div>{{ $t("swap.swap1") }}<span v-if="chooseFromAsset" class="size-20 sign">{{ chooseFromAsset.chain }}</span></div>
          <div>{{ $t("swap.swap4") }}：
            <span v-if="balanceLoading" class="text-3a"><i class="el-icon-loading"/></span>
            <span v-else-if="available" class="text-3a">{{ available | numberFormat }}</span>
            <span v-else class="text-3a">--</span>
            <!--          <span class="word-break">{{ (available || 0.0) | numberFormat }}</span>-->
          </div>
        </div>
        <div class="input-cont mt-2">
          <template>
            <div
              v-if="!chooseFromAsset"
              class="coin-cont size-28 cursor-pointer text-90"
              @click.stop="openModal('send')">{{ $t('swap.swap12') }}</div>
            <div v-else class="coin-cont cursor-pointer d-flex align-items-center text-90" @click.stop="openModal('send')">
              <div class="image-cont">
                <img :src="chooseFromAsset.icon" alt="" @error="pictureError">
              </div>
              <div class="w-90 direction-column size-30 ml-1 text-truncate text-3a">
                {{ chooseFromAsset.symbol }}
              </div>
            </div>
          </template>
          <div class="icon-cont" @click.stop="openModal('receive')">
            <img src="@/assets/image/drop_down.png" alt="">
          </div>
          <div class="space-cont"/>
          <div class="input-item align-items-center d-flex flex-1">
            <input
              v-model="amountIn"
              class="flex-1"
              placeholder="0"
              @input="amountInDebounce"
              @focus="amountFocus('from')">
            <span class="text-primary size-28 cursor-pointer" @click="maxAmount">{{ $t("swap.swap3") }}</span>
          </div>
        </div>
        <div v-if="amountMsg" class="text-red mt-2 ml-2 size-28">{{ amountMsg }}</div>
        <div class="down-icon" @click="switchAssetClick">
          <img v-if="switchAsset" src="@/assets/image/switch.png" alt="">
          <img v-else src="@/assets/image/swap.png" alt="">
        </div>
        <div class="d-flex mt-05 align-items-center space-between text-90 size-28">
          <div>{{ $t("swap.swap2") }}<span v-if="chooseToAsset" class="size-20 sign">{{ chooseToAsset.chain }}</span></div>
        </div>
        <div class="input-cont mt-2">
          <template>
            <div
              v-if="!chooseToAsset"
              class="coin-cont size-28 cursor-pointer text-90 text-truncate text-truncate_one"
              @click.stop="openModal('receive')">{{ $t('swap.swap12') }}</div>
            <div v-else class="coin-cont cursor-pointer d-flex align-items-center" @click.stop="openModal('receive')">
              <div class="image-cont">
                <img :src="chooseToAsset.icon || getPicture(chooseToAsset.symbol) || pictureError" @error="pictureError">
              </div>
              <div class="w-90 text-truncate direction-column size-30 ml-1 text-3a">
                {{ chooseToAsset.symbol }}
              </div>
            </div>
            <div class="icon-cont" @click.stop="openModal('receive')">
              <img src="@/assets/image/drop_down.png" alt="">
            </div>
          </template>
          <div class="space-cont"/>
          <div class="input-item align-items-center d-flex flex-1">
            <input
              v-model="amountOut"
              class="flex-1"
              placeholder="0"
              @input="amountOutDebounce"
              @focus="amountFocus('to')">
          </div>
        </div>
      </div>
      <div v-if="needAuth" class="btn size-30 cursor-pointer" @click="approveERC20">
        <span class="mr-2">{{ $t("vaults.over6") }}</span>
        <Loading v-if="approvingLoading" :is-active="false"/>
      </div>
      <div v-else-if="showComputedLoading" class="btn size-30 cursor-pointer opacity_btn">
        <span>
          {{ $t("swap.swap35") }}<span class="point_cont"/>
        </span>
      </div>
      <div v-else :class="!canNext && 'opacity_btn'" class="btn size-30 cursor-pointer" @click="nextStep">{{ $t("swap.swap8") }}</div>
      <div v-if="currentChannel && !showComputedLoading" class="swap-info d-flex direction-column">
        <div v-if="currentChannel.swapRate" class="d-flex space-between size-28">
          <span class="text-90">{{ $t("swap.swap5") }}</span>
          <span class="text-3a w-75">{{ currentChannel.swapRate }}</span>
        </div>
        <div v-if="currentChannel.feeAmount" class="d-flex space-between size-28 mt-3">
          <div class="d-flex align-items-center">
            <span class="text-90">{{ $t("swap.swap6") }}</span>
            <!--            <el-tooltip :manual="false" class="tooltip-item ml-1" effect="dark" :content="$t('swap.swap31')" placement="top">-->
            <!--              <span class="info-icon">-->
            <!--                <img src="@/assets/image/info.png"/>-->
            <!--              </span>-->
            <!--            </el-tooltip>-->
          </div>
          <span class="text-3a">{{ currentChannel.feeAmount | numberFormat }}{{ chooseFromAsset && chooseFromAsset.symbol }}</span>
        </div>
        <div v-if="currentChannel.minReceive" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ (currentChannel && currentChannel.isCross ? $t("swap.swap32") : $t("swap.swap20")) || $t("swap.swap20") }}</span>
          <span class="text-3a">
            {{ currentChannel.minReceive | numberFormat }}{{ chooseToAsset && chooseToAsset.symbol }}
          </span>
        </div>
        <div v-if="currentChannel.impact" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap33") }}</span>
          <span class="text-3a">{{ currentChannel.impact }}%</span>
        </div>
        <div v-if="currentChannel.crossChainFee" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap34") }}</span>
          <span class="text-3a">{{ currentChannel.crossChainFee }}USDT</span>
        </div>
        <div v-if="currentChannel.channel" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap7") }}</span>
          <span class="text-3a d-flex">
            <span class="d-flex">
              <span v-if="currentChannel && currentChannel.isBest" class="sign size-22 mr-1">{{ $t("swap.swap19") }}</span>
              <span class="d-flex align-items-center cursor-pointer" @click="showPop=true">
                <span class="coin-icon_small">
                  <img src="@/assets/image/SwapBox.png" alt="">
                </span>{{ currentChannel.channel }}
              </span>
            </span>
          </span>
        </div>
      </div>
      <!--FIXME:取消在APP内部显示-->
      <div v-if="!isDapp" class="order-list">
        <div class="list-item">
          <div class="size-36 font-bold">{{ $t('swap.swap11') }}</div>
          <div
            v-for="(item, index) in orderList"
            v-if="orderList.length > 0"
            :key="item.id"
            class="size-28 mt-5 d-flex align-items-center space-between"
            @click="toOrderDetail(item)">
            <span>{{ item.amount }} {{ item.symbol }} {{ $t('swap.swap14') }} {{ item.swapSuccAmount }} {{ item.swapSymbol }}</span>
            <span>{{ item.createTime }}</span>
            <template>
              <i v-if="item.status !== 5 && item.status !== 4" class="el-icon-loading" style="color: #6EB6A9"/>
              <i v-else-if="item.status === 4" class="el-icon-success" style="color: #6EB6A9"/>
              <i v-else-if="item.status === 5" class="el-icon-error" style="color: #eb7d62"/>
            </template>
            <!--          <span v-if="index===0" class="order-icon">-->
            <!--                  <svg t="1626399518824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1288" width="17" height="17"><path d="M709.570095 118.362074a37.044619 37.044619 0 0 1-16.865843-3.614109A424.657824 424.657824 0 0 0 630.059694 90.352729 37.64697 37.64697 0 0 1 650.539646 18.974073a543.923426 543.923426 0 0 1 74.992765 27.406994 37.64697 37.64697 0 0 1-15.962316 71.981007zM870.699128 859.8568a38.550498 38.550498 0 0 1-24.696413-9.035273 37.948146 37.948146 0 0 1-2.710582-53.308109 426.163703 426.163703 0 0 0 63.24691-96.376244 37.64697 37.64697 0 1 1 67.764547 32.828158 518.624662 518.624662 0 0 1-74.089238 112.940911 37.345794 37.345794 0 0 1-29.515224 12.950557z m113.543262-265.03467h-3.614109a37.64697 37.64697 0 0 1-33.731685-40.959904q1.807055-20.781128 1.807054-41.562255a430.68134 430.68134 0 0 0-6.324691-73.788062 37.64697 37.64697 0 1 1 74.390413-12.649382A517.721135 517.721135 0 0 1 1023.997591 511.998795c0 16.263491 0 32.526982-2.409407 48.489298a37.64697 37.64697 0 0 1-37.345794 34.334037z m-60.235152-282.201689a37.345794 37.345794 0 0 1-32.526983-18.672897 451.763643 451.763643 0 0 0-70.475128-90.352729A37.64697 37.64697 0 1 1 873.40971 150.587881a508.685862 508.685862 0 0 1 82.522158 107.218571 37.345794 37.345794 0 0 1-13.854085 51.19988 34.936388 34.936388 0 0 1-18.974073 3.614109zM673.429004 995.687069a37.64697 37.64697 0 0 1-12.649382-72.884534 473.448298 473.448298 0 0 0 60.235152-28.009346 37.64697 37.64697 0 1 1 36.442267 65.656316A493.024722 493.024722 0 0 1 686.379561 993.880014a38.851673 38.851673 0 0 1-12.950557 1.807055zM511.998795 1023.997591a511.998795 511.998795 0 0 1 0-1023.997591 37.64697 37.64697 0 0 1 0 75.29394 436.704855 436.704855 0 0 0-69.872776 867.687371l-9.938801-16.263492a37.64697 37.64697 0 0 1 64.752789-38.851673l47.284595 79.209226A37.345794 37.345794 0 0 1 511.998795 1023.997591z" fill="#333333" p-id="1289"></path><path d="M680.356046 667.405488a37.044619 37.044619 0 0 1-21.383479-6.927042L490.31414 542.116371a38.249322 38.249322 0 0 1-15.962315-30.117576V227.3877a37.64697 37.64697 0 0 1 75.293941 0v264.733495l152.394935 106.61622a37.64697 37.64697 0 0 1-21.684655 68.668073z" fill="#333333" p-id="1290"></path></svg>-->
            <!--                </span>-->
          </div>
          <div v-if="orderList.length === 0" class="text-center mt-3 size-28">{{ $t('swap.swap15') }}</div>
        </div>
      </div>
      <CoinModal
        v-if="showModal"
        :show-modal.sync="showModal"
        :modal-type="modalType"
        :coin-list="dialogCoinList"
        :from-chain="chooseFromAsset && chooseFromAsset.symbol || ''"
        :from-asset="chooseFromAsset"
        :to-asset="chooseToAsset"
        :from-address="fromAddress"
        :from-network="fromNetwork"
        :support-advanced="chooseFromAsset && chooseFromAsset.isSupportAdvanced === 'Y' || false"
        :usdt-info="USDT_info"
        :usdtn-info="USDTN_info"
        @select="selectCoin"/>
      <pop-modal :prevent-boo="false" :show="showPop" :custom-class="true">
        <div class="route-cont">
          <div class="header-cont size-36 font-500 mt-2">
            {{ $t('swap.swap7') }}
            <div class="back-icon cursor-pointer" @click="showPop=false">
              <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
            </div>
          </div>
          <div class="route-cont_main">
            <div
              v-for="item in channelConfigList"
              :key="item.channel"
              :class="{active_choose: item.isChoose}"
              class="route-item cursor-pointer"
              @click="routeClick(item)">
              <div class="d-flex h-86 direction-column flex-1">
                <div class="size-28">
                  <span class="text-90">{{ $t('swap.swap17') }}</span>
                  <!--              {{ this.chooseToAsset.symbol }}-->
                  <span class="text-3a ml-3">{{ item.minReceive | numberFormat }}{{ chooseToAsset && chooseToAsset.symbol }}</span>
                </div>
                <div class="d-flex size-28 mt-23">
                  <span class="text-90 mr-3">{{ $t('swap.swap18') }}</span>
                  <div class="d-flex align-items-center">
                    <div class="route-icon">
                      <img src="@/assets/image/SwapBox.png" alt="">
                    </div>
                    <span class="size-26">{{ item.channel }}</span>
                    <span v-if="item.isBest" class="sign size-22">{{ $t('swap.swap19') }}</span>
                  </div>
                </div>
              </div>
              <div v-if="item.isChoose" class="success-icon">
                <img src="@/assets/image/choose.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </pop-modal>
      <pop-modal :prevent-boo="false" :show="showSlippage" :custom-class="true">
        <div class="slippage-modal">
          <div class="header-cont size-36 font-500 mt-2">
            {{ $t('swap.swap36') }}
            <div class="back-icon cursor-pointer" @click="showSlippage=false">
              <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
            </div>
          </div>
          <div class="slippage-switch">
            <span
              v-for="(item, index) in slippageList"
              :key="item"
              :class="{ active_slippage: index===currentIndex }"
              class="font-500"
              @click="slippageClick(item, index)">{{ item }}%</span>
            <span><input v-model="slippage" type="number" @input="slippageInput">%</span>
          </div>
          <div v-if="slippageMsg" class="text-red pl-1 mt-1">{{ slippageMsg }}</div>
        </div>
      </pop-modal>
    </div>
    <ConfirmOrder v-if="showOrderDetail" @back="changeShowDetail" @confirm="confirmChange"/>
  </div>
</template>

<script>
import CoinModal from './Modal/CoinModal';
import PopUp from '@/components/PopUp/PopUp';
import ConfirmOrder from '@/views/confirmOrder/confirmOrder';
import { Loading } from '@/components';
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
} from '@/api/util';
import { ETransfer } from '@/api/api';
import ISwap from './util/iSwap';
import { ISWAP_VERSION, ISWAP_USDT_CONFIG } from './util/swapConfig';

export const valideNetwork = supportChainList.map(v => {
  return v.SwftChain;
});
export const networkToChain = {};
valideNetwork.map(v => {
  const chain = supportChainList.filter(item => item.SwftChain === v)[0];
  networkToChain[v] = {
    chain: chain.value,
    chainId: chain.chainId,
    assetId: chain.assetId
  };
});

export default {
  name: 'Swap',
  components: {
    CoinModal,
    'pop-modal': PopUp,
    ConfirmOrder,
    Loading
  },
  data() {
    this.getFeeDebounce = debounce(this.getStableTransferFee, 500);
    this.amountInDebounce = debounce(this.amountInInput, 500);
    this.amountOutDebounce = debounce(this.amountOutInput, 500);
    return {
      slippageList: ['0.5', '1', '2'],
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
      currentChannel: null, // 当前最优平台
      platformList: [], // 当前可选择的swapPlatform
      platformConfig: ['SwapBox', 'swft'], // 当前支持的通道
      lpCountFull: true, // 流动性是否足够
      switchAsset: false, // 同链切换
      usdtnFromAsset: null, // usdtn from资产
      usdtnToAsset: null, // usdtn to资产
      USDTN_info: {}, // 当前支持的USDTN资产
      USDT_info: {}, // 当前的USDT资产
      currentNetwork: '', // 当前兑换资产选择的网络
      showOrderDetail: false,
      swftError: false,
      fromContractAddress: '',
      toContractAddress: '',
      // todo: 新增参数
      channelConfigList: [],
      amountIn: '', // 输入
      amountOut: '', // 输出
      inputType: 'amountIn',
      showComputedLoading: false, // 计算中
      iSwap: null,
      currentDex: null, // 当前默认的dex
      needAuth: false,
      getAllowanceTimer: null,
      showApproveLoading: false,
      approvingLoading: false,
      slippage: 0.5, // 滑点
      fromAssetDex: null,
      toAssetDex: null,
      limitMin: '', // 最小限制
      limitMax: '', // 最大限制
      showSlippage: true,
      currentIndex: 0,
      slippageMsg: ''
    };
  },
  computed: {
    canNext() {
      return !(!this.amountIn ||
          !this.amountOut ||
          !this.chooseFromAsset ||
          !this.chooseToAsset ||
          !this.currentChannel ||
          this.showComputedLoading ||
          this.amountMsg);
    }
  },
  watch: {
    chooseFromAsset: {
      immediate: true,
      handler(val) {
        if (val) {
          this.fromAmount = '';
          this.toAmount = '';
          this.stableFromAsset = val.supportMemo;
        }
      },
      deep: true
    },
    currentChannel: {
      handler(val) {
        if (val && val.platform === 'swft') {
          this.checkAmount();
        } else if (val && val.platform === 'SwapBox' && !this.usdtnToAsset && !this.usdtnFromAsset) {
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
        }
      },
      deep: true
    },
    amountIn: {
      handler(newVal, oldVal) {
        if (newVal && !isNaN(newVal)) {
          const decimals = 6;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.amountIn = newVal;
          } else {
            this.amountIn = oldVal;
          }
        }
      },
      deep: true
    },
    slippage: {
      handler(newVal, oldVal) {
        if (newVal && !isNaN(newVal)) {
          const decimals = 2;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.slippage = newVal;
          } else {
            this.slippage = oldVal;
          }
        }
      },
      deep: true
    },
    amountOut: {
      handler(newVal, oldVal) {
        // debugger;
        if (newVal) {
          this.checkLpBalance();
          const decimals = 6;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.amountOut = newVal;
          } else {
            this.amountOut = oldVal;
          }
        }
      },
      deep: true
    },
    stableFee: {
      handler(val) {
        if (this.stableFromAsset && this.stableToAsset && this.toAmount && this.fromAmount && this.currentChannel && this.currentChannel.platform === 'SwapBox') {
          if (this.focusType === 'from') {
            this.toAmount = Minus(this.fromAmount, val);
          } else {
            this.fromAmount = Plus(this.toAmount, val);
          }
          this.checkStableFee();
        } else {
          if (this.focusType === 'from') {
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
        if (this.currentChannel && this.currentChannel.platform !== 'SwapBox') {
          if (this.focusType === 'from') {
            this.toAmount = this.numberFormat(this.formatFloat(Times(val, this.fromAmount)), 8, true);
          } else if (this.focusType === 'to') {
            this.fromAmount = this.numberFormat(this.formatFloat(Division(this.toAmount, val)), 8, true);
          }
        }
      }
    }
  },
  created() {
    if (Object.keys(this.$route.query).length > 0) {
      this.fromContractAddress = this.$route.query.fromContractAddress;
      this.toContractAddress = this.$route.query.toContractAddress;
    }
    this.iSwap = new ISwap({ chain: this.fromNetwork });
    this.getUsdtnAssets();
    // setTimeout 0 不然获取不到地址
    setTimeout(() => {
      // this.getOrderList(this.$store.state.fromAddress);
      this.getSwapAssetList();
    }, 0);
    // this.getLiquidityInfo(); // 获取当前池子的余额
    this.getChanelConfig();
    this.initISwapConfig();
    console.log(this.fromNetwork, 'from');
    // encodeParameters();
    // const iSwap = new ISwap();
    // iSwap.getTradeInfo();
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
  },
  methods: {
    // 滑点设置
    slippageInput() {
      if (this.slippage && this.slippage > 0 && Minus(this.slippage, 100) < 0) {
        this.slippageMsg = '';
        this.currentIndex = this.slippageList.indexOf(this.slippage);
      } else {
        this.slippageMsg = this.$t('tips.tips31');
      }
      if (this.slippageList.indexOf(this.slippage) !== -1) {
        this.slippageList = [...this.slippageList];
      }
    },
    slippageClick(item, index) {
      this.currentIndex = index;
      this.slippage = item;
    },
    // 查询异构链token资产授权情况
    async checkCrossInAuthStatus() {
      const transfer = new ETransfer();
      const config = JSON.parse(sessionStorage.getItem('config'));
      const multySignAddress = config[this.fromNetwork]['config']['crossAddress'];
      const contractAddress = this.chooseFromAsset.contractAddress;
      const needAuth = await transfer.getERC20Allowance(
        contractAddress,
        multySignAddress,
        this.fromAddress
      );
      this.needAuth = needAuth;
      if (!needAuth && this.getAllowanceTimer) {
        this.clearGetAllowanceTimer();
      }
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      this.showApproveLoading = true;
      try {
        const transfer = new ETransfer();
        const config = JSON.parse(sessionStorage.getItem('config'));
        const multySignAddress = config[this.fromNetwork]['config']['crossAddress'];
        const contractAddress = this.chooseFromAsset.contractAddress;
        const res = await transfer.approveERC20(
          contractAddress,
          multySignAddress,
          this.fromAddress
        );
        if (res.hash) {
          this.$message({
            message: this.$t('tips.tips14'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: 'warning',
            duration: 2000,
            offset: 30
          });
        }
        this.approvingLoading = true;
        this.showApproveLoading = false;
      } catch (e) {
        console.log(e);
        this.$message.warning({ message: e.message, offset: 30 });
        this.showApproveLoading = false;
      }
    },

    clearGetAllowanceTimer() {
      if (!this.getAllowanceTimer) return;
      clearInterval(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    },

    setGetAllowanceTimer() {
      this.getAllowanceTimer = setInterval(() => {
        this.checkCrossInAuthStatus();
      }, 3000);
    },

    async initISwapConfig() {
      const dexConfig = await this.iSwap.getRouterList();
      const tempConfig = JSON.stringify(dexConfig);
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      const nativeId = tempSupportChainList.find(item => item.chain === this.fromNetwork).nativeId;
      const limitInfo = await this.iSwap.getTradeLimit({
        chainId: nativeId,
        version: ISWAP_VERSION,
        symbol: ISWAP_USDT_CONFIG[nativeId]
      });
      if (limitInfo) {
        this.limitMin = limitInfo.normalMin;
        this.limitMax = limitInfo.normalMax;
        console.log(limitInfo);
        this.orginChannelConfigList = this.orginChannelConfigList && this.orginChannelConfigList.map(channel => {
          if (channel.channel === 'ISWAP') {
            return {
              ...channel,
              limitMin: limitInfo.normalMin,
              limitMax: limitInfo.normalMax
            };
          }
          return {
            ...channel,
            limitMin: 0,
            limitMax: 0
          };
        });
      }
    },
    // 获取当前支持的通道
    async getChanelConfig() {
      // this.orginChannelConfigList = [
      //   {
      //     channel: 'ISWAP'
      //   }
      // ];
      // this.channelConfigList = [
      //   {
      //     channel: 'ISWAP'
      //   }
      // ];
      const res = await this.$request({
        url: '/swap/channel',
        method: 'get'
      });
      if (res.code === 1000 && res.data) {
        console.log(res.data, 'channelConfigList');
        localStorage.setItem('channelConfig', JSON.stringify(res.data));
        this.orginChannelConfigList = res.data;
        this.channelConfigList = res.data;
      }
    },
    // 查询当前支持的usdtn列表
    async getUsdtnAssets() {
      try {
        const res = await this.$request({
          method: 'get',
          url: '/swap/usdtn/assets'
        });
        if (res.code === 1000 && res.data) {
          const tempUsdtnMap = {};
          const tempUsdtMap = {};
          this.USDTN_info = res.data.forEach(item => {
            if (item.symbol === 'USDTN') {
              tempUsdtnMap[item.chain] = {
                chainId: item.chainId,
                symbol: item.symbol,
                contractAddress: item.contractAddress,
                assetId: item.assetId
              };
            } else if (item.symbol === 'USDT') {
              tempUsdtMap[item.chain] = {
                chainId: item.chainId,
                symbol: item.symbol,
                contractAddress: item.contractAddress,
                assetId: item.assetId
              };
            }
          });
          this.USDTN_info = tempUsdtnMap;
          this.USDT_info = tempUsdtMap;
        } else {
          this.USDTN_info = {};
          this.USDT_info = {};
          throw res.msg;
        }
      } catch (e) {
        console.error('erroe:' + e);
      }
    },
    // 下一步
    nextStep() {
      if (!this.canNext) return false;
      const { currentChannel, stableFromAsset, stableToAsset, chooseFromAsset, chooseToAsset, amountIn, amountOut, fromAddress, fromNetwork, currentDex, toAssetDex, fromAssetDex } = this;
      const toChain = this.chooseToAsset.chain;
      const tempParams = {
        address: fromAddress,
        fromAsset: chooseFromAsset,
        toAddress: this.currentAccount['address'][toChain] || '',
        toAsset: chooseToAsset,
        fromNetwork,
        amountIn,
        amountOut,
        stableFromAsset,
        stableToAsset,
        currentChannel,
        currentDex,
        toAssetDex,
        fromAssetDex
      };
      window.sessionStorage.setItem('swapInfo', JSON.stringify(tempParams));
      this.showOrderDetail = true;
      this.$store.commit('changeSwap', false);
    },
    // 获取当前支持的兑换的列表
    async getSwapAssetList() {
      try {
        // this.showLoading = true;
        const data = {
          chain: this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/assets',
          data
        });
        if (res.code === 1000 && res.data.length > 0) {
          console.log(res.data, 'res.data');
          const tempList = res.data.length > 0 && res.data.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
          const tempFromCoin = tempList.find(item => item.contractAddress === this.fromContractAddress);
          const tempToCoin = tempList.find(item => item.contractAddress === this.toContractAddress);
          if (this.fromContractAddress && this.toContractAddress && tempFromCoin && tempToCoin) {
            this.chooseFromAsset = tempFromCoin;
            await this.selectCoin({ coin: this.chooseFromAsset, type: 'send', network: this.fromNetwork });
            this.chooseToAsset = tempToCoin;
            await this.selectCoin({ coin: this.chooseToAsset, type: 'receive', network: this.fromNetwork });
          } else {
            this.chooseFromAsset = tempList.find(item => item.symbol === 'USDT') || tempList[0];
          }
          this.chooseFromAsset && await this.getBalance(this.chooseFromAsset);
          if (this.chooseFromAsset && this.chooseFromAsset.assetId === 0 && this.fromNetwork !== 'NULS') {
            await this.checkCrossInAuthStatus();
          }
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 当前选择的币
    async selectCoin({ coin, type, network }) {
      this.currentNetwork = network;
      this.showModal = false;
      switch (type) {
        case 'send':
          this.currentChannel = null;
          this.chooseFromAsset = coin;
          await this.getBalance(this.chooseFromAsset, true);
          if (this.chooseToAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOutDebounce();
          }
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.switchAsset = true;
          }
          // todo：验证授权权限
          if (this.chooseFromAsset.assetId === 0 && this.fromNetwork !== 'NULS') {
            await this.checkCrossInAuthStatus();
          }
          break;
        case 'receive': // 选择接受资产
          this.chooseToAsset = coin;
          if (this.chooseFromAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOutDebounce();
          }
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.switchAsset = true;
          }
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
        toChain: this.chooseToAsset && this.chooseToAsset.chain,
        pairAddress: this.chooseFromAsset && this.chooseFromAsset.pairAddress,
        contractAddress: this.chooseFromAsset && this.chooseFromAsset.contractAddress,
        amount: this.fromAmount && timesDecimals(this.fromAmount, this.chooseFromAsset.decimals),
        auth: '1561ced6ef90f5d60ce669ba'
      };
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
          isBest: item === 'SwapBox',
          fee: this.getPlatformFee(item, this.stableFee),
          minReceive: (Minus(this.fromAmount, this.getPlatformFee(item, this.stableFee)) < 0) ? '0' : Minus(this.fromAmount, this.getPlatformFee(item, this.stableFee)),
          swapRate: item === 'SwapBox' ? 1 : this.swapRate
        }));
        if (this.lpCountFull) {
          this.currentChannel = this.getBestPlatform(this.platformList);
        } else {
          this.currentChannel = this.getBestPlatform(this.platformList, this.lpCountFull);
        }
      } else {
        this.checkStableFee();
        this.stableFeeLoading = false;
        return '';
      }
    },
    // 获取钱包余额
    async getBalance(asset, clickBoo = false) {
      if (this.balanceRequest || clickBoo) {
        this.balanceLoading = true;
      }
      if (this.$store.state.network === 'NERVE' || this.$store.state.network === 'NULS') {
        const params = {
          chain: this.fromNetwork,
          address: this.fromAddress,
          chainId: asset.chainId,
          assetId: asset.assetId,
          contractAddress: asset.contractAddress
        };
        this.available = this.$store.state.network === 'NULS' ? await this.getNulsAssetBalance(asset) : await this.getNerveAssetBalance(asset);
        console.log(this.available, 'availableavailableavailable');
      } else {
        try {
          const transfer = new ETransfer({
            chain: this.fromNetwork
          });
          if (asset.contractAddress) {
            const tempAvailable = await transfer.getERC20Balance(asset.contractAddress, asset.decimals, this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
          } else {
            const tempAvailable = await transfer.getEthBalance(this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
          }
        } catch (e) {
          console.log(e, 'error');
          this.available = 0;
          this.$message({
            message: this.$t('tips.tips2'),
            type: 'warning',
            duration: 1000,
            offset: 30
          });
        }
      }
      this.balanceLoading = false;
      this.balanceRequest = false;
    },
    async amountInInput() {
      this.inputType = 'amountIn';
      console.log(this.checkBalance(), 'checkBalance');
      if (this.chooseFromAsset && this.chooseToAsset && this.amountIn && this.checkBalance()) {
        this.amountOut = '';
        this.getOptionalChannel('amountIn');
        const tempChannel = await this.getChannelList();
        if (tempChannel) {
          this.amountOut = this.numberFormat(tofix(tempChannel.amountOut || 0, 6, -1), 6);
          this.currentChannel = tempChannel;
        } else {
          this.currentChannel = null;
        }
      } else {
        if (!this.amountIn) { this.amountMsg = ''; }
        this.amountOut = '';
        this.currentChannel = null;
      }
    },
    getOptionalChannel(type) {
      this.channelConfigList = this.orginChannelConfigList.filter(channel => {
        if (channel.limitMin && channel.limitMax && type === 'amountIn') {
          return Minus(this.amountIn, channel.limitMin) >= 0 && Minus(this.amountIn, channel.limitMax) <= 0;
        } else if (channel.limitMin && channel.limitMax && type === 'amountOut') {
          return Minus(this.amountOut, channel.limitMin) >= 0 && Minus(this.amountOut, channel.limitMax) <= 0;
        }
        return channel;
      });
    },
    checkBalance() {
      const { amountIn, available, limitMin, limitMax, chooseFromAsset } = this;
      if (Minus(amountIn, available) > 0) {
        this.amountMsg = `${chooseFromAsset.symbol} ${this.$t('tips.tips9')}`;
        return false;
      } else if (Minus(amountIn, limitMin) < 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
        this.amountMsg = `${this.$t('tips.tips3')}${this.numberFormat(tofix(Division(limitMin, 10), 4, -1), 4)}${chooseFromAsset.symbol}`;
        return false;
      } else if (Minus(this.amountIn, this.limitMax) > 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
        this.amountMsg = `${this.$t('tips.tips4')}${this.numberFormat(tofix(Division(limitMax, 10), 4, -1), 4)}${chooseFromAsset.symbol}`;
        return false;
      }
      return true;
    },
    computedSwapRate(isCross, amountIn, amountOut) {
      return `1${this.chooseFromAsset.symbol}≈${tofix(Division(amountOut, amountIn), 4, -1)}${this.chooseToAsset.symbol}`;
    },
    async amountOutInput() {
      this.inputType = 'amountOut';
      if (this.chooseFromAsset && this.chooseToAsset && this.amountOut) {
        this.amountIn = '';
        this.getOptionalChannel('amountOut');
        const tempChannel = await this.getChannelList();
        if (tempChannel) {
          this.amountIn = this.numberFormat(tofix(tempChannel.amount || 0, 6, -1), 6);
          this.checkBalance();
          this.currentChannel = tempChannel;
        } else {
          this.amountMsg = '';
          this.currentChannel = null;
        }
      } else {
        if (!this.amountMsg) { this.amountMsg = ''; }
        this.amountIn = '';
        this.currentChannel = null;
      }
    },
    // 获取当前支持的config
    async getChannelList() {
      try {
        const isCross = this.chooseToAsset.chain !== this.chooseFromAsset.chain;
        this.showComputedLoading = true;
        this.amountMsg = '';
        const tempChannelConfig = await Promise.all(this.channelConfigList.map(async item => {
          let currentConfig = {};
          if (item.channel === 'ISWAP') {
            currentConfig = await this.getEstimateFeeInfo();
            if (currentConfig) {
              return {
                ...currentConfig,
                iSwapConfig: currentConfig,
                minReceive: isCross ? tofix(Times(currentConfig.outToken.amountOut, Division(Minus(100, !this.slippageMsg && this.slippage || '0.5'), 100)), this.chooseToAsset.decimals, -1) : tofix(Times(currentConfig.amountOut, Division(Minus(100, !this.slippageMsg && this.slippage || '0.5'), 100)), this.chooseToAsset.decimals, -1), // 最低收到
                mostSold: isCross ? currentConfig.inToken.amount : currentConfig.amount, // 最多卖出
                amount: isCross ? currentConfig.inToken.amount : currentConfig.amount,
                crossChainFee: isCross ? this.numberFormat(tofix(currentConfig.inToken.feeAmount, 4, -1), 4) : 0, // 跨链手续费
                originCrossChainFee: isCross ? currentConfig.inToken.feeAmount : 0,
                impact: currentConfig.impact || 0,
                amountOut: isCross ? currentConfig.outToken.amountOut : currentConfig.amountOut,
                channel: item.channel,
                isBest: false,
                isCurrent: false,
                swapRate: this.computedSwapRate(isCross, isCross ? currentConfig.inToken.amount : currentConfig.amount, isCross ? currentConfig.outToken.amountOut : currentConfig.amountOut)
              };
            }
            return null;
          }
          return null;
        }));
        this.showComputedLoading = false;
        return this.getBestPlatform(tempChannelConfig);
      } catch (e) {
        console.log(e.message, 'error');
        this.$message.warning({ message: e.message, offset: 30 });
        if (e.message.indexOf('Network Error')) {
          this.showComputedLoading = false;
        }
      }
    },
    // 获取iSwap费率信息
    async getEstimateFeeInfo() {
      // TODO: 部分资产返回的decimals字段有问题
      console.log(this.chooseFromAsset, 'this.chooseFromAsset');
      const feeInfoParams = {
        inToken: {
          amount: this.inputType === 'amountIn' ? this.amountIn : '',
          chain: this.chooseFromAsset.nativeId,
          address: this.chooseFromAsset.contractAddress || '',
          decimals: this.chooseFromAsset.decimals || 18,
          symbol: this.chooseFromAsset.symbol,
          dexInfo: this.getDexInfo(this.chooseFromAsset, 'out')
        },
        outToken: {
          amount: '',
          amountOut: this.amountOut,
          chain: this.chooseToAsset.nativeId,
          address: this.chooseToAsset.contractAddress || '',
          decimals: this.chooseToAsset.decimals || 18,
          symbol: this.chooseToAsset.symbol,
          dexInfo: this.getDexInfo(this.chooseToAsset, 'out')
        },
        direct: this.inputType === 'amountIn' ? 'src' : 'dest',
        channel: 'ISWAP',
        single: this.chooseFromAsset.chain === this.chooseToAsset.chain,
        from: this.fromAddress,
        version: ISWAP_VERSION
      };
      this.currentDex = this.getDexInfo(this.chooseToAsset, 'out');
      this.fromAssetDex = this.getDexInfo(this.chooseFromAsset, 'in');
      this.toAssetDex = this.getDexInfo(this.chooseToAsset, 'out');
      // if (res) {
      //   if (this.inputType === 'amountIn') {
      //     this.amountOut = res.amountOut;
      //   } else {
      //     this.amountIn = res.amount;
      //   }
      //   this.swapInfoMap = res;
      // }
      return await this.iSwap.getEstimateFeeInfo(feeInfoParams);
    },
    /**
     * 根据chain获取当前最优的dex
     * @param token 当前选择的token资产
     * @param type {'in' | 'out'} 当前类型
     */
    getDexInfo(token, type) {
      const { symbol, nativeId } = token;
      const iSwapConfig = JSON.parse(localStorage.getItem('iSwapConfig'));
      const dexInfo = iSwapConfig[nativeId];
      const dexToken = dexInfo['token'];
      if (type === 'in') {
        const dexName = dexToken[symbol];
        return {
          routerAddress: dexName ? dexInfo['dex'][dexName].routerAddress : dexInfo['defaultDex'].routerAddress,
          factoryAddress: dexName ? dexInfo['dex'][dexName].factoryAddress : dexInfo['defaultDex'].factoryAddress
        };
      } else {
        const dexName = dexToken[symbol];
        return {
          routerAddress: dexName ? dexInfo['dex'][dexName].routerAddress : dexInfo['defaultDex'].routerAddress,
          factoryAddress: dexName ? dexInfo['dex'][dexName].factoryAddress : dexInfo['defaultDex'].factoryAddress
        };
      }
    },
    // 最大
    async maxAmount() {
      if (!this.available) return false;
      this.inputType = 'amountIn';
      this.amountIn = this.numberFormat(tofix(this.available, 6, -1), 6);
      await this.amountInInput();
    },
    // 获取平台的手续费
    getPlatformFee(platform, stableFee = 0) {
      let tempFee;
      switch (platform) {
        case 'SwapBox':
          tempFee = stableFee;
          break;
        case 'swft':
          tempFee = this.withdrawFee || 0;
          break;
        default:
          tempFee = 0;
      }
      return tempFee || 0;
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
    getBestPlatform(platformList) {
      if (platformList.length === 0) return false;
      const tempList = platformList.reduce((p, v) => p.minReceive < v.minReceive ? v : p);
      console.log(tempList, 'tempList');
      this.channelConfigList = platformList.map(item => {
        if (item.channel === tempList.channel) {
          return {
            ...item,
            isBest: true,
            isChoose: true
          };
        }
        return {
          ...item,
          isBest: false,
          isChoose: false
        };
      });
      console.log(this.channelConfigList, 'this.channelConfigList');
      return this.channelConfigList.reduce((p, v) => p.minReceive < v.minReceive ? v : p);
    },
    // 检查稳定币手续费是否足够
    checkStableFee() {
      if (!this.chooseFromAsset || !this.chooseToAsset) return false;
      // console.log(Minus(Plus(this.fromAmount, 0), this.available) > 0, (Minus(this.fromAmount, this.stableFee) <= 0), "checkStableFee")
      if (Minus(Plus(this.fromAmount, 0), this.available) > 0) { // 余额不足
        this.amountMsg = this.chooseFromAsset.symbol + this.$t('tips.tips20');
      } else if (!(Minus(Plus(this.fromAmount, 0), this.available) > 0) && (Minus(this.fromAmount, this.stableFee) <= 0)) { // 最小兑换数量
        this.amountMsg = `${this.$t('tips.tips3')}${Plus(this.stableFee, 0)}`;
      } else {
        // this.checkLpBalance();
        this.amountMsg = '';
      }
    },
    // 选择最优路径
    routeClick(platform) {
      this.currentChannel = platform;
      for (const item of this.platformList) {
        item.isChoose = item.platform === platform.platform;
      }
      this.showPop = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo() {
      const res = await this.$request({
        method: 'get',
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
      };
      const res = await this.$request({
        url: '/swap/get/list',
        data: params
      });
      if (res.code === 1000) {
        this.orderList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime),
            amount: divisionDecimals(item.amount, item.decimal),
            swapSuccAmount: item.swapSuccAmount && divisionDecimals(item.swapSuccAmount, item.swapDecimal) || 0
          };
        });
      }
    },
    // 同连切换资产
    async switchAssetClick() {
      if (!this.switchAsset) return false;
      const tempFromAsset = { ...this.chooseFromAsset };
      const tempToAsset = { ...this.chooseToAsset };
      const tempToAmount = this.toAmount;
      const tempFromAmount = this.fromAmount;
      this.chooseToAsset = { ...tempFromAsset };
      this.chooseFromAsset = { ...tempToAsset };
      this.currentChannel = null;
      await this.getBalance(this.chooseFromAsset, true);
      if (this.inputType == 'amountIn') {
        await this.amountInInput();
      } else {
        await this.amountInInput();
      }
    },
    // 订单详情
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
        this.dialogCoinList = this.supportList;
      }
      this.modalType = type;
      this.showModal = true;
    },
    // 格式化
    formatFloat(float) {
      if (!float) return '';
      const _float = parseFloat(float);
      if (_float === 0) {
        return 0;
      }
      return tofix(float, 8);
    },
    // 重置
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
      this.currentChannel = null;
      this.swftError = false;
    },
    changeShowDetail() {
      this.showOrderDetail = false;
      this.$store.commit('changeSwap', true);
    },
    async confirmChange() {
      this.showOrderDetail = false;
      this.reset();
      await this.getSwapAssetList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index";
.w-75 {
  width: 85%;
  text-align: right;
}
.m-3 {
  margin: 30px;
}

.slippage-cont {
  height: 30px;
  width: 30px;
  img {
    height: 100%;
    width: 100%;
  }
}

.point_cont{
  height: 5px;
  width: 5px;
  display: inline-block;
  border-radius: 50%;
  animation: dotting 1.4s infinite step-start;
}
@keyframes dotting {
  25%{
    box-shadow: 6px 0 0 #FFFFFF;
  }
  50%{
    box-shadow: 6px 0 0 #FFFFFF ,20px 0 0 #FFFFFF;
  }
  75%{
    box-shadow: 6px 0 0 #FFFFFF ,20px 0 0 #FFFFFF, 34px 0 0 #FFFFFF;
  }
}
</style>
