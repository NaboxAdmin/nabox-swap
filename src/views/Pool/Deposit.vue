<template>
  <!--   p-4-->
  <div class="join-cont p-4">
    <div v-loading="confirmLoading" v-if="confirmLoading" class="position-fixed_loading" @touchmove.prevent/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="currentAvailable">{{ currentAvailable || 0.0 }}</span>
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
    <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
    <div class="output-cont d-flex direction-column">
      <div class="account-info d-flex align-items-center size-28 text-90 cursor-pointer">
        <div @click.stop="showAccountList = !showAccountList">
          {{ `${currentType}${ $t('tips.tips46') }${superLong(currentAccount['address'][currentType])}${ $t('tips.tips47') }` }}
        </div>
        <img class="drop_icon" src="../../assets/image/drop_grey.png" alt="">
        <div v-if="showAccountList" class="account-list bg-white">
          <div>{{ $t('tips.tips48') }}</div>
          <div/>
          <div v-for="(item, index) in accountType" :key="index">
            <div class="d-flex align-items-center" @click="currentType=item.chainName;showAccountList=false;currentToChain=item">
              <span class="chain-icon mr-3">
                <img :src="getPicture(item.chainName)" alt="" @error="pictureError">
              </span>
              {{ superLong(currentAccount['address'][item.chainName]) }}
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
      <div v-if="crossFee && currentType!=='NERVE'" class="mb-3 d-flex size-28 align-items-center space-between">
        <span class="text-90 w-85">{{ $t("pool.join11") }}</span>
        <span class="text-3a text-right d-flex direction-column">
          <span>{{ crossFee }}{{ mainAssetSymbol }}</span>
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
    <div v-else class="btn m-88 size-30 d-flex align-items-center justify-content-center" @click="approveERC20">
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
import { NTransfer } from '@/api/api';
import { currentNet, MAIN_INFO } from '@/config';
import { divisionDecimals, timesDecimals, Minus, Division, tofix, Times, debounce } from '@/api/util';
import Modal from './Modal/Modal';
import { ETransfer } from '@/api/api';
import Loading from '@/components/Loading/Loading';

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
      currentType: 'NERVE',
      crossFee: 0,
      requestLoading: true,
      accountType: [],
      currentToChain: null, // 目标链
      needAuth: false,
      approvingLoading: false,
      poolList: [],
      computedFeeLoading: false
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
      return this.requestLoading || !this.joinCount || !Number(this.joinCount) || this.amountMsg || this.computedFeeLoading;
      // return true;
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.fromNetwork]['symbol'];
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
          console.log(this.poolList.length === 0, 'this.poolList.length === 0');
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
      if (this.fromNetwork === 'NERVE') {
        return await this.getNerveAssetBalance(asset);
      } else {
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
      }
    },
    showDropModal() {
      if (this.fromNetwork !== 'NERVE') return;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.showModal = true;
    },
    // 查询异构链token资产授权情况
    async checkAssetAuthStatus() {
      const transfer = new ETransfer();
      const config = JSON.parse(sessionStorage.getItem('config'));
      const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
      const contractAddress = this.currentAsset.contractAddress;
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
      this.confirmLoading = true;
      const config = JSON.parse(sessionStorage.getItem('config'));
      try {
        const transfer = new ETransfer();
        const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
        const contractAddress = this.currentAsset.contractAddress;
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
        this.confirmLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.$message.warning({ message: e.message, offset: 30 });
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
        this.computedFeeLoading = true;
        const params = {
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork],
          toAddress: this.currentType === 'NERVE' ? this.currentAccount['address']['NERVE'] : this.fromAddress,
          chainId: this.currentAsset.chainId,
          assetId: this.currentAsset.assetId,
          contractAddress: this.currentAsset.contractAddress,
          // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
          pairAddress: this.liquidityInfo.address,
          lpType: 1,
          swapChainId: this.currentType === 'NERVE' ? this.liquidityInfo.chainId : this.currentToChain.heterogeneousChainId,
          swapAssetId: this.currentType === 'NERVE' ? this.liquidityInfo.assetId : '0',
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentToChain.contractAddress
        };
        if (Minus(this.joinCount, this.userAvailable) > 0) {
          this.amountMsg = this.$t('tips.tips17');
          this.computedFeeLoading = false;
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
          this.orderId = res.data.orderId;
          this.requestLoading = false;
        } else {
          this.$message({
            type: 'warning',
            message: res.msg,
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
          if (this.fromNetwork !== 'NERVE') {
            this.checkAssetAuthStatus();
          }
        }
      }
      !refresh && await this.getAssetInfo(this.currentAsset);
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
      if (this.liquidityInfo.lpCoinList && this.fromNetwork === 'NERVE') {
        const tempParams = this.liquidityInfo.lpCoinList.map(item => ({
          chainId: item.nerveChainId,
          assetId: item.nerveAssetId,
          contractAddress: item.contractAddress
        }));
        const params = [config[this.fromNetwork]['chainId'], this.currentAccount['address'][this.fromNetwork], tempParams];
        const res = await this.$post(url, 'getBalanceList', params);
        if (res.result && res.result.length !== 0) {
          this.lpAssetsList = this.liquidityInfo.lpCoinList.map((item, index) => ({
            ...res.result[index],
            symbol: item.symbol,
            registerChain: item.chain,
            userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1),
            chainId: res.result[index].assetChainId,
            decimals: item.decimals
          }));
          console.log(this.lpAssetsList, 'this.lpAssetsList');
        }
      } else {
        // const batchQueryContract = config[this.fromNetwork]['config'].multiCallAddress || '';
        // const addresses = this.liquidityInfo.lpCoinList.map(asset => {
        //   if (asset.contractAddress) {
        //     return asset.contractAddress;
        //   }
        //   return batchQueryContract;
        // });
        // const res = await getBatchERC20Balance(addresses, this.fromAddress, batchQueryContract, url);
        // console.log(res, '123');
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
      if (this.fromNetwork === 'NERVE') {
        this.userAvailable = await this.getNerveAssetBalance(currentAsset);
      } else {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        if (currentAsset.contractAddress) {
          this.userAvailable = await transfer.getERC20Balance(currentAsset.contractAddress, currentAsset.decimals, this.fromAddress);
        } else {
          this.userAvailable = await transfer.getEthBalance(this.fromAddress);
        }
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
      if (this.fromNetwork === 'NERVE') {
        const params = {
          chainId: this.liquidityInfo.chainId,
          assetId: this.liquidityInfo.assetId,
          decimals: this.liquidityInfo.decimals,
          contractAddress: this.liquidityInfo.contractAddress || ''
        };
        const addedLiquidityBalance = await this.getNerveAssetBalance(params);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(addedLiquidityBalance, 4, -1)
        };
      } else {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        let addedLiquidityBalance;
        if (this.liquidityInfo.heterogeneousList) {
          const currentAsset = this.liquidityInfo.heterogeneousList && this.liquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          if (currentAsset.contractAddress) {
            addedLiquidityBalance = await transfer.getERC20Balance(currentAsset.contractAddress, this.liquidityInfo.decimals, this.fromAddress);
          } else {
            addedLiquidityBalance = await transfer.getEthBalance(this.fromAddress);
          }
        }
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(addedLiquidityBalance, 4, -1)
        };
      }
      this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo['balance'], this.liquidityInfo.total), 100), 2, -1) || 0;
    },

    async submit() {
      if (this.canNext) {
        // this.$toast(this.$t('tips.tips38'));
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
        }
        const orderParams = {
          orderId: this.orderId,
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork],
          toAddress: this.currentAccount['address'][this.currentType],
          chainId: this.currentAsset.chainId,
          assetId: this.currentAsset.assetId,
          contractAddress: this.fromNetwork === 'NERVE' ? '' : this.currentAsset.contractAddress,
          // amount: timesDecimals(this.joinCount, this.currentAsset.decimals),
          amount: this.joinCount,
          pairAddress: this.liquidityInfo.address,
          lpType: 1,
          crossFee: this.crossFee,
          swapChainId: this.currentType === 'NERVE' ? this.liquidityInfo.chainId : this.currentToChain.heterogeneousChainId,
          swapAssetId: this.currentType === 'NERVE' ? this.liquidityInfo.assetId : '0',
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentToChain.contractAddress,
          succAmount: this.joinCount
        };
        const orderRes = await this.$request({
          url: '/swap/lp/tx/save',
          data: orderParams
        });
        if (this.fromNetwork === 'NERVE') {
          const transfer = new NTransfer({
            chain: 'NERVE',
            type: 2
          });
          // const { nerveAssetId, nerveChainId } = this.currentAsset;
          const { chainId, assetId } = this.currentAsset;
          const transferInfo = {
            from: this.currentAccount && this.currentAccount.address['NERVE'] || '',
            to: lpNerveAddress,
            amount: timesDecimals(this.joinCount, this.currentAsset.decimals),
            fee: timesDecimals(this.crossFee, MAIN_INFO['decimal']),
            assetsChainId: chainId,
            assetsId: assetId
          };
          const { inputs, outputs } = await transfer.transferTransaction(transferInfo);
          if (orderRes.code === 1000) {
            const txHex = await transfer.getTxHex({
              inputs,
              outputs,
              txData: {},
              pub: this.currentAccount.pub,
              signAddress: this.currentAccount.address.Ethereum,
              remarks: this.orderId || ''
            });
            if (txHex) {
              console.log(txHex, '==txHex==');
              await this.broadcastHex(txHex);
            }
          } else {
            throw orderRes.msg;
          }
        } else {
          const transfer = new ETransfer();
          const config = JSON.parse(sessionStorage.getItem('config'));
          const multySignAddress = config[this.fromNetwork]['config']['crossAddress'] || '';
          const params = {
            fromAddress: this.fromAddress,
            decimals: this.currentAsset.decimals,
            contractAddress: this.currentAsset.contractAddress,
            orderId: ethers.utils.toUtf8Bytes(this.orderId),
            numbers: this.joinCount,
            multySignAddress,
            crossChainFee: this.crossFee.toString(),
            nerveAddress: lpNerveAddress
          };
          if (orderRes.code === 1000) {
            const res = await transfer.crossInII(params);
            if (res.hash) {
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
      const params = {
        orderId,
        txHash: hash
      };
      await this.$request({
        url: '/swap/lp/tx/hash/update',
        data: params
      });
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
        await this.getLiquidityInfo();
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

</style>
