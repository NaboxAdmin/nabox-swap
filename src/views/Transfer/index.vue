<template>
  <!--  :class="{'p-4': !isDapp}" -->
  <div class="bg-white p-transfer">
    <div v-loading="transferLoading" v-if="transferLoading" class="position-fixed_loading" @click.stop @touchmove.prevent/>
    <!--:class="{'mt-2': !isDapp}"-->
    <div class="transfer-cont d-flex align-items-center space-between">
      <div class="sign-cont d-flex align-items-center space-between size-28 text-90 direction-column">
        <div class="">{{ $t("transfer.transfer1") }}</div>
        <span/>
        <span/>
        <span/>
        <div class="mt-1">{{ $t("transfer.transfer2") }}</div>
      </div>
      <div class="coin-cont d-flex direction-column space-between">
        <template>
          <div v-if="toNerve" class="asset-cont">
            <div class="asset-icon flex-1 d-flex align-items-center">
              <span class="icon-item">
                <img :src="getPicture(fromNetwork)" alt="">
              </span>
              <span class="size-30 ml-12">{{ fromNetwork === 'OKExChain' && 'OEC' || fromNetwork }}</span>
            </div>
            <div class="size-30 text-90">{{ superLong(fromAddress) }}</div>
            <div class="drop_down">
              <!--              <img src="@/assets/image/drop_down.png" alt="">-->
            </div>
          </div>
          <div v-else class="asset-cont">
            <div class="asset-icon flex-1 d-flex align-items-center">
              <span class="icon-item">
                <img :src="getPicture('NERVE')" alt="">
              </span>
              <span class="size-30 ml-12">NERVE</span>
            </div>
            <div class="size-28 ml-1 text-90">{{ superLong(nerveAddress) }}</div>
            <div class="drop_down">
              <!--              <img src="@/assets/image/drop_down.png" alt="">-->
            </div>
          </div>
        </template>
        <div class="position-cont"/>
        <template>
          <div v-if="!toNerve" class="asset-cont">
            <div class="asset-icon flex-1 d-flex align-items-center">
              <span class="icon-item">
                <img :src="getPicture(fromNetwork)" alt="">
              </span>
              <span class="size-30 ml-12">{{ fromNetwork === 'OKExChain' && 'OEC' || fromNetwork }}</span>
            </div>
            <div class="size-30 text-90">{{ superLong(fromAddress) }}</div>
            <div class="drop_down">
              <!--              <img src="@/assets/image/drop_down.png" alt="">-->
            </div>
          </div>
          <div v-else class="asset-cont">
            <div class="asset-icon flex-1 d-flex align-items-center">
              <span class="icon-item">
                <img :src="getPicture('NERVE')" alt="">
              </span>
              <span class="size-30 ml-12">NERVE</span>
            </div>
            <div class="size-30 ml-1 text-90">{{ superLong(nerveAddress) }}</div>
            <div class="drop_down">
              <!--              <img src="@/assets/image/drop_down.png" alt="">-->
            </div>
          </div>
        </template>
      </div>
      <div class="transfer-icon cursor-pointer" @click="switchToNerve">
        <svg t="1627381344617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2109" width="23" height="23"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#6EB6A9" p-id="2110"/><path d="M610.393043 743.958261a31.165217 31.165217 0 0 1-14.692173-3.561739A31.610435 31.610435 0 0 1 578.782609 712.347826V311.652174a31.833043 31.833043 0 0 1 63.443478 0v341.036522l49.864348-33.613913a31.610435 31.610435 0 1 1 35.394782 52.535652l-99.283478 66.782608a32.055652 32.055652 0 0 1-17.808696 5.565218zM413.606957 743.958261A31.610435 31.610435 0 0 1 381.773913 712.347826V371.311304l-49.864348 33.613913a31.610435 31.610435 0 1 1-35.394782-52.535652l99.283478-66.782608a32.055652 32.055652 0 0 1 32.500869-1.78087A31.610435 31.610435 0 0 1 445.217391 311.652174v400.695652a31.610435 31.610435 0 0 1-31.610434 31.610435z" fill="#FFFFFF" p-id="2111"/></svg>
      </div>
    </div>
    <div class="asset-cont mt-5 cursor-pointer">
      <span class="size-28 text-90">{{ $t("transfer.transfer3") }}</span>
      <div class="asset-info mt-1" @click="showModal=true">
        <div class="asset-icon">
          <img :src="currentCoin && currentCoin.icon || getPicture(currentCoin && currentCoin.symbol) || pictureError" alt="" @error="pictureError">
        </div>
        <span class="size-30 ml-12">{{ currentCoin && currentCoin.symbol }}</span>
        <div class="size-30 ml-1 text-90 flex-1">{{ currentCoin && superLong(currentCoin.contractAddress) || '' }}</div>
        <div class="drop_down">
          <img src="@/assets/image/drop_down.png" alt="">
        </div>
      </div>
    </div>
    <div class="asset-cont mt-5">
      <div class="size-28 text-90 d-flex space-between">
        <span>{{ $t("transfer.transfer4") }}</span>
        <template>
          <div>
            {{ $t("transfer.transfer5") }}：
            <span v-if="availableLoading"><i class="el-icon-loading"/></span>
            <span v-else-if="userAvailable">{{ (userAvailable || 0) | numberFormat }}</span>
            <span v-else>--</span>
          </div>
        </template>
      </div>
      <div class="asset-info d-flex space-between align-items-center mt-1 active-border">
        <input
          v-model="transferCount"
          class="font-500 size-38 ml-12"
          placeholder="0"
          @input="accountInput">
        <span class="size-28 text-primary" @click="maxAmount">{{ $t("transfer.transfer6") }}</span>
      </div>
      <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
    </div>
    <div class="h-16 d-flex align-items-center size-28 space-between mt-4">
      <span v-if="!toNerve" class="text-90">{{ $t("transfer.transfer7") }}</span>
      <div v-if="!toNerve">
        <span v-if="showFeeLoading" class="text-3a"><i class="el-icon-loading"/></span>
        <span v-else-if="transferFee" class="text-3a">{{ transferFee }}</span>
        <span v-else class="text-3a">--</span>
        <span class="text-primary ml-2 cursor-pointer" @click="showFeeModal=true">{{ $t('transfer.transfer10') }}</span>
      </div>
    </div>
    <div v-if="crossInAuth" :class="{opacity_btn: !canNext}" class="btn size-30 cursor-pointer d-flex align-items-center justify-content-center" @click="approveERC20">
      <span :class="{'mr-1': showApproveLoading}">{{ $t("transfer.transfer8") }}</span>
      <Loading v-if="showApproveLoading" :is-active="false"/>
    </div>
    <div v-else :class="{opacity_btn: !canNext}" class="btn size-30 cursor-pointer" @click="next">{{ $t("transfer.transfer9") }}</div>
    <transfer-modal
      v-if="showModal"
      :show-modal.sync="showModal"
      :asset-list="transferAssets"
      @selectAsset="selectAsset"/>
    <transfer-modal
      v-if="showFeeModal"
      :show-modal.sync="showFeeModal"
      :asset-list="transferFeeAssets"
      type="feeAssets"
      @selectAsset="selectFeeAsset"/>
  </div>
</template>
<script>
import {
  debounce,
  divisionDecimals,
  formatFloatNumber,
  getCurrentAccount,
  Minus,
  Plus,
  supportChainList,
  Times,
  timesDecimals,
  tofix
} from '@/api/util';
import { MAIN_INFO, NULS_INFO } from '@/config';
import { crossFee, ETransfer, getBatchERC20Balance, getSymbolUSD, NTransfer } from '@/api/api';
import { getContractCallData } from '@/api/nulsContractValidate';
import Modal from './Modal/Modal';
import { Loading } from '@/components';

export default {
  name: 'Transfer',
  components: {
    TransferModal: Modal,
    Loading
  },
  data() {
    this.getFeeDebounce = debounce(this.getTransferFee(), 500);
    this.getAllowanceTimer = null; // 查询授权额度定时器
    return {
      currentCoin: null, // 当前网络上面选择的USDT
      toNerve: true, // 是否是转入NERVE
      transferFee: 0, // 交易手续费
      transferCount: '', // 当前需要transfer的数量
      storeAccountInfo: [], // 链上主资产信息
      needExtraFee: false, // nvt不足，需要额外转入一笔手续费
      withdrawalFee: '', // 转出需要的NVT
      NULSContract: false, // 是否是nuls的合约资产跨链
      available: 0, // 当前资产可用
      crossInAuth: false, // 异构链转入nerve是否需要授权
      transferInfo: null, // 交易信息
      stepList: [],
      showFeeLoading: false,
      transferLoading: false,
      amountMsg: '',
      availableLoading: false,
      transactionInfo: null,
      assetTimer: null,
      showModal: false,
      transferAssets: [],
      isMainAsset: false, // 是否为主资产
      maxClick: false, // 点击最大
      showFeeModal: false,
      transferFeeAssets: [],
      currentFeeChain: 'NERVE',
      currentFeeAsset: {},
      userAvailable: 0,
      showApproveLoading: false
    };
  },
  computed: {
    canNext() {
      if (this.toNerve) {
        return !this.showFeeLoading && this.transferCount && !this.amountMsg && Number(this.transferCount);
      }
      return !this.showFeeLoading && this.transferCount && !this.amountMsg && Number(this.transferCount) && this.transferFee;
    }
  },
  watch: {
    transferCount: {
      handler(newVal, oldVal) {
        const decimals = this.currentCoin && this.currentCoin.decimals || 8;
        const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
        if (patrn.exec(newVal) || newVal === '') {
          this.transferCount = newVal;
        } else {
          this.transferCount = oldVal;
        }
      }
    },
    transferFee: {
      handler(newVal) {
        if (newVal) {
          const { value } = this.splitFeeSymbol(newVal);
          if (this.transferCount && this.maxClick && this.isMainAsset) {
            if (Minus(this.available, value) < 0) {
              this.transferCount = this.available;
              this.amount = this.transferCount;
            } else {
              this.transferCount = Minus(this.available, value);
              this.amount = this.transferCount;
            }
            this.checkTransferFee();
          }
        }
      }
    }
  },
  created() {
    !this.toNerve && this.getMainAssetInfo();
    this.getTransferAsset();
  },
  beforeDestroy() {
    if (this.assetTimer) {
      clearInterval(this.assetTimer);
      this.assetTimer = null;
    }
  },
  methods: {
    // 获取当前NERVE地址下面的所有主资产信息
    async getMainAssetInfo() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAsset = config[this.currentFeeChain];
      const accountInfo = await this.$request({ // 获取主资产信息
        url: '/asset/nerve/chain/main',
        data: {
          address: this.nerveAddress
        }
      });
      this.allTransferFeeAssets = accountInfo.data.map(item => ({
        ...item,
        balance: this.numberFormat(tofix(divisionDecimals(item.balance, item.decimals), 6, -1) || 0, 6)
      }));
      const tempParams = this.allTransferFeeAssets.map(item => ({
        chainId: item.chainId,
        assetId: item.assetId,
        contractAddress: item.contractAddress
      }));
      const tempData = await this.getNerveBatchData(tempParams);
      for (let i = 0; i < this.allTransferFeeAssets.length; i++) {
        const asset = this.allTransferFeeAssets[i];
        this.allTransferFeeAssets[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
      }
      this.currentFeeAsset = this.allTransferFeeAssets.find(asset => mainAsset.symbol === asset.symbol);
      this.transferFeeAssets = this.allTransferFeeAssets.filter(item => item.registerChain !== this.currentFeeChain && item.registerChain !== 'NULS'); // 主资产信息
    },
    // 选择支付手续费的主资产
    async selectFeeAsset(asset) {
      this.currentFeeChain = asset.registerChain;
      this.currentFeeAsset = asset;
      this.transferFeeAssets = this.allTransferFeeAssets.filter(item => item.registerChain !== this.currentFeeChain && item.registerChain !== 'NULS');
      this.showFeeModal = false;
      if (this.currentCoin) {
        this.transferFee = await this.getCrossOutFee();
      }
      this.transferCount && await this.checkTransferFee();
    },
    // 选择资产
    async selectAsset(asset) {
      this.showModal = false;
      if (asset.contractAddress && this.currentCoin.contractAddress === asset.contractAddress) {
        return false;
      } else if (!asset.contractAddress && this.currentCoin.chainId === asset.chainId && this.currentCoin.assetId === asset.assetId) {
        return false;
      }
      const config = JSON.parse(sessionStorage.getItem('config'));
      const tempNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
      this.isMainAsset = config[tempNetwork].assetId === asset.assetId && config[tempNetwork].chainId === asset.chainId;
      this.transferCount = '';
      this.transferFee = '';
      this.currentCoin = asset;
      await this.getCurrentAssetInfo(false, asset);
      if (this.currentCoin && this.currentCoin.assetId === 0 && tempNetwork !== 'NULS') {
        await this.checkCrossInAuthStatus();
      } else {
        this.crossInAuth = false;
      }
    },
    // 获取当前支持的coinList
    async getTransferAsset() {
      try {
        const config = JSON.parse(sessionStorage.getItem('config'));
        // this.availableLoading = true;
        const tempNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
        const data = {
          chain: this.toNerve ? this.fromNetwork : 'NERVE',
          toChain: this.toNerve ? 'NERVE' : this.fromNetwork,
          cross: true
          // address: this.toNerve ? this.fromAddress : this.nerveAddress
        };
        if (this.toNerve) {
          delete data['toChain'];
        }
        const res = await this.$request({
          url: '/asset/query/chain',
          data
        });
        if (res.code === 1000 && res.data) {
          const tempList = res.data.map(asset => ({
            ...asset,
            showBalanceLoading: true
          }));
          this.transferAssets = [...tempList];
          if (this.toNerve && this.fromNetwork !== 'NULS') {
            const config = JSON.parse(sessionStorage.getItem('config'));
            const batchQueryContract = config[this.fromNetwork]['config'].multiCallAddress || '';
            const fromAddress = this.currentAccount['address'][this.fromNetwork];
            const RPCUrl = config[this.fromNetwork]['apiUrl'];
            const addresses = this.transferAssets.map(asset => {
              if (asset.contractAddress) {
                return asset.contractAddress;
              }
              return batchQueryContract;
            });
            const balanceData = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
            this.transferAssets.forEach((item, index) => {
              balanceData.forEach(data => {
                if (data.contractAddress === item.contractAddress && item.showBalanceLoading) {
                  this.transferAssets[index].balance = data.balance && tofix(divisionDecimals(data.balance, item.decimals), 6, -1) || 0;
                  this.transferAssets[index].showBalanceLoading = false;
                }
              });
            });
          } else if (this.toNerve && this.fromNetwork === 'NULS') {
            const tempParams = this.transferAssets.map(item => ({
              chainId: item.chainId,
              assetId: item.assetId,
              contractAddress: item.contractAddress || ''
            }));
            const res = await this.getNulsBatchData(tempParams);
            console.log(res, '12321');
            if (res.length > 0) {
              this.transferAssets.forEach((asset, index) => {
                res.result.forEach(() => {
                  this.transferAssets[index].balance = res.result[index].balance && tofix(divisionDecimals(res.result[index].balance, asset.decimals), 6, -1) || 0;
                  this.transferAssets[index].showBalanceLoading = false;
                });
              });
            }
          } else {
            const tempParams = this.transferAssets.map(item => ({
              chainId: item.chainId,
              assetId: item.assetId,
              contractAddress: item.contractAddress || ''
            }));
            const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
            const url = MAIN_INFO.batchRPC;
            const res = await this.$post(url, 'getBalanceList', params);
            if (res.result && res.result.length !== 0) {
              this.transferAssets.forEach((asset, index) => {
                res.result.forEach(() => {
                  this.transferAssets[index].balance = res.result[index].balance && tofix(divisionDecimals(res.result[index].balance, asset.decimals), 6, -1) || 0;
                  this.transferAssets[index].showBalanceLoading = false;
                });
              });
            }
          }
          this.transferAssets = (tempList.length > 0 && tempList.sort((a, b) => a.symbol > b.symbol ? 1 : -1).sort((a, b) => b.balance - a.balance)) || [];
          if (!this.currentCoin) {
            this.currentCoin = !this.currentCoin && (this.transferAssets.find(asset => asset.symbol === 'USDT' && asset.registerChain === this.fromNetwork) || this.transferAssets[0]) || this.currentCoin;
          }
          this.isMainAsset = config[tempNetwork].assetId === this.currentCoin.assetId && config[tempNetwork].chainId === this.currentCoin.chainId;
          await this.getCurrentAssetInfo(false, this.currentCoin);
          // this.available = this.currentCoin.userBalance;
          if (this.currentCoin && this.currentCoin.assetId === 0 && tempNetwork !== 'NULS') {
            await this.checkCrossInAuthStatus();
          } else {
            this.crossInAuth = false;
          }
          this.availableLoading = false;
          // await this.getTransferFee();
        } else {
          this.transferAssets = [];
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击最大
    maxAmount() {
      if (!this.available) return;
      this.maxClick = true;
      if (this.toNerve && this.$store.state.network === 'NULS') {
        this.transferCount = Minus(this.available, 0.01);
      } else {
        this.transferCount = this.available;
      }
      if (!this.transferFee && !this.toNerve) {
        this.getTransferFee();
      } else {
        if (this.isMainAsset) {
          const { value } = this.splitFeeSymbol(this.transferFee);
          this.transferCount = Minus(this.available, value) < 0 ? this.available : Minus(this.available, value);
          this.amount = this.transferCount;
        }
        this.checkTransferFee();
      }
    },
    // 获取当前资产详情
    async getCurrentAssetInfo(refresh = false, assetInfo) {
      try {
        if (!refresh) {
          this.availableLoading = true;
        }
        const tempNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
        if (tempNetwork === 'NERVE') {
          this.available = await this.getNerveAssetBalance(assetInfo);
          this.userAvailable = tofix(this.available, 6, -1) || 0;
          this.availableLoading = false;
          !this.toNerve && !refresh && await this.getTransferFee();
        } else {
          this.available = await this.getHeterogeneousAssetBalance(assetInfo);
          this.userAvailable = tofix(this.available, 6, -1);
          this.availableLoading = false;
          !this.toNerve && !refresh && await this.getTransferFee();
        }
      } catch (e) {
        this.availableLoading = false;
        console.log(e);
      }
    },
    // 获取NERVE上面的资产信息
    async getNerveAssetBalance(assetInfo) {
      const { chainId, assetId, contractAddress } = assetInfo;
      const tempParams = [{
        chainId,
        assetId,
        contractAddress
      }];
      const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
      const url = MAIN_INFO.batchRPC;
      const res = await this.$post(url, 'getBalanceList', params);
      if (res.result && res.result.length !== 0) {
        const tempAsset = res.result[0];
        return divisionDecimals(tempAsset.balance, this.currentCoin.decimals);
      } else {
        return 0;
      }
    },
    async getHeterogeneousAssetBalance(assetInfo) {
      const transfer = new ETransfer({
        chain: this.fromNetwork
      });
      const { contractAddress, decimals } = assetInfo;
      if (assetInfo.contractAddress) {
        return await transfer.getERC20Balance(contractAddress, decimals, this.fromAddress);
      } else {
        return await transfer.getEthBalance(this.fromAddress);
      }
    },
    // nerve to
    switchToNerve() {
      this.toNerve = !this.toNerve;
      this.transferCount = '';
      this.showFeeLoading = false;
      this.transferFee = '';
      this.available = '';
      this.userAvailable = '';
      this.amountMsg = '';
      this.currentCoin = null;
      // this.getCurrentAssetInfo();
      this.getTransferAsset();
      !this.toNerve && this.getMainAssetInfo();
    },
    // 输入转账
    accountInput(e) {
      this.maxClick = false;
      if (this.$store.fromNetwork === 'NULS') {
        this.getFeeDebounce();
      } else {
        if (this.transferCount === '' || (Number(this.transferCount) < 0)) {
          this.transferCount = '';
          // this.transferFee = "";
          this.amountMsg = '';
          return false;
        }
        if (!this.toNerve && this.transferFee) {
          this.checkTransferFee();
        } else if (this.toNerve) {
          this.checkTransferFee();
        }
      }
    },
    // 查询异构链token资产授权情况
    async checkCrossInAuthStatus() {
      const transfer = new ETransfer();
      const heterogeneousInfo = this.currentCoin.heterogeneousList.filter(
        (v) => v.chainName === this.fromNetwork
      )[0];
      const contractAddress = this.currentCoin.contractAddress;
      const needAuth = await transfer.getERC20Allowance(
        contractAddress,
        heterogeneousInfo.heterogeneousChainMultySignAddress,
        this.fromAddress
      );
      this.crossInAuth = needAuth;
      if (!needAuth && this.getAllowanceTimer) {
        this.showApproveLoading = false;
        this.clearGetAllowanceTimer();
      }
    },
    // 获取跨链费用
    async getTransferFee() {
      try {
        if (!this.currentCoin) return;
        this.showFeeLoading = true;
        this.amountMsg = '';
        const nerveToNulsFee = crossFee + 'NVT' + '+' + crossFee + 'NULS'; // nerve -> nuls的手续费
        const nulsToNerveFee = crossFee + 'NULS'; // nuls -> nerve的手续费
        // 从其他链跨链转账到nerve
        if (this.toNerve) {
          if (this.$store.state.network === 'NULS') { // NULS跨链转入NERVE 为默认手续费
            let crossInFee = nulsToNerveFee;
            this.NULSContract = !!this.currentCoin.contractAddress;
            if (this.currentCoin.contractAddress) {
              this.NULSContract = true;
              crossInFee = await this.getContractCallData();
              if (crossInFee) {
                crossInFee = crossInFee + 'NULS';
              } else {
                return null;
              }
            }
            this.transferFee = crossInFee;
          } else { // 异构链跨链转入到NERVE
            this.transferFee = await this.getCrossInFee();
          }
        } else { // NERVE转账到其他链
          // NERVE跨链转出到NULS为默认手续费
          if (this.$store.state.network === 'NULS') {
            this.transferFee = nerveToNulsFee;
          } else { // NERVE跨链转出到异构链
            this.transferFee = await this.getCrossOutFee();
          }
        }
        this.showFeeLoading = false;
        this.transferCount && await this.checkTransferFee();
      } catch (e) {
        this.showFeeLoading = false;
        console.log(e, '计算手续费失败');
      }
    },
    // 检查手续费
    async checkTransferFee() {
      // console.log('checkTransferFee checkTransferFee')
      let flag = true;
      // 验证可用余额
      if (Minus(this.transferFee, this.available) > 0) flag = false;
      const tempFromNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
      const temToNetwork = this.toNerve ? 'NERVE' : this.fromNetwork;
      const asset = this.currentCoin; // 当前需要转入的资产
      const assetSymbol = asset.symbol;
      const feeList = this.transferFee && this.transferFee.split('+');
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAssetInfo = config[tempFromNetwork]; // 发起链主资产
      const isMainAsset = assetSymbol === mainAssetInfo.symbol; // 是否为主资产
      if (tempFromNetwork === 'NERVE') {
        if (temToNetwork === 'NULS') {
          if (assetSymbol === 'NULS') {
            if (Minus(Plus(this.transferCount, crossFee), this.available) > 0) flag = false;
          } else {
            const nulsBalance = await this.getNulsInfo(this.nerveAddress);
            if (nulsBalance - crossFee < 0) flag = false;
          }
          if (!this.checkFee(crossFee, isMainAsset)) {
            flag = false;
          }
        } else {
          const { value } = this.splitFeeSymbol(this.transferFee);
          if (!this.checkFee(value, isMainAsset)) {
            flag = false;
          }
        }
      } else if (tempFromNetwork === 'NULS') {
        let nulsFee;
        feeList.map(v => {
          const { symbol, value } = this.splitFeeSymbol(v);
          if (symbol === 'NULS') {
            nulsFee = value;
          }
        });
        if (!this.checkFee(nulsFee, isMainAsset)) {
          flag = false;
        }
      } else {
        if (temToNetwork === 'NERVE') {
          const { value } = this.splitFeeSymbol(this.transferFee);
          // flag = this.checkFee(value, isMainAsset)
          if (!this.checkFee(value, isMainAsset)) {
            flag = false;
          }
        }
      }
      this.amountMsg = flag ? '' : (!this.toNerve && this.$t('tips.tips8') || this.$t('tips.tips9'));
    },
    // 验证主资产是否够手续费/手续费+转账数量
    checkFee(fee, isMainAsset) {
      let flag = true;
      const tempNetwork = this.toNerve ? this.fromNetwork : this.currentFeeChain;
      // const fromChainInfo = !this.toNerve && this.storeAccountInfo.filter(v => v.chain === tempNetwork)[0];
      // const fromChainBalance = !this.toNerve && divisionDecimals(fromChainInfo.balance, fromChainInfo.decimals);
      console.log(this.currentFeeAsset, 'currentFeeAsset');
      const feeChainBalance = !this.toNerve && this.currentFeeAsset.balance || 0;
      if (this.toNerve) {
        if (isMainAsset) {
          if (Minus(Plus(this.transferCount, fee), this.available) > 0) flag = false;
        } else {
          // Minus(fromChainBalance, fee) < 0 ||
          if (Minus(this.transferCount, this.available) > 0) flag = false;
        }
      } else {
        console.log(isMainAsset, feeChainBalance, 'isMainAsset');
        if (isMainAsset && this.currentFeeAsset.chain === tempNetwork) {
          if (Minus(Plus(this.transferCount, fee), this.available) > 0) flag = false;
        } else {
          if (Minus(feeChainBalance, fee) < 0 || Minus(this.transferCount, this.available) > 0) flag = false;
        }
      }
      return flag;
    },
    /**
     * 查询nerve链上nuls余额
     * @param address // nerveAddress
     */
    async getNulsInfo(address) {
      const data = {
        address,
        assetId: NULS_INFO.assetId,
        chainId: NULS_INFO.chainId,
        decimals: NULS_INFO.decimal || 8
      };
      return await this.getNerveAssetBalance(data);
    },
    // nerve转出到异构链手续费
    async getCrossOutFee() {
      this.showFeeLoading = true;
      const chainToSymbol = {};
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      tempSupportChainList.map(v => {
        chainToSymbol[v.value] = v.symbol;
      });
      // eslint-disable-next-line no-unused-vars
      const tempFromNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
      const temToNetwork = this.toNerve ? 'NERVE' : this.fromNetwork;
      const asset = this.currentCoin;
      const assetHeterogeneousInfo = asset.heterogeneousList.filter(
        (v) => v.chainName === temToNetwork
      )[0];
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAsset = config['NERVE'];
      const isToken = assetHeterogeneousInfo && assetHeterogeneousInfo.token;
      const transfer = new ETransfer({ chain: temToNetwork });
      const { decimals, chainId, assetId } = this.currentFeeAsset;
      const feeIsNvt = chainId === mainAsset.chainId && assetId === mainAsset.assetId;
      let feeUSD = await getSymbolUSD(this.currentFeeChain); // 获取手续费资产稳定币价格
      feeUSD = feeUSD + '';
      let heterogeneousChainUSD = await getSymbolUSD(temToNetwork);
      heterogeneousChainUSD = heterogeneousChainUSD + '';
      let res;
      if (this.currentFeeChain === temToNetwork) {
        res = await transfer.calWithdrawFee(
          '',
          '',
          isToken,
          decimals || 8,
          true,
        );
      } else {
        res = await transfer.calWithdrawFee(
          heterogeneousChainUSD,
          feeUSD,
          isToken,
          decimals || 8,
          false,
          feeIsNvt
        );
      }
      let nvtFee;
      this.showFeeLoading = false;
      // OK上面波动大收取三倍手续费保证交易能够被确认
      if (this.currentFeeChain === 'OKExChain' || this.currentFeeChain === 'OEC') {
        nvtFee = this.numberFormat(formatFloatNumber(6, Times(this.floatToCeil(res, this.currentFeeAsset.decimals), 3)), 6);
      } else {
        nvtFee = this.numberFormat(formatFloatNumber(6, this.floatToCeil(res, this.currentFeeAsset.decimals)), 6);
      }
      this.withdrawalFee = nvtFee;
      return nvtFee + chainToSymbol[this.currentFeeChain];
    },
    floatToCeil(num, decimal = 6) {
      return Math.ceil(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
    },
    // 异构链转入nerve手续费
    async getCrossInFee() {
      const tempFromNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
      const assetHeterogeneousInfo = this.currentCoin && this.currentCoin.heterogeneousList.filter(
        (v) => v.chainName === tempFromNetwork
      )[0];
      const isToken = assetHeterogeneousInfo && assetHeterogeneousInfo.token;
      const gasLimit = isToken ? '150000' : '33594';
      const transfer = new ETransfer();
      const fee = await transfer.getGasPrice(gasLimit);
      // eslint-disable-next-line no-undef
      return fee + chainToSymbol[tempFromNetwork];
    },
    // nuls合约资产跨链 计算手续费&其他信息
    async getContractCallData() {
      const currentAccount = getCurrentAccount(this.fromAddress);
      const NERVEAddress = currentAccount.address.NERVE;
      const price = 25;
      const res = await getContractCallData(
        this.fromAddress,
        NERVEAddress,
        price,
        this.currentCoin.contractAddress,
        'transferCrossChain',
        this.transferCount,
        this.currentCoin.decimals
      );
      if (res.success) {
        // console.log(res, 55);
        // this.fee = res.data.fee;
        this.NULSContractGas = res.data.gas;
        this.NULSContractTxData = res.data.contractCallData;
        return res.data.fee;
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
    splitFeeSymbol(str) {
      if (!str) return { value: 0 };
      return {
        symbol: str.match(/[a-z|A-Z]+/gi)[0],
        value: str.match(/[\d|.]+/gi)[0]
      };
    },
    // 下一步
    async next() {
      if (!this.canNext) return false;
      this.transferLoading = true;
      const currentAccount = getCurrentAccount(this.fromAddress);
      const asset = this.currentCoin;
      const { nerveChainId: chainId, nerveAssetId: assetId } = this.currentCoin;
      const tempFromNetwork = this.toNerve && this.$store.state.network || 'NERVE';
      const tempToNetwork = this.toNerve && 'NERVE' || this.$store.state.network;
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAssetInfo = config[tempFromNetwork];
      const transferInfo = {
        fromChain: tempFromNetwork,
        toChain: tempToNetwork,
        fromAddress: currentAccount.address[tempFromNetwork],
        toAddress: currentAccount.address[tempToNetwork],
        chainId: asset.chainId,
        assetId: asset.assetId,
        contractAddress: asset.contractAddress,
        amount: this.transferCount,
        symbol: asset.symbol,
        pub: currentAccount.pub,
        signAddress: currentAccount.address.Ethereum,
        isTransferMainAsset: mainAssetInfo.symbol === asset.symbol,
        asset
      };
      const baseCrossFee = timesDecimals(crossFee, MAIN_INFO.decimal);
      const from = transferInfo.fromAddress;
      const to = transferInfo.toAddress;
      const nerveAddress = currentAccount.address.NERVE;
      const amount = timesDecimals(this.transferCount, asset.decimals);
      const assetsId = assetId === 0 ? asset.assetId : assetId; // nuls上的token资产通过getAssetNerveInfo查出来assetId为0

      // nerve nuls跨链
      const crossInfo = {
        from,
        to,
        assetsChainId: chainId,
        assetsId,
        amount,
        fee: baseCrossFee
        // type: 10
      };
      // 跨链转入
      // 提现
      let crossOutInfo;
      if (this.withdrawalFee) {
        const decimals = this.toNerve ? MAIN_INFO.decimal : this.currentFeeAsset.decimals;
        const proposalPrice = timesDecimals(
          this.withdrawalFee,
          decimals
        );
        const heterogeneousChain_Out = asset.heterogeneousList.filter(
          (v) => v.chainName === tempToNetwork
        )[0];
        const txData = {
          heterogeneousAddress: currentAccount.address[tempToNetwork],
          heterogeneousChainId: heterogeneousChain_Out && heterogeneousChain_Out.heterogeneousChainId
        };
        crossOutInfo = {
          from: nerveAddress,
          assetsChainId: chainId,
          assetsId,
          amount,
          fee: 0,
          proposalPrice,
          txData
          // type: 43
        };
      }
      if (tempFromNetwork === 'NERVE') {
        if (tempToNetwork === 'NULS') {
          transferInfo.crossInfo = crossInfo;
        } else {
          transferInfo.crossOutInfo = crossOutInfo;
        }
      } else if (tempFromNetwork === 'NULS') {
        if (this.NULSContract) {
          // nuls合约资产跨链
          const price = 25;
          transferInfo.NULSContracInfo = {
            from,
            assetsChainId: NULS_INFO.chainId,
            assetsId: NULS_INFO.assetId,
            amount: Plus(20000000, Times(this.NULSContractGas, price)).toFixed(),
            toContractValue: 10000000,
            to: asset.contractAddress,
            txData: this.NULSContractTxData,
            fee: timesDecimals(0.1, MAIN_INFO.decimal)
            // type: 16
          };
        } else {
          crossInfo.to = nerveAddress;
          transferInfo.crossInfo = crossInfo;
        }
        if (tempToNetwork !== 'NERVE') {
          transferInfo.crossOutInfo = crossOutInfo;
        }
      } else {
        // 异构链跨链转入nerve
        const heterogeneousChain_In = asset.heterogeneousList.filter(
          (v) => v.chainName === tempFromNetwork
        )[0];
        transferInfo.crossInInfo = {
          multySignAddress: heterogeneousChain_In.heterogeneousChainMultySignAddress,
          nerveAddress: nerveAddress,
          numbers: this.transferCount.toString(),
          fromAddress: from,
          contractAddress: heterogeneousChain_In.contractAddress,
          decimals: asset.decimals
        };
        if (tempToNetwork !== 'NERVE') {
          if (tempToNetwork !== 'NULS') {
            transferInfo.crossOutInfo = crossOutInfo;
          } else {
            crossInfo.from = nerveAddress;
            transferInfo.crossInfo = crossInfo;
          }
        }
      }
      this.transferInfo = transferInfo;
      await this.initTransfer();
    },
    // 转账交易
    async initTransfer() {
      const {
        fromChain,
        toChain,
        crossInfo, // 普通nerve nuls跨链信息
        crossOutInfo, // 提现
        crossInInfo // 异构链转入
      } = this.transferInfo;
      if (fromChain === 'NERVE') { // 转出
        let type, transferInfo;
        if (toChain === 'NULS') {
          type = 10; // 跨链交易
          transferInfo = crossInfo;
        } else {
          type = 43; // 跨链转出异构连
          transferInfo = crossOutInfo;
        }
        const txData = transferInfo.txData || {};
        await this.constructTx(fromChain, type, transferInfo, txData, this.$t('transfer.transfer5'), true);
      } else {
        // 异构链转入
        await this.constructCrossInTx(crossInInfo, this.$t('transfer.transfer2'));
      }
      await this.runTransfer();
    },
    /**
     * @desc 组装nerve nuls普通跨链，token跨链交易
     * @param chain
     * @param type
     * @param transferInfo
     * @param txData
     * @param label
     * @param needBroadcast 是否需要自己先广播
     */
    async constructTx(chain, type, transferInfo, txData, label, needBroadcast) {
      const fn = async() => {
        const { pub, signAddress } = this.transferInfo;
        const transfer = new NTransfer({ chain, type });
        transferInfo = {
          ...transferInfo,
          feeAsset: {
            chainId: this.currentFeeAsset.chainId,
            assetId: this.currentFeeAsset.assetId
          }
        };
        const inputOutput = await transfer.WithdrawalTransaction(transferInfo);
        // return false;
        const data = {
          inputs: inputOutput.inputs,
          outputs: inputOutput.outputs,
          txData,
          pub,
          signAddress
        };
        this.txHex = await transfer.getTxHex(data);
        console.log(this.txHex, '==this.txHex==');
        return this.txHex;
      };
      this.transactionInfo = {
        label,
        done: false,
        fn,
        needBroadcast
      };
    },
    // 组装异构链跨链转入交易
    async constructCrossInTx(crossInInfo, label) {
      const transfer = new ETransfer();
      const fn = async() => await transfer.crossIn(crossInInfo);
      this.transactionInfo = {
        label,
        done: false,
        fn
      };
    },
    // 执行转账
    async runTransfer() {
      this.transferLoading = true;
      const { fromChain, toChain, fromAddress, toAddress, chainId, assetId, contractAddress, amount, symbol } = this.transferInfo;
      const broadcastData = {
        fromChain,
        toChain,
        fromAddress,
        toAddress,
        chainId,
        assetId,
        contractAddress,
        symbol,
        amount,
        txHash: '' // 第一条交易hash
      };
      try {
        //  调用metamask转账/签名hash
        const res = await this.transactionInfo.fn();
        if (!this.toNerve) {
          await this.broadcastHex(broadcastData);
        } else {
          if (res) {
            this.txHex = res.raw;
            if (res.hash) {
              this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
              this.$message({
                message: this.$t('tips.tips10'),
                type: 'success',
                duration: 2000,
                offset: 30
              });
              this.transferLoading = false;
              this.reset();
            } else {
              throw this.$t('tips.tips15');
            }
          }
        }
      } catch (e) {
        console.error('error: ' + e);
        this.transferLoading = false;
        this.$message({
          message: e.message || this.$t('tips.tips15'),
          type: 'warning',
          duration: 2000,
          offset: 30
        });
      }
    },
    // 广播nerve跨链转出交易
    async broadcastHex(data) {
      // const { fromChain, toChain, assetId, chainId, amount, contractAddress, fromAddress, toAddress } = data;
      // const params = {
      //   fromChain,
      //   toChain,
      //   assetId,
      //   chainId,
      //   amount,
      //   contractAddress,
      //   fromAddress,
      //   toAddress,
      //   txHex: this.txHex
      // };
      // const res = await this.$request({
      //   url: '/swap/cross',
      //   data: params
      // });
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config['NERVE'].apiUrl;
      const chainId = config['NERVE'].chainId;
      const res = await this.$post(url, 'broadcastTx', [chainId, this.txHex]);
      if (res.result && res.result.hash) {
        this.formatArrayLength('NERVE', { type: 'L2', userAddress: this.fromAddress, chain: 'NERVE', isPure: false, txHash: res.result.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
        this.$message({
          message: this.$t('tips.tips10'),
          type: 'success',
          offset: 30
        });
        this.reset();
      } else {
        throw this.$t('tips.tips15');
      }
      this.transferLoading = false;
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      if (!this.canNext) return false;
      if (this.showApproveLoading) return false;
      this.transferLoading = true;
      try {
        const transfer = new ETransfer();
        const heterogeneousInfo = this.currentCoin.heterogeneousList.filter(
          (v) => v.chainName === this.fromNetwork
        )[0];
        const contractAddress = this.currentCoin.contractAddress;
        const res = await transfer.approveERC20(
          contractAddress,
          heterogeneousInfo.heterogeneousChainMultySignAddress,
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
          this.showApproveLoading = true;
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: 'warning',
            duration: 2000,
            offset: 30
          });
        }
        this.transferLoading = false;
      } catch (e) {
        console.log(e);
        this.$message.warning({ message: e.message, offset: 30 });
        this.transferLoading = false;
      }
    },
    setGetAllowanceTimer() {
      this.getAllowanceTimer = setInterval(() => {
        this.checkCrossInAuthStatus();
      }, 3000);
    },
    clearGetAllowanceTimer() {
      if (!this.getAllowanceTimer) return;
      clearInterval(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    },
    reset() {
      this.transferCount = '';
      this.transferFee = '';
      this.getTransferAsset();
    }
  }
};
</script>

<style scoped lang="scss">
@import "index";
</style>
