<template>
  <div>
    <div v-loading="showApproveLoading" v-if="showApproveLoading" class="position-fixed_loading"/>
    <div v-loading="showLoading" v-if="!showOrderDetail" :class="!isDapp && 'p-3'" class="swap-cont">
      <div :class="!isDapp && 'swap-info'" class="p-4">
        <div class="size-36 d-flex align-items-center space-between mb-3 pb-2 pt-2 b_E9EBF3">
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
        <div class="input-cont mt-3">
          <template>
            <div
              v-if="!chooseFromAsset"
              class="coin-cont size-28 cursor-pointer text-90"
              @click.stop="openModal('send')">{{ $t('swap.swap12') }}</div>
            <div v-else class="coin-cont cursor-pointer d-flex align-items-center text-90" @click.stop="openModal('send')">
              <div class="image-cont">
                <img :src="chooseFromAsset.icon || getPicture(chooseFromAsset.symbol)" alt="" @error="pictureError">
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
              pattern="^[0-9]*[.,]?[0-9]*$"
              type="text"
              class="flex-1"
              placeholder="0"
              @input="amountInDebounce"
              @focus="amountFocus($event)">
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
              pattern="^[0-9]*[.,]?[0-9]*$"
              @input="amountOutDebounce"
              @focus="amountFocus($event)">
          </div>
        </div>
      </div>
      <div class="p-4">
        <div v-if="needAuth" class="btn size-30 cursor-pointer" @click="approveERC20">
          <span class="mr-2">{{ $t("vaults.over6") }}</span>
          <Loading v-if="approvingLoading" :is-active="false"/>
        </div>
        <div v-else-if="showComputedLoading" class="btn size-30 cursor-pointer opacity_btn">
          <span>
            {{ $t("swap.swap35") }}<span class="point_cont"/>
          </span>
        </div>
        <div v-else :class="!canNext && 'opacity_btn'" class="btn size-30 cursor-pointer" @click="nextStep">{{ (!currentChannel && getChannelBool && $t('tips.tips39')) || btnErrorMsg || $t("swap.swap8") }}</div>
      </div>
      <div v-if="currentChannel && !showComputedLoading" class="swap-info d-flex direction-column p-4">
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
        <div v-if="currentChannel.minReceive && !stableSwap" class="d-flex space-between size-28 mt-3">
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
          <span class="text-3a">{{ currentChannel.crossChainFee | numberFormat }}{{ stableSwap && (currentChannel.channel === 'NERVE' && mainAssetSymbol || chooseFromAsset.symbol) || 'USDT' }}</span>
        </div>
        <div v-if="currentChannel.swapFee" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap43") }}</span>
          <span class="text-3a">{{ currentChannel.swapFee | numberFormat }}{{ (stableSwap && chooseFromAsset.symbol || 'USDT') }}</span>
        </div>
        <div v-if="currentChannel.channel" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap7") }}</span>
          <span class="text-3a d-flex">
            <span class="d-flex">
              <span v-if="currentChannel && currentChannel.isBest" class="sign size-22 mr-1">{{ $t("swap.swap19") }}</span>
              <span class="d-flex align-items-center cursor-pointer" @click="showPop=false">
                <span class="coin-icon_small">
                  <img :src="currentChannel.icon" alt="">
                </span>{{ currentChannel.channel }}
              </span>
            </span>
          </span>
        </div>
      </div>
      <CoinModal
        v-if="showModal"
        :show-modal.sync="showModal"
        :modal-type="modalType"
        :from-chain="chooseFromAsset && chooseFromAsset.symbol || ''"
        :from-asset="chooseFromAsset"
        :to-asset="chooseToAsset"
        :from-address="fromAddress"
        :from-network="fromNetwork"
        :support-advanced="chooseFromAsset && chooseFromAsset.isSupportAdvanced === 'Y' || false"
        :usdt-info="USDT_info"
        :usdtn-info="USDTN_info"
        @select="selectCoin"/>
      <pop-modal :prevent-boo="false" :show.sync="showPop" :custom-class="true">
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
                <div class="d-flex size-28 mt-23 align-items-center">
                  <span class="text-90 mr-3">{{ $t('swap.swap18') }}</span>
                  <div class="d-flex align-items-center">
                    <div class="route-icon">
                      <img :src="item.icon" alt="">
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
      <pop-modal :prevent-boo="false" :show.sync="showSlippage" :custom-class="false">
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
import Loading from '@/components/Loading/Loading';
import {
  debounce,
  Division,
  Minus,
  supportChainList,
  Times,
  timesDecimals,
  tofix,
  divisionDecimals,
  Plus
} from '@/api/util';
import { ETransfer } from '@/api/api';
import ISwap from './util/iSwap';
import { ISWAP_VERSION, ISWAP_USDT_CONFIG, ISWAP_BRIDGE_VERSION } from './util/swapConfig';
import { contractConfig, contractBridgeConfig } from './util/swapConfig';
import Dodo from './util/Dodo';
import { currentNet, MAIN_INFO } from '@/config';
import NerveChannel from './util/Nerve';
import { feeRate } from './util/Nerve';
import { swapAssetList } from './util/swapAssetList';
import { isBeta } from '@/api/util';

const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Swap',
  components: {
    CoinModal,
    'pop-modal': PopUp,
    ConfirmOrder,
    Loading
  },
  data() {
    this.amountInDebounce = debounce(this.amountInInput, 500);
    this.amountOutDebounce = debounce(this.amountOutInput, 500);
    return {
      slippageList: ['0.5', '1', '2'],
      showModal: false,
      showLoading: false,
      modalType: '',
      transferFee: 0, // 发送交易需要消耗的手续费
      chooseFromAsset: null, // 当前选择的资产
      chooseToAsset: null, // 需要兑换的资产
      available: 0, // 当前可用余额
      fromAmount: '', // 需要兑换的数量
      amount: '',
      swapRate: '', // 兑换汇率
      amountMsg: '', // 提示
      focusType: '',
      balanceRequest: true,
      balanceLoading: false, // 余额加载
      showPop: false,
      currentChannel: null, // 当前最优平台
      switchAsset: false, // 同链切换
      USDTN_info: {}, // 当前支持的USDTN资产
      USDT_info: {}, // 当前的USDT资产
      currentNetwork: '', // 当前兑换资产选择的网络
      showOrderDetail: false,
      fromContractAddress: '',
      toContractAddress: '',
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
      slippage: 2, // 滑点
      fromAssetDex: null,
      toAssetDex: null,
      limitMin: '', // 最小限制
      limitMax: '', // 最大限制
      showSlippage: false,
      currentIndex: 2,
      slippageMsg: '',
      btnErrorMsg: '',
      crossTransaction: false,
      stableSwap: false,
      crossFeeAsset: null,
      bridgeLimitInfo: [],
      balanceTimer: null,
      getChannelBool: false, // 是否寻找了最优通道
      swapPairInfo: [],
      swapPairTradeList: []
    };
  },
  computed: {
    canNext() {
      return !(!this.amountIn ||
          !this.amountOut ||
          !this.chooseFromAsset ||
          !this.chooseToAsset ||
          !this.currentChannel ||
          this.btnErrorMsg ||
          this.showComputedLoading ||
          this.amountMsg);
    },
    currentChainId() {
      const supportChainList = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];
      const currentChain = supportChainList.find(chain => chain.chain === this.fromNetwork);
      return currentChain && currentChain.nativeId || '';
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.fromNetwork]['symbol'];
    }
  },
  watch: {
    amountIn: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (!this.chooseFromAsset) {
            this.amountIn = '';
            return;
          }
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
        if (newVal) {
          const decimals = 2;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.slippage = newVal;
          } else {
            this.slippage = oldVal;
          }
          if (this.currentChannel && this.currentChannel.minReceive) {
            this.currentChannel.minReceive = tofix(Times(this.amountOut, Division(Minus(100, !this.slippageMsg && newVal || '0.5'), 100)), this.chooseToAsset.decimals, -1);
          }
        }
      },
      deep: true
    },
    amountOut: {
      handler(newVal, oldVal) {
        // debugger;
        if (newVal) {
          if (!this.chooseToAsset) {
            this.amountOut = '';
            return;
          }
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
    currentChannel: {
      async handler(newVal) {
        if (newVal) {
          this.needAuth = false;
          this.approvingLoading = false;
          if (newVal.channel === 'iSwap') {
            this.chooseFromAsset.contractAddress && await this.checkAssetAuthStatus();
          } else if (newVal.channel === 'DODO') {
            newVal.approveAddress && await this.checkAssetAuthStatus();
          } else if (newVal.channel === 'NERVE' && this.fromNetwork !== 'NERVE') {
            await this.checkAssetAuthStatus();
          }
          if (newVal.impact > 20) {
            this.btnErrorMsg = this.$t('tips.tips35');
          } else if (newVal.minReceive < 0 || newVal.minReceive == 0) {
            this.btnErrorMsg = this.$t('tips.tips36');
          } else {
            this.btnErrorMsg = '';
          }
        }
      },
      deep: true
    },
    '$store.state.network': {
      handler() {
        this.chooseFromAsset = null;
        this.chooseToAsset = null;
        this.balanceRequest = true;
        this.reset();
        this.getSwapAssetList();
      },
      deep: true
    }
  },
  created() {
    if (Object.keys(this.$route.query).length > 0) {
      this.fromContractAddress = this.$route.query.fromContractAddress;
      this.toContractAddress = this.$route.query.toContractAddress;
    }
    this.iSwap = new ISwap({ chain: this.fromNetwork });
    if (this.fromNetwork === 'NERVE') {
      this.getNerveSwapPairTrade();
    }
    // const nerveChannel = new NerveChannel({
    //   chooseFromAsset: this.chooseFromAsset,
    //   chooseToAsset: this.chooseToAsset
    // });
    // nerveChannel.getNerveChannelConfig('amountIn', 1);

    // this.getUsdtnAssets();
    // setTimeout 0 不然获取不到地址
    setTimeout(() => {
      this.getSwapAssetList();
    }, 0);
    // this.getLiquidityInfo(); // 获取当前池子的余额
    this.getNerveLimitInfo();
    this.getChanelConfig();
    this.initISwapConfig();
  },
  beforeDestroy() {
    if (this.balanceTimer) clearInterval(this.balanceTimer);
    this.balanceTimer = null;
  },
  methods: {
    async getNerveSwapPairTrade() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config && config['NERVE']['apiUrl'];
      const res = await this.$post(url, 'getStablePairListForSwapTrade', [MAIN_INFO.chainId]);
      if (res.result) {
        this.swapPairTradeList = res.result;
      } else {
        this.swapPairTradeList = [];
      }
    },
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
    async checkAssetAuthStatus() {
      const transfer = new ETransfer();
      const contractAddress = this.chooseFromAsset.contractAddress;
      const authContractAddress = this.getAuthContractAddress();
      const needAuth = await transfer.getERC20Allowance(
        contractAddress,
        authContractAddress,
        this.fromAddress
      );
      this.needAuth = needAuth;
      if (!needAuth && this.getAllowanceTimer) {
        this.clearGetAllowanceTimer();
      }
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      if (this.approvingLoading) return false;
      this.showApproveLoading = true;
      try {
        const transfer = new ETransfer();
        const authContractAddress = this.getAuthContractAddress();
        const contractAddress = this.chooseFromAsset.contractAddress;
        const res = await transfer.approveERC20(
          contractAddress,
          authContractAddress,
          this.fromAddress
        );
        if (res.hash) {
          this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            message: this.$t('tips.tips14'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: res.msg,
            type: 'warning',
            duration: 2000,
            offset: 30
          });
        }
        this.approvingLoading = true;
        this.showApproveLoading = false;
      } catch (e) {
        console.log(e, 'error');
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
        this.checkAssetAuthStatus();
      }, 3000);
    },

    getAuthContractAddress() {
      // TODO: dodo还需要验证合约地址
      let authContractAddress;
      const config = JSON.parse(sessionStorage.getItem('config'));
      if (this.currentChannel.channel === 'iSwap' && !this.stableSwap) {
        authContractAddress = contractConfig[this.fromNetwork];
      } else if (this.currentChannel.channel === 'iSwap' && this.stableSwap) {
        authContractAddress = contractBridgeConfig[this.fromNetwork];
      } else if (this.currentChannel.channel === 'NERVE') {
        authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
      }
      // else if (this.currentChannel.channel === 'DODO') {
      //   authContractAddress = this.currentChannel.approveAddress;
      // }
      return authContractAddress;
    },

    async initISwapConfig() {
      const dexConfig = await this.iSwap.getRouterList();
      const tempConfig = JSON.stringify(dexConfig);
      localStorage.setItem('iSwapConfig', tempConfig);
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      const nativeId = tempSupportChainList.find(item => item.chain === this.fromNetwork).nativeId;
      const limitInfo = await this.iSwap.getTradeLimit({
        chainId: nativeId,
        version: ISWAP_VERSION
      });
      const bridgeLimitInfo = await this.iSwap.getBridgeTradeLimit({
        chainId: nativeId,
        version: ISWAP_BRIDGE_VERSION
      });
      if (bridgeLimitInfo) {
        this.bridgeLimitInfo = bridgeLimitInfo;
        localStorage.setItem('bridgeLimitInfo', JSON.stringify(this.bridgeLimitInfo));
      } else {
        this.bridgeLimitInfo = localStorage.getItem('bridgeLimitInfo') && JSON.parse('bridgeLimitInfo') || [];
      }
      if (limitInfo) {
        this.limitMin = limitInfo.normalMin;
        this.limitMax = limitInfo.normalMax;
        this.originChannelConfigList = this.originChannelConfigList && this.originChannelConfigList.map(channel => {
          if (channel.channel === 'iSwap') {
            return {
              ...channel,
              limitMin: limitInfo.normalMin,
              limitMax: limitInfo.normalMax,
              bridgeLimitMin: '',
              bridgeLimitMax: ''
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
      const res = await this.$request({
        url: '/swap/channel',
        method: 'get'
      });
      if (res.code === 1000 && res.data) {
        console.log(res.data, 'channelConfigList');
        // @FIXME: 暂时不上
        // const tempDodoConfig = {
        //   channel: 'DODO',
        //   swap: true,
        //   crossSwap: false,
        //   icon: 'https://dodoex.github.io/docs/zh/img/logo.svg'
        // };
        localStorage.setItem('channelConfig', JSON.stringify(res.data));
        // this.orginChannelConfigList = res.data.concat([tempDodoConfig]);
        // this.channelConfigList = res.data.concat([tempDodoConfig]);
        this.originChannelConfigList = res.data;
        this.channelConfigList = res.data;
      }
    },
    // 获取当前是否为稳定币资产兑换
    isStableSwap(fromAsset, toAsset) {
      return fromAsset.channelInfo && toAsset.channelInfo && fromAsset.channelInfo['iSwap'] && toAsset.channelInfo['iSwap'] && fromAsset.channelInfo['iSwap'].token && toAsset.channelInfo['iSwap'].token && (fromAsset.channelInfo['iSwap'].token === toAsset.channelInfo['iSwap'].token) ||
             fromAsset.channelInfo && toAsset.channelInfo && fromAsset.channelInfo['NERVE'] && toAsset.channelInfo['NERVE'] && fromAsset.channelInfo['NERVE'].pairAddress && toAsset.channelInfo['NERVE'].pairAddress && (fromAsset.channelInfo['NERVE'].pairAddress === toAsset.channelInfo['NERVE'].pairAddress) ||
             false;
    },
    // 下一步
    nextStep() {
      if (!this.canNext) return false;
      const {
        currentChannel,
        chooseFromAsset,
        chooseToAsset,
        amountIn,
        amountOut,
        // fromAddress,
        fromNetwork,
        currentDex,
        toAssetDex,
        fromAssetDex,
        slippage,
        stableSwap,
        crossFeeAsset,
        mainAssetSymbol,
        swapPairInfo,
        swapPairTradeList
      } = this;
      const fromAddress = this.currentAccount['address'][this.fromNetwork];
      const toChain = this.chooseToAsset.chain;
      const tempParams = {
        address: fromAddress,
        fromAsset: chooseFromAsset,
        toAddress: this.currentAccount['address'][toChain] || '',
        toAsset: chooseToAsset,
        fromNetwork,
        amountIn,
        amountOut,
        currentChannel,
        currentDex,
        toAssetDex,
        fromAssetDex,
        slippage,
        stableSwap,
        crossFeeAsset,
        mainAssetSymbol,
        swapPairInfo,
        swapPairTradeList
      };
      window.sessionStorage.setItem('swapInfo', JSON.stringify(tempParams));
      this.showOrderDetail = true;
      this.$store.commit('changeSwap', false);
    },
    // 获取nerve限额信息
    async getNerveLimitInfo() {
      const res = await this.$request({
        method: 'get',
        url: '/swap/stable/info'
      });
      if (res.code === 1000 && res.data) {
        this.nerveLimitInfo = res.data;
        localStorage.setItem('nerveLimitInfo', JSON.stringify(res.data));
      } else {
        this.nerveLimitInfo = localStorage.getItem('nerveLimitInfo') && JSON.parse(localStorage.getItem('nerveLimitInfo'));
      }
    },
    // 获取当前支持的兑换的列表
    async getSwapAssetList() {
      try {
        const data = {
          chain: this.fromNetwork
        };
        if (isBeta) {
          const res = await this.$request({
            url: '/swap/assets',
            data
          });
          if (res.code === 1000 && res.data.length > 0) {
            await this.updateSwapAssetList(res.data);
          }
        } else {
          const localSwapAssetList = localStorage.getItem('localSwapAssetMap') && JSON.parse(localStorage.getItem('localSwapAssetMap'))[this.fromNetwork];
          const tempList = localSwapAssetList && localSwapAssetList.length > 0 && localSwapAssetList || swapAssetList[this.fromNetwork];
          await this.setSwapAssetList(tempList || []);
          const res = await this.$request({
            url: '/swap/assets',
            data
          });
          if (res.code === 1000 && res.data.length > 0) {
            await this.updateSwapAssetList(res.data);
          }
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 获取当前的swap资产
    async setSwapAssetList(assetList) {
      const tempList = assetList.length > 0 && assetList.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
      const tempFromCoin = tempList.find(item => item.contractAddress === this.fromContractAddress);
      const tempToCoin = tempList.find(item => item.contractAddress === this.toContractAddress);
      if (this.fromContractAddress && this.toContractAddress && tempFromCoin && tempToCoin) {
        this.chooseFromAsset = tempFromCoin;
        await this.selectCoin({ coin: this.chooseFromAsset, type: 'send', network: this.fromNetwork });
        this.chooseToAsset = tempToCoin;
        await this.selectCoin({ coin: this.chooseToAsset, type: 'receive', network: this.fromNetwork });
      } else {
        this.chooseFromAsset = tempList.find(item => item.symbol === (ISWAP_USDT_CONFIG[this.currentChainId] || 'USDT')) || tempList[0];
        this.crossFeeAsset = tempList.find(item => item.symbol === (ISWAP_USDT_CONFIG[this.currentChainId] || 'USDT')) || null;
      }
      this.chooseFromAsset && await this.getBalance(this.chooseFromAsset);
      this.refreshBalance();
    },
    // 更新当前的swap资产列表
    updateSwapAssetList(assetList) {
      const localSwapAssetMap = localStorage.getItem('localSwapAssetMap') && JSON.parse(localStorage.getItem('localSwapAssetMap'));
      localSwapAssetMap[this.fromNetwork] = assetList || [];
      localStorage.setItem('localSwapAssetMap', JSON.stringify(localSwapAssetMap));
    },
    // 当前选择的币
    async selectCoin({ coin, type, network }) {
      console.log(coin, 'coin');
      this.currentNetwork = network;
      this.showModal = false;
      switch (type) {
        case 'send':
          this.resetData();
          this.currentChannel = null;
          this.chooseFromAsset = coin;
          await this.getBalance(this.chooseFromAsset, true);
          this.refreshBalance();
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.crossTransaction = false;
            this.switchAsset = true;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = true;
            this.switchAsset = false;
          } else {
            this.crossTransaction = true;
            this.switchAsset = false;
          }
          if (this.chooseToAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOutDebounce();
          }
          break;
        case 'receive': // 选择接受资产
          this.chooseToAsset = coin;
          this.resetData();
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.crossTransaction = false;
            this.switchAsset = true;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = true;
            this.switchAsset = false;
          } else {
            this.crossTransaction = true;
            this.switchAsset = false;
          }
          if (this.chooseFromAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOutDebounce();
          }
          break;
        default:
          return false;
      }
    },
    // 获取钱包余额
    async getBalance(asset, clickBoo = false) {
      if (this.balanceRequest || clickBoo) {
        this.balanceLoading = true;
      }
      if (this.$store.state.network === 'NERVE' || this.$store.state.network === 'NULS') {
        this.available = this.$store.state.network === 'NULS' ? await this.getNulsAssetBalance(asset) : await this.getNerveAssetBalance(asset);
      } else {
        try {
          const transfer = new ETransfer({
            chain: this.fromNetwork
          });
          if (asset.contractAddress) {
            const tempAvailable = await transfer.getERC20Balance(asset.contractAddress, asset.decimals, this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
            this.userAvailable = tempAvailable;
          } else {
            const tempAvailable = await transfer.getEthBalance(this.fromAddress);
            this.available = tempAvailable && tofix(tempAvailable, 6, -1);
            this.userAvailable = tempAvailable;
          }
        } catch (e) {
          console.log(e, 'error');
          // this.available = 0;
          clickBoo && this.$message({
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
    // 刷新当前余额
    refreshBalance() {
      if (this.balanceTimer) {
        clearInterval(this.balanceTimer);
        this.balanceTimer = null;
      }
      this.balanceTimer = setInterval(() => {
        this.getBalance(this.chooseFromAsset, false);
      }, 8000);
    },
    async amountInInput() {
      this.inputType = 'amountIn';
      if (this.chooseFromAsset && this.chooseToAsset && this.amountIn && Number(this.amountIn) !== 0 && !this.availableLoading) {
        this.amountOut = '';
        this.btnErrorMsg = '';
        this.needAuth = false;
        this.getOptionalChannel();
        const tempChannel = await this.getChannelList();
        if (tempChannel) {
          this.amountOut = tempChannel.amountOut < 0 ? '' : this.numberFormat(tofix(tempChannel.amountOut || 0, 6, -1), 6);
          this.currentChannel = tempChannel;
          this.checkChannelLimitInfo();
        } else {
          this.currentChannel = null;
        }
      } else {
        if (!this.amountIn) { this.amountMsg = ''; this.btnErrorMsg = ''; this.getChannelBool = false; }
        this.amountOut = '';
        this.currentChannel = null;
      }
    },
    getOptionalChannel() {
      this.channelConfigList = this.originChannelConfigList.filter(channel => {
        if (this.crossTransaction && !this.stableSwap) {
          return channel.crossSwap === true && channel.status === 1;
        } else if (this.crossTransaction && this.stableSwap) {
          return this.checkLpBalance() && channel.channel === 'NERVE' && channel.bridge === true && channel.status === 1 || channel.channel !== 'NERVE' && channel.bridge === true && channel.status === 1;
        }
        return channel.swap === true && channel.status === 1;
      });
    },
    // 查看当前你nerve通道流动性
    checkLpBalance() {
      if (this.chooseFromAsset && this.chooseToAsset) {
        const pairAddress = this.chooseFromAsset.channelInfo && this.chooseFromAsset.channelInfo['NERVE'] && this.chooseFromAsset.channelInfo['NERVE'].pairAddress || '';
        console.log(this.nerveLimitInfo, 'this.nerveLimitInfo');
        const swapAssets = pairAddress && this.nerveLimitInfo.find(item => item.pairAddress === pairAddress).swapAssets || [];
        const swapMap = {};
        swapAssets.forEach(item => {
          swapMap[item.chain] = divisionDecimals(item.amount, item.decimals);
        });
        this.originChannelConfigList = this.originChannelConfigList && this.originChannelConfigList.map(channel => {
          if (channel === 'NERVE') {
            return {
              ...channel,
              limitMin: 1,
              limitMax: swapMap[this.chooseToAsset.chain]
            };
          }
          return {
            ...channel
          };
        });
        return Minus(this.inputType === 'amountIn' ? Times(this.amountIn, Minus(1, feeRate)) : this.amountOut, swapMap[this.chooseToAsset.chain]) <= 0;
      }
      return false;
    },
    // 根据不同通道查询当前的限额
    checkChannelLimitInfo() {
      if (this.stableSwap) {
        if (this.currentChannel.channel === 'iSwap') {
          const limitAssetInfo = this.bridgeLimitInfo.find(item => this.chooseFromAsset.symbol === item.symbol);
          const currentLimitMax = this.chooseFromAsset.symbol === (ISWAP_USDT_CONFIG[this.currentChainId] || 'USDT') ? (limitAssetInfo && limitAssetInfo.biggerMax) : limitAssetInfo.normalMax;
          const currentLimitMin = this.chooseFromAsset.symbol === (ISWAP_USDT_CONFIG[this.currentChainId] || 'USDT') ? limitAssetInfo && limitAssetInfo.normalMin : limitAssetInfo.normalMin;
          console.log(currentLimitMax, 'currentLimitMax', currentLimitMin, 'currentLimitMin');
          if (Minus(this.amountIn, currentLimitMin) < 0) {
            this.amountMsg = `${this.$t('tips.tips3')}${currentLimitMin}${this.chooseFromAsset.symbol}`;
          } else if (Minus(this.amountIn, currentLimitMax) > 0) {
            this.amountMsg = `${this.$t('tips.tips4')}${currentLimitMax}${this.chooseFromAsset.symbol}`;
          } else {
            this.checkBalance();
          }
        } else if (this.currentChannel.channel === 'NERVE') {
          if (Minus(this.amountIn, 1) < 0) {
            this.amountMsg = `${this.$t('tips.tips3')}${1}${this.chooseFromAsset.symbol}`;
          } else {
            this.checkBalance();
          }
        // else if (Minus(this.amountIn, 1000) > 0) {
        //     this.amountMsg = `${this.$t('tips.tips4')}${1000}${this.chooseFromAsset.symbol}`;
        //   }
        }
      } else {
        if (Minus(this.currentChannel.usdtAmountIn, this.limitMin) < 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
          this.amountMsg = `${this.$t('tips.tips3')}$${this.limitMin}`;
        } else if (Minus(this.currentChannel.usdtAmountIn, this.limitMax) > 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
          this.amountMsg = `${this.$t('tips.tips4')}$${this.limitMax}`;
        } else {
          this.checkBalance();
        }
      }
    },
    // 检查当前余额是否足够
    checkBalance() {
      const { amountIn, available, chooseFromAsset } = this;
      if (Minus(amountIn, available) > 0) {
        this.amountMsg = `${chooseFromAsset.symbol} ${this.$t('tips.tips9')}`;
      } else {
        this.amountMsg = '';
      }
    },
    computedSwapRate(isCross, amountIn, amountOut) {
      return `1${this.chooseFromAsset.symbol}≈${this.numberFormat(tofix((Division(amountOut, amountIn) < 0 && '0' || Division(amountOut, amountIn)), 4, -1), 4)}${this.chooseToAsset.symbol}`;
    },
    async amountOutInput() {
      this.inputType = 'amountOut';
      if (this.chooseFromAsset && this.chooseToAsset && this.amountOut && Number(this.amountOut) !== 0) {
        this.amountIn = '';
        this.btnErrorMsg = '';
        this.needAuth = false;
        this.getOptionalChannel();
        const tempChannel = await this.getChannelList();
        if (tempChannel) {
          this.amountIn = tempChannel.amount < 0 ? '' : this.numberFormat(tofix(tempChannel.amount || 0, 6, -1), 6);
          this.currentChannel = tempChannel;
          this.checkChannelLimitInfo();
        } else {
          this.amountMsg = '';
          this.currentChannel = null;
        }
      } else {
        if (!this.amountOut) { this.amountMsg = ''; this.getChannelBool = false; }
        this.amountIn = '';
        this.currentChannel = null;
      }
    },
    // 获取当前支持的config
    async getChannelList() {
      console.log(this.stableSwap, 'stableSwap');
      try {
        const config = JSON.parse(sessionStorage.getItem('config'));
        const isCross = this.chooseToAsset.chain !== this.chooseFromAsset.chain;
        this.showComputedLoading = true;
        this.amountMsg = '';
        console.log(this.channelConfigList, 'channelConfigList');
        console.log(this.fromNetwork, 'this.fromNetwork');
        const tempChannelConfig = await Promise.all(this.channelConfigList.map(async item => {
          let currentConfig = {};
          if (item.channel === 'iSwap' && !this.stableSwap) {
            currentConfig = await this.getEstimateFeeInfo();
            if (currentConfig) {
              return {
                ...currentConfig,
                icon: item.icon || 'https://www.iswap.com/favicon.svg',
                iSwapConfig: currentConfig,
                minReceive: isCross ? tofix(Times((currentConfig.outToken.amountOut) < 0 && '0' || currentConfig.outToken.amountOut, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1) : tofix(Times((currentConfig.amountOut) < 0 && '0' || (currentConfig.amountOut), Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1), // 最低收到
                mostSold: isCross ? currentConfig.inToken.amount : currentConfig.amount, // 最多卖出
                amount: isCross ? currentConfig.inToken.amount : currentConfig.amount,
                crossChainFee: isCross ? this.numberFormat(tofix(currentConfig.inToken.feeAmount, 4, -1), 4) : 0, // 跨链手续费
                originCrossChainFee: isCross ? currentConfig.inToken.feeAmount : 0,
                impact: currentConfig.impact || 0,
                amountOut: isCross ? currentConfig.outToken.amountOut : currentConfig.amountOut,
                channel: item.channel,
                usdtAmountIn: this.inputType === 'amountIn' && currentConfig.inToken && currentConfig.inToken.amountOut || '',
                usdtAmountOut: this.inputType === 'amountOut' && currentConfig.outToken && currentConfig.outToken.amount || '',
                isBest: false,
                isCurrent: false,
                status: item.status,
                swapFee: isCross ? currentConfig.outToken && currentConfig.outToken.relayerGas : '',
                swapRate: this.computedSwapRate(isCross, isCross ? currentConfig.inToken.amount : currentConfig.amount, isCross ? currentConfig.outToken.amountOut : currentConfig.amountOut)
              };
            }
            return null;
            // TODO: 修改为tempDODO => DODO
          } else if (item.channel === 'tempDODO') {
            currentConfig = await this.getDodoSwapRoute();
            if (currentConfig) {
              return {
                icon: item.icon,
                amount: this.amountIn,
                channel: item.channel,
                amountOut: currentConfig.resAmount,
                minReceive: tofix(Times(currentConfig.resAmount, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                impact: this.numberFormat(tofix(currentConfig.priceImpact, 4, -1) || 0, 4),
                isBest: false,
                isCurrent: false,
                swapRate: this.computedSwapRate(false, this.amountIn, currentConfig.resAmount),
                approveAddress: currentConfig.targetApproveAddr || '',
                transactionData: currentConfig.data,
                transactionToAddress: currentConfig.to
              };
            }
            return null;
          } else if (this.fromNetwork === 'NERVE' && item.channel === 'NERVE' && !this.stableSwap) {
            console.log('!this.stableSwap NERVE');
            currentConfig = await this.getNerveSwapRoute();
            console.log(currentConfig, 'currentConfig NERVE SWAP');
            if (currentConfig) {
              return {
                icon: item.icon,
                amount: currentConfig.amountIn,
                channel: item.channel,
                amountOut: currentConfig.amountOut,
                minReceive: tofix(Times(currentConfig.amountOut, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                impact: this.numberFormat(tofix(currentConfig.priceImpact, 4, -1) || 0, 4),
                isBest: false,
                isCurrent: false,
                swapRate: this.computedSwapRate(false, currentConfig.amountIn, currentConfig.amountOut)
              };
            }
            return null;
          } else if (item.channel === 'iSwap' && this.stableSwap) {
            currentConfig = await this.getBridgeEstimateFeeInfo();
            if (currentConfig) {
              return {
                iSwapConfig: currentConfig,
                icon: item.icon,
                amount: this.inputType === 'amountIn' ? this.amountIn : divisionDecimals(currentConfig.amount, this.chooseFromAsset.decimals || 18),
                channel: item.channel,
                amountOut: this.inputType === 'amountOut' ? this.amountOut : divisionDecimals(currentConfig.amount, this.chooseToAsset.decimals || 18),
                minReceive: this.inputType === 'amountOut' ? this.amountOut : divisionDecimals(currentConfig.amount, this.chooseToAsset.decimals || 18),
                crossChainFee: divisionDecimals(currentConfig.crossChainFee, this.chooseFromAsset.decimals || 18),
                isBest: false,
                swapFee: this.numberFormat(tofix(divisionDecimals(currentConfig.gasFee, this.crossFeeAsset.decimals), 6, -1), 6),
                isCurrent: false
              };
            }
            return null;
          } else if (item.channel === 'NERVE' && this.stableSwap) {
            console.log('this.stableSwap NERVEBRIDGE');
            currentConfig = await this._getNerveEstimateFeeInfo();
            if (currentConfig) {
              return {
                icon: item.icon,
                channel: item.channel,
                amount: this.inputType === 'amountIn' ? this.amountIn : Plus(this.amountOut, currentConfig.swapFee),
                amountOut: this.inputType === 'amountOut' ? this.amountOut : Minus(this.amountIn, currentConfig.swapFee).toString(),
                minReceive: this.inputType === 'amountOut' ? this.amountOut : Minus(this.amountIn, currentConfig.swapFee).toString(),
                swapFee: tofix(this.numberFormat(currentConfig.swapFee, 6), 6, -1),
                crossChainFee: tofix(this.numberFormat(currentConfig.crossChainFee, 6), 6, -1),
                originCrossChainFee: tofix(this.numberFormat(currentConfig.crossChainFee, 6), 6, -1),
                isBest: false,
                isCurrent: false,
                orderId: currentConfig.orderId
              };
            }
            return null;
          }
          return item;
        }));
        this.getChannelBool = true;
        console.log(tempChannelConfig, 'tempChannelConfig');
        this.showComputedLoading = false;
        return this.getBestPlatform(tempChannelConfig.filter(item => item));
      } catch (e) {
        // this.showComputedLoading = false;
        console.log(e.message, 'error');
        if (e.message.indexOf('/api/swap/estimate-fee-info') === -1) {
          // this.$message.warning({ message: e.message, offset: 30 });
          this.showComputedLoading = false;
        }
        // if (e.message.indexOf('Network Error') > -1) {
        //   this.showComputedLoading = false;
        // }
      }
    },
    // 获取iSwap费率信息
    async getEstimateFeeInfo() {
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
      this.currentDex = this.getDexInfo(this.chooseFromAsset, 'in');
      this.fromAssetDex = this.getDexInfo(this.chooseFromAsset, 'in');
      // @FIXME routerAddress 都必须使用目标链上面的dex！！！！
      this.toAssetDex = this.getDexInfo(this.chooseToAsset, 'out');
      return await this.iSwap.getEstimateFeeInfo(feeInfoParams);
    },
    // 获取iSwap Bridge费率信息
    async getBridgeEstimateFeeInfo() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const toMainAssetSymbol = config[this.chooseToAsset.chain].symbol;
      const bridgeFeeInfoParams = {
        version: ISWAP_BRIDGE_VERSION,
        address: this.fromAddress,
        srcChain: this.chooseFromAsset.nativeId,
        destChain: this.chooseToAsset.nativeId,
        tokenIn: this.chooseFromAsset.contractAddress || '',
        tokenOut: this.chooseToAsset.contractAddress || '',
        direct: this.inputType === 'amountIn' ? 'src' : 'dest',
        isReturnEth: toMainAssetSymbol === this.chooseToAsset.symbol
      };
      this.inputType === 'amountIn' ? bridgeFeeInfoParams['amountIn'] = timesDecimals(this.amountIn, this.chooseFromAsset.decimals) : bridgeFeeInfoParams['amountOut'] = timesDecimals(this.amountOut, this.chooseToAsset.decimals);
      return await this.iSwap.getBridgeEstimateFeeInfo(bridgeFeeInfoParams);
    },
    // 获取nerve稳定币兑换信息
    async _getNerveEstimateFeeInfo() {
      const NerveSwap = new NerveChannel({
        chooseFromAsset: this.chooseFromAsset,
        chooseToAsset: this.chooseToAsset
      });
      const params = {
        channel: 'NERVE',
        platform: 'NABOX',
        swapType: 2,
        fromChain: this.chooseFromAsset.chain,
        toChain: this.chooseToAsset.chain,
        fromAddress: this.fromAddress,
        toAddress: this.chooseToAsset.chain === 'NERVE' ? this.currentAccount['address']['NERVE'] : this.fromAddress,
        chainId: this.chooseFromAsset.chainId,
        assetId: this.chooseFromAsset.assetId,
        contractAddress: this.chooseFromAsset.contractAddress,
        swapChainId: this.chooseToAsset.chainId,
        swapAssetId: this.chooseToAsset.assetId,
        swapContractAddress: this.chooseToAsset.contractAddress,
        amount: this.inputType === 'amountIn' && this.amountIn || this.amountOut,
        // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
        pairAddress: this.chooseFromAsset.channelInfo['NERVE'].pairAddress
      };
      return await NerveSwap.getNerveEstimateFeeInfo(params);
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
      if (!dexInfo) return null;
      const dexToken = dexInfo['token'];
      if (type === 'in') {
        const dexName = dexToken[symbol];
        return {
          routerAddress: dexName ? (dexInfo['dex'][dexName] && dexInfo['dex'][dexName].routerAddress || dexInfo['defaultDex'].routerAddress) : dexInfo['defaultDex'].routerAddress,
          factoryAddress: dexName ? (dexInfo['dex'][dexName] && dexInfo['dex'][dexName].factoryAddress || dexInfo['defaultDex'].factoryAddress) : dexInfo['defaultDex'].factoryAddress
        };
      } else {
        const dexName = dexToken[symbol];
        return {
          routerAddress: dexName ? (dexInfo['dex'][dexName] && dexInfo['dex'][dexName].routerAddress || dexInfo['defaultDex'].routerAddress) : dexInfo['defaultDex'].routerAddress,
          factoryAddress: dexName ? (dexInfo['dex'][dexName] && dexInfo['dex'][dexName].factoryAddress || dexInfo['defaultDex'].factoryAddress) : dexInfo['defaultDex'].factoryAddress
        };
      }
    },
    // 获取DODO费率信息
    async getDodoSwapRoute() {
      const supportChainList = JSON.parse(sessionStorage.getItem('supportChainList'));
      const rpc = supportChainList.find(item => item.chain === this.fromNetwork).apiUrl;
      const data = {
        fromTokenAddress: this.chooseFromAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        fromTokenDecimals: this.chooseFromAsset.decimals || 18,
        toTokenAddress: this.chooseToAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        toTokenDecimals: this.chooseToAsset.decimals || 18,
        fromAmount: timesDecimals(this.amountIn, this.chooseFromAsset.decimals),
        slippage: this.slippage,
        userAddr: this.fromAddress,
        chainId: this.chooseFromAsset.nativeId || '',
        rpc // 当前的rpc地址
      };
      const dodo = new Dodo();
      return await dodo.getDodoRoute(data);
    },
    // 获取nerve通道上面
    async getNerveSwapRoute() {
      const data = {
        chainId: this.chooseFromAsset.nerveChainId,
        assetId: this.chooseFromAsset.nerveAssetId,
        swapChainId: this.chooseToAsset.nerveChainId,
        swapAssetId: this.chooseToAsset.nerveAssetId,
        maxPairSize: 4
      };
      const res = await this.$request({
        url: '/swap/nerve/route',
        data
      });
      if (res.code === 1000) {
        this.swapPairInfo = res.data;
      } else {
        this.swapPairInfo = [];
      }
      const nerveChannel = new NerveChannel({
        chooseFromAsset: { ...this.chooseFromAsset, chainId: this.chooseFromAsset.nerveChainId, assetId: this.chooseFromAsset.nerveAssetId },
        chooseToAsset: { ...this.chooseToAsset, chainId: this.chooseToAsset.nerveChainId, assetId: this.chooseToAsset.nerveAssetId },
        swapPairInfo: this.swapPairInfo || []
      });
      if (this.inputType === 'amountIn') {
        return nerveChannel.getNerveChannelConfig(this.inputType, this.amountIn);
      } else {
        return nerveChannel.getNerveChannelConfig(this.inputType, this.amountOut);
      }
    },
    // 最大
    async maxAmount() {
      if (!this.available || this.available == 0) return false;
      this.inputType = 'amountIn';
      this.amountIn = this.numberFormat(tofix(this.available, 6, -1), 6);
      await this.amountInInput();
    },
    // 切换当前选择的平台
    getBestPlatform(platformList) {
      if (platformList.length === 0) return false;
      if (this.inputType === 'amountIn') {
        const tempList = platformList.reduce((p, v) => p.minReceive < v.minReceive ? v : p);
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
        console.log(this.channelConfigList, '==channelConfigList==');
        return this.channelConfigList.reduce((p, v) => p.minReceive < v.minReceive ? v : p);
      } else {
        const tempList = platformList.reduce((p, v) => p.amount > v.amount ? v : p);
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
        console.log(this.channelConfigList, '==channelConfigList==');
        return this.channelConfigList.reduce((p, v) => p.amount > v.amount ? v : p);
      }
    },
    // 选择最优路径
    routeClick(platform) {
      if (platform.status === 0) {
        this.$toast(this.$t('tips.tips37'));
        return;
      }
      this.currentChannel = platform;
      for (const item of this.channelConfigList) {
        item.isChoose = item.channel === platform.channel;
      }
      if (this.inputType === 'amountIn') {
        this.amountOut = this.numberFormat(tofix(this.currentChannel.amountOut, 6, -1), 6);
      } else {
        this.amountIn = this.numberFormat(tofix(this.currentChannel.amount, 6, -1), 6);
      }
      this.showPop = false;
    },
    // 同连切换资产
    async switchAssetClick() {
      if (!this.switchAsset) return false;
      this.amountMsg = '';
      this.needAuth = false;
      const tempFromAsset = { ...this.chooseFromAsset };
      const tempToAsset = { ...this.chooseToAsset };
      this.chooseToAsset = { ...tempFromAsset };
      this.chooseFromAsset = { ...tempToAsset };
      this.currentChannel = null;
      this.inputType === 'amountIn' ? this.amountOut = '' : this.amountIn = '';
      await this.getBalance(this.chooseFromAsset, true);
      this.refreshBalance();
      if (this.inputType === 'amountIn') {
        await this.amountInInput();
      } else {
        await this.amountOutInput();
      }
    },
    // 订单详情
    toOrderDetail(item) {
      this.$router.push({ path: '/orderDetail', query: { txHash: item.txHash }});
    },
    amountFocus(event) {
      event.currentTarget.select();
    },
    async openModal(type) {
      this.modalType = type;
      this.showModal = true;
    },
    // 重置
    reset() {
      this.approvingLoading = false;
      this.amountIn = '';
      this.amountOut = '';
      this.amount = '';
      this.available = '';
      this.transferFee = '';
      this.btnErrorMsg = '';
      this.currentChannel = null;
      this.getChannelBool = false;
    },
    resetData() {
      this.needAuth = false;
      this.amountMsg = '';
      this.btnErrorMsg = '';
      this.stableSwap = false;
      this.getChannelBool = false;
    },
    changeShowDetail() {
      this.showOrderDetail = false;
      this.$store.commit('changeSwap', true);
    },
    async confirmChange() {
      this.showOrderDetail = false;
      this.reset();
      await this.getBalance(this.chooseFromAsset, true);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
