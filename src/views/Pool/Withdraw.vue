<template>
  <div class="join-cont p-4">
    <div v-loading="withDrawLoading" v-if="withDrawLoading" class="position-fixed_loading" @touchmove.prevent/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="addedLiquidityInfo && addedLiquidityInfo.balance">{{ addedLiquidityInfo && addedLiquidityInfo.balance || 0.0 }}</span>
      <span v-else>--</span>
    </div>
    <div class="input-cont mt-2 d-flex align-items-center">
      <span class="image-cont">
        <img :src="getPicture(liquidityInfo && liquidityInfo.symbol || 'USDTN')" alt="">
      </span>
      <!--{{ liquidityInfo && liquidityInfo.symbol }}-->
      <span class="font-500 ml-14 size-30">{{ liquidityInfo && liquidityInfo.symbol || "USDTN" }}</span>
      <div class="input-item align-items-center ml-4 d-flex flex-1">
        <input
          v-model="withdrawCount"
          class="flex-1"
          placeholder="0"
          @input="withdrawInput">
        <span class="text-primary size-28" @click="maxCount">{{ $t("swap.swap3") }}</span>
      </div>
    </div>
    <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
    <div class="output-cont d-flex justify-content-center direction-column" @click="showModal=!showModal">
      <div class="size-28 text-90">{{ $t("pool.join1") }}</div>
      <div class="d-flex align-items-center space-between mt-2">
        <div class="d-flex align-items-center cursor-pointer">
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
    <div>
      <div class="d-flex mt-5 size-28 align-items-center space-between" @click="showDropList = !showDropList">
        <span class="text-90">{{ $t("pool.join2") }}</span>
        <span class="text-3a d-flex align-items-center">
          <span>${{ liquidityInfo && liquidityInfo.total | numberFormatLetter }}</span>
          <span :class="{'rotate_x': showDropList}" class="drop_down ml-1">
            <img src="@/assets/image/drop_down_black.png" alt="">
          </span>
        </span>
      </div>
      <template v-if="showDropList">
        <div
          v-for="item in lpCoinList"
          :key="item.assetId"
          class="d-flex size-28 align-items-center text-90 space-between justify-content-end mt-2">
          <span class="d-flex align-items-center ml-4">
            <span class="icon-cont mr-2">
              <img :src="getPicture(item.chain)" alt="" @error="pictureError">
            </span>
            <span>{{ item.chain }}</span>
          </span>
          <span class="text-3a mr-3">${{ item.balance | numberFormatLetter }}</span>
        </div>
      </template>
    </div>
    <div class="d-flex mt-4 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join3") }}</span>
      <span class="text-3a d-flex direction-column text-right">
        <span>${{ addedBalance || 0 }}({{ poolRate | rateFormat }})</span>
        <!--        <span>{{ liquidityInfo && liquidityInfo.symbol || "USDTN" }}  |  {{ poolRate | rateFormat }}</span>-->
      </span>
    </div>
    <div :class="{opacity_btn: canNext}" class="btn size-30" @click="submit">{{ $t("pool.join4") }}</div>
    <Modal
      :show-modal.sync="showModal"
      :asset-list="lpAssetsList"
      @selectAsset="selectAsset"/>
  </div>
</template>

<script>
import { divisionDecimals, timesDecimals, Times, tofix, Division, Minus } from '@/api/util';
import { NTransfer } from '@/api/api';
import { currentNet, MAIN_INFO } from '@/config';
import Modal from './Modal/Modal';

const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Withdraw',
  components: { Modal },
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
      lpAssetsList: [],
      addedBalance: 0
      // userAvailable: 0 // 用户可用的流动性
    };
  },
  computed: {
    lpCoinList() {
      const tempList = this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
      tempList.forEach(item => {
        item.balance = divisionDecimals(item.balance, item.decimals);
      });
      return this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
    },
    canNext() {
      return !this.withdrawCount || !Number(this.withdrawCount) || this.amountMsg;
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
    }
  },
  created() {
    this.getLiquidityInfo();
    this.infoTimer = setInterval(async() => {
      await this.getLiquidityInfo(true);
    }, 15000);
  },
  beforeDestroy() {
    if (this.assetTimer) clearInterval(this.assetTimer);
    if (this.infoTimer) clearInterval(this.infoTimer);
    this.assetTimer = null;
    this.infoTimer = null;
  },
  methods: {
    maxCount() {
      const currentPollTotal = this.currentWithdrawAsset && this.currentWithdrawAsset.total;
      this.withdrawCount = this.userAvailable;
      if (Minus(this.withdrawCount, currentPollTotal) < 0) {
        this.amountMsg = this.$t('pool.join9');
      }
    },
    withdrawInput() {
      const currentPollTotal = this.currentWithdrawAsset && this.currentWithdrawAsset.total;
      const addedBalance = this.addedLiquidityInfo && this.addedLiquidityInfo.balance || 0;
      if (!this.withdrawCount) {
        this.amountMsg = '';
        return false;
      }
      if (Minus(this.withdrawCount, currentPollTotal) < 0) {
        this.amountMsg = this.$t('pool.join9');
      } else if (Minus(this.withdrawCount, addedBalance) > 0) {
        this.amountMsg = this.$t('pool.join10');
      } else {
        this.amountMsg = '';
      }
    },
    // 选择需要撤出流动性的资产
    selectAsset(asset) {
      // this.currentWithdrawAssetInfo = asset;
      this.getAssetInfo(asset);
      this.showModal = false;
    },
    // 获取pool流动性信息
    async getLiquidityInfo(refresh = false) {
      if (!refresh) {
        this.availableLoading = true;
      }
      const res = await this.$request({
        method: 'get',
        url: '/swap/usdn/info'
      });
      if (res.code === 1000 && res.data) {
        const currentNetwork = sessionStorage.getItem('network');
        this.liquidityInfo = res.data;
        this.liquidityInfo.total = res.data && divisionDecimals(res.data.total, res.data.decimals);
        if (!this.currentWithdrawAssetInfo) {
          this.currentWithdrawAssetInfo = res.data.lpCoinList.length !== 0 && (res.data.lpCoinList.find(item => item.chain === currentNetwork) || res.data.lpCoinList[0]);
        }
        // await this.getAssetInfo(this.currentAsset);
        !refresh && await this.getAddedLiquidity();
        if (this.assetTimer) {
          clearInterval(this.assetTimer);
          this.assetTimer = null;
        }
        this.assetTimer = setInterval(async() => {
          await this.getAddedLiquidity();
        }, 10000);
        if (this.liquidityInfo.lpCoinList) {
          const tempParams = this.liquidityInfo.lpCoinList.map(item => ({
            chainId: item.chainId,
            assetId: item.assetId,
            contractAddress: item.contractAddress
          }));
          const url = MAIN_INFO.batchRPC;
          const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
          const res = await this.$post(url, 'getBalanceList', params);
          if (res.result && res.result.length !== 0) {
            this.lpAssetsList = this.liquidityInfo.lpCoinList.map((item, index) => ({
              ...res.result[index],
              symbol: item.symbol,
              registerChain: item.chain,
              userBalance: tofix(divisionDecimals(res.result[index].balance || 0, item.decimals || 8), 6, -1),
              chainId: res.result[index].assetChainId
            }));
          } else {
            this.lpAssetsList = await Promise.all(this.liquidityInfo.lpCoinList.map(async item => {
              const data = {
                chain: 'NERVE',
                address: this.nerveAddress,
                chainId: item.chainId,
                assetId: item.assetId,
                contractAddress: '',
                refresh: true
              };
              const res = await this.$request({
                url: '/wallet/address/asset',
                data
              });
              if (res.code === 1000) {
                return {
                  ...res.data,
                  userBalance: res.data && tofix(divisionDecimals(res.data.balance, res.data.decimals), 6, -1) || 0
                };
              }
            }));
          }
        }
      } else {
        this.availableLoading = false;
      }
    },
    // 获取已添加流动性资产信息
    async getAddedLiquidity() {
      const params = {
        chain: 'NERVE',
        address: this.nerveAddress,
        chainId: this.liquidityInfo.chainId,
        assetId: this.liquidityInfo.assetId,
        refresh: true,
        contractAddress: this.liquidityInfo.contractAddress || ''
      };
      const res = await this.$request({
        url: '/wallet/address/asset',
        data: params
      });
      if (res.code === 1000) {
        this.addedLiquidityInfo = res.data;
        this.userAvailable = divisionDecimals(res.data.balance, res.data.decimals);
        this.addedLiquidityInfo['balance'] = this.numberFormat(tofix(divisionDecimals(res.data.balance, res.data.decimals), 6, -1));
        this.addedBalance = this.numberFormat(tofix(res.data.balance, 4, -1), 4);
        this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo['balance'], this.liquidityInfo.total), 100), 2, -1) || 0;
      }
      this.availableLoading = false;
    },
    // 获取资产信息
    async getAssetInfo(currentAsset) {
      if (!currentAsset) return '';
      const params = {
        chain: 'NERVE',
        address: this.nerveAddress,
        chainId: currentAsset.chainId,
        assetId: currentAsset.assetId,
        refresh: true,
        contractAddress: ''
      };
      const res = await this.$request({
        url: '/wallet/address/asset',
        data: params
      });
      if (res.code === 1000) {
        this.currentWithdrawAssetInfo = res.data;
      }
    },
    // 确认
    async submit() {
      if (this.canNext) return false;
      this.withDrawLoading = true;
      const transfer = new NTransfer({
        chain: 'NERVE',
        type: 2
      });
      try {
        const { symbol, contractAddress } = this.currentWithdrawAssetInfo;
        // console.log(this.currentWithdrawAssetInfo, "this.currentWithdrawAssetInfo");
        const { chainId, assetId } = this.addedLiquidityInfo;
        const { address, decimals } = this.liquidityInfo;
        const amounts = nerve.swap.tokenAmount(chainId, assetId, timesDecimals(this.withdrawCount, decimals));
        const temIndex = this.lpCoinList.map((item, index) => index);
        const tempReceiveOrderIndex = this.lpCoinList.findIndex(item => {
          return item.chainId === this.currentWithdrawAssetInfo.chainId && item.assetId === this.currentWithdrawAssetInfo.assetId;
        });
        tempReceiveOrderIndex !== -1 && temIndex.unshift(tempReceiveOrderIndex);
        const transferInfo = {
          from: this.nerveAddress,
          to: this.nerveAddress,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: timesDecimals(this.withdrawCount, decimals),
          fee: 0
        };
        const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
        const fromAddress = this.nerveAddress;
        const stablePairAddress = address;
        const tokenAmountLP = amounts;
        const receiveOrderIndexs = Array.from(new Set(temIndex));
        const deadline = nerve.swap.currentTime() + 300;
        const toAddress = this.nerveAddress;
        const remark = '';
        const tempTxData = await nerve.swap.stableSwapRemoveLiquidity(fromAddress, stablePairAddress, tokenAmountLP, receiveOrderIndexs, deadline, toAddress, remark);
        const tAssemble = nerve.deserializationTx(tempTxData.hex); // 获取tAssemble
        const txData = {
          tAssemble,
          inputs,
          outputs,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address.Ethereum
        };
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          console.log(txHex, '==txHex==');
          await this.broadcastHex(txHex);
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
    // 广播nerve nuls跨链转账交易
    async broadcastHex(txHex) {
      const res = await this.$request({
        url: '/swap/lp/add',
        data: { txHex }
      });
      if (res.code === 1000) {
        this.$message({
          message: this.$t('tips.tips10'),
          type: 'success',
          duration: 2000,
          offset: 30
        });
        this.withDrawLoading = false;
        this.reset();
        await this.getLiquidityInfo();
      } else {
        this.withDrawLoading = false;
        this.$message({
          message: this.$t('tips.tips15'),
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
  margin: 88px auto;
  color: #FFFFFF;
  text-align: center;
  line-height: 98px;
  background: #53b8a9;
  border-radius: 20px;
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
</style>
