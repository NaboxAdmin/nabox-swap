<template>
  <div class="join-cont p-4">
    <div v-loading="withDrawLoading" v-if="withDrawLoading" class="position-fixed_loading" @touchmove.prevent/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="addedLiquidityInfo">{{ (addedLiquidityInfo && addedLiquidityInfo.balance || 0) | numFormatFixSix }}</span>
      <span v-else>--</span>
    </div>
    <div class="input-cont mt-2 d-flex align-items-center">
      <span class="image-cont">
        <img :src="liquidityInfo.icon || getPicture(liquidityInfo && liquidityInfo.symbol || 'USDTN')" alt="" @error="pictureError">
      </span>
      <!--{{ liquidityInfo && liquidityInfo.symbol }}-->
      <span class="font-500 ml-14 size-30">{{ liquidityInfo && liquidityInfo.symbol || "USDTN" }}</span>
      <div class="input-item align-items-center ml-4 d-flex flex-1">
        <input
          v-model="withdrawCount"
          class="flex-1"
          placeholder="0"
          @input="countInputDebounce">
        <span class="text-primary size-28" @click="maxCount">{{ $t("swap.swap3") }}</span>
      </div>
    </div>
    <div v-if="amountMsg" class="text-red mt-2 size-24">{{ amountMsg }}</div>
    <div class="output-cont d-flex justify-content-center direction-column cursor-pointer">
      <div class="account-info d-flex align-items-center size-28 text-90">
        <div @click.stop="showAccountList = !showAccountList">
          <span v-if="!currentType" class="text-primary">{{ $t('tips.tips54') }}</span>
          <span v-else class="text-primary">{{ `${currentType}${ $t('tips.tips46') }${superLong(currentType==='TRON' && !addressError && toAddress || currentAccount['address'][currentType] || currentAccount['address'][chainNameToId[currentType]] || '')}${ $t('tips.tips47') }` }}</span>
        </div>
        <img class="drop_icon" src="../../assets/image/drop_grey.png" alt="">
        <div v-if="showAccountList" class="account-list bg-white">
          <div>{{ $t('tips.tips48') }}</div>
          <div/>
          <div v-for="(item, index) in accountType" :key="index">
            <div v-if="currentAccount['address'][item.chain] !== undefined || currentAccount['address'][chainNameToId[item.chain]] !== undefined" class="d-flex align-items-center" @click="selectReceiveNetwork(item)">
              <span class="chain-icon mr-3">
                <img :src="getPicture(item.chain)" alt="" @error="pictureError">
              </span>
              {{ superLong(currentAccount['address'][item.chain] || currentAccount['address'][chainNameToId[item.chain]] || `${item.chain}${$t('tips.tips46')}`) }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center space-between mt-2">
        <div class="d-flex align-items-center cursor-pointer" @click="showDropModal">
          <span class="image-cont">
            <img :src="currentWithdrawAssetInfo.icon || getPicture(currentWithdrawAssetInfo && currentWithdrawAssetInfo.symbol || 'USDT')" alt="" @error="pictureError">
          </span>
          <div class="d-flex align-items-center ml-14 direction-column">
            <span class="font-500 size-30">{{ currentWithdrawAssetInfo && currentWithdrawAssetInfo.symbol || "USDT" }}</span>
            <span v-if="currentWithdrawAssetInfo" class="sign">{{ (currentWithdrawAssetInfo && currentWithdrawAssetInfo.registerChain) || (currentWithdrawAssetInfo && currentWithdrawAssetInfo.chain) }}</span>
          </div>
          <div class="ml-2 drop_down">
            <img v-if="currentType === 'NERVE'" src="@/assets/image/drop_down.png" alt="">
          </div>
        </div>
        <span class="font-500 size-36 m-w180 word-break">{{ withdrawCount || "0" }}</span>
      </div>
    </div>
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
          class="d-flex size-28 align-items-center text-90 space-between justify-content-end mt-2">
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
    <div class="d-flex mt-3 size-28 align-items-center space-between">
      <span class="text-90">{{ $t("pool.join2") }}</span>
      <span class="text-3a d-flex align-items-center">
        <span>{{ liquidityInfo && liquidityInfo.total | numberFormatLetter }}</span>
      </span>
    </div>
    <div class="d-flex mt-2 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join3") }}</span>
      <span class="text-3a d-flex direction-column text-right">
        <span>{{ addedBalance || 0 | numberFormatLetter }}({{ poolRate | rateFormat }})</span>
      </span>
    </div>
    <div v-if="!needAuth" class="m-88">
      <div v-if="crossFee && (currentType!=='NERVE' || currentType==='NERVE' && fromNetwork === 'NULS' || currentType==='NULS' && fromNetwork === 'NERVE')" class="d-flex mb-3 size-28 align-items-center space-between">
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
      <div v-else :class="{opacity_btn: canNext}" class="btn size-30 cursor-pointer" @click="submit">{{ $t("pool.join4") }}</div>
    </div>
    <div v-else class="btn m-88 size-30 d-flex align-items-center justify-content-center cursor-pointer" @click="approveERC20">
      <span class="mr-2">{{ $t("transfer.transfer8") }}</span>
      <Loading v-if="approvingLoading" :is-active="false"/>
    </div>
    <Modal
      :show-modal.sync="showModal"
      :asset-list="lpAssetsList"
      @selectAsset="selectAsset"/>
  </div>
</template>

<script>
import { divisionDecimals, timesDecimals, Times, tofix, Division, Minus, debounce, Plus, TRON } from '@/api/util';
import {
  crossFee as commonFee,
  ETransfer,
  getBatchERC20Balance,
  NTransfer,
  validateAddress,
  validateNerveAddress
} from '@/api/api';
import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import Modal from './Modal/Modal';
import Loading from '@/components/Loading/Loading';
import { getContractCallData } from '@/api/nulsContractValidate';
import NerveChannel from '@/views/Swap/util/Nerve';
import TronLink from '@/api/tronLink';

const ethers = require('ethers');
const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Withdraw',
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
    this.countInputDebounce = debounce(this.withdrawInput, 500);
    return {
      available: 0,
      withdrawCount: '',
      chain: this.fromNetwork, // 当前所在的链
      showDropList: false,
      poolRate: 0,
      liquidityInfo: null,
      showModal: false,
      addedLiquidityInfo: null, // 已添加流动性资产信息
      currentWithdrawAsset: null, // 退出流动性接收的主资产
      currentWithdrawAssetInfo: null,
      amountMsg: '', // 金额错误提示
      withDrawLoading: false,
      availableLoading: false,
      addedBalance: 0,
      // userAvailable: 0, // 用户可用的流动性
      lpAssetsList: [],
      showAccountList: false,
      currentType: '',
      crossFee: 0,
      requestLoading: true,
      accountType: [],
      originLpAssetList: [],
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
    lpCoinList() {
      const tempList = this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
      tempList.forEach(item => {
        item.balance = divisionDecimals(item.amount, item.decimals);
      });
      return this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
    },
    canNext() {
      return !this.withdrawCount || !Number(this.withdrawCount) || this.amountMsg || this.requestLoading || this.computedFeeLoading || ((this.fromNetwork !== 'TRON' && this.currentType && this.currentType === 'TRON') && (!this.toAddress || this.addressError));
      // return true;
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
    withdrawCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = this.addedLiquidityInfo.decimals || 8;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.withdrawCount = newVal;
          } else {
            this.withdrawCount = oldVal;
          }
        } else {
          this.withdrawCount = '';
        }
      }
    },
    currentType: {
      handler(val) {
        if (val) {
          if (val !== 'NERVE') {
            this.currentWithdrawAssetInfo = this.originLpAssetList.find(item => item.chain === val) || this.originLpAssetList[0];
            // this.lpAssetsList = this.originLpAssetList.filter(item => item.chain === val);
            // this.getChainAssetBalance(val, this.originLpAssetList.filter(item => item.chain === val));
          } else {
            this.currentWithdrawAssetInfo = this.originLpAssetList.find(item => item.chain === val) || this.originLpAssetList[0];
            this.lpAssetsList = this.originLpAssetList;
            this.getChainAssetBalance(val, this.originLpAssetList);
          }
          this.countInputDebounce();
        }
      },
      deep: true
    },
    currentWithdrawAssetInfo: {
      handler(val) {
        if (val && this.withdrawCount) {
          this.countInputDebounce();
        }
      },
      deep: true
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
  created() {
    const liquidityInfo = JSON.parse(sessionStorage.getItem('liquidityItem'));
    this.accountType = liquidityInfo.swapAssets;
    !this.accountType.find(item => item.chain === 'NERVE') && this.accountType.push({ chain: 'NERVE' });
    const tempData = JSON.parse(sessionStorage.getItem('liquidityItem'));
    this.getLiquidityInfo(tempData, false);
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
  mounted() {
    window.addEventListener('click', () => {
      if (this.showAccountList) this.showAccountList = false;
    }, false);
  },
  methods: {
    selectReceiveNetwork(item) {
      this.currentType = item.chain;
      this.showAccountList = false;
      if (item.chain === TRON && this.currentAccount['address'][item.chain]) {
        this.toAddress = this.currentAccount['address'][item.chain];
      } else {
        this.toAddress = '';
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
      if (this.currentType !== 'NERVE') return;
      this.showModal = !this.showModal;
    },
    // 查询异构链token资产授权情况
    async checkAssetAuthStatus() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
      // const contractAddress = this.accountType.find(item => item.chain === this.fromNetwork).contractAddress;
      if (!this.addedLiquidityInfo.heterogeneousList || !this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork)) return false;
      const currentAsset = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
      const contractAddress = currentAsset.contractAddress;
      const currentAmount = timesDecimals(this.withdrawCount || 0, currentAsset.decimals || 18);
      let needAuth;
      if (this.chainType === 2) {
        const transfer = new ETransfer();
        needAuth = await transfer.getERC20Allowance(
          contractAddress,
          authContractAddress,
          this.fromAddress,
          currentAmount
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
      this.withDrawLoading = true;
      const config = JSON.parse(sessionStorage.getItem('config'));
      try {
        const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
        const contractAddress = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork).contractAddress;
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
        this.withDrawLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.$message.warning({ message: e.message || e, offset: 30 });
        this.withDrawLoading = false;
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
    // 最大
    maxCount() {
      if (!this.userAvailable || !Number(this.userAvailable)) return false;
      this.withdrawCount = this.userAvailable;
      this.countInputDebounce();
    },
    async withdrawInput() {
      try {
        const currentPollTotal = this.liquidityInfo.lpCoinList.find(item => item.chain === this.currentWithdrawAssetInfo.chain).balance || 0;
        if (!this.withdrawCount) {
          this.amountMsg = '';
          this.requestLoading = true;
          return false;
        }
        if (!this.currentType) {
          this.amountMsg = this.$t('tips.tips54');
          return false;
        }
        this.computedFeeLoading = true;
        const heterAsset = this.addedLiquidityInfo.heterogeneousList && this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
        const params = {
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
          toAddress: this.toAddress || this.currentAccount['address'][this.currentType] || this.currentAccount['address'][this.chainNameToId[this.currentType]],
          chainId: heterAsset && heterAsset.heterogeneousChainId || this.addedLiquidityInfo.chainId,
          assetId: heterAsset && '0' || this.addedLiquidityInfo.assetId,
          contractAddress: heterAsset && heterAsset.contractAddress || '',
          // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
          pairAddress: this.liquidityInfo.address,
          lpType: 2,
          swapChainId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.currentWithdrawAssetInfo.nerveChainId : this.currentWithdrawAssetInfo.chainId,
          swapAssetId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.currentWithdrawAssetInfo.nerveAssetId : this.currentWithdrawAssetInfo.assetId,
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentWithdrawAssetInfo.contractAddress
        };
        if (Minus(this.withdrawCount, currentPollTotal) > 0) {
          this.amountMsg = this.$t('pool.join9');
          this.computedFeeLoading = false;
          return false;
        } else if (Minus(this.withdrawCount, this.userAvailable) > 0) {
          this.amountMsg = this.$t('pool.join10');
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
          if (this.fromNetwork === 'NULS' && this.addedLiquidityInfo.contractAddress) {
            this.contactFee = await this.getContractCallData();
            this.crossFee = Plus(Plus(this.contactFee, 0.001), res.data.crossFee);
          } else if (this.fromNetwork === 'NERVE' && this.currentType === 'NULS') {
            this.crossFee = Plus(0, commonFee);
          }
          this.orderId = res.data.orderId;
          this.requestLoading = false;
          if (this.chainType !== 1) {
            this.checkAssetAuthStatus();
          }
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
        this.swapNerveAddress,
        price,
        this.addedLiquidityInfo.contractAddress,
        'transferCrossChain',
        this.withdrawCount,
        this.addedLiquidityInfo.decimals
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
          decimals: MAIN_INFO.decimal
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
    // 选择需要撤出流动性的资产
    selectAsset(asset) {
      this.currentWithdrawAssetInfo = { ...asset };
      this.showModal = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo(tempData, refresh = false) {
      if (!refresh) {
        this.availableLoading = true;
      }
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
      this.originLpAssetList = this.liquidityInfo.lpCoinList || [];
      if (!this.currentWithdrawAssetInfo) {
        if (this.liquidityInfo.lpCoinList.length !== 0) {
          this.currentWithdrawAssetInfo = this.liquidityInfo.lpCoinList.length !== 0 && (this.liquidityInfo.lpCoinList.find(item => item.chain === currentNetwork) || this.liquidityInfo.lpCoinList[0]);
        }
      }
      await this.getAddedLiquidity();
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config[this.fromNetwork].apiUrl;
      if (this.liquidityInfo.lpCoinList && (this.fromNetwork === 'NERVE')) {
        const tempParams = this.liquidityInfo.lpCoinList.map(item => ({
          chainId: item.nerveChainId,
          assetId: item.nerveAssetId,
          contractAddress: item.contractAddress
        }));
        const params = [config[this.fromNetwork]['chainId'], this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId], tempParams];
        const res = await this.$post(url, 'getBalanceList', params);
        if (res.result && res.result.length !== 0) {
          this.lpAssetsList = this.liquidityInfo.lpCoinList.map((item, index) => ({
            // ...res.result[index],
            ...item,
            registerChain: item.chain,
            userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1),
            nerveAssetId: res.result[index].assetId,
            nerveChainId: res.result[index].assetChainId
          }));
          this.originLpAssetList = this.lpAssetsList;
        }
      } else {
        const tempLpAssetsList = this.liquidityInfo.lpCoinList.map(item => ({
          ...item,
          registerChain: item.chain
        }));
        console.log(tempLpAssetsList, 'tempLpAssetsList');
        this.originLpAssetList = tempLpAssetsList;
        // await this.getChainAssetBalance(this.currentType || this.fromNetwork, tempLpAssetsList);
      }
      // } else {
      //   this.availableLoading = false;
      // }
    },
    // 获取已添加流动性资产信息
    async getAddedLiquidity() {
      if (this.chainType === 1) {
        const params = {
          chain: this.fromNetwork,
          address: this.nerveAddress,
          chainId: this.liquidityInfo.chainId,
          assetId: this.liquidityInfo.assetId,
          decimals: this.liquidityInfo.decimals,
          refresh: true,
          contractAddress: this.liquidityInfo.contractAddress || ''
        };
        const addedLiquidityBalance = this.fromNetwork === 'NERVE' ? await this.getNerveAssetBalance(params) : await this.getNulsAssetBalance(params);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 6, -1), 6, -1) // this.numberFormat(addedLiquidityBalance, 6, -1)
        };
        this.userAvailable = addedLiquidityBalance;
        this.addedBalance = this.numberFormat(tofix(addedLiquidityBalance, 4, -1), 4);
      } else if (this.chainType === 2) {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.userAvailable || 0
        };
        let addedLiquidityBalance = this.userAvailable || 0;
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
        this.userAvailable = addedLiquidityBalance;
        this.addedBalance = this.numberFormat(tofix(addedLiquidityBalance, 4, -1), 4);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 6, -1), 6, -1)
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
        this.userAvailable = addedLiquidityBalance;
        this.addedBalance = this.numberFormat(tofix(addedLiquidityBalance, 4, -1), 4);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(tofix(addedLiquidityBalance, 6, -1), 6, -1)
        };
      }
      this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo['balance'], this.liquidityInfo.total), 100), 2, -1) || 0;
      this.availableLoading = false;
    },
    // 确认
    async submit() {
      if (this.canNext) {
        // this.$toast(this.$t('tips.tips38'));
        return false;
      }
      this.withDrawLoading = true;
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
        const heterAsset = this.addedLiquidityInfo.heterogeneousList && this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
        const orderParams = {
          orderId: this.orderId,
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
          toAddress: this.toAddress || this.currentAccount['address'][this.currentType] || this.currentAccount['address'][this.chainNameToId[this.currentType]],
          chainId: heterAsset && heterAsset.heterogeneousChainId || this.addedLiquidityInfo.chainId,
          assetId: heterAsset && '0' || this.addedLiquidityInfo.assetId,
          contractAddress: heterAsset && heterAsset.contractAddress || this.addedLiquidityInfo.contractAddress,
          amount: this.withdrawCount,
          pairAddress: this.liquidityInfo.address,
          lpType: 2,
          crossFee: this.originCrossChainFee,
          swapChainId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.currentWithdrawAssetInfo.nerveChainId : this.currentWithdrawAssetInfo.chainId,
          swapAssetId: (this.currentType === 'NERVE' || this.currentType === 'NULS') ? this.currentWithdrawAssetInfo.nerveAssetId : this.currentWithdrawAssetInfo.assetId,
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentWithdrawAssetInfo.contractAddress,
          succAmount: this.withdrawCount
        };
        const orderRes = await this.$request({
          url: '/swap/lp/tx/save',
          data: orderParams
        });
        const config = JSON.parse(sessionStorage.getItem('config'));
        const multySignAddress = config[this.fromNetwork]['config']['crossAddress'] || '';
        // TODO
        if (this.chainType === 1) {
          const nerveChannel = new NerveChannel({});
          const {
            currentAccount,
            lpNerveAddress,
            lpNulsAddress,
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
            fromAsset: this.addedLiquidityInfo,
            currentAccount,
            swapNerveAddress: lpNerveAddress,
            swapNulsAddress: lpNulsAddress,
            toNetwork: currentType,
            chainId: this.addedLiquidityInfo.chainId,
            assetId: this.addedLiquidityInfo.assetId,
            signAddress: this.currentAccount['address']['Ethereum'] || this.currentAccount['address'][1] || this.currentAccount['address'][97],
            amountIn: timesDecimals(this.withdrawCount, this.addedLiquidityInfo.decimals),
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
                orderId: this.orderId,
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
              this.withDrawLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            } else {
              throw res.msg;
            }
          } else {
            throw orderRes.msg;
          }
        } else if (this.chainType === 2) {
          const transfer = new ETransfer();
          const heterAsset = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          const params = {
            fromAddress: this.fromAddress,
            decimals: this.addedLiquidityInfo.decimals,
            contractAddress: heterAsset && heterAsset.contractAddress || this.addedLiquidityInfo.contractAddress,
            orderId: ethers.utils.toUtf8Bytes(this.orderId),
            numbers: this.withdrawCount,
            multySignAddress,
            crossChainFee: this.crossFee.toString(),
            nerveAddress: lpNerveAddress
          };
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
              this.withDrawLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            }
          } else {
            throw orderRes.msg;
          }
        } else if (this.chainType === 3) {
          const nerveChannel = new NerveChannel({});
          const heterAsset = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          const params = {
            fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
            decimals: this.addedLiquidityInfo.decimals,
            contractAddress: heterAsset && heterAsset.contractAddress || this.addedLiquidityInfo.contractAddress,
            orderId: ethers.utils.toUtf8Bytes(this.orderId),
            numbers: this.withdrawCount,
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
              this.withDrawLoading = false;
              this.reset();
              await this.recordHash(this.orderId, res.hash);
            }
          } else {
            throw orderRes.msg;
          }
        }
      } catch (e) {
        this.$message({
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          type: 'warning',
          offset: 30
        });
        this.withDrawLoading = false;
        console.log(e);
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
    // 获取当前选择撤出的资产余额
    async getChainAssetBalance(chain, assetList) {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const batchQueryContract = config[chain]['config'].multiCallAddress || '';
      try {
        if ((chain === 'NERVE' || chain === 'NULS') && this.fromNetwork !== 'NERVE') {
          const RPCUrl = config['NERVE'].apiUrl;
          const tempParams = assetList.map(item => ({
            chainId: item.nerveChainId,
            assetId: item.nerveAssetId,
            contractAddress: ''
          }));
          const params = [config['NERVE']['chainId'], this.currentAccount['address']['NERVE'], tempParams];
          const res = await this.$post(RPCUrl, 'getBalanceList', params);
          if (res.result && res.result.length !== 0) {
            this.lpAssetsList = assetList.map((item, index) => ({
              ...item,
              userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1)
            }));
            this.originLpAssetList = this.lpAssetsList;
          }
        } else if (chain !== 'NERVE') {
          const RPCUrl = config[chain].apiUrl;
          assetList = assetList.filter(item => item.chain === this.fromNetwork);
          const addresses = assetList.map(asset => {
            if (asset.contractAddress) {
              return asset.contractAddress;
            }
            return batchQueryContract;
          });
          const fromAddress = this.currentAccount['address'][chain] || this.currentAccount['address'][this.chainNameToId[chain]];
          console.log(addresses, fromAddress, RPCUrl, '1234');
          const balanceData = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
          assetList.forEach((item, index) => {
            balanceData.forEach(data => {
              if (data.contractAddress === item.contractAddress) {
                assetList[index].userBalance = data.balance && tofix(divisionDecimals(data.balance, item.decimals), 6, -1) || 0;
                assetList[index].showBalanceLoading = false;
              }
              return batchQueryContract;
            });
          });
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    reset() {
      this.withdrawCount = '';
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
  padding: 0 30px 0 35px;
  border-radius: 20px;
  height: 166px;
  margin-top: 50px;
  border: 1px solid #AAB2C9;
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
.input-item {
  input {
    border: none;
    height: 60px;
    line-height: 60px;
    //font-weight: bold;
    font-size: 36px;
    outline:none;
    background-color: transparent;
  }
}
.btn {
  height: 98px;
  //width: calc(100vw - 80px);
  // margin: 88px auto;
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
.drop_icon {
  margin-left: 14px;
  height: 17px;
  width: 17px;
}
.account-info {
  position: relative;
  .account-list {
    position: absolute;
    width: 650px;
    padding: 20px 30px;
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
