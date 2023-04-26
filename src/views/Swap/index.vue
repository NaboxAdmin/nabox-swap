<template>
  <div :class="{ mobile_class: !isMobile }">
    <div v-loading="showApproveLoading" v-if="showApproveLoading" class="position-fixed_loading"/>
    <div v-loading="showLoading" v-if="!showOrderDetail" :class="!isDapp && 'p-3'" class="swap-cont">
      <div :class="!isDapp && 'swap-info'" class="p-4">
        <div class="size-36 d-flex align-items-center space-between mb-3 pb-2 pt-2 b_E9EBF3">
          <span class="text-3a font-500">{{ $t('navBar.navBar5') }}{{ nerveChainAvailable }}</span>
          <span class="slippage-cont" @click="showSlippage=true">
            <img src="@/assets/image/slippage.png" alt="">
          </span>
        </div>
        <div class="d-flex align-items-center space-between text-90 size-28">
          <div>{{ $t("swap.swap1") }}<span v-if="chooseFromAsset" class="size-20 sign">{{ chooseFromAsset.chain }}</span></div>
          <div>{{ $t("swap.swap4") }}：
            <span v-if="balanceLoading" class="text-3a"><i class="el-icon-loading"/></span>
            <span v-else-if="available" class="text-3a">{{ available | numFormatFixSix }}</span>
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
              <div class="d-flex direction-column align-items-center">
                <div class="w-90 direction-column size-30 text-center text-truncate text-3a">
                  {{ chooseFromAsset.symbol }}
                </div>
                <div v-if="chooseFromAsset.registerChain && fromNetwork==='NERVE' && chooseFromAsset.chain === 'NERVE'" class="sign-small size-20">{{ chooseFromAsset.registerChain }}</div>
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
              <div class="d-flex direction-column align-items-center">
                <div class="w-90 text-truncate direction-column text-center size-30 text-3a">
                  {{ chooseToAsset.symbol }}
                </div>
                <div v-if="chooseToAsset.registerChain && chooseToAsset.chain === 'NERVE'" class="sign-small size-20">{{ chooseToAsset.registerChain }}</div>
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
        <template v-if="chooseFromAsset && chooseToAsset && chooseToAsset.chain !== chooseFromAsset.chain">
          <div class="text-90 size-28 mt-5">{{ $t('tips.tips60') }}</div>
          <div class="input_address-cont mt-2">
            <div class="input-item align-items-center d-flex flex-1">
              <input
                v-model="toAddress"
                :placeholder="networkPlaceholder"
                type="text"
                class="flex-1"
                @focus="addressFocus($event)"
                @input="addressInput">
            </div>
          </div>
          <div v-if="addressError" class="text-red mt-2 ml-2 size-28">{{ addressError }}</div>
        </template>
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
        <div v-else-if="chooseFromAsset && (chooseFromAsset.chain !== fromNetwork)" class="btn size-30 cursor-pointer" @click="chainChange(chooseFromAsset.chain)">{{ `${$t('tips.tips75')}${chooseFromAsset.chain}${$t('tips.tips76')}` }}</div>
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
        <div v-if="(currentChannel.minReceive && !stableSwap)" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ (currentChannel && currentChannel.originalChannel === 'MetaPath' ? $t("swap.swap32") : $t("swap.swap20")) || $t("swap.swap20") }}</span>
          <span class="text-3a">
            {{ currentChannel.minReceive | numberFormat }}{{ chooseToAsset && chooseToAsset.symbol }}
          </span>
        </div>
        <div v-if="currentChannel.impact" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ $t("swap.swap33") }}</span>
          <span class="text-3a">{{ currentChannel.impact }}%</span>
        </div>
        <div v-if="currentChannel.crossChainFee" class="d-flex space-between size-28 mt-3">
          <span class="text-90">{{ chooseFromAsset.chain === chooseToAsset.chain ? $t("swap.swap49") : $t("swap.swap34") }}</span>
          <template>
            <span v-if="fromNetwork === 'NERVE' && chooseToAsset.chain === 'NULS'">{{ `${currentChannel.crossChainFee}NVT+${currentChannel.crossChainFee}NULS` }}</span>
            <span v-else-if="currentChannel.dex === 'Bridgers' || currentChannel.dex === 'Aggregator'">{{ currentChannel.crossChainFee | numberFormat }}{{ chooseToAsset.symbol }}</span>
            <span v-else-if="currentChannel.dex === 'SWFT'">{{ currentChannel.crossChainFee | numberFormat }}{{ chooseToAsset.symbol }}</span>
            <span v-else class="text-3a">{{ currentChannel.crossChainFee | numberFormat }}{{ stableSwap && (currentChannel.channel === 'NERVE' && mainAssetSymbol || chooseFromAsset.symbol) || mainAssetSymbol }}</span>
          </template>
        </div>
        <div v-if="currentChannel.swapFee" class="d-flex space-between size-28 mt-3">
          <span class="text-90 d-flex align-items-center">
            <span>{{ $t("swap.swap43") }}</span>
          </span>
          <span v-if="currentChannel.dex === 'SWFT'" class="text-3a">{{ currentChannel.swapFee | numberFormat }}{{ chooseFromAsset.symbol || currentChannel.feeSymbol || 'USDT' }}</span>
          <span v-else-if="currentChannel.dex === 'Bridgers' || currentChannel.dex === 'Aggregator'" class="text-3a">{{ currentChannel.swapFee }}{{ chooseFromAsset.symbol }}</span>
          <span v-else class="text-3a">{{ currentChannel.swapFee | numberFormat }}{{ (stableSwap && chooseFromAsset.symbol || (currentChannel.feeSymbol || 'USDT')) }}</span>
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
        v-show="!showImportModal"
        v-if="showModal"
        :show-modal.sync="showModal"
        :modal-type="modalType"
        :from-asset="chooseFromAsset"
        :to-asset="chooseToAsset"
        @select="selectCoin"
        @importAsset="importAsset"/>
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
                      <img v-lazy="item.icon" alt="">
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
      <pop-modal :prevent-boo="!!slippageMsg" :show.sync="showSlippage" :custom-class="false">
        <div class="slippage-modal">
          <div class="header-cont size-36 font-500 mt-2">
            {{ $t('swap.swap36') }}
            <div class="back-icon cursor-pointer" @click="closeModal">
              <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
            </div>
          </div>
          <div class="slippage-switch">
            <span
              v-for="(item, index) in slippageList"
              :key="item"
              :class="{ active_slippage: index===currentIndex }"
              class="font-500 cursor-pointer"
              @click="slippageClick(item, index)">{{ item }}%</span>
            <span :class="{ active_slippage_input: currentIndex===-1 && !slippageMsg }"><input v-model="slippage" type="number" @input="slippageInput">%</span>
          </div>
          <div v-if="slippageMsg" class="text-red pl-1 mt-1">{{ slippageMsg }}</div>
        </div>
      </pop-modal>
    </div>
    <ConfirmOrder
      v-if="showOrderDetail"
      @back="changeShowDetail"
      @confirm="confirmChange"/>
    <ImportModal
      v-if="showImportModal"
      :modal-type="modalType"
      :asset-info="importAssetInfo"
      :show-modal.sync="showImportModal"
      @select="selectCoin"/>
    <pop-modal :prevent-boo="false" :show.sync="showTips">
      <div class="address-detail_pop">
        <div class="customer-p4">
          <div class="icon_pop-cont d-flex space-between">
            <div class="font-500">{{ $t('tips.tips62') }}</div>
            <span class="cursor-pointer" @click="showTips=false">
              <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"/></svg>
            </span>
          </div>
          <div style="line-height: 24px" class="mt-4">{{ $t('tips.tips63') }}</div>
          <div class="pop-btn d-flex align-items-center space-between mt-4">
            <div class="btn-pop cursor-pointer" @click="cancelClick">{{ $t("vaults.vaults7") }}</div>
            <div class="btn-pop btn_pop_active cursor-pointer" @click="switchPlugin">{{ $t("tips.tips64") }}</div>
          </div>
        </div>
      </div>
    </pop-modal>
  </div>
</template>

<script>
import CoinModal from './Modal/CoinModal';
import ImportModal from '@/views/Swap/Modal/ImportModal';
import PopUp from '@/components/PopUp/PopUp';
import ConfirmOrder from '@/views/confirmOrder/confirmOrder';
import Loading from '@/components/Loading/Loading';
import {
  debounce,
  Division,
  divisionDecimals,
  Minus,
  Plus, REFERRER, replaceBrowserHistory,
  supportChainList,
  Times,
  timesDecimals,
  tofix,
  TRON,
  MAIN_EVM_ADDRESS
} from '@/api/util';
import { crossFee, ETransfer, validateAddress } from '@/api/api';
import {
  contractBridgeConfig,
  contractConfig,
  ISWAP_BRIDGE_VERSION,
  ISWAP_USDT_CONFIG,
  ISWAP_VERSION, localChannelList
} from './util/swapConfig';
import Dodo from './util/Dodo';
import { currentNet, ETHNET, MAIN_INFO, NULS_INFO } from '@/config';
import NerveChannel, { feeRate, getENULSFeeInfo } from './util/Nerve';
import { getContractCallData } from '@/api/nulsContractValidate';
import TronLink from '@/api/tronLink';
import { validateNerveAddress } from '@/api/api';
import { getEquipmentNo, getMultiQuote } from '@/views/Swap/util/MetaPath';
import Inch from './util/1inch';

const ethers = require('ethers');
const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Swap',
  components: {
    CoinModal,
    'pop-modal': PopUp,
    ConfirmOrder,
    Loading,
    ImportModal
  },
  data() {
    this.amountInDebounce = debounce(this.amountInInput, 800);
    this.amountOutDebounce = debounce(this.amountOutInput, 800);
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
      slippage: localStorage.getItem('slippage') || 2, // 滑点
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
      swapPairTradeList: [],
      nerveChainStableSwap: false,
      swapNerveAddress: '',
      swapNulsAddress: '',
      NULSContractGas: 0,
      NULSContractTxData: null,
      toAddress: '', // 接收地址
      addressError: '', // 地址错误提示
      inch: null,
      assetList: [],
      isFromLpAsset: false,
      isToLpAsset: false,
      nerveCrossSwap: false,
      showImportModal: false,
      importAssetInfo: {},
      showTips: false,
      switchFlag: false,
      isBridge: false,
      tokenPath: []
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
          this.amountMsg || ((this.fromNetwork === 'TRON' && this.chooseToAsset && this.chooseToAsset.chain !== 'TRON' || this.fromNetwork !== 'TRON' && this.chooseToAsset && this.chooseToAsset.chain === 'TRON') && (!this.toAddress || this.addressError))
      ); //  && !this.toAddress && this.addressError
    },
    currentChainId() {
      const supportChainList = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];
      const currentChain = supportChainList.find(chain => chain.chain === this.fromNetwork);
      return currentChain && currentChain.nativeId || '';
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.fromNetwork]['symbol'];
    },
    networkPlaceholder() {
      return `${this.$t('tips.tips57')}${this.chooseToAsset && this.chooseToAsset.chain || 'TRON'}${this.$t('tips.tips58')}`;
    },
    l1ChainList() {
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      return tempSupportChainList.map(chain => ({
        chainId: chain[ETHNET],
        rpcUrls: chain.rpcUrl ? [chain.rpcUrl] : [],
        icon: chain.icon,
        chainName: chain.value,
        nativeCurrency: {
          name: chain.value,
          symbol: chain.symbol,
          decimals: chain.decimals
        },
        blockExplorerUrls: [chain.origin],
        chainType: chain.chainType
      }));
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
          const decimals = this.chooseFromAsset.decimals || 6;
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
          const decimals = this.chooseToAsset.decimals || 6;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal.toString()) || newVal === '') {
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
            await this.checkAssetAuthStatus();
          } else if (newVal.channel === 'DODO') {
            await this.checkAssetAuthStatus();
          } else if (newVal.channel === 'NERVE' && this.fromNetwork !== 'NERVE') {
            await this.checkAssetAuthStatus();
          } else if (newVal.channel === 'NERVE' && this.fromNetwork === 'NERVE') {
            await this.checkAssetAuthStatus();
          } else if (newVal.originalChannel === 'MetaPath' && this.fromNetwork !== 'NERVE') {
            this.limitMin = newVal.limitMin || 0.001;
            this.limitMax = newVal.limitMax || 1000000;
            await this.checkAssetAuthStatus();
          } else if (newVal.channel === '1inch') {
            await this.checkInchAssetAuthStatus();
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
    this.currentIndex = this.slippageList.findIndex(item => item.toString() === this.slippage.toString());
    if (this.fromNetwork === 'NERVE') {
      this.getNerveSwapPairTrade();
    }
    if (this.chainType == 2) {
      this.inch = new Inch({ nativeId: this.nativeId });
    }
    // setTimeout 0 不然获取不到地址
    this.setSwapAssetList();
    this.getSwapAddress();
    this.getNerveLimitInfo();
    this.getChanelConfig();
  },
  beforeDestroy() {
    if (this.balanceTimer) clearInterval(this.balanceTimer);
    this.balanceTimer = null;
  },
  methods: {
    switchPlugin() {
      localStorage.removeItem('walletType');
      this.showTips = false;
      window.location.reload();
    },
    cancelClick() {
      this.showTips = false;
      this.switchFlag = true;
      this.setSwapAssetList();
    },
    async closeModal() {
      if (this.slippageMsg) return;
      this.showSlippage = false;
    },
    async getNerveSwapPairTrade() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config && config['NERVE']['apiUrl'];
      const res = await this.$post(url, 'getAvailableStablePairList', [MAIN_INFO.chainId]);
      if (res.result) {
        this.swapPairTradeList = res.result;
      } else {
        this.swapPairTradeList = [];
      }
    },
    addressInput() {
      if (this.chooseToAsset && this.toAddress) {
        if (this.chooseToAsset.chain === 'NULS' && !validateNerveAddress(this.toAddress, 'NULS')) {
          this.addressError = this.$t('tips.tips59');
        } else if (this.chooseToAsset.chain === 'NERVE' && !validateNerveAddress(this.toAddress, 'NERVE')) {
          this.addressError = this.$t('tips.tips59');
        } else if (this.chooseToAsset.chain === 'TRON') {
          const tron = new TronLink();
          if (!tron.validAddress(this.toAddress)) {
            this.addressError = this.$t('tips.tips59');
          } else {
            this.addressError = '';
            this.changeAmount();
          }
        } else if (this.chooseToAsset.chain !== 'NULS' && this.chooseToAsset.chain !== 'NERVE' && this.chooseToAsset.chain !== TRON && !validateAddress(this.toAddress)) {
          this.addressError = this.$t('tips.tips59');
        } else {
          this.addressError = '';
          this.changeAmount();
        }
      } else if (!this.toAddress) {
        this.addressError = this.$t('tips.tips61');
        this.changeAmount();
      } else {
        this.addressError = '';
        this.changeAmount();
      }
    },
    addressFocus(event) {
      event.currentTarget.select();
    },
    changeAmount() {
      if (this.inputType === 'amountIn' && this.amountIn) {
        this.amountInDebounce();
      } else if (this.inputType === 'amountOut' && this.amountOut) {
        this.amountOutDebounce();
      }
    },
    // 滑点设置
    slippageInput() {
      if (this.slippage && this.slippage > 0 && Minus(this.slippage, 100) < 0) {
        this.slippageMsg = '';
        this.currentIndex = this.slippageList.indexOf(this.slippage);
        localStorage.setItem('slippage', this.slippage);
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
      localStorage.setItem('slippage', this.slippage);
    },
    // 查询异构链token资产授权情况
    async checkAssetAuthStatus() {
      try {
        const contractAddress = this.chooseFromAsset.contractAddress;
        const authContractAddress = this.getAuthContractAddress();
        if (authContractAddress && this.chooseFromAsset.contractAddress && this.chainType === 2) {
          const transfer = new ETransfer();
          this.needAuth = await transfer.getERC20Allowance(
            contractAddress,
            authContractAddress,
            this.fromAddress
          );
        } else if (authContractAddress && this.chooseFromAsset.contractAddress && this.chainType === 3) {
          const transfer = new TronLink();
          this.needAuth = await transfer.getTrc20Allowance(
            this.currentAccount['address'][this.fromNetwork],
            authContractAddress,
            contractAddress
          );
        } else if (this.chainType === 1) {
          this.needAuth = false;
        }
        // this.showComputedLoading = false;
        await this.checkChannelLimitInfo();
        if (this.inputType === 'amountIn') {
          this.amountOut = this.currentChannel.amountOut < 0 ? '' : this.numberFormat(tofix(this.currentChannel.amountOut || 0, this.chooseToAsset.decimals || 6, -1), this.chooseToAsset.decimals || 6);
        } else {
          this.amountIn = this.currentChannel.amount < 0 ? '' : this.numberFormat(tofix(this.currentChannel.amount || 0, this.chooseFromAsset.decimals || 6, -1), this.chooseFromAsset.decimals || 6);
        }
        if (!this.needAuth && this.getAllowanceTimer) {
          this.clearGetAllowanceTimer();
        }
      } catch (e) {
        this.needAuth = false;
        console.log(e, 'error');
      }
    },
    // 获取Inch资产授权
    async checkInchAssetAuthStatus() {
      const params = {
        tokenAddress: this.chooseFromAsset.contractAddress,
        walletAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId]
      };
      this.needAuth = this.chooseFromAsset.contractAddress && await this.inch.get1inchAssetAllowance(params) || false;
      await this.checkChannelLimitInfo();
      if (this.inputType === 'amountIn') {
        this.amountOut = this.currentChannel.amountOut < 0 ? '' : this.numberFormat(tofix(this.currentChannel.amountOut || 0, this.chooseToAsset.decimals || 6, -1), this.chooseToAsset.decimals || 6);
      } else {
        this.amountIn = this.currentChannel.amount < 0 ? '' : this.numberFormat(tofix(this.currentChannel.amount || 0, this.chooseFromAsset.decimals || 6, -1), this.chooseFromAsset.decimals || 6);
      }
      if (!this.needAuth && this.getAllowanceTimer) {
        this.clearGetAllowanceTimer();
      }
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      if (this.approvingLoading) return false;
      this.showApproveLoading = true;
      try {
        let transfer, res;
        if (this.currentChannel.channel === '1inch') {
          transfer = new ETransfer();
          const params = {
            tokenAddress: this.chooseFromAsset.contractAddress
          };
          const transactionData = await this.inch.get1inchApproveTransactionData(params);
          res = await transfer.sendTransaction({
            ...transactionData
          });
        } else {
          const authContractAddress = this.getAuthContractAddress();
          const contractAddress = this.chooseFromAsset.contractAddress;
          if (this.fromNetwork === TRON) {
            transfer = new TronLink();
            res = await transfer.approveTrc20(
              this.currentAccount['address'][this.fromNetwork],
              authContractAddress,
              contractAddress
            );
          } else {
            transfer = new ETransfer();
            res = await transfer.approveERC20(
              contractAddress,
              authContractAddress,
              this.fromAddress
            );
          }
        }
        if (res.hash && this.fromNetwork !== TRON || res && this.fromNetwork === TRON) {
          this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: this.fromNetwork === TRON && res || res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            message: this.$t('tips.tips14'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: this.errorHandling(res.msg),
            type: 'warning',
            duration: 2000,
            offset: 30
          });
        }
        this.approvingLoading = true;
        this.showApproveLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
        this.showApproveLoading = false;
      }
    },

    clearGetAllowanceTimer() {
      if (!this.getAllowanceTimer) return;
      clearInterval(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    },

    setGetAllowanceTimer() {
      if (this.currentChannel.channel === '1inch') {
        this.getAllowanceTimer = setInterval(() => {
          this.checkInchAssetAuthStatus();
        }, 3000);
      } else {
        this.getAllowanceTimer = setInterval(() => {
          this.checkAssetAuthStatus();
        }, 3000);
      }
    },

    getAuthContractAddress() {
      let authContractAddress;
      const config = JSON.parse(sessionStorage.getItem('config'));
      if (this.currentChannel.channel === 'iSwap' && !this.stableSwap) {
        authContractAddress = contractConfig[this.nativeId];
      } else if (this.currentChannel.channel === 'iSwap' && this.stableSwap) {
        authContractAddress = contractBridgeConfig[this.nativeId];
      } else if (this.currentChannel.channel === 'NERVE') {
        authContractAddress = this.currentChannel['approveAddress'] || config[this.fromNetwork]['config']['crossAddress'];
      } else if (this.currentChannel.channel === 'DODO') {
        authContractAddress = this.currentChannel.approveAddress;
      } else if (this.currentChannel.originalChannel === 'MetaPath') {
        authContractAddress = this.currentChannel.approveAddress || '';
      }
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
      try {
        if (localStorage.getItem('channelConfig')) {
          this.originChannelConfigList = JSON.parse(localStorage.getItem('channelConfig'));
          this.channelConfigList = JSON.parse(localStorage.getItem('channelConfig'));
          const res = await this.$request({
            url: '/swap/channel',
            method: 'get'
          });
          if (res.code === 1000 && res.data) {
            localStorage.setItem('channelConfig', JSON.stringify(res.data));
            this.originChannelConfigList = res.data;
            this.channelConfigList = res.data;
          }
        } else {
          this.originChannelConfigList = localChannelList;
          this.channelConfigList = localChannelList;
          const res = await this.$request({
            url: '/swap/channel',
            method: 'get'
          });
          if (res.code === 1000 && res.data) {
            localStorage.setItem('channelConfig', JSON.stringify(res.data));
            this.originChannelConfigList = res.data;
            this.channelConfigList = res.data;
          }
        }
      } catch (e) {
        this.originChannelConfigList = localChannelList;
        this.channelConfigList = localChannelList;
        console.log(e, 'error');
      }
    },
    // 获取当前是否为稳定币资产兑换
    isStableSwap(fromAsset, toAsset) {
      this.nerveChainStableSwap = fromAsset.chain === 'NERVE' && toAsset.chain === 'NERVE';
      this.nerveCrossSwap = !!(fromAsset.nerveChainId && fromAsset.nerveAssetId && toAsset.nerveChainId && toAsset.nerveAssetId) && fromAsset.chain !== toAsset.chain;
      let isStableLpInfo;
      if (fromAsset.channelInfo && fromAsset.channelInfo['NERVE'] && fromAsset.channelInfo['NERVE'].pairAddress) {
        const currentPairIno = this.swapPairTradeList.find(item => item.address === fromAsset.channelInfo['NERVE'].pairAddress);
        const assetKey = `${toAsset.nerveChainId}-${toAsset.nerveAssetId}`;
        isStableLpInfo = currentPairIno && (currentPairIno.lpToken === assetKey || currentPairIno.groupCoin['assetKey'] == 1);
        this.isToLpAsset = isStableLpInfo;
        this.isFromLpAsset = false;
      } else if (toAsset.channelInfo && toAsset.channelInfo['NERVE'] && toAsset.channelInfo['NERVE'].pairAddress) {
        const currentPairIno = this.swapPairTradeList.find(item => item.address === toAsset.channelInfo['NERVE'].pairAddress);
        const assetKey = `${fromAsset.nerveChainId}-${fromAsset.nerveAssetId}`;
        isStableLpInfo = currentPairIno && (currentPairIno.lpToken === assetKey || currentPairIno.groupCoin['assetKey'] == 1);
        this.isToLpAsset = false;
        this.isFromLpAsset = isStableLpInfo;
      }
      this.isBridge = fromAsset.nerveChainId === toAsset.nerveChainId && fromAsset.nerveAssetId === toAsset.nerveAssetId;
      return this.isBridge ||
             fromAsset.channelInfo && toAsset.channelInfo && fromAsset.channelInfo['NERVE'] && toAsset.channelInfo['NERVE'] && fromAsset.channelInfo['NERVE'].pairAddress && toAsset.channelInfo['NERVE'].pairAddress && (fromAsset.channelInfo['NERVE'].pairAddress === toAsset.channelInfo['NERVE'].pairAddress) || isStableLpInfo ||
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
        swapPairTradeList,
        bridgeLimitInfo,
        nerveChainStableSwap,
        NULSContractGas,
        NULSContractTxData,
        isToLpAsset,
        isFromLpAsset,
        nerveCrossSwap,
        isBridge,
        tokenPath
      } = this;
      const pariBool = this.chooseToAsset && this.chooseToAsset['channelInfo'] && this.chooseToAsset['channelInfo']['NERVE'];
      const stableSwapAsset = this.nerveLimitInfo.find(item => item.pairAddress === (pariBool && this.chooseToAsset.channelInfo['NERVE'].pairAddress));
      const tokenOutIndex = stableSwapAsset && stableSwapAsset.swapAssets.find(item => this.chooseToAsset.nerveChainId === item.nerveChainId && this.chooseToAsset.nerveAssetId === item.nerveAssetId).coinIndex || 0;
      const tempTokenIndexList = stableSwapAsset && stableSwapAsset.swapAssets.map(item => item.coinIndex) || [];
      tempTokenIndexList.unshift(tokenOutIndex);
      const tokenIndexList = tempTokenIndexList && [...new Set(tempTokenIndexList)] || [];
      const fromAddress = this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId];
      const toChain = this.chooseToAsset.chain;
      const tempParams = {
        address: fromAddress,
        fromAsset: chooseFromAsset,
        toAddress: this.toAddress || this.currentAccount['address'][toChain] || this.currentAccount['address'][this.chainNameToId[toChain]] || '',
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
        swapPairTradeList,
        bridgeLimitInfo,
        nerveChainStableSwap,
        tokenOutIndex,
        NULSContractGas,
        NULSContractTxData,
        isToLpAsset,
        isFromLpAsset,
        tokenIndexList,
        nerveCrossSwap,
        isBridge,
        tokenPath
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
    async getSwapAssetList(chain) {
      try {
        const data = {
          chain: chain || this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/assets',
          data
        });
        if (res.code === 1000 && res.data.length > 0) {
          return res.data;
        } else {
          return [];
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 获取当前的swap资产
    async setSwapAssetList() {
      let fromContractAddress, toContractAddress, fromChain, toChain, tempFromCoin, tempToCoin, assetList, tempList;
      if (Object.keys(this.$route.query).length > 0) {
        fromContractAddress = this.$route.query.from;
        toContractAddress = this.$route.query.to;
        fromChain = this.$route.query.fromChain;
        toChain = this.$route.query.toChain;
      }
      const currentChain = this.l1ChainList.find(item => item.chainName === fromChain);
      if (this.fromNetwork !== fromChain && currentChain) {
        const tempFromAssetList = await this.getSwapAssetList(fromChain);
        const tempToAssetList = await this.getSwapAssetList(toChain);
        tempFromCoin = this.formatNulsNerveAsset(fromChain, tempFromAssetList, fromContractAddress);
        tempToCoin = this.formatNulsNerveAsset(toChain, tempToAssetList, toContractAddress);
      } else {
        assetList = await this.getSwapAssetList();
        tempList = assetList && assetList.length > 0 && assetList.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
        if (this.fromNetwork === fromChain && this.fromNetwork === toChain) {
          tempFromCoin = this.formatNulsNerveAsset(fromChain, tempList, fromContractAddress);
          tempToCoin = this.formatNulsNerveAsset(toChain, tempList, toContractAddress);
        } else if (this.fromNetwork === fromChain && this.fromNetwork !== toChain) {
          tempFromCoin = this.formatNulsNerveAsset(fromChain, tempList, fromContractAddress);
          const toTempAssetList = await this.getSwapAssetList(toChain);
          tempToCoin = this.formatNulsNerveAsset(toChain, toTempAssetList, toContractAddress);
        }
      }
      // console.log(fromContractAddress, toContractAddress, tempFromCoin, tempToCoin)
      if (fromContractAddress && toContractAddress && tempFromCoin && tempToCoin) {
        this.chooseFromAsset = tempFromCoin;
        await this.selectCoin({ coin: this.chooseFromAsset, type: 'send', network: this.fromNetwork });
        this.chooseToAsset = tempToCoin;
        await this.selectCoin({ coin: this.chooseToAsset, type: 'receive', network: this.fromNetwork });
      } else {
        if (!tempList) tempList = await this.getSwapAssetList(this.fromNetwork);
        if (this.fromNetwork === 'NULS' || this.fromNetwork === 'NERVE') {
          this.chooseFromAsset = tempList.find(item => this.fromNetwork == 'NERVE' && item.assetId == 1 && item.chainId == 9 || this.fromNetwork == 'NULS' && item.assetId == 1 && item.chainId == 1) || tempList[0] || null;
        } else {
          this.chooseFromAsset = tempList.find(item => item.assetId == 1) || tempList[0] || null;
        }
        this.chooseToAsset = tempList.find(item => item.symbol === ISWAP_USDT_CONFIG[this.currentChainId] || item.symbol === 'USDT' || item.symbol === 'USD18') || tempList[2] || null;
        this._replaceBrowserHistory(this.chooseFromAsset, this.chooseToAsset);
        if (this.chooseToAsset && this.chooseFromAsset && this.chooseFromAsset.chain && this.chooseToAsset.chain) {
          this.switchAsset = true;
        }
        this.crossFeeAsset = tempList.find(item => item.symbol === ISWAP_USDT_CONFIG[this.currentChainId] || item.symbol === 'USDT' || item.symbol === 'USD18') || null;
      }
      if (this.fromNetwork === 'NERVE' && tempList) {
        sessionStorage.setItem('nerveSwapAssetList', JSON.stringify(tempList));
      }
      this.chooseFromAsset && this.chooseFromAsset.chain === this.fromNetwork && await this.getBalance(this.chooseFromAsset);
      this.chooseFromAsset.chain === this.fromNetwork && this.refreshBalance();
    },
    _replaceBrowserHistory(fromAsset, toAsset) {
      const fromChain = fromAsset && fromAsset.chain;
      const toChain = toAsset && toAsset.chain;
      const from = fromAsset && this.formatNulsNerveChainId(fromAsset) || '';
      const to = toAsset && this.formatNulsNerveChainId(toAsset) || '';
      fromChain && replaceBrowserHistory('fromChain', fromChain);
      toChain && replaceBrowserHistory('toChain', toChain);
      from && replaceBrowserHistory('from', from);
      to && replaceBrowserHistory('to', to);
    },
    formatNulsNerveAsset(chain, assetList, contractAddress) {
      if (chain === 'NULS' || chain === 'NERVE') {
        const chainId = contractAddress.split('-')[0] || '';
        const assetId = contractAddress.split('-')[1] || '';
        return assetList.find(item => item.chainId == chainId && item.assetId == assetId);
      }
      return assetList.find(item => contractAddress === MAIN_EVM_ADDRESS && !item.contractAddress || item.contractAddress === contractAddress);
    },
    formatNulsNerveChainId(asset) {
      if (asset.chain === 'NULS' || asset.chain === 'NERVE') {
        return `${asset.chainId}-${asset.assetId}`;
      }
      return asset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    },
    async chainChange(chain) {
      try {
        const currentChain = this.l1ChainList.find(item => item.chainName === chain);
        const walletType = localStorage.getItem('walletType') || 'ethereum';
        const tempChain = {
          ...currentChain
        };
        if (this.currentChain === tempChain.chainName) return;
        if (tempChain.chainName === 'NULS' || tempChain.chainName === 'NERVE' || tempChain.chainId === window[walletType].chainId) {
          if (walletType === 'tronWeb') {
            this.showTips = true;
            return;
          }
          this.$store.commit('changeNetwork', tempChain.chainName);
          this.$emit('changeChainId', tempChain.chainName === 'NERVE' && '0x-2' || '0x-1');
          window.location.reload();
        } else if (tempChain.chainType === 2) {
          if (walletType === 'tronWeb') {
            this.showTips = true;
            return;
          }
          delete tempChain['icon'];
          delete tempChain['chainType'];
          if (tempChain.chainName !== 'Ethereum') {
            window[walletType] && await window[walletType].request({
              method: 'wallet_addEthereumChain',
              params: [tempChain]
            });
          } else {
            window[walletType] && await window[walletType].request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: tempChain.chainId }]
            });
          }
        } else if (tempChain.chainType === 3) {
          if (walletType !== 'tronWeb') {
            this.showTips = true;
            return;
          }
          this.showTips = true;
        }
      } catch (e) {
        console.log(e, 'error');
        this.$message({
          message: e.message || e,
          offset: 30,
          type: 'warning'
        });
        return true;
      }
    },
    // 更新当前的swap资产列表
    updateSwapAssetList(assetList) {
      const localSwapAssetMap = localStorage.getItem('localSwapAssetMap') && JSON.parse(localStorage.getItem('localSwapAssetMap'));
      localSwapAssetMap[this.fromNetwork] = assetList || [];
      localStorage.setItem('localSwapAssetMap', JSON.stringify(localSwapAssetMap));
    },
    // 当前选择的币
    async selectCoin({ coin, type }) {
      this.showModal = false;
      this.showImportModal = false;
      switch (type) {
        case 'send':
          this.resetData();
          this.currentChannel = null;
          this.chooseFromAsset = coin;
          this._replaceBrowserHistory(this.chooseFromAsset, '');
          // console.log(this.chooseFromAsset.chain === this.fromNetwork, 'this.chooseFromAsset.chain === this.fromNetwork &&');
          this.chooseFromAsset.chain === this.fromNetwork && await this.getBalance(this.chooseFromAsset, true);
          this.chooseFromAsset.chain === this.fromNetwork && this.refreshBalance();
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === 'NERVE' && this.chooseToAsset.chain === 'NERVE') {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = false;
            this.switchAsset = true;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = true;
            this.switchAsset = false;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.nerveCrossSwap = false;
            this.crossTransaction = false;
            this.switchAsset = true;
          } else {
            this.crossTransaction = true;
            this.switchAsset = false;
          }
          if (this.chooseToAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountIn = '';
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOut = '';
            this.amountOutDebounce();
          }
          break;
        case 'receive': // 选择接收资产
          this.chooseToAsset = coin;
          this._replaceBrowserHistory('', this.chooseToAsset);
          this.resetData();
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = true;
            this.switchAsset = false;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === 'NERVE' && this.chooseToAsset.chain === 'NERVE') {
            this.stableSwap = this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
            this.crossTransaction = false;
            this.switchAsset = true;
          } else if (this.chooseFromAsset && this.chooseToAsset && this.chooseFromAsset.chain === this.chooseToAsset.chain) {
            this.nerveCrossSwap = false;
            this.crossTransaction = false;
            this.switchAsset = true;
          } else {
            this.crossTransaction = true;
            this.switchAsset = false;
          }
          if (this.chooseFromAsset && this.inputType === 'amountIn' && this.amountIn) {
            this.amountIn = '';
            this.amountOut = '';
            this.amountInDebounce();
          } else if (this.chooseToAsset && this.inputType === 'amountOut' && this.amountOut) {
            this.amountIn = '';
            this.amountOut = '';
            this.amountOutDebounce();
          }
          // if (this.fromNetwork === 'TRON' && this.chooseToAsset && this.chooseToAsset.chain !== 'TRON' || this.fromNetwork !== 'TRON' && this.chooseToAsset && this.chooseToAsset.chain === 'TRON') {
          //   this.toAddress = this.currentAccount['address'][this.chooseToAsset.chain] || this.currentAccount['address'][this.chainNameToId[this.chooseToAsset.chain]] || '';
          //   this.addressInput();
          // }
          if (this.chooseFromAsset && this.chooseToAsset && this.chooseToAsset.chain !== this.chooseFromAsset.chain) {
            this.toAddress = this.currentAccount['address'][this.chooseToAsset.chain] || this.currentAccount['address'][this.chainNameToId[this.chooseToAsset.chain]] || '';
            this.addressInput();
          }
          break;
        default:
          return false;
      }
    },
    importAsset({ coin }) {
      // this.showModal = false;
      this.showImportModal = true;
      this.importAssetInfo = coin;
    },
    // 获取钱包余额
    async getBalance(asset, clickBoo = false) {
      if (!asset) return false;
      if (this.balanceRequest || clickBoo) {
        this.balanceLoading = true;
      }
      if (this.chainType === 1) {
        this.available = this.$store.state.network === 'NULS' ? await this.getNulsAssetBalance(asset) : await this.getNerveAssetBalance(asset);
        this.userAvailable = this.available;
      } else if (this.chainType === 2) {
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
      } else if (this.chainType === 3) {
        const tempAvailable = await this.getTronAssetBalance(asset);
        this.available = tempAvailable && tofix(tempAvailable, 6, -1);
        this.userAvailable = tempAvailable;
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
      // if (this.chooseToAsset && this.chooseToAsset.chain === TRON && !this.toAddress) {
      //   this.addressError = this.$t('tips.tips61');
      // }
      if (this.chooseFromAsset && this.chooseToAsset && this.amountIn && Number(this.amountIn) !== 0 && !this.availableLoading && !this.addressError) {
        this.amountOut = '';
        this.btnErrorMsg = '';
        this.needAuth = false;
        this.getOptionalChannel();
        const tempChannel = await this.getChannelList();
        if (tempChannel) {
          // this.amountOut = tempChannel.amountOut < 0 ? '' : this.numberFormat(tofix(tempChannel.amountOut || 0, 6, -1), 6);
          this.currentChannel = tempChannel;
        } else {
          this.currentChannel = null;
          this.showComputedLoading = false;
        }
      } else {
        if (!this.amountIn) { this.amountMsg = ''; this.btnErrorMsg = ''; this.getChannelBool = false; }
        this.amountOut = '';
        if (!this.addressError) this.currentChannel = null;
      }
    },
    getOptionalChannel() {
      this.channelConfigList = (this.originChannelConfigList || []).filter(channel => {
        if (this.crossTransaction && !this.stableSwap) {
          return channel.crossSwap === true && channel.status === 1;
        } else if (this.crossTransaction && this.stableSwap) {
          return this.checkLpBalance() && channel.channel === 'NERVE' && channel.bridge === true && channel.status === 1 || this.isBridge && channel.channel === 'NERVE' && channel.bridge === true && channel.status === 1 || channel.channel !== 'NERVE' && channel.bridge === true && channel.status === 1;
        }
        return channel.swap === true && channel.status === 1; //  && channel.channel === 'DODO'
      });
    },
    // 查看当前nerve通道流动性
    checkLpBalance() {
      if (this.chooseFromAsset && this.chooseToAsset) {
        const pairAddress = this.chooseFromAsset.channelInfo && this.chooseFromAsset.channelInfo['NERVE'] && this.chooseFromAsset.channelInfo['NERVE'].pairAddress || '';
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
              limitMax: swapMap[this.chooseToAsset.registerChain]
            };
          }
          return {
            ...channel
          };
        });
        return Minus(this.inputType === 'amountIn' ? Times(this.amountIn, Minus(1, feeRate)) : this.amountOut, swapMap[this.chooseToAsset.registerChain]) <= 0;
      }
      return false;
    },
    // 根据不同通道查询当前的限额
    async checkChannelLimitInfo() {
      if (this.stableSwap) {
        if (this.currentChannel.channel === 'iSwap') {
          const limitAssetInfo = this.bridgeLimitInfo.find(item => this.chooseFromAsset.symbol === item.symbol);
          const currentLimitMax = this.chooseFromAsset.symbol === (limitAssetInfo.symbol || 'USDT') ? (limitAssetInfo && limitAssetInfo.biggerMax || limitAssetInfo.normalMax) : limitAssetInfo.normalMax;
          const currentLimitMin = this.chooseFromAsset.symbol === (limitAssetInfo.symbol || 'USDT') ? (limitAssetInfo && limitAssetInfo.normalMin || limitAssetInfo.normalMin) : limitAssetInfo.normalMin;
          if (Minus(this.amountIn, currentLimitMin) < 0) {
            this.amountMsg = `${this.$t('tips.tips3')}${currentLimitMin}${this.chooseFromAsset.symbol}`;
            this.showComputedLoading = false;
          } else if (Minus(this.amountIn, currentLimitMax) > 0) {
            this.amountMsg = `${this.$t('tips.tips4')}${currentLimitMax}${this.chooseFromAsset.symbol}`;
            this.showComputedLoading = false;
          } else {
            await this.checkBalance();
          }
        } else if (this.currentChannel.channel === 'NERVE' && this.nerveChainStableSwap) {
          await this.checkBalance();
        } else if (this.currentChannel.channel === 'NERVE') {
          if (Minus(this.amountIn, 0.001) < 0) {
            this.amountMsg = `${this.$t('tips.tips3')}${0.001}${this.chooseFromAsset.symbol}`;
            this.showComputedLoading = false;
          } else {
            await this.checkBalance();
          }
        } else if (this.currentChannel.originalChannel === 'MetaPath') {
          if (Minus(this.amountIn, this.limitMax) > 0) {
            this.amountMsg = `${this.$t('tips.tips4')}${this.limitMax}${this.chooseFromAsset.symbol}`;
            this.showComputedLoading = false;
          } else if (Minus(this.amountIn, this.limitMin) < 0) {
            this.amountMsg = `${this.$t('tips.tips3')}${this.limitMin}${this.chooseFromAsset.symbol}`;
            this.showComputedLoading = false;
          } else {
            await this.checkBalance();
          }
        }
      } else {
        if (Minus(this.currentChannel.usdtAmountIn, this.limitMin) < 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
          this.amountMsg = `${this.$t('tips.tips3')}$${this.limitMin}`;
          this.showComputedLoading = false;
        } else if (Minus(this.currentChannel.usdtAmountIn, this.limitMax) > 0 && this.chooseFromAsset.chain !== this.chooseToAsset.chain) {
          this.amountMsg = `${this.$t('tips.tips4')}$${this.limitMax}`;
          this.showComputedLoading = false;
        } else if (this.currentChannel.originalChannel === 'MetaPath' && Minus(this.amountIn, this.limitMax) > 0) {
          this.amountMsg = `${this.$t('tips.tips4')}${this.limitMax}${this.chooseFromAsset.symbol}`;
          this.showComputedLoading = false;
        } else if (this.currentChannel.originalChannel === 'MetaPath' && Minus(this.amountIn, this.limitMin) < 0) {
          this.amountMsg = `${this.$t('tips.tips3')}${this.limitMin}${this.chooseFromAsset.symbol}`;
          this.showComputedLoading = false;
        } else {
          await this.checkBalance();
        }
      }
    },
    // 检查当前余额是否足够
    async checkBalance() {
      const { userAvailable, chooseFromAsset } = this;
      let amountIn;
      if (this.inputType === 'amountIn') {
        amountIn = this.amountIn;
      } else {
        amountIn = this.currentChannel.amount < 0 ? '' : this.numberFormat(tofix(this.currentChannel.amount || 0, 6, -1), 6);
      }
      if (this.fromNetwork === 'NULS') {
        const nulsBalance = await this.getNulsAssetBalance({
          assetId: NULS_INFO.assetId,
          chainId: NULS_INFO.chainId,
          contractAddress: '',
          decimals: NULS_INFO.decimal
        });
        if (Minus(amountIn, userAvailable) > 0) {
          this.amountMsg = `${chooseFromAsset.symbol} ${this.$t('tips.tips9')}`;
        } else if (Minus(this.currentChannel.crossChainFee || 0, nulsBalance) > 0) {
          this.amountMsg = `NULS ${this.$t('tips.tips9')}`;
        } else {
          this.amountMsg = '';
        }
      } else {
        if (this.fromNetwork === 'NERVE' && this.chooseToAsset.chain === 'NULS') {
          const nulsBalance = await this.getNerveAssetBalance({
            assetId: NULS_INFO.assetId,
            chainId: NULS_INFO.chainId,
            contractAddress: '',
            decimals: NULS_INFO.decimal
          });
          const NVTBalance = await this.getNerveAssetBalance({
            assetId: MAIN_INFO.assetId,
            chainId: MAIN_INFO.chainId,
            contractAddress: '',
            decimals: MAIN_INFO.decimal
          });
          if (Minus(crossFee, NVTBalance) > 0) {
            this.amountMsg = `NVT ${this.$t('tips.tips9')}`;
          } else if (Minus(crossFee, nulsBalance) > 0) {
            this.amountMsg = `NULS ${this.$t('tips.tips9')}`;
          } else {
            this.amountMsg = '';
          }
        } else if (Minus(amountIn, userAvailable) > 0) {
          this.amountMsg = `${chooseFromAsset.symbol} ${this.$t('tips.tips9')}`;
        } else {
          this.amountMsg = '';
        }
      }
      this.showComputedLoading = false;
    },
    computedSwapRate(isCross, amountIn, amountOut) {
      return `1${this.chooseFromAsset.symbol}≈${this.numberFormat(tofix((Division(amountOut, amountIn) < 0.000001 && '0' || Division(amountOut, amountIn)), this.formatLength(Division(amountOut, amountIn)), -1), this.formatLength(Division(amountOut, amountIn)))}${this.chooseToAsset.symbol}`;
    },
    formatLength(amount) {
      if (amount.toString().indexOf('.') !== -1) {
        const intLength = amount.toString().split('.')[0].length;
        if (amount.toString().split('.')[0] == 0) {
          return 6;
        } else if (intLength < 6) {
          return 6 - intLength;
        } else {
          return 0;
        }
      }
      return 6;
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
          this.currentChannel = tempChannel;
        } else {
          this.amountMsg = '';
          this.currentChannel = null;
          this.showComputedLoading = false;
        }
      } else {
        if (!this.amountOut) { this.amountMsg = ''; this.getChannelBool = false; }
        this.amountIn = '';
        this.currentChannel = null;
      }
    },
    // 获取当前支持的config
    async getChannelList() {
      try {
        if (this.chooseFromAsset.chain !== this.fromNetwork) return;
        const isCross = this.chooseToAsset.chain !== this.chooseFromAsset.chain;
        this.showComputedLoading = true;
        this.amountMsg = '';
        // console.log(this.nativeId, this.nerveCrossSwap, 'this.nativeId')
        // debugger;
        console.log(this.channelConfigList, '==channelConfigList==');
        const tempChannelConfig = await Promise.all(this.channelConfigList.map(async item => {
          let currentConfig = {};
          if (item.channel === 'DODO' && this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'NULS') {
            currentConfig = await this.getDodoSwapRoute();
            if (currentConfig) {
              return {
                icon: item.icon,
                amount: this.amountIn,
                channel: item.channel,
                originalChannel: item.channel,
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
          } else if (item.channel === '1inch' && this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'NULS') {
            currentConfig = await this.get1inchSwapRoute();
            if (currentConfig) {
              return {
                icon: item.icon,
                amount: this.amountIn,
                channel: item.channel,
                originalChannel: item.channel,
                amountOut: currentConfig.toAmount,
                minReceive: tofix(Times(currentConfig.toAmount, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                isBest: false,
                isCurrent: false,
                swapRate: this.computedSwapRate(false, this.amountIn, currentConfig.toAmount),
                swapFee: Times(this.amountIn, 0.001),
                feeSymbol: this.chooseFromAsset.symbol
              };
            }
            return null;
          } else if (this.fromNetwork === 'NERVE' && item.channel === 'NERVE' && !this.stableSwap && this.chooseToAsset.chain === 'NERVE') {
            currentConfig = await this.getNerveSwapRoute();
            if (currentConfig) {
              this.tokenPath = currentConfig.tokenPath || [];
              return {
                icon: item.icon,
                amount: currentConfig.amountIn,
                channel: item.channel,
                originalChannel: item.channel,
                amountOut: currentConfig.amountOut,
                minReceive: tofix(Times(currentConfig.amountOut, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                impact: this.numberFormat(tofix(currentConfig.priceImpact, 4, -1) || 0, 4),
                isBest: false,
                isCurrent: false,
                swapRate: this.computedSwapRate(false, currentConfig.amountIn, currentConfig.amountOut),
                // swapFee: 1
              };
            }
            return null;
          } else if (this.fromNetwork === 'NERVE' && item.channel === 'NERVE' && this.stableSwap && this.nerveChainStableSwap) {
            let currentAsset;
            if (this.isFromLpAsset) {
              const stableSwapAsset = this.nerveLimitInfo.find(item => item.pairAddress === this.chooseToAsset.channelInfo['NERVE'].pairAddress);
              currentAsset = stableSwapAsset && stableSwapAsset.swapAssets.find(item => this.chooseToAsset.nerveChainId === item.nerveChainId && this.chooseToAsset.nerveAssetId === item.nerveAssetId) || null;
            } else if (this.isToLpAsset) {
              const stableSwapAsset = this.nerveLimitInfo.find(item => item.pairAddress === this.chooseFromAsset.channelInfo['NERVE'].pairAddress);
              currentAsset = stableSwapAsset && stableSwapAsset.tokenLp || null;
            } else {
              const pariBool = this.chooseToAsset && this.chooseToAsset['channelInfo'] && this.chooseToAsset['channelInfo']['NERVE'];
              const stableSwapAsset = this.nerveLimitInfo.find(item => item.pairAddress === (pariBool && this.chooseToAsset.channelInfo['NERVE'].pairAddress));
              currentAsset = stableSwapAsset && stableSwapAsset.swapAssets.find(item => this.chooseToAsset.nerveChainId === item.nerveChainId && this.chooseToAsset.nerveAssetId === item.nerveAssetId) || null;
            }
            const limitMax = divisionDecimals(currentAsset && currentAsset.amount || 0, currentAsset && currentAsset.decimals || 18);
            if (Minus(this.amountIn, limitMax) > 0) {
              // this.amountMsg = `${this.$t('tips.tips4')}${limitMax}${this.chooseFromAsset.symbol}`;
              return null;
            }
            return {
              icon: item.icon,
              amount: this.inputType === 'amountIn' ? this.amountIn : this.amountOut,
              channel: item.channel,
              originalChannel: item.channel,
              amountOut: this.inputType === 'amountOut' ? this.amountOut : this.amountIn,
              isBest: false,
              isCurrent: false,
              swapRate: this.computedSwapRate(false, 1, 1)
            };
          } else if (item.channel === 'NERVE' && this.stableSwap) {
            currentConfig = await this._getNerveEstimateFeeInfo(this.isBridge && 3 || 2);
            let contractFee; // 调用合约的费用 / 默认的费用
            if (this.fromNetwork === 'NERVE') {
              if (this.chooseToAsset.chain === 'NULS') {
                contractFee = crossFee;
              }
            } else if (this.fromNetwork === 'NULS' && currentConfig) {
              contractFee = Plus(crossFee, 0.001);
              if (this.chooseFromAsset.contractAddress) {
                contractFee = await this.getContractCallData(currentConfig && currentConfig.swapFee);
              }
            }
            if (currentConfig) {
              return {
                icon: item.icon,
                channel: item.channel,
                originalChannel: item.channel,
                amount: this.inputType === 'amountIn' ? this.amountIn : Plus(this.amountOut, currentConfig.swapFee),
                amountOut: this.inputType === 'amountOut' ? this.amountOut : Minus(this.amountIn, currentConfig.swapFee).toString(),
                minReceive: this.inputType === 'amountOut' ? this.amountOut : Minus(this.amountIn, currentConfig.swapFee).toString(),
                swapFee: tofix(this.numberFormat(currentConfig.swapFee, 6), 6, -1),
                crossChainFee: tofix(this.numberFormat(contractFee ? Plus(currentConfig.crossChainFee, contractFee) : currentConfig.crossChainFee, 6), 6, -1),
                contractFee: contractFee || 0, // 调用合约消耗的gasFee
                originCrossChainFee: tofix(this.numberFormat(currentConfig.crossChainFee, 6), 6, -1),
                isBest: false,
                isCurrent: false,
                orderId: currentConfig.orderId
              };
            }
            return null;
          } else if (item.channel === 'NERVE' && !this.stableSwap && this.nerveCrossSwap) {
            if (this.inputType !== 'amountIn') {
              return null;
            }
            currentConfig = await this._getNerveEstimateFeeInfo(1);
            let contractFee;
            if (this.fromNetwork === 'NERVE') {
              if (this.chooseToAsset.chain === 'NULS') {
                contractFee = crossFee;
              }
            } else if (this.fromNetwork === 'NULS' && currentConfig) {
              contractFee = Plus(crossFee, 0.001);
              if (this.chooseFromAsset.contractAddress) {
                contractFee = await this.getContractCallData(currentConfig && currentConfig.swapFee);
              }
            }
            if (currentConfig) {
              return {
                icon: item.icon,
                channel: item.channel,
                originalChannel: item.channel,
                amount: this.inputType === 'amountIn' ? this.amountIn : currentConfig.swapSuccAmount,
                amountOut: this.inputType === 'amountOut' ? this.amountOut : currentConfig.swapSuccAmount,
                minReceive: tofix(Times(currentConfig.swapSuccAmount, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                swapFee: tofix(this.numberFormat(currentConfig.swapFee, 6), 6, -1),
                crossChainFee: tofix(this.numberFormat(contractFee ? Plus(currentConfig.crossChainFee, contractFee) : currentConfig.crossChainFee, 6), 6, -1),
                contractFee: contractFee || 0, // 调用合约消耗的gasFee
                originCrossChainFee: tofix(this.numberFormat(currentConfig.crossChainFee, 6), 6, -1),
                isBest: false,
                isCurrent: false,
                orderId: currentConfig.orderId,
                feeSymbol: this.chooseFromAsset.symbol
              };
            }
            return null;
          } else if (item.channel === 'NERVE' && (this.nativeId === 120 || this.nativeId === 119)) {
            const currentConfig = await this._getENULSFeeInfo();
            if (currentConfig) {
              return {
                icon: item.icon,
                channel: item.channel,
                originalChannel: item.channel,
                amount: this.amountIn,
                amountOut: this.amountIn,
                minReceive: this.amountIn,
                token0: currentConfig.token0,
                token1: currentConfig.token1,
                swapRate: this.computedSwapRate(false, this.amountIn, this.amountIn),
                packSwap: true,
                approveAddress: currentConfig.contractAddress
              };
            }
            return null;
          } else if (item.channel === 'MetaPath' && this.fromNetwork !== 'NERVE' && this.chooseToAsset && this.chooseToAsset.chain !== 'NERVE') {
            const currentConfig = await this.getMetaPathEstimateFeeInfo();
            if (currentConfig) {
              return {
                icon: currentConfig.logoUrl || item.icon,
                channel: currentConfig.dex || item.channel,
                originalChannel: item.channel,
                isBest: false,
                isCurrent: false,
                amount: this.amountIn,
                amountOut: currentConfig.receiveTokenAmount || currentConfig.toTokenAmount,
                approveAddress: currentConfig.approveAddress || '',
                minReceive: tofix(Times(currentConfig.receiveTokenAmount || currentConfig.toTokenAmount, Division(Minus(100, !this.slippageMsg && this.slippage || '2'), 100)), this.chooseToAsset.decimals, -1),
                impact: currentConfig.impact || 0,
                swapRate: this.computedSwapRate(isCross, this.amountIn, currentConfig.receiveTokenAmount || currentConfig.toTokenAmount),
                feeSymbol: currentConfig.feeToken,
                swapFee: this.formatFee(currentConfig, false) || 0,
                dex: currentConfig.dex,
                limitMin: currentConfig.depositMin || 0,
                limitMax: currentConfig.depositMax || 999999,
                crossChainFee: this.formatFee(currentConfig, true) || 0,
                txData: currentConfig.txData || {},
                orderId: currentConfig.orderId,
                platformAddress: currentConfig.platformAddress || ''
              };
            }
            return null;
          }
          return null;
        }));
        this.getChannelBool = true;
        console.log(tempChannelConfig, 'tempChannelConfig');
        // this.showComputedLoading = false;
        return this.getBestPlatform(tempChannelConfig.filter(item => item));
      } catch (e) {
        console.error(e.message, 'error');
      }
    },
    formatFee(currentConfig, isCrossFee) {
      if (currentConfig.dex === 'SWFT') {
        const feeList = currentConfig.fee.split('+');
        if (!isCrossFee) {
          const crossFeeRate = this.toPoint(feeList[0]);
          return Times(this.amountIn, crossFeeRate);
        } else {
          return feeList[1] && feeList[1].trim() || '';
        }
      } else if (currentConfig.dex === 'Bridgers' || currentConfig.dex === 'Aggregator') {
        if (!isCrossFee) {
          return Times(this.amountIn, currentConfig.fee);
        } else {
          return currentConfig.chainFee;
        }
      } else {
        if (!isCrossFee) {
          return currentConfig.fee;
        } else {
          return '';
        }
      }
    },
    toPoint(percent) {
      let str = percent.replace('%', '');
      str = str / 100;
      return str;
    },
    async _getENULSFeeInfo() {
      try {
        const params = {
          contractAddress: this.chooseFromAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          swapContractAddress: this.chooseToAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        };
        return await getENULSFeeInfo(params);
      } catch (e) {
        return null;
      }
    },
    // 获取MetaPath通道配置
    async getMetaPathEstimateFeeInfo() {
      if (!(this.chooseFromAsset['channelInfo'] && this.chooseFromAsset['channelInfo']['MetaPath'] && this.chooseToAsset['channelInfo'] && this.chooseToAsset['channelInfo']['MetaPath'])) {
        return null;
      }
      const params = {
        equipmentNo: getEquipmentNo(this.fromAddress),
        fromTokenAddress: this.chooseFromAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        toTokenAddress: this.chooseToAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        fromTokenAmount: timesDecimals(this.amountIn, this.chooseFromAsset.decimals || 18),
        fromTokenChain: this.chooseFromAsset['channelInfo']['MetaPath']['chain'],
        toTokenChain: this.chooseToAsset['channelInfo']['MetaPath']['chain'],
        userAddr: this.fromAddress,
        toAddress: this.toAddress || this.fromAddress,
        slippage: this.slippage || 1
      };
      return await getMultiQuote(params, this.amountIn);
    },
    // 获取nerve稳定币兑换信息
    async _getNerveEstimateFeeInfo(type) {
      const NerveSwap = new NerveChannel({
        chooseFromAsset: this.chooseFromAsset,
        chooseToAsset: this.chooseToAsset,
        swapPairTradeList: this.swapPairTradeList
      });
      const { platform } = this.$route.query;
      const params = {
        channel: 'NERVE',
        // platform: '',
        platform: platform || 'NABOX',
        swapType: type || 2,
        fromChain: this.chooseFromAsset.chain,
        toChain: this.chooseToAsset.chain,
        fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.chainNameToId[this.fromNetwork]],
        toAddress: this.chooseToAsset.chain === 'NERVE' ? this.toAddress || this.currentAccount['address']['NERVE'] : this.toAddress || this.currentAccount['address'][this.chooseToAsset.chain] || this.currentAccount['address'][this.chainNameToId[this.chooseToAsset.chain]] || 'TFtN2JUP5Zi1i487oZKLK25sPBTTSdYMWy',
        chainId: type === 1 && this.inputType === 'amountOut' && this.chooseToAsset.chainId || this.chooseFromAsset.chainId,
        assetId: type === 1 && this.inputType === 'amountOut' && this.chooseToAsset.assetId || this.chooseFromAsset.assetId,
        contractAddress: type === 1 && this.inputType === 'amountOut' && this.chooseToAsset.contractAddress || this.chooseFromAsset.contractAddress,
        swapChainId: type === 1 && this.inputType === 'amountOut' && this.chooseFromAsset.chainId || this.chooseToAsset.chainId,
        swapAssetId: type === 1 && this.inputType === 'amountOut' && this.chooseFromAsset.assetId || this.chooseToAsset.assetId,
        swapContractAddress: type === 1 && this.inputType === 'amountOut' && this.chooseFromAsset.contractAddress || this.chooseToAsset.contractAddress,
        amount: this.inputType === 'amountIn' && this.amountIn || this.amountOut,
        // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
        pairAddress: this.chooseFromAsset.channelInfo && this.chooseFromAsset.channelInfo['NERVE'] && this.chooseFromAsset.channelInfo['NERVE'].pairAddress || '',
        slippage: type == 1 && this.slippage || 0
      };
      return await NerveSwap.getNerveEstimateFeeInfo(params);
    },
    // 获取DODO费率信息
    async getDodoSwapRoute() {
      if (this.fromNetwork === TRON) return null;
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
        rebateTo: REFERRER,
        fee: '1000000000000000',
        rpc // 当前的rpc地址
      };
      const dodo = new Dodo();
      return await dodo.getDodoRoute(data);
    },
    async get1inchSwapRoute() {
      if (this.fromNetwork === TRON) return null;
      const params = {
        fromTokenAddress: this.chooseFromAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        toTokenAddress: this.chooseToAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        amount: timesDecimals(this.amountIn, this.chooseFromAsset.decimals || 0),
        fee: '0.1'
      };
      return this.inch.get1inchRouteQuote(params);
    },
    // 获取nerve通道上面
    async getNerveSwapRoute() {
      const nerveSwapAssetList = JSON.parse(sessionStorage.getItem('nerveSwapAssetList'));
      const fromAssetKey = `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}`;
      const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
      let tempFromAsset, tempToAsset;
      const checkFromAsset = nerve.swap.checkStableToken(nerve.swap.token(this.chooseFromAsset.chainId, this.chooseFromAsset.assetId), this.swapPairTradeList);
      const checkToAsset = nerve.swap.checkStableToken(nerve.swap.token(this.chooseToAsset.chainId, this.chooseToAsset.assetId), this.swapPairTradeList);
      if (checkFromAsset.success) {
        tempFromAsset = nerveSwapAssetList.find(item => `${item.chainId}-${item.assetId}` === `${checkFromAsset.lpToken.chainId}-${checkFromAsset.lpToken.assetId}`);
      } else {
        tempFromAsset = this.chooseFromAsset;
      }
      if (checkToAsset.success) {
        tempToAsset = nerveSwapAssetList.find(item => `${item.chainId}-${item.assetId}` === `${checkToAsset.lpToken.chainId}-${checkToAsset.lpToken.assetId}`);
      } else {
        tempToAsset = this.chooseToAsset;
      }
      const data = {
        chainId: tempFromAsset.nerveChainId,
        assetId: tempFromAsset.nerveAssetId,
        swapChainId: tempToAsset.nerveChainId,
        swapAssetId: tempToAsset.nerveAssetId,
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
        swapPairInfo: this.swapPairInfo || [],
        swapPairTradeList: this.swapPairTradeList
      });
      if (this.inputType === 'amountIn') {
        return nerveChannel.getNerveChannelConfig(this.inputType, this.amountIn, this.swapPairTradeList);
      } else {
        return nerveChannel.getNerveChannelConfig(this.inputType, this.amountOut, this.swapPairTradeList);
      }
    },
    // 计算nuls合约资产需要的手续费
    async getContractCallData(swapFee) {
      const transferAmount = swapFee && (this.inputType === 'amountIn' ? this.amountIn : Plus(this.amountIn, swapFee || 0));
      const price = 25;
      const res = await getContractCallData(
        this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
        this.swapNerveAddress,
        price,
        this.chooseFromAsset.contractAddress,
        'transferCrossChain',
        transferAmount,
        this.chooseFromAsset.decimals
      );
      if (res.success) {
        const { gasLimit, price } = res.data.contractCallData;
        this.NULSContractGas = gasLimit;
        this.NULSContractTxData = res.data.contractCallData;
        return divisionDecimals(Plus(10100000, Times(gasLimit, price)), 8);
      } else {
        this.$message({
          message: res.msg,
          type: 'warning',
          duration: 2000,
          offset: 30
        });
        return null;
      }
    },
    // 获取中间账户地址
    async getSwapAddress() {
      const configRes = await this.$request({
        method: 'get',
        url: '/api/common/config'
      });
      if (configRes.code === 1000) {
        this.swapNerveAddress = configRes.data.swapNerveAddress;
        this.swapNulsAddress = configRes.data.swapNulsAddress;
      }
    },
    // 最大
    async maxAmount() {
      if (!this.available || this.available == 0) return false;
      this.inputType = 'amountIn';
      this.amountIn = this.userAvailable;
      await this.amountInInput();
    },
    // 切换当前选择的平台
    getBestPlatform(platformList) {
      if (platformList.length === 0) return false;
      if (this.inputType === 'amountIn') {
        const tempList = platformList.reduce((p, v) => Minus(p.minReceive || 0, v.minReceive || 0) < 0 ? v : p);
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
        return this.channelConfigList.reduce((p, v) => Minus(p.minReceive || 0, v.minReceive || 0) < 0 ? v : p);
      } else {
        const tempList = platformList.reduce((p, v) => Minus(p.amount || 0, v.amount || 0) > 0 ? v : p);
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
        return this.channelConfigList.reduce((p, v) => Minus(p.amount || 0, v.amount || 0) > 0 ? v : p);
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
        this.amountOut = this.numberFormat(tofix(this.currentChannel.amountOut, this.chooseToAsset.decimals || 6, -1), this.chooseToAsset.decimals || 6);
      } else {
        this.amountIn = this.numberFormat(tofix(this.currentChannel.amount, this.chooseFromAsset.decimals || 6, -1), this.chooseFromAsset.decimals || 6);
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
      this.isStableSwap(this.chooseFromAsset, this.chooseToAsset);
      this.getChannelBool = false;
      this.currentChannel = null;
      // this.inputType === 'amountIn' ? this.amountOut = '' : this.amountIn = '';
      this.amountOut = '';
      this.amountIn = '';
      await this.getBalance(this.chooseFromAsset, true);
      this.refreshBalance();
      // if (this.inputType === 'amountIn') {
      //   await this.amountInInput();
      // } else {
      //   await this.amountOutInput();
      // }
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
      this.nerveChainStableSwap = false;
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
