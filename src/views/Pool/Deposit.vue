<template>
  <!--   p-4-->
  <div class="join-cont p-4">
    <div v-loading="confirmLoading" v-if="confirmLoading" class="position-fixed_loading" @touchmove.prevent/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="currentAvailable">{{ (currentAvailable || 0.0) | numFormatFixSix }}</span>
      <span v-else>--</span>
    </div>
    <div class="input-cont mt-2 d-flex align-items-center">
      <div class="d-flex align-items-center cursor-pointer" @click="showDropModal">
        <span class="image-cont">
          <img :src="currentAsset && currentAsset.icon || getPicture(currentAsset && currentAsset.symbol)" alt="" @error="pictureError">
        </span>
        <div class="d-flex align-items-center ml-14 direction-column">
          <span class="font-500 size-30">{{ currentAsset && currentAsset.symbol || "USDT" }}</span>
          <span v-if="currentAsset" class="sign">{{ (currentAsset && currentAsset.registerChain) || (currentAsset && currentAsset.chain) }}</span>
        </div>
        <div class="ml-2 drop_down">
          <img v-if="fromNetwork === 'NERVE'" src="@/assets/image/drop_down.png" alt="">
        </div>
      </div>
      <div class="input-item align-items-center ml-4 d-flex flex-1">
        <input
          v-model="joinCount"
          class="flex-1"
          placeholder="0"
          @focus.stop
          @input="countInputDebounce">
        <span class="text-primary size-28" @click.stop="maxCount">{{ $t("swap.swap3") }}</span>
      </div>
    </div>
    <div v-if="amountMsg" class="text-red mt-2 size-24">{{ amountMsg }}</div>
    <div class="output-cont d-flex direction-column">
      <div class="account-info d-flex align-items-center size-28 text-90 cursor-pointer">
        <div @click.stop="showAccountList = !showAccountList">
          <span v-if="!currentType" class="text-primary">{{ $t('tips.tips54') }}</span>
          <span v-else class="text-primary">{{ `${currentType}${ $t('tips.tips46') }${superLong(currentType==='TRON' && !addressError && toAddress || currentAccount['address'][currentType] || currentAccount['address'][chainNameToId[currentType]] || '')}${ $t('tips.tips47') }` }}</span>
        </div>
        <img class="drop_icon" src="../../assets/image/drop_grey.png" alt="">
        <div v-if="showAccountList" class="account-list bg-white">
          <div>{{ $t('tips.tips48') }}</div>
          <div/>
          <div v-for="(item, index) in accountType" :key="index">
            <div v-if="currentAccount['address'][item.chainName] !== undefined || currentAccount['address'][chainNameToId[item.chainName]] !== undefined" class="d-flex align-items-center" @click="changeAccountType(item)">
              <span class="chain-icon mr-3">
                <img :src="getPicture(item.chainName)" alt="" @error="pictureError">
              </span>
              {{ superLong(currentAccount['address'][item.chainName] || currentAccount['address'][chainNameToId[item.chainName]] || `${item.chainName}${$t('tips.tips46')}`) }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center space-between mt-2">
        <div class="d-flex align-items-center">
          <span class="image-cont mr-14">
            <img :src="liquidityInfo.icon || getPicture(liquidityInfo && liquidityInfo.symbol || 'USDTN')" alt="" @error="pictureError">
          </span>
          <span class="font-500 size-30">{{ liquidityInfo && liquidityInfo.symbol || 'USDTN' }}</span>
        </div>
        <span class="font-500 size-36 m-w180 word-break">{{ joinCount || "0" }}</span>
      </div>
    </div>
    <!--fromNetwork === 'TRON' && currentType && currentType !== 'TRON' || -->
    <template v-if="fromNetwork !== 'TRON' && currentType && currentType === 'TRON'">
      <div class="text-90 size-28 mt-5">{{ $t('tips.tips60') }}</div>
      <div class="input_address-cont mt-1">
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
    </template>
    <div v-if="addressError" class="text-red mt-2 ml-2 size-28">{{ addressError }}</div>
    <div class="mt-5">
      <template v-if="true">
        <div
          v-for="(item, index) in lpCoinList"
          :key="index"
          class="d-flex align-items-center size-28 text-90 space-between justify-content-end mt-2">
          <span class="d-flex align-items-center">
            <span class="icon-cont mr-2">
              <img :src="getPicture(item.chain)" alt="" @error="pictureError">
            </span>
            <span>{{ item.chain }}</span>
          </span>
          <span class="text-3a">{{ item.balance | numberFormatLetter }}</span>
        </div>
      </template>
    </div>
    <div class="d-flex mt-3 size-28 align-items-center space-between" @click="showDropList = !showDropList">
      <span class="text-90">{{ $t("pool.join2") }}</span>
      <span class="text-3a d-flex align-items-center cursor-pointer">
        <span>{{ liquidityInfo && liquidityInfo.total | numberFormatLetter }}</span>
        <!--          <span :class="{'rotate_x': showDropList}" class="drop_down ml-1">-->
        <!--            <img src="@/assets/image/drop_down_black.png" alt="">-->
        <!--          </span>-->
      </span>
    </div>
    <div class="d-flex mt-2 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join3") }}</span>
      <span class="text-3a text-right d-flex direction-column">
        <span>{{ addedLiquidityInfo && addedLiquidityInfo.balance | numberFormatLetter }}({{ poolRate | rateFormat }})</span>
      </span>
    </div>
    <div v-if="!needAuth" class="m-88">
      <div v-if="crossFee && (currentType!=='NERVE' || currentType==='NERVE' && fromNetwork === 'NULS')" class="mb-3 d-flex size-28 align-items-center space-between">
        <span class="text-90 w-85">{{ $t("pool.join11") }}</span>
        <span class="text-3a text-right d-flex direction-column">
          <span v-if="fromNetwork === 'NERVE' && currentType === 'NULS'">
            {{ `${commonFee}NVT+${commonFee}NULS` }}
          </span>
          <span v-else>{{ crossFee }}{{ mainAssetSymbol }}</span>
        </span>
      </div>
      <div v-if="computedFeeLoading" class="btn size-30 cursor-pointer opacity_btn">
        <span>
          {{ $t("swap.swap35") }}<span class="point_cont"/>
        </span>
      </div>
      <div v-else :class="{opacity_btn: canNext}" class="btn size-30 cursor-pointer" @click="submit">
        {{ $t("pool.join4") }}
      </div>
    </div>
    <div v-else class="btn m-88 size-30 d-flex align-items-center justify-content-center cursor-pointer" @click="approveERC20">
      <span class="mr-2">{{ $t("transfer.transfer8") }}</span>
      <Loading v-if="approvingLoading" :is-active="false"/>
    </div>
    <div class="tips size-26 text-center">{{ `${$t("pool.join5")}${liquidityInfo && liquidityInfo.symbol || 'USDTN'}${$t("pool.join12")}` }}</div>
    <keep-alive>
      <Modal
        :show-modal.sync="showModal"
        :asset-list="lpAssetsList"
        @selectAsset="selectAsset"/>
    </keep-alive>
  </div>
</template>

<script>
import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { divisionDecimals, Minus, Division, tofix, Times, debounce, Plus, timesDecimals, TRON } from '@/api/util';
import Modal from './Modal/Modal';
import { ETransfer, validateAddress, validateNerveAddress } from '@/api/api';
import Loading from '@/components/Loading/Loading';
import { crossFee as commonFee } from '@/api/api';
import { getContractCallData } from '@/api/nulsContractValidate';
import NerveChannel from '@/views/Swap/util/Nerve';
import TronLink from '@/api/tronLink';

const ethers = require('ethers');
const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Deposit',
  components: { Modal, Loading },
  filters: {
    rateFormat(val) {
      if (val < 0.01) {
        return '<0.01%';
      } else {
        return `${val}%`;
      }
    }
  },
  data() {
    this.countInputDebounce = debounce(this.countInput, 500);
    return {
      joinCount: '',
      chain: 'NERVE', // 当前所在的链
      showDropList: false,
      liquidityInfo: null, // 流动性信息
      currentAsset: null, // 当前选择的资产
      currentAssetInfo: null, // 当前资产的详细信息
      currentAvailable: 0, // 当前选择的资产的余额-6位小数
      userAvailable: 0, // 当前选择的资产的余额
      addedLiquidityInfo: null, // 已添加流动性的资产信息
      confirmLoading: false,
      showModal: false,
      poolRate: 0,
      amountMsg: '', // 当前可用余额不足提示
      availableLoading: false,
      assetTimer: null,
      infoTimer: null,
      isFirstRequest: false,
      lpAssetsList: [],
      showAccountList: false,
      currentType: '',
      crossFee: 0,
      requestLoading: true,
      accountType: [],
      currentToChain: null, // 目标链
      needAuth: false,
      approvingLoading: false,
      poolList: [],
      computedFeeLoading: false,
      commonFee,
      lpNulsAddress: '',
      lpNerveAddress: '',
      NULSContractGas: '',
      NULSContractTxData: '',
      contactFee: 0,
      toAddress: '', // 接收地址
      addressError: '' // 地址错误提示
    };
  },
  computed: {
    // 当前资金池里面的总额
    lpCoinList() {
      const tempList = this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
      tempList.forEach(item => {
        item.balance = divisionDecimals(item.amount, item.decimals);
      });
      return this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
    },
    // 计算全网资金池
    poolTotalCount() {
      if (this.lpCoinList.length === 0) return '';
      let total = 0;
      this.lpCoinList.forEach(coin => {
        total += Number(coin.balance) || 0;
      });
      return total;
    },
    canNext() {
      return this.requestLoading || !this.joinCount || !Number(this.joinCount) || this.amountMsg || this.computedFeeLoading || ((this.fromNetwork !== 'TRON' && this.currentType && this.currentType === 'TRON') && (!this.toAddress || this.addressError));
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.fromNetwork]['symbol'];
    },
    networkPlaceholder() {
      return `${this.$t('tips.tips57')}${this.currentType || 'TRON'}${this.$t('tips.tips58')}`;
    }
  },
  watch: {
    joinCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = this.currentAssetInfo.decimals || 8;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.joinCount = newVal;
          } else {
            this.joinCount = oldVal;
          }
        } else {
          this.joinCount = '';
        }
      }
    },
    currentType: {
      handler(val) {
        if (val && this.joinCount) {
          this.countInputDebounce();
        }
      }
    },
    currentAsset: {
      handler(val) {
        if (val && this.joinCount) {
          this.countInputDebounce();
        }
      }
    },
    '$store.state.network': {
      handler(val) {
        const liquidityInfo = JSON.parse(sessionStorage.getItem('liquidityItem'));
        const supportNetwork = liquidityInfo.supportNetwork;
        supportNetwork.push('NERVE');
        if (supportNetwork.indexOf(val) === -1) {
          this.$router.replace({ path: '/liquidityPool' });
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      if (this.showAccountList) this.showAccountList = false;
    }, false);
  },
  async created() {
    const liquidityInfo = JSON.parse(sessionStorage.getItem('liquidityItem'));
    this.accountType = liquidityInfo.tokenLp.heterogeneousList || [];
    this.accountType.push({ chainName: 'NERVE' });
    this.currentToChain = this.accountType.find(item => item.chainName === 'NERVE') || this.accountType[0];
    const tempData = JSON.parse(sessionStorage.getItem('liquidityItem'));
    await this.getLiquidityInfo(tempData, false);
    await this.getLpAddress();
    this.infoTimer = setInterval(async() => {
      await this.getLiquidityPoolList();
    }, 15000);
  },
  beforeDestroy() {
    if (this.assetTimer) clearInterval(this.assetTimer);
    if (this.infoTimer) clearInterval(this.infoTimer);
    this.assetTimer = null;
    this.infoTimer = null;
  },
  methods: {
    // 获取中间账户地址
    async getLpAddress() {
      const configRes = await this.$request({
        method: 'get',
        url: '/api/common/config'
      });
      if (configRes.code === 1000) {
        this.lpNerveAddress = configRes.data.lpNerveAddress;
        this.lpNulsAddress = configRes.data.lpNulsAddress;
      }
    },
    addressInput() {
      if (this.currentType && this.toAddress) {
        if (this.currentType === 'NULS' && !validateNerveAddress(this.toAddress, 'NULS')) {
          this.addressError = this.$t('tips.tips59');
        } else if (this.currentType === 'NERVE' && !validateNerveAddress(this.toAddress, 'NERVE')) {
          this.addressError = this.$t('tips.tips59');
        } else if (this.currentType === 'TRON') {
          const tron = new TronLink();
          if (!tron.validAddress(this.toAddress)) {
            this.addressError = this.$t('tips.tips59');
          } else {
            this.addressError = '';
          }
        } else if (this.currentType !== 'NULS' && this.currentType !== 'NERVE' && this.currentType !== TRON && !validateAddress(this.toAddress)) {
          this.addressError = this.$t('tips.tips59');
        } else {
          this.addressError = '';
        }
      } else {
        this.addressError = '';
      }
    },
    addressFocus(event) {
      event.currentTarget.select();
    },
    changeAccountType(item) {
      this.currentType = item.chainName;
      this.showAccountList = false;
      this.currentToChain = item;
      if (item.chainName === TRON && this.currentAccount['address'][item.chainName]) {
        this.toAddress = this.currentAccount['address'][item.chainName];
      } else {
        this.toAddress = '';
      }
    },
    async getLiquidityPoolList() {
      try {
        const res = await this.$request({
          method: 'get',
          url: '/swap/stable/info'
        });
        if (res.code === 1000 && res.data.length !== 0) {
          const tempLiquidityData = JSON.parse(sessionStorage.getItem('liquidityItem'));
          const tempRes = res.data.filter(item => item.pairAddress === tempLiquidityData.pairAddress);
          const tempData = this.fromNetwork === 'NERVE' ? tempRes : tempRes.filter(item => item.swapAssets.map(asset => asset.chain).indexOf(this.fromNetwork) > -1);
          this.poolList = tempData.map(item => ({
            ...item,
            supportNetwork: item.swapAssets.map(asset => asset.chain),
            totalLp: this.numberFormat(tofix(divisionDecimals(item.tokenLp.amount, item.tokenLp.decimals), 2, -1), 2),
            depositAssetSymbol: item.swapAssets.find(asset => asset.chain === this.fromNetwork) && item.swapAssets.find(asset => asset.chain === this.fromNetwork).symbol || item.swapAssets[0].symbol
          }));
          this.poolLoading = false;
          const tempPoolList = await Promise.all(this.poolList.map(async item => ({
            ...item,
            myShare: await this.getUserShare(item.tokenLp)
          })));
          this.poolList = tempPoolList.map(item => ({
            ...item,
            poolRate: tofix(Times(Division(item.myShare, item.totalLp), 100), 2, -1) || 0
          }));
          const tempPoolItem = this.poolList.find(item => item.pairAddress === tempLiquidityData.pairAddress);
          sessionStorage.setItem('liquidityItem', JSON.stringify(tempPoolItem));
          await this.getLiquidityInfo(tempPoolItem, true);
        } else {
          this.poolList = [];
        }
        this.poolLoading = false;
      } catch (e) {
        this.poolLoading = false;
        console.log(e, 'error');
      }
    },
    async getUserShare(asset) {
      if (this.chainType === 1) {
        return this.fromNetwork === 'NERVE' ? await this.getNerveAssetBalance(asset) : await this.getNulsAssetBalance(asset);
      } else if (this.chainType === 2) {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        if (asset.heterogeneousList) {
          const currentAsset = asset.heterogeneousList && asset.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          if (currentAsset.contractAddress) {
            const tempAvailable = await transfer.getERC20Balance(currentAsset.contractAddress, asset.decimals, this.fromAddress);
            return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
          } else {
            const tempAvailable = await transfer.getEthBalance(this.fromAddress);
            return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
          }
        } else {
          return 0;
        }
      } else if (this.chainType === 3) {
        if (asset.heterogeneousList) {
          const currentAsset = asset.heterogeneousList && asset.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          const tempAvailable = currentAsset && await this.getTronAssetBalance(currentAsset) || 0;
          return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
        } else {
          return 0;
        }
      }
    },
    showDropModal() {
      if (this.fromNetwork !== 'NERVE') return;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.showModal = true;
    },
    // 查询异构链token资产授权情况
    async checkAssetAuthStatus() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
      const contractAddress = this.currentAsset.contractAddress;
      let needAuth;
      if (this.chainType === 2) {
        const transfer = new ETransfer();
        needAuth = await transfer.getERC20Allowance(
          contractAddress,
          authContractAddress,
          this.fromAddress
        );
      } else if (this.chainType === 3) {
        const tron = new TronLink();
        needAuth = await tron.getTrc20Allowance(
          this.currentAccount['address'][this.fromNetwork],
          authContractAddress,
          contractAddress
        );
      }
      this.needAuth = needAuth;
      if (!needAuth && this.getAllowanceTimer) {
        this.clearGetAllowanceTimer();
      }
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      if (this.approvingLoading) return false;
      this.confirmLoading = true;
      const config = JSON.parse(sessionStorage.getItem('config'));
      try {
        const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
        const contractAddress = this.currentAsset.contractAddress;
        let transfer, res;
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
            message: res.msg,
            type: 'warning',
            duration: 2000,
            offset: 30
          });
        }
        this.approvingLoading = true;
        this.confirmLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.$message.warning({ message: e.message || e, offset: 30 });
        this.confirmLoading = false;
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
    maxCount() {
      if (!this.userAvailable || !Number(this.userAvailable)) return false;
      this.joinCount = this.userAvailable;
      this.countInputDebounce();
    },
    async countInput() {
      try {
        if (!this.joinCount) {
          this.amountMsg = '';
          this.requestLoading = true;
          return false;
        }
        if (!this.currentType) {
          this.amountMsg = this.$t('tips.tips54');
          return false;
        }
        this.computedFeeLoading = true;
        const params = {
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
          toAddress: this.toAddress || this.currentAccount['address'][this.currentType] || this.currentAccount['address'][this.chainNameToId[this.currentType]],
          chainId: this.fromNetwork === 'NERVE' && this.currentAsset.nerveChainId || this.currentAsset.chainId,
          assetId: this.fromNetwork === 'NERVE' && this.currentAsset.nerveAssetId || this.currentAsset.assetId,
          contractAddress: this.currentAsset.contractAddress || '',
          // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
          pairAddress: this.liquidityInfo.address,
          lpType: 1,
          swapChainId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.liquidityInfo.chainId : this.currentToChain.heterogeneousChainId,
          swapAssetId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.liquidityInfo.assetId : '0',
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentToChain.contractAddress
        };
        if (Minus(this.joinCount, this.userAvailable) > 0) {
          this.amountMsg = this.$t('tips.tips17');
          this.computedFeeLoading = false;
          return false;
        } else if (await this.checkBalance()) {
          return false;
        } else {
          this.amountMsg = '';
        }
        this.requestLoading = true;
        const res = await this.$request({
          url: '/swap/lp/fee',
          data: params
        });
        if (res.code === 1000) {
          this.crossFee = res.data.crossFee;
          this.originCrossChainFee = res.data.crossFee;
          if (this.fromNetwork === 'NULS' && this.currentAsset.contractAddress) {
            this.contactFee = await this.getContractCallData();
            this.crossFee = Plus(Plus(this.contactFee, 0.001), res.data.crossFee);
          } else if (this.fromNetwork === 'NULS') {
            this.crossFee = Plus(this.contactFee, 0.001);
          }
          this.orderId = res.data.orderId;
          this.requestLoading = false;
        } else {
          this.$message({
            type: 'warning',
            message: res.msg || this.$t('tips.tips51'),
            offset: 30
          });
        }
        this.computedFeeLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.computedFeeLoading = false;
        this.$message({
          type: 'warning',
          message: e.message
        });
      }
    },
    // 计算nuls合约资产需要的手续费
    async getContractCallData() {
      const price = 25;
      const res = await getContractCallData(
        this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
        this.lpNerveAddress,
        price,
        this.currentAsset.contractAddress,
        'transferCrossChain',
        this.joinCount,
        this.currentAsset.decimals
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
    // 产看当前转账资产是否足够
    async checkBalance() {
      if (this.fromNetwork === 'NERVE' && this.currentType === 'NULS') {
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
          decimals: NULS_INFO.decimal
        });
        if (Minus(this.commonFee, NVTBalance) > 0) {
          this.amountMsg = `NVT ${this.$t('tips.tips9')}`;
        } else if (Minus(this.commonFee, nulsBalance) > 0) {
          this.amountMsg = `NULS ${this.$t('tips.tips9')}`;
        } else {
          this.amountMsg = '';
        }
      } else if (this.fromNetwork === 'NULS') {
        const nulsBalance = await this.getNulsAssetBalance({
          assetId: NULS_INFO.assetId,
          chainId: NULS_INFO.chainId,
          contractAddress: '',
          decimals: NULS_INFO.decimal
        });
        if (Minus(this.crossFee || 0, nulsBalance) > 0) {
          this.amountMsg = `NULS ${this.$t('tips.tips9')}`;
        } else {
          this.amountMsg = '';
        }
      }
    },
    // 选择需要加入到流动性的资产
    selectAsset(asset) {
      this.currentAsset = asset;
      this.joinCount = '';
      this.amountMsg = '';
      this.getAssetInfo(asset);
      // this.getCoins(asset.symbol);
      this.showModal = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo(tempData, refresh = false) {
      const currentNetwork = sessionStorage.getItem('network');
      this.liquidityInfo = {
        icon: tempData.tokenLp.icon,
        lpCoinList: tempData.swapAssets,
        address: tempData.pairAddress,
        total: divisionDecimals(tempData.tokenLp.amount, tempData.tokenLp.decimals),
        chainId: tempData.tokenLp.chainId,
        assetId: tempData.tokenLp.assetId,
        symbol: tempData.tokenLp.symbol,
        decimals: tempData.tokenLp.decimals,
        heterogeneousList: tempData.tokenLp.heterogeneousList
      };
      // this.liquidityInfo['total'] = res.data.total && divisionDecimals(res.data.total, res.data.decimals) || 0;
      // this.currentAsset = !this.currentAsset && res.data.lpCoinList.length !== 0 && (res.data.lpCoinList.filter(item => item.chain === this.$store.state.fromNetwork) || res.data.lpCoinList[0]) || this.currentAsset;
      if (!this.currentAsset) {
        if (this.liquidityInfo.lpCoinList.length !== 0) {
          this.currentAsset = this.liquidityInfo.lpCoinList.find(item => item.chain === currentNetwork) || this.liquidityInfo.lpCoinList[0];
          if (this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'NULS' && this.currentAsset.contractAddress) {
            this.checkAssetAuthStatus();
          }
        }
      }
      !refresh && await this.getAssetInfo(this.currentAsset, false);
      if (this.assetTimer) {
        clearInterval(this.assetTimer);
        this.assetTimer = null;
      }
      this.assetTimer = setInterval(async() => {
        await this.getAssetInfo(this.currentAsset, true);
      }, 15000);
      await this.getAddedLiquidity();
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config[this.fromNetwork].apiUrl;
      if (this.liquidityInfo.lpCoinList && (this.fromNetwork === 'NERVE' || this.fromNetwork === 'NULS')) {
        const tempParams = this.liquidityInfo.lpCoinList.map(item => ({
          chainId: item.nerveChainId,
          assetId: item.nerveAssetId,
          contractAddress: item.contractAddress
        }));
        const params = [config[this.fromNetwork]['chainId'], this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId], tempParams];
        const res = await this.$post(url, 'getBalanceList', params);
        if (res.result && res.result.length !== 0) {
          this.lpAssetsList = this.liquidityInfo.lpCoinList.map((item, index) => ({
            ...item,
            registerChain: item.chain,
            userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1)
            // chainId: res.result[index].assetChainId,
            // decimals: item.decimals
          }));
        }
      }
    },
    // 获取资产信息
    async getAssetInfo(currentAsset, refresh = false) {
      if (!currentAsset) return '';
      if (!refresh) {
        this.availableLoading = true;
      }
      currentAsset = {
        ...currentAsset
      };
      if (this.chainType === 1) {
        currentAsset = {
          ...currentAsset,
          chainId: currentAsset.nerveChainId,
          assetId: currentAsset.nerveAssetId
        };
        this.userAvailable = this.fromNetwork === 'NERVE' ? await this.getNerveAssetBalance(currentAsset) : await this.getNulsAssetBalance(currentAsset);
      } else if (this.chainType === 2) {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        if (currentAsset.contractAddress) {
          this.userAvailable = await transfer.getERC20Balance(currentAsset.contractAddress, currentAsset.decimals, this.fromAddress);
        } else {
          this.userAvailable = this.numberFormat(await transfer.getEthBalance(this.fromAddress));
        }
      } else if (this.chainType === 3) {
        this.userAvailable = await this.getTronAssetBalance(currentAsset);
      }
      this.currentAvailable = this.numberFormat(tofix(this.userAvailable, 6, -1));
      this.currentAssetInfo = {
        ...currentAsset,
        balance: this.userAvailable
      };
      this.availableLoading = false;
    },
    // 获取已添加流动性资产信息
    async getAddedLiquidity() {
      if (this.chainType === 1) {
        const params = {
          chainId: this.liquidityInfo.chainId,
          assetId: this.liquidityInfo.assetId,
          decimals: this.liquidityInfo.decimals,
          contractAddress: this.liquidityInfo.contractAddress || ''
        };
        const addedLiquidityBalance = this.fromNetwork === 'NERVE' ? await this.getNerveAssetBalance(params) : await this.getNulsAssetBalance(params);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 2, -1), 2, -1)
        };
      } else if (this.chainType === 2) {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        let addedLiquidityBalance = 0;
        if (this.liquidityInfo.heterogeneousList) {
          const currentAsset = this.liquidityInfo.heterogeneousList && this.liquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          if (!currentAsset) {
            addedLiquidityBalance = 0;
          } else if (currentAsset.contractAddress) {
            addedLiquidityBalance = await transfer.getERC20Balance(currentAsset.contractAddress, this.liquidityInfo.decimals, this.fromAddress);
          } else {
            addedLiquidityBalance = await transfer.getEthBalance(this.fromAddress);
          }
        }
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 2, -1), 2, -1)
        };
      } else if (this.chainType === 3) {
        let addedLiquidityBalance = 0;
        if (this.liquidityInfo.heterogeneousList) {
          const currentAsset = this.liquidityInfo.heterogeneousList && this.liquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          if (currentAsset) {
            currentAsset.decimals = this.liquidityInfo.decimals;
          }
          addedLiquidityBalance = currentAsset && await this.getTronAssetBalance(currentAsset) || 0;
        }
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 2, -1), 2, -1)
        };
      }
      this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo['balance'], this.liquidityInfo.total), 100), 2, -1) || 0;
    },

    async submit() {
      if (this.canNext) {
        return false;
      }
      this.confirmLoading = true;
      try {
        const configRes = await this.$request({
          method: 'get',
          url: '/api/common/config'
        });
        let lpNerveAddress;
        if (configRes.code === 1000) {
          lpNerveAddress = configRes.data.lpNerveAddress;
          this.lpNerveAddress = configRes.data.lpNerveAddress;
          this.lpNulsAddress = configRes.data.lpNulsAddress;
        }
        const orderParams = {
          orderId: this.orderId,
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
          toAddress: this.toAddress || this.currentAccount['address'][this.currentType] || this.currentAccount['address'][this.chainNameToId[this.currentType]],
          chainId: this.fromNetwork === 'NERVE' && this.currentAsset.nerveChainId || this.currentAsset.chainId,
          assetId: this.fromNetwork === 'NERVE' && this.currentAsset.nerveAssetId || this.currentAsset.assetId,
          contractAddress: this.currentAsset.contractAddress || '',
          amount: this.joinCount,
          pairAddress: this.liquidityInfo.address,
          lpType: 1,
          crossFee: this.fromNetwork === 'NULS' ? Minus(this.crossFee, this.contactFee) : this.crossFee,
          swapChainId: (this.currentType === 'NERVE' || this.fromNetwork === 'NULS') ? this.liquidityInfo.chainId : this.currentToChain.heterogeneousChainId,
          swapAssetId: (this.currentType === 'NERVE' || this.fromNetwork === 'NULS') ? this.liquidityInfo.assetId : '0',
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentToChain.contractAddress,
          succAmount: this.joinCount
        };
        const orderRes = await this.$request({
          url: '/swap/lp/tx/save',
          data: orderParams
        });
        const config = JSON.parse(sessionStorage.getItem('config'));
        const multySignAddress = config[this.fromNetwork]['config']['crossAddress'] || '';
        if (this.chainType === 1) {
          // TODO: NULS组装交易
          const nerveChannel = new NerveChannel({});
          const {
            currentAccount,
            lpNerveAddress,
            lpNulsAddress,
            currentAsset,
            joinCount,
            orderId,
            fromNetwork,
            NULSContractGas,
            NULSContractTxData,
            currentType
          } = this;
          const params = {
            currentChannel: {
              originCrossChainFee: this.originCrossChainFee || 0
            },
            fromAsset: this.currentAsset,
            currentAccount,
            swapNerveAddress: lpNerveAddress,
            swapNulsAddress: lpNulsAddress,
            toNetwork: currentType,
            chainId: currentAsset.nerveChainId,
            assetId: currentAsset.nerveAssetId,
            signAddress: this.currentAccount['address'][1] || this.currentAccount['address'][3],
            amountIn: timesDecimals(joinCount, this.currentAsset.decimals),
            fee: this.crossFee || 0,
            orderId,
            fromNetwork,
            NULSContractGas,
            NULSContractTxData,
            nativeId: this.chainNameToId[this.fromNetwork]
          };
          if (orderRes.code === 1000) {
            const res = await nerveChannel.sendNerveCommonTransaction(params);
            if (res && res.hash) {
              const params = {
                orderId,
                txHash: res.hash,
                type: 'lp'
              };
              const hashList = localStorage.getItem('hashList') && JSON.parse(localStorage.getItem('hashList')) || [];
              hashList.push(params);
              localStorage.setItem('hashList', JSON.stringify(hashList));
              this.$message({
                type: 'success',
                message: this.$t('tips.tips24'),
                offset: 30,
                duration: 1500
              });
              this.confirmLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            } else {
              throw res.msg;
            }
          } else {
            throw this.$t('tips.tips53');
          }
        } else if (this.chainType === 2) {
          const transfer = new ETransfer();
          const params = {
            fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
            decimals: this.currentAsset.decimals,
            contractAddress: this.currentAsset.contractAddress,
            orderId: ethers.utils.toUtf8Bytes(this.orderId),
            numbers: this.joinCount,
            multySignAddress,
            crossChainFee: this.crossFee.toString(),
            nerveAddress: lpNerveAddress
          };
          console.log(params, 'params');
          if (orderRes.code === 1000) {
            const res = await transfer.crossInII(params);
            if (res.hash) {
              const params = {
                orderId: this.orderId,
                txHash: res.hash,
                type: 'lp'
              };
              const hashList = localStorage.getItem('hashList') && JSON.parse(localStorage.getItem('hashList')) || [];
              hashList.push(params);
              localStorage.setItem('hashList', JSON.stringify(hashList));
              this.$message({
                message: this.$t('tips.tips10'),
                type: 'success',
                duration: 2000,
                offset: 30
              });
              this.confirmLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            }
          } else {
            throw this.$t('tips.tips53');
          }
        } else if (this.chainType === 3) {
          const nerveChannel = new NerveChannel({});
          const params = {
            fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
            decimals: this.currentAsset.decimals,
            contractAddress: this.currentAsset.contractAddress,
            orderId: ethers.utils.toUtf8Bytes(this.orderId),
            numbers: this.joinCount,
            multySignAddress,
            crossChainFee: this.crossFee.toString(),
            nerveAddress: lpNerveAddress,
            fromNetwork: this.fromNetwork
          };
          if (orderRes.code === 1000) {
            const res = await nerveChannel.sendNerveBridgeTransaction(params);
            if (res.hash) {
              const params = {
                orderId: this.orderId,
                txHash: res.hash,
                type: 'lp'
              };
              const hashList = localStorage.getItem('hashList') && JSON.parse(localStorage.getItem('hashList')) || [];
              hashList.push(params);
              localStorage.setItem('hashList', JSON.stringify(hashList));
              this.$message({
                message: this.$t('tips.tips10'),
                type: 'success',
                duration: 2000,
                offset: 30
              });
              this.confirmLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            }
          } else {
            throw this.$t('tips.tips53');
          }
        }
      } catch (e) {
        this.confirmLoading = false;
        console.log(e);
        this.$message({
          message: this.$t(e.message || e),
          type: 'warning',
          duration: 2000,
          offset: 30
        });
      }
    },
    // 记录一次交易hash
    async recordHash(orderId, hash) {
      try {
        const params = {
          orderId,
          txHash: hash
        };
        await this.$request({
          url: '/swap/lp/tx/hash/update',
          data: params
        });
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 广播nerve nuls跨链转账交易
    async broadcastHex(txHex) {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config['NERVE'].apiUrl;
      const chainId = config['NERVE'].chainId;
      const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
      if (res.result && res.result.hash) {
        // this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.result.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
        this.$message({
          message: this.$t('tips.tips10'),
          type: 'success',
          duration: 2000,
          offset: 30
        });
        this.reset();
        this.confirmLoading = false;
        await this.recordHash(this.orderId, res.result.hash);
      } else {
        this.$message({
          message: res.error && res.error.message || this.$t('tips.tips15'),
          type: 'warning',
          duration: 2000,
          offset: 30
        });
        this.confirmLoading = false;
        return null;
      }
    },
    reset() {
      this.joinCount = '';
    }
  }
};
</script>

<style scoped lang="scss">
.input-cont {
  padding: 0 30px;
  height: 136px;
  border-radius: 20px;
  border: 1px solid #6EB6A9;
  .image-cont {
    height: 51px;
    width: 51px;
    background-color: #FFFFFF;
    overflow: hidden;
    border-radius: 50%;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
.output-cont {
  padding: 30px 30px 30px 35px;
  border-radius: 20px;
  margin-top: 50px;
  border: 1px solid #AAB2C9;
}
.input-item {
  input {
    border: none;
    height: 60px;
    line-height: 60px;
    //font-weight: bold;
    font-size: 36px;
    outline:none;
  }
}
.btn {
  height: 98px;
  //width: calc(100vw - 80px);
  //margin: 88px auto;
  color: #FFFFFF;
  text-align: center;
  line-height: 98px;
  background: #53b8a9;
  border-radius: 20px;
}
.m-88 {
  margin: 88px auto;
}
.ml-14 {
  margin-left: 14px;
}
.tips {
  margin-top: 80px;
  border-radius: 20px;
  background-color: #F0F7F7;
  line-height: 40px;
  padding: 41px 35px 40px 40px;
}
.drop_down {
  height: 10px;
  width: 16px;
  img {
    vertical-align: 20px;
    height: 100%;
    width: 100%;
  }
}
.sign {
  margin-top: 5px;
  padding: 5px 12px;
  background: #E7F2F0;
  border-radius: 4px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #6EB6A9;
}
.image-cont {
  height: 51px;
  width: 51px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #FFFFFF;
  img {
    height: 100%;
    width: 100%;
  }
}
.icon-cont {
  height: 30px;
  width: 30px;
  //margin-left: 40px;
  img {
    height: 100%;
    width: 100%;
    vertical-align: 20px;
  }
}
.mr-14 {
  margin-right: 14px;
}
.rotate_x {
  transform: rotateX(180deg);
}
.opacity_btn {
  opacity: .7;
}
.w-85 {
  width: 220px;
}
.m-w180 {
  max-width: 500px;
}
.drop_icon {
  margin-left: 14px;
  height: 17px;
  width: 17px;
}
.account-info {
  position: relative;
  .account-list {
    position: absolute;
    padding: 20px 30px;
    width: 650px;
    color: #333333;
    font-weight: bold;
    border-radius: 10px;
    top: 40px;
    left: 0px;
    z-index: 999;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    div {
      margin-top: 20px;
      &:first-child {
        margin-top: 0px
      }
    }
    .chain-icon {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
}
.top-30 {
  top: -30px;
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
.input_address-cont {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
  padding: 0 30px;
  //background-color: #F0F3F3;
  border: 1px solid #6EB6A9;
  border-radius: 20px;
  .input-item {
    input {
      border: none;
      height: 60px;
      //font-weight: bold;
      font-size: 24px;
      outline:none;
      background-color: transparent;
    }
  }
}
.mt-5 {
  margin-top: 50px;
}

</style>
