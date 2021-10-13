<template>
<!--   p-4-->
  <div class="join-cont p-4">
    <div class="position-fixed_loading"  @touchmove.prevent v-if="confirmLoading" v-loading="confirmLoading"/>
    <div class="d-flex align-items-center size-26 text-90 justify-content-end">
      {{ $t("swap.swap4") }}：
      <span v-if="availableLoading"><i class="el-icon-loading"/></span>
      <span v-else-if="currentAvailable">{{ currentAvailable || 0.0 }}</span>
      <span v-else>--</span>
    </div>
    <div class="input-cont mt-2 d-flex align-items-center">
      <div class="d-flex align-items-center cursor-pointer" @click="showModal=true">
        <span class="image-cont">
          <img :src="getPicture(currentAsset && currentAsset.symbol)" alt="">
        </span>
        <div>
          <span class="font-bold ml-14 size-30">{{ currentAsset && currentAsset.symbol || "USDT" }}</span>
        </div>
        <div class="ml-2 drop_down">
          <img src="@/assets/image/drop_down.png" alt="">
        </div>
      </div>
      <div class="input-item align-items-center ml-4 d-flex flex-1">
        <input class="flex-1"
               @focus.stop
               @input="countInput"
               v-model="joinCount"
               placeholder="0.00">
        <span class="text-primary size-28" @click.stop="maxCount">{{ $t("swap.swap3") }}</span>
      </div>
    </div>
    <div class="text-red mt-2" v-if="amountMsg">{{ amountMsg }}</div>
    <div class="output-cont d-flex direction-column">
      <div class="size-28 text-90">{{ $t("pool.join1") }}</div>
      <div class="d-flex align-items-center space-between mt-3">
        <span class="font-bold size-30">{{ liquidityInfo && liquidityInfo.symbol || 'USDTN' }}</span>
        <span class="font-bold size-36 m-w180 word-break">{{ joinCount || "0.00" }}</span>
      </div>
    </div>
    <div>
      <div class="d-flex mt-5 size-28 align-items-center space-between" @click="showDropList = !showDropList">
        <span class="text-90">{{ $t("pool.join2") }}</span>
        <span class="text-3a d-flex align-items-center">
          <span>${{ liquidityInfo && liquidityInfo.total | numberFormatLetter }}</span>
          <span class="drop_down ml-1" :class="{'rotate_x': showDropList}">
            <img src="@/assets/image/drop_down_black.png" alt="">
          </span>
        </span>
      </div>
      <template v-if="showDropList">
        <div class="d-flex align-items-center size-28 text-90 space-between justify-content-end mt-2"
             :key="item.assetId"
             v-for="(item, index) in lpCoinList">
          <span class="ml-4">{{ item.chain }}</span>
          <span class="text-3a mr-3">${{ item.balance | numberFormatLetter }}</span>
        </div>
      </template>
    </div>
    <div class="d-flex mt-4 size-28 align-items-center space-between">
      <span class="text-90 w-85">{{ $t("pool.join3") }}</span>
      <span class="text-3a text-right d-flex direction-column">
        <span>${{ addedLiquidityInfo && addedLiquidityInfo.balance | numFormat }}({{ poolRate | rateFormat }})</span>
<!--        <span>{{ liquidityInfo && liquidityInfo.symbol || "USDTN" }}  |  {{ poolRate | rateFormat }}</span>-->
      </span>
    </div>
    <div class="btn size-30 cursor-pointer" :class="{opacity_btn: canNext}" @click="submit">{{ $t("pool.join4") }}</div>
    <div class="tips size-26 text-center">{{ $t("pool.join5") }}</div>
    <keep-alive>
      <Modal :show-modal.sync="showModal"
             :asset-list="lpAssetsList"
             @selectAsset="selectAsset"/>
    </keep-alive>
  </div>
</template>

<script>
import { valideNetwork } from "../Swap";
import { NTransfer } from "@/api/api";
import { currentNet } from "@/config";
import { divisionDecimals, timesDecimals, getAssetNerveInfo, Minus, Division, tofix } from "@/api/util";
import Modal from "./Modal/Modal";
import {Times} from "../../../../api/util";

const nerve = require('nerve-sdk-js');
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: "Join",
  props: {
    // nerveAddress: String,
    // currentAccount: {
    //   type: Object,
    //   default: () => null
    // },
    // fromNetwork: {
    //   type: String,
    //   default: ""
    // }
  },
  data() {
    return {
      joinCount: '',
      chain: "NERVE", // 当前所在的链
      showDropList: false,
      liquidityInfo: null, // 流动性信息
      currentAsset: null, // 当前选择的资产
      currentAssetInfo: null, // 当前资产的详细信息
      currentAvailable: 0, // 当前选择的资产的余额
      addedLiquidityInfo: null, // 已添加流动性的资产信息
      confirmLoading: false,
      showModal: false,
      poolRate: 0,
      amountMsg: '', // 当前可用余额不足提示
      availableLoading: false,
      assetTimer: null,
      infoTimer: null,
      isFirstRequest: false,
      lpAssetsList: []
    }
  },
  components: { Modal },
  async created() {
    // await this.getCoins();
    await this.getLiquidityInfo();
    this.infoTimer = setInterval(async () => {
      await this.getLiquidityInfo(true);
    }, 20000);
  },
  watch: {
    joinCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = this.currentAssetInfo.decimals || 8;
          const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
          if (patrn.exec(newVal) || newVal === "") {
            this.joinCount = newVal;
          } else {
            this.joinCount = oldVal;
          }
        } else {
          this.joinCount = "";
        }
      }
    }
  },
  computed: {
    // 当前资金池里面的总额
    lpCoinList() {
      const tempList = this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
      tempList.forEach(item => {
        item.balance = divisionDecimals(item.balance, item.decimals);
      });
      return this.liquidityInfo && this.liquidityInfo.lpCoinList || []
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
      return !this.joinCount || !Number(this.joinCount) || this.amountMsg;
    }
  },
  filters: {
    rateFormat(val) {
      if (val < 0.01) {
        return '<0.01%'
      } else {
        return `${val}%`
      }
    }
  },
  methods: {
    maxCount() {
      if (!this.currentAvailable || !Number(this.currentAvailable)) return false;
      this.joinCount = this.currentAvailable;
    },
    countInput() {
      if (!this.joinCount) {
        this.amountMsg = ''
        return false
      }
      if (Minus(this.joinCount, this.currentAvailable) > 0) {
        this.amountMsg = this.$t("tips.tips17")
      } else {
        this.amountMsg = ''
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
    // 获取当前链上的资产
    async getCoins(symbol) {
      const res = await this.$request({
        url: "/wallet/address/assets",
        data: {
          chain: "NERVE",
          address: this.nerveAddress
        }
      });
      if (res.code === 1000) {
        const coins = res.data.filter(v => valideNetwork.indexOf(v.registerChain) > -1);
        this.currentCoin = coins && coins.find(coin => coin.symbol === (symbol || "USDT")) || null;
        this.available = this.currentCoin && divisionDecimals(this.currentCoin.balance, this.currentCoin.decimals) || 0;
      }
    },
    // 获取pool流动性信息
    async getLiquidityInfo(refresh=false) {
      const res = await this.$request({
        method: "get",
        url: '/swap/usdn/info'
      });
      if (res.code === 1000 && res.data) {
        const currentNetwork = sessionStorage.getItem('network');
        this.liquidityInfo = res.data;
        this.liquidityInfo["total"] = res.data.total && divisionDecimals(res.data.total, res.data.decimals) || 0;
        // this.currentAsset = !this.currentAsset && res.data.lpCoinList.length !== 0 && (res.data.lpCoinList.filter(item => item.chain === this.$store.state.fromNetwork) || res.data.lpCoinList[0]) || this.currentAsset;
        if (!this.currentAsset) {
          if (res.data.lpCoinList.length !== 0) {
            this.currentAsset = res.data.lpCoinList.find(item => item.chain === currentNetwork) || res.data.lpCoinList[0]
          }
        } else {
          this.currentAsset = this.currentAsset;
        }
        !refresh && await this.getAssetInfo(this.currentAsset);
        if (this.assetTimer) {
          clearInterval(this.assetTimer);
          this.assetTimer = null;
        }
        this.assetTimer = setInterval(async () => {
          await this.getAssetInfo(this.currentAsset, true);
        }, 10000);
        await this.getAddedLiquidity();
        if (this.liquidityInfo.lpCoinList) {
          this.lpAssetsList = await Promise.all(this.liquidityInfo.lpCoinList.map(async (item) => {
            const data = {
              chain: "NERVE",
              address: this.nerveAddress,
              chainId: item.chainId,
              assetId: item.assetId,
              contractAddress: "",
              refresh: true
            }
            const res = await this.$request({
              url: '/wallet/address/asset',
              data
            });
            if (res.code === 1000) {
              return {
                ...res.data,
                userBalance: res.data && tofix(divisionDecimals(res.data.balance, res.data.decimals), 6, -1) || 0
              }
            }
          }));
        }
      }
    },
    // 获取资产信息
    async getAssetInfo(currentAsset, refresh=false) {
      if (!currentAsset) return '';
      if (!refresh) {
        this.availableLoading = true;
      }
      const params = {
        chain: "NERVE",
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
        this.currentAssetInfo = res.data;
        this.currentAvailable = divisionDecimals(res.data.balance, res.data.decimals);
      }
      this.availableLoading = false;
    },
    // 获取已添加流动性资产信息
    async getAddedLiquidity() {
      const params = {
        chain: "NERVE",
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
        this.addedLiquidityInfo["balance"] = this.numberFormat(tofix(divisionDecimals(res.data.balance, res.data.decimals), 4, -1));
        this.poolRate = this.liquidityInfo.total && tofix(Times(Division(this.addedLiquidityInfo["balance"], this.liquidityInfo.total), 100), 2, -1) || 0;
      }
    },
    async submit() {
      if (this.canNext) return false;
      this.confirmLoading = true;
      const transfer = new NTransfer({
        chain: "NERVE",
        type: 2
      });
      try {
        const { chainId, assetId } = this.currentAssetInfo;
        const { address } = this.liquidityInfo;
        const { decimals } = this.currentAsset;
        const amounts = nerve.swap.tokenAmount(chainId, assetId, timesDecimals(this.joinCount, decimals));
        const transferInfo = {
          from: this.nerveAddress,
          to: this.nerveAddress,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: timesDecimals(this.joinCount, decimals),
          fee: 0
        }
        const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
        const fromAddress = this.nerveAddress;
        const stablePairAddress = address; // 当前的稳定币地址
        const tokenAmounts = [amounts]; // 当前需要质押的资产
        const deadline = nerve.swap.currentTime() + 300;
        const toAddress = this.nerveAddress;
        const remark = '';
        const tempTxData = await nerve.swap.stableSwapAddLiquidity(fromAddress, stablePairAddress, tokenAmounts, deadline, toAddress, remark);
        const tAssemble = nerve.deserializationTx(tempTxData.hex); // 通过获取tAssemble
        const txData = {
          tAssemble,
          inputs,
          outputs,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address.Ethereum
        }
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          await this.broadcastHex(txHex);
        }
      } catch (e) {
        this.confirmLoading = false;
        console.log(e);
        this.$message({
          message: this.$t(e.message || e),
          type: "warning",
          duration: 2000,
          offset: 30,
        })
      }
    },
    //广播nerve nuls跨链转账交易
    async broadcastHex(txHex) {
      // const url = MAIN_INFO.rpc;
      // const chainId = MAIN_INFO.chainId;
      // const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
      // if (res.result && res.result.hash) {
      //   this.$message({ message: this.$t("交易成功"), type: "success", duration: 2000 })
      // } else {
      //   this.$message({ message: this.$t("交易失败"), type: "warning", duration: 2000 })
      // }
      const res = await this.$request({
        url: '/swap/lp/add',
        data: { txHex }
      });
      if (res.code === 1000) {
        this.$message({
          message: this.$t("tips.tips10"),
          type: "success",
          duration: 2000,
          offset: 30
        });
        this.reset();
        this.confirmLoading = false;
        await this.getLiquidityInfo();
      } else {
        this.$message({
          message: this.$t("tips.tips15"),
          type: "warning",
          duration: 2000,
          offset: 30
        });
        this.confirmLoading = false;
      }
    },
    reset() {
      this.joinCount = '';
    }
  },
  beforeDestroy() {
    if (this.assetTimer) clearInterval(this.assetTimer);
    if (this.infoTimer) clearInterval(this.infoTimer);
    this.assetTimer = null;
    this.infoTimer = null;
  }
}
</script>

<style scoped lang="scss">
.input-cont {
  padding: 0 30px;
  height: 148px;
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
  padding: 40px 30px 50px 35px;
  border-radius: 20px;
  margin-top: 50px;
  border: 1px solid #AAB2C9;
}
.input-item {
  input {
    border: none;
    height: 60px;
    line-height: 60px;
    font-weight: bold;
    font-size: 36px;
    outline:none;
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
</style>