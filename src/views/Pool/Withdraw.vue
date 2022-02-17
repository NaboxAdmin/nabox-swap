<template>
  <div class="join-cont p-4">
    <div v-loading="withDrawLoading" v-if="withDrawLoading" class="position-fixed_loading" @touchmove.prevent/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="addedLiquidityInfo">{{ addedLiquidityInfo && addedLiquidityInfo.balance || 0 }}</span>
      <span v-else>--</span>
    </div>
    <div class="input-cont mt-2 d-flex align-items-center">
      <span class="image-cont">
        <img :src="getPicture(liquidityInfo && liquidityInfo.symbol || 'USDTN')" alt="" @error="pictureError">
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
    <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
    <div class="output-cont d-flex justify-content-center direction-column cursor-pointer">
      <div class="account-info d-flex align-items-center size-28 text-90">
        <div @click.stop="showAccountList = !showAccountList">
          {{ `${currentType}${$t('tips.tips46')}${superLong(currentAccount['address'][currentType])}${$t('tips.tips47')}` }}
        </div>
        <img class="drop_icon" src="../../assets/image/drop_grey.png" alt="">
        <div v-if="showAccountList" class="account-list bg-white">
          <div>{{ $t('tips.tips48') }}</div>
          <div/>
          <div v-for="(item, index) in accountType" :key="index">
            <div class="d-flex align-items-center" @click="currentType=item.chain;showAccountList=false;currentToChain=item">
              <span class="chain-icon mr-3">
                <img :src="getPicture(item.chain)" alt="" @error="pictureError">
              </span>
              {{ superLong(currentAccount['address'][item.chain]) }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center space-between mt-2">
        <div class="d-flex align-items-center cursor-pointer" @click="showModal=!showModal">
          <div class="d-flex align-items-center ml-14 direction-column">
            <span class="font-500 size-30">{{ currentWithdrawAssetInfo && currentWithdrawAssetInfo.symbol || "USDT" }}</span>
            <span v-if="currentWithdrawAssetInfo" class="sign">{{ (currentWithdrawAssetInfo && currentWithdrawAssetInfo.registerChain) || (currentWithdrawAssetInfo && currentWithdrawAssetInfo.chain) }}</span>
          </div>
          <div class="ml-2 drop_down">
            <img src="@/assets/image/drop_down.png" alt="">
          </div>
        </div>
        <span class="font-500 size-36 m-w180 word-break">{{ withdrawCount || "0" }}</span>
      </div>
    </div>
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
          <span class="text-3a">${{ item.balance | numberFormatLetter }}</span>
        </div>
      </template>
    </div>
    <div class="d-flex mt-3 size-28 align-items-center space-between">
      <span class="text-90">{{ $t("pool.join2") }}</span>
      <span class="text-3a d-flex align-items-center">
        <span>${{ liquidityInfo && liquidityInfo.total | numberFormatLetter }}</span>
        <!--        <span :class="{'rotate_x': showDropList}" class="drop_down ml-1">-->
        <!--          <img src="@/assets/image/drop_down_black.png" alt="">-->
        <!--        </span>-->
      </span>
    </div>
    <div class="d-flex mt-2 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join3") }}</span>
      <span class="text-3a d-flex direction-column text-right">
        <span>${{ addedBalance || 0 | numberFormatLetter }}({{ poolRate | rateFormat }})</span>
      </span>
    </div>
    <!--    <div v-if="crossFee && currentType!=='NERVE'" class="d-flex mt-2 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join11") }}</span>
      <span class="text-3a text-right d-flex direction-column">
        <span>{{ crossFee }}{{ mainAssetSymbol }}</span>
      </span>
    </div>-->
    <div v-if="!needAuth" class="m-88">
      <div v-if="crossFee && currentType!=='NERVE'" class="d-flex mb-3 size-28 align-items-center space-between">
        <span class="text-90 w-85">{{ $t("pool.join11") }}</span>
        <span class="text-3a text-right d-flex direction-column">
          <span>{{ crossFee }}{{ mainAssetSymbol }}</span>
        </span>
      </div>
      <div :class="{opacity_btn: canNext}" class="btn size-30" @click="submit">{{ $t("pool.join4") }}</div>
    </div>
    <div v-else class="btn m-88 size-30 d-flex align-items-center justify-content-center" @click="approveERC20">
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
import { divisionDecimals, timesDecimals, Times, tofix, Division, Minus, debounce } from '@/api/util';
import { ETransfer, getBatchERC20Balance, NTransfer } from '@/api/api';
import { currentNet, MAIN_INFO } from '@/config';
import Modal from './Modal/Modal';
import Loading from '@/components/Loading/Loading';

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
      currentType: 'NERVE',
      crossFee: 0,
      requestLoading: true,
      accountType: [],
      currentToChain: null,
      originLpAssetList: [],
      needAuth: false,
      approvingLoading: false
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
      return !this.withdrawCount || !Number(this.withdrawCount) || this.amountMsg || this.requestLoading;
      // return true;
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.fromNetwork]['symbol'];
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
          console.log(this.originLpAssetList, 'this.originLpAssetList');
          if (val !== 'NERVE') {
            this.currentWithdrawAssetInfo = this.originLpAssetList.find(item => item.chain === val) || this.originLpAssetList[0];
            console.log(this.currentWithdrawAssetInfo, 'currentWithdrawAssetInfo currentWithdrawAssetInfo');
            // this.lpAssetsList = this.originLpAssetList.filter(item => item.chain === val);
            this.getChainAssetBalance(val, this.originLpAssetList.filter(item => item.chain === val));
          } else {
            this.currentWithdrawAssetInfo = this.originLpAssetList.find(item => item.chain === val) || this.originLpAssetList[0];
            this.lpAssetsList = this.originLpAssetList;
          }
          this.countInputDebounce();
        }
      },
      deep: true,
      immediate: true
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
    this.getLiquidityInfo();
    // this.infoTimer = setInterval(async() => {
    //   await this.getLiquidityInfo(true);
    // }, 15000);
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
    // 查询异构链token资产授权情况
    async checkAssetAuthStatus() {
      const transfer = new ETransfer();
      const config = JSON.parse(sessionStorage.getItem('config'));
      const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
      // const contractAddress = this.accountType.find(item => item.chain === this.fromNetwork).contractAddress;
      const contractAddress = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork).contractAddress;
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
      this.withDrawLoading = true;
      const config = JSON.parse(sessionStorage.getItem('config'));
      try {
        const transfer = new ETransfer();
        const authContractAddress = config[this.fromNetwork]['config']['crossAddress'];
        // const contractAddress = this.accountType.find(item => item.chain === this.fromNetwork).contractAddress;
        const contractAddress = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork).contractAddress;
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
        this.withDrawLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.$message.warning({ message: e.message, offset: 30 });
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
      const currentPollTotal = this.liquidityInfo.lpCoinList.find(item => item.chain === this.currentWithdrawAssetInfo.chain).balance || 0;
      if (!this.withdrawCount) {
        this.amountMsg = '';
        return false;
      }
      const heterAsset = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
      const params = {
        fromChain: this.fromNetwork,
        toChain: this.currentType,
        fromAddress: this.currentAccount['address'][this.fromNetwork],
        toAddress: this.currentAccount['address'][this.currentType],
        chainId: heterAsset && heterAsset.heterogeneousChainId || this.addedLiquidityInfo.chainId,
        assetId: heterAsset && '0' || this.addedLiquidityInfo.assetId,
        contractAddress: heterAsset && heterAsset.contractAddress || '',
        // amount: this.inputType === 'amountIn' && timesDecimals(this.amountIn, this.chooseFromAsset.decimals) || timesDecimals(this.amountOut, this.chooseToAsset.decimals),
        pairAddress: this.liquidityInfo.address,
        lpType: 2,
        swapChainId: this.currentType === 'NERVE' ? this.currentWithdrawAssetInfo.nerveChainId : this.currentWithdrawAssetInfo.chainId,
        swapAssetId: this.currentType === 'NERVE' ? this.currentWithdrawAssetInfo.nerveAssetId : this.currentWithdrawAssetInfo.assetId,
        swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentWithdrawAssetInfo.contractAddress
      };
      if (Minus(this.withdrawCount, currentPollTotal) > 0) {
        this.amountMsg = this.$t('pool.join9');
        return false;
      } else if (Minus(this.withdrawCount, this.userAvailable) > 0) {
        this.amountMsg = this.$t('pool.join10');
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
      }
    },
    // 选择需要撤出流动性的资产
    selectAsset(asset) {
      this.currentWithdrawAssetInfo = { ...asset };
      this.showModal = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo(refresh = false) {
      if (!refresh) {
        this.availableLoading = true;
      }
      // const res = await this.$request({
      //   method: 'get',
      //   url: '/swap/usdn/info'
      // });
      const tempData = JSON.parse(sessionStorage.getItem('liquidityItem'));
      const currentNetwork = sessionStorage.getItem('network');
      this.liquidityInfo = {
        lpCoinList: tempData.swapAssets,
        address: tempData.pairAddress,
        total: divisionDecimals(tempData.tokenLp.amount, tempData.tokenLp.decimals),
        chainId: tempData.tokenLp.chainId,
        assetId: tempData.tokenLp.assetId,
        symbol: tempData.tokenLp.symbol,
        decimals: tempData.tokenLp.decimals,
        heterogeneousList: tempData.tokenLp.heterogeneousList
      };
      if (!this.currentWithdrawAssetInfo) {
        if (this.liquidityInfo.lpCoinList.length !== 0) {
          this.currentWithdrawAssetInfo = this.liquidityInfo.lpCoinList.length !== 0 && (this.liquidityInfo.lpCoinList.find(item => item.chain === currentNetwork) || this.liquidityInfo.lpCoinList[0]);
        }
      }
      !refresh && await this.getAddedLiquidity();
      if (this.assetTimer) {
        clearInterval(this.assetTimer);
        this.assetTimer = null;
      }
      this.assetTimer = setInterval(async() => {
        await this.getAddedLiquidity();
      }, 10000);
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
            decimals: item.decimals,
            chain: item.chain,
            registerChain: item.chain,
            userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1),
            nerveAssetId: res.result[index].assetId,
            nerveChainId: res.result[index].assetChainId,
            chainId: item.chainId,
            assetId: item.assetId,
            contractAddress: item.contractAddress
          }));
          this.originLpAssetList = this.lpAssetsList;
        }
      } else {
        const tempLpAssetsList = this.liquidityInfo.lpCoinList.map(item => ({
          ...item,
          registerChain: item.chain
        }));
        await this.getChainAssetBalance(this.currentType, tempLpAssetsList);
        this.originLpAssetList = this.lpAssetsList;
      }
      // } else {
      //   this.availableLoading = false;
      // }
    },
    // 获取已添加流动性资产信息
    async getAddedLiquidity() {
      if (this.fromNetwork === 'NERVE') {
        const params = {
          chain: 'NERVE',
          address: this.nerveAddress,
          chainId: this.liquidityInfo.chainId,
          assetId: this.liquidityInfo.assetId,
          decimals: this.liquidityInfo.decimals,
          refresh: true,
          contractAddress: this.liquidityInfo.contractAddress || ''
        };
        const addedLiquidityBalance = await this.getNerveAssetBalance(params);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(addedLiquidityBalance, 6, -1)
        };
        this.userAvailable = addedLiquidityBalance;
        this.addedBalance = this.numberFormat(tofix(addedLiquidityBalance, 4, -1), 4);
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
        this.userAvailable = addedLiquidityBalance;
        this.addedBalance = this.numberFormat(tofix(addedLiquidityBalance, 4, -1), 4);
        this.addedLiquidityInfo = {
          ...this.liquidityInfo,
          balance: this.numberFormat(addedLiquidityBalance, 4, -1)
        };
      }
      this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo['balance'], this.liquidityInfo.total), 100), 2, -1) || 0;
      this.availableLoading = false;
      if (this.fromNetwork !== 'NERVE') {
        this.checkAssetAuthStatus();
      }
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
        }
        const heterAsset = this.addedLiquidityInfo.heterogeneousList.find(item => item.chainName === this.fromNetwork);
        const orderParams = {
          orderId: this.orderId,
          fromChain: this.fromNetwork,
          toChain: this.currentType,
          fromAddress: this.currentAccount['address'][this.fromNetwork],
          toAddress: this.currentAccount['address'][this.currentType],
          chainId: heterAsset && heterAsset.heterogeneousChainId || this.addedLiquidityInfo.chainId,
          assetId: heterAsset && '0' || this.addedLiquidityInfo.assetId,
          contractAddress: heterAsset && heterAsset.contractAddress || this.addedLiquidityInfo.contractAddress,
          // amount: timesDecimals(this.joinCount, this.currentAsset.decimals),
          amount: this.withdrawCount,
          pairAddress: this.liquidityInfo.address,
          lpType: 2,
          crossFee: this.crossFee,
          swapChainId: this.currentType === 'NERVE' ? this.currentWithdrawAssetInfo.nerveChainId : this.currentWithdrawAssetInfo.chainId,
          swapAssetId: this.currentType === 'NERVE' ? this.currentWithdrawAssetInfo.nerveAssetId : this.currentWithdrawAssetInfo.assetId,
          swapContractAddress: this.currentType === 'NERVE' ? '' : this.currentWithdrawAssetInfo.contractAddress
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
          const { chainId, assetId } = this.addedLiquidityInfo;
          const transferInfo = {
            from: this.currentAccount && this.currentAccount.address['NERVE'] || '',
            to: lpNerveAddress,
            amount: timesDecimals(this.withdrawCount, this.addedLiquidityInfo.decimals || 18),
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
          message: e.message || e,
          type: 'warning',
          offset: 30
        });
        this.withDrawLoading = false;
        console.log(e);
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
    // 获取当前选择撤出的资产余额
    async getChainAssetBalance(chain, assetList) {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const RPCUrl = config[chain].apiUrl;
      const batchQueryContract = config[chain]['config'].multiCallAddress || '';
      try {
        if (chain === 'NERVE' && this.fromNetwork !== 'NERVE') {
          const tempParams = assetList.map(item => ({
            chainId: item.nerveChainId,
            assetId: item.nerveAssetId,
            contractAddress: item.contractAddress
          }));
          const params = [config[chain]['chainId'], this.currentAccount['address'][chain], tempParams];
          const res = await this.$post(RPCUrl, 'getBalanceList', params);
          if (res.result && res.result.length !== 0) {
            this.lpAssetsList = assetList.map((item, index) => ({
              ...item,
              userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1)
            }));
            this.originLpAssetList = this.lpAssetsList;
          }
        } else if (chain !== 'NERVE') {
          const addresses = assetList.map(asset => {
            if (asset.contractAddress) {
              return asset.contractAddress;
            }
            return batchQueryContract;
          });
          const fromAddress = this.currentAccount['address'][chain];
          const balanceData = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
          assetList.forEach((item, index) => {
            balanceData.forEach(data => {
              if (data.contractAddress === item.contractAddress) {
                assetList[index].userBalance = data.balance && tofix(divisionDecimals(data.balance, item.decimals), 6, -1) || 0;
                assetList[index].showBalanceLoading = false;
              }
            });
          });
          this.lpAssetsList = [...assetList];
        }
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
      // TODO:前端保存交易记录
      if (res.result && res.result.hash) {
        // this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.result.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
        this.$message({
          message: this.$t('tips.tips10'),
          type: 'success',
          duration: 2000,
          offset: 30
        });
        this.withDrawLoading = false;
        this.reset();
        await this.recordHash(this.orderId, res.result.hash);
        await this.getLiquidityInfo();
      } else {
        this.withDrawLoading = false;
        this.$message({
          message: res.error && res.error.message || this.$t('tips.tips15'),
          type: 'warning',
          duration: 2000,
          offset: 30
        });
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
  max-width: 360px;
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
</style>
