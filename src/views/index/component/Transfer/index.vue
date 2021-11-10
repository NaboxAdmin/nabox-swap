<template>
<!--  :class="{'p-4': !isDapp}" -->
  <div class="bg-white p-transfer">
    <div @click.stop class="position-fixed_loading" @touchmove.prevent v-if="transferLoading" v-loading="transferLoading"/>
    <!--:class="{'mt-2': !isDapp}"-->
    <div class="transfer-cont d-flex align-items-center space-between">
      <div class="sign-cont d-flex align-items-center space-between size-28 text-90 direction-column">
        <div class="">{{ $t("transfer.transfer1") }}</div>
        <span></span>
        <span></span>
        <span></span>
        <div class="mt-1">{{ $t("transfer.transfer2") }}</div>
      </div>
      <div class="coin-cont d-flex direction-column space-between">
        <template>
          <div class="asset-cont" v-if="toNerve">
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
          <div class="asset-cont" v-else>
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
        <div class="position-cont"></div>
        <template>
          <div class="asset-cont" v-if="!toNerve">
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
          <div class="asset-cont" v-else>
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
        <svg t="1627381344617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2109" width="23" height="23"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#6EB6A9" p-id="2110"></path><path d="M610.393043 743.958261a31.165217 31.165217 0 0 1-14.692173-3.561739A31.610435 31.610435 0 0 1 578.782609 712.347826V311.652174a31.833043 31.833043 0 0 1 63.443478 0v341.036522l49.864348-33.613913a31.610435 31.610435 0 1 1 35.394782 52.535652l-99.283478 66.782608a32.055652 32.055652 0 0 1-17.808696 5.565218zM413.606957 743.958261A31.610435 31.610435 0 0 1 381.773913 712.347826V371.311304l-49.864348 33.613913a31.610435 31.610435 0 1 1-35.394782-52.535652l99.283478-66.782608a32.055652 32.055652 0 0 1 32.500869-1.78087A31.610435 31.610435 0 0 1 445.217391 311.652174v400.695652a31.610435 31.610435 0 0 1-31.610434 31.610435z" fill="#FFFFFF" p-id="2111"></path></svg>
      </div>
    </div>
    <div class="asset-cont mt-5 cursor-pointer">
      <span class="size-28 text-90">{{ $t("transfer.transfer3") }}</span>
      <div class="asset-info mt-1" @click="showModal=true">
        <div class="asset-icon">
          <img :src="getPicture(currentCoin && currentCoin.symbol)" @error="pictureError" alt="">
        </div>
        <span class="size-30 ml-12">{{ currentCoin && currentCoin.symbol }}</span>
        <div class="size-30 ml-1 text-90 flex-1">{{ toNerve ? superLong(fromAddress) : superLong(nerveAddress) }}</div>
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
        <input class="font-500 size-38 ml-12"
               v-model="transferCount"
               @input="accountInput"
               placeholder="0"/>
        <span class="size-28 text-primary" @click="maxAmount">{{ $t("transfer.transfer6") }}</span>
      </div>
      <div class="text-red mt-2" v-if="amountMsg">{{ amountMsg }}</div>
    </div>
    <div class="h-16 d-flex align-items-center size-28 space-between mt-4">
      <span v-if="!toNerve" class="text-90">{{ $t("transfer.transfer7") }}</span>
      <div v-if="!toNerve">
        <span class="text-3a" v-if="showFeeLoading"><i class="el-icon-loading"/></span>
        <span class="text-3a" v-else-if="transferFee">{{ transferFee }}</span>
        <span class="text-3a" v-else>--</span>
        <span class="text-primary ml-2 cursor-pointer" @click="showFeeModal=true">{{ $t('transfer.transfer10') }}</span>
      </div>
    </div>
    <div class="btn size-30 cursor-pointer" :class="{opacity_btn: !canNext}" v-if="crossInAuth" @click="approveERC20">{{ $t("transfer.transfer8") }}</div>
    <div class="btn size-30 cursor-pointer" :class="{opacity_btn: !canNext}" v-else @click="next">{{ $t("transfer.transfer9") }}</div>
    <transfer-modal :show-modal.sync="showModal"
                    v-if="showModal"
                    :asset-list="transferAssets"
                    @selectAsset="selectAsset"/>
    <transfer-modal :show-modal.sync="showFeeModal"
                    v-if="showFeeModal"
                    type="feeAssets"
                    :asset-list="transferFeeAssets"
                    @selectAsset="selectFeeAsset"/>
  </div>
</template>

<script>
import {valideNetwork} from "../Swap";
import {debounce, divisionDecimals, getCurrentAccount, supportChainList, Times, timesDecimals, Minus, Plus, genID} from "@/api/util";
import {MAIN_INFO, NULS_INFO} from "@/config";
import {crossFee, ETransfer, getSymbolUSD, swapScale, swapSymbolConfig, NTransfer} from "@/api/api";
import {getContractCallData} from "@/api/nulsContractValidate";
import Modal from "./Modal/Modal";
import {tofix} from "../../../../api/util";

let chainToSymbol = {}
supportChainList.map(v => {
  chainToSymbol[v.value] = v.symbol
});

export default {
  name: "Transfer",
  watch: {
    transferCount: {
      handler(newVal, oldVal) {
        const decimals = this.currentCoin && this.currentCoin.decimals || 8;
        const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
        if (patrn.exec(newVal) || newVal === "") {
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
              this.amount =this.transferCount;
            }
            this.checkTransferFee();
          }
        }
      }
    }
  },
  data() {
    this.getFeeDebounce = debounce(this.getTransferFee(), 500);
    this.getAllowanceTimer = null; // 查询授权额度定时器
    return {
      currentCoin: null, // 当前网络上面选择的USDT
      toNerve: true, // 是否是转入NERVE
      transferFee: 0,  // 交易手续费
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
      USDTasset: null, // 当前稳定比资产信息
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
      userAvailable: 0
    }
  },
  components: {
    TransferModal: Modal
  },
  created() {
    !this.toNerve && this.getMainAssetInfo();
    this.getTransferAsset();
    // this.getLiquidityInfo();
  },
  computed: {
    canNext() {
      if (this.toNerve) {
        return !this.showFeeLoading && this.transferCount && !this.amountMsg && Number(this.transferCount)
      }
      return !this.showFeeLoading && this.transferCount && !this.amountMsg && Number(this.transferCount) && this.transferFee;
    },
  },
  methods: {
    // 获取当前NERVE地址下面的所有主资产信息
    async getMainAssetInfo() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAsset = config[this.currentFeeChain];
      const accountInfo = await this.$request({ // 获取主资产信息
        url: "/asset/nerve/chain/main",
        data: {
          address: this.nerveAddress
        },
      });
      this.allTransferFeeAssets = accountInfo.data.map(item => ({
        ...item,
        userBalance: this.numberFormat(tofix(divisionDecimals(item.balance, item.decimals), 6, -1) || 0, 6)
      }));
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
        this.transferFee = await this.getCrossOutFee(true);
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
      const tempNetwork = this.toNerve ? this.fromNetwork : "NERVE";
      this.isMainAsset = config[tempNetwork].assetId === asset.assetId && config[tempNetwork].chainId === asset.chainId;
      this.transferCount = '';
      this.transferFee = '';
      this.currentCoin = asset;
      await this.getCurrentAssetInfo(false, asset);
      if (this.currentCoin && this.currentCoin.assetId === 0 && tempNetwork !== "NULS") {
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
        const tempNetwork = this.toNerve ? this.fromNetwork : "NERVE";
        const data = {
          fromChain: this.toNerve ? this.fromNetwork : 'NERVE',
          toChain: this.toNerve ? 'NERVE' : this.fromNetwork,
          address: this.toNerve ? this.fromAddress : this.nerveAddress
        }
        const res = await this.$request({
          url: '/swap/cross/assets',
          data,
        });
        if (res.code === 1000 && res.data) {
          this.transferAssets = res.data.map(asset => ({
            ...asset,
            userBalance: this.numberFormat(tofix(divisionDecimals(asset.balance, asset.decimals), 6, -1) || 0, 6)
          }));
        // .filter(item => item.nulsCross && item.heterogeneousList)
          if (!this.currentCoin) {
            this.currentCoin = !this.currentCoin && (this.transferAssets.find(asset => asset.symbol === 'USDT' && asset.registerChain === this.fromNetwork) || this.transferAssets[0]) || this.currentCoin;
          }
          this.isMainAsset = config[tempNetwork].assetId === this.currentCoin.assetId && config[tempNetwork].chainId === this.currentCoin.chainId;
          await this.getCurrentAssetInfo(false, this.currentCoin);
          // this.available = this.currentCoin.userBalance;
          if (this.currentCoin && this.currentCoin.assetId === 0 && tempNetwork !== "NULS") {
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
    // 获取pool流动性信息
    async getLiquidityInfo() {
      const res = await this.$request({
        method: "get",
        url: '/swap/usdn/info'
      });
      if (res.code === 1000 && res.data) {
        const tempData = res.data.lpCoinList;
        this.USDTasset = tempData.find(item => item.chain === this.$store.state.network) || null;
        await this.getCurrentAssetInfo();
        if (this.assetTimer) {
          clearInterval(this.assetTimer);
          this.assetTimer = null;
        }
        this.assetTimer = setInterval(async () => {
          await this.getCurrentAssetInfo(true);
        }, 15000);
      }
    },
    maxAmount() {
      if (!this.available) return;
      this.maxClick = true;
      if (this.toNerve && this.$store.state.network === "NULS") {
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

    async getCurrentAssetInfo(refresh = false, assetInfo) {
      try {
        if (!refresh) {
          this.availableLoading = true;
        }
        const { chainId, assetId, contractAddress } = assetInfo;
        const tempNetwork = this.toNerve ? this.fromNetwork : "NERVE";
        const address = this.currentAccount.address[tempNetwork];
        // 关注当前资产
        // !refresh && await this.focusAsset(tempNetwork, this.USDTasset);
        if (tempNetwork === "NERVE") {
          const data = {
            address,
            assetId,
            chainId,
            chain: tempNetwork,
            refresh: true,
          }
          const res = await this.$request({
            url: "/wallet/address/asset",
            data
          });
          if (res.code === 1000) {
            // this.currentCoin = res.data;
            this.clearGetAllowanceTimer();
            // assset.assetId为0 则为异构链上token资产
            if (res.data && res.data.assetId === 0 && tempNetwork !== "NULS") {
              await this.checkCrossInAuthStatus();
            } else {
              this.crossInAuth = false;
            }
            this.available = res.data && divisionDecimals(res.data.balance, res.data.decimals) || 0;
            this.userAvailable = res.data && tofix(divisionDecimals(res.data.balance, res.data.decimals), 6, -1) || 0;
            this.availableLoading = false;
            !this.toNerve && !refresh && await this.getTransferFee();
          }
        } else {
          const data = {
            address,
            assetId,
            chainId,
            contractAddress,
            chain: tempNetwork,
            refresh: true,
          }
          const res = await this.$request({
            url: "/wallet/address/asset",
            data
          });
          if (res.code === 1000) {
            // this.currentCoin = res.data;
            this.clearGetAllowanceTimer();
            // assset.assetId为0 则为异构链上token资产
            if (res.data && res.data.assetId === 0 && tempNetwork !== "NULS") {
              await this.checkCrossInAuthStatus();
            } else {
              this.crossInAuth = false;
            }
            this.available = res.data && divisionDecimals(res.data.balance, res.data.decimals) || 0;
            this.userAvailable = res.data && tofix(divisionDecimals(res.data.balance, res.data.decimals), 6, -1);
            this.availableLoading = false;
            !this.toNerve && !refresh && await this.getTransferFee();
          } else {
            this.availableLoading = false;
          }
        }
      } catch (e) {
        this.availableLoading = false;
        console.log(e);
      }
    },
    // 关注资产
    async focusAsset(network, asset) {
      const tempNetwork = this.toNerve ? network : "NERVE";
      let chainId, assetId;
      if (tempNetwork==='NERVE') {
        chainId = asset.chainId;
        assetId = asset.assetId
        // const infoParams = {
        //   network: network,
        //   assetsChainId: asset.chainId,
        //   assetsId: asset.assetId,
        //   contractAddress: asset.contractAddress || ""
        // }
        // const res = await getAssetNerveInfo(infoParams); // 查询nerve的usdt资产信息
        // if (res) {
        //
        // }
      } else { // 异构链关注资产
        // const params = {
        //   address: this.currentAccount['address'][network],
        //   chain: network,
        //   contractAddress: asset.contractAddress || "",
        //   chainId: asset.heterogeneousChainId,
        //   refresh: true
        // }
        // const tempRes = await this.$request({
        //   url: '/wallet/address/asset',
        //   data: params
        // });
        // if (tempRes.code===1000 && tempRes.data) {
        //   chainId = tempRes.data.chainId;
        //   assetId = tempRes.data.assetId;
        // }
      }
      const focusParams = {
        address: this.currentAccount['address'][network],
        assetId,
        chainId,
        chain: network,
        contractAddress: asset.contractAddress || "",
        focus: true
      };
      await this.$request({ url: "/wallet/address/asset/focus", data: focusParams });
    },
    // nerve to
    switchToNerve() {
      this.toNerve = !this.toNerve;
      this.transferCount = "";
      this.showFeeLoading = false;
      this.transferFee = "";
      this.available = 0;
      this.amountMsg = "";
      this.currentCoin = null;
      // this.getCurrentAssetInfo();
      this.getTransferAsset();
      !this.toNerve && this.getMainAssetInfo();
    },

    // 获取转账的资产列表
    async getCoins(network = '', address = '') {
      const res = await this.$request({
        url: "/wallet/address/assets",
        data: {
          chain: network || this.fromNetwork || '',
          address: address || this.fromAddress
        }
      });
      if (res.code === 1000) {
        const tempFromNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
        const coins = res.data.filter(v => valideNetwork.indexOf(v.registerChain) > -1);
        this.clearGetAllowanceTimer();
        this.currentCoin = coins && coins.find(coin => coin.symbol === "NVT") || null;
        // assset.assetId为0 则为异构链上token资产
        if (this.currentCoin && this.currentCoin.assetId === 0 && tempFromNetwork !== "NULS") {
          await this.checkCrossInAuthStatus();
        } else {
          this.crossInAuth = false;
        }
        this.available = this.currentCoin && divisionDecimals(this.currentCoin.balance, this.currentCoin.decimals) || 0;
        !this.toNerve && await this.getTransferFee();
      }
    },
    // 输入转账
    accountInput(e) {
      this.maxClick = false;
      if (this.$store.fromNetwork === "NULS") {
        this.getFeeDebounce();
      } else {
        if (this.transferCount === "" || (Number(this.transferCount) < 0)) {
          this.transferCount = "";
          // this.transferFee = "";
          this.amountMsg = "";
          return false
        }
        if (!this.toNerve && this.transferFee) {
          this.checkTransferFee()
        } else if (this.toNerve) {
          this.checkTransferFee()
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
        this.clearGetAllowanceTimer();
      }
    },

    // 获取跨链费用
    async getTransferFee() {
      try {
        if (!this.currentCoin) return;
        this.showFeeLoading = true;
        this.amountMsg = "";
        const nerveToNulsFee = crossFee + "NVT" + "+" + crossFee + "NULS"; // nerve -> nuls的手续费
        const nulsToNerveFee = crossFee + "NULS"; // nuls -> nerve的手续费
        // const pubKey = getCurrentAccount(this.fromAddress).pub;
        // const accountInfo = await this.$request({ // 获取主资产信息
        //   url: "/wallet/chain/main",
        //   data: { pubKey },
        // });
        // this.storeAccountInfo = accountInfo.data; // 主资产信息
        // 从其他链跨链转账到nerve
        if (this.toNerve) {
          if (this.$store.state.network === "NULS") { // NULS跨链转入NERVE 为默认手续费
            let crossInFee = nulsToNerveFee;
            this.NULSContract = !!this.currentCoin.contractAddress;
            if (this.currentCoin.contractAddress) {
              this.NULSContract = true;
              crossInFee = await this.getContractCallData();
              if (crossInFee) {
                crossInFee = crossInFee + "NULS";
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
          if (this.$store.state.network === "NULS") {
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
      const tempFromNetwork = this.toNerve ? this.fromNetwork : "NERVE";
      const temToNetwork = this.toNerve ? "NERVE" : this.fromNetwork;
      const asset = this.currentCoin; // 当前需要转入的资产
      const assetSymbol = asset.symbol;
      const feeList = this.transferFee && this.transferFee.split("+");
      const config = JSON.parse(sessionStorage.getItem("config"));
      const mainAssetInfo = config[tempFromNetwork]; // 发起链主资产
      const isMainAsset = assetSymbol === mainAssetInfo.symbol; // 是否为主资产
      if (tempFromNetwork === "NERVE") {
        if (temToNetwork === "NULS") {
          if (assetSymbol === "NULS") {
            if (Minus(Plus(this.transferCount, crossFee), this.available) > 0) flag = false;
          } else {
            const nulsBalance = await this.getNulsInfo(this.nerveAddress);
            if (nulsBalance - crossFee < 0) flag = false;
          }
          if (!this.checkFee(crossFee, isMainAsset)) {
            flag = false
          }
        } else {
          const { value } = this.splitFeeSymbol(this.transferFee);
          console.log(value, 'this,transferFee')
          if (!this.checkFee(value, isMainAsset)) {
            flag = false
          }
        }
      } else if (tempFromNetwork === "NULS") {
        let nulsFee
        feeList.map(v => {
          const { symbol, value } = this.splitFeeSymbol(v);
          if (symbol === "NULS") {
            nulsFee = value;
          }
        })
        if (!this.checkFee(nulsFee, isMainAsset)) {
          flag = false
        }
      } else {
        if (temToNetwork === "NERVE") {
          const { value } = this.splitFeeSymbol(this.transferFee);
          // flag = this.checkFee(value, isMainAsset)
          if (!this.checkFee(value, isMainAsset)) {
            flag = false
          }
        }
      }
      this.amountMsg = flag ? "" : (!this.toNerve && this.$t("tips.tips8") || this.$t("tips.tips9"));
    },

    // 验证主资产是否够手续费/手续费+转账数量
    checkFee(fee, isMainAsset) {
      let flag = true;
      const tempNetwork = this.toNerve ? this.fromNetwork : this.currentFeeChain;
      // const fromChainInfo = !this.toNerve && this.storeAccountInfo.filter(v => v.chain === tempNetwork)[0];
      // const fromChainBalance = !this.toNerve && divisionDecimals(fromChainInfo.balance, fromChainInfo.decimals);
      const feeChainBalance = !this.toNerve &&  divisionDecimals(this.currentFeeAsset.balance, this.currentFeeAsset.decimals) || 0;
      if (this.toNerve) {
        if (isMainAsset) {
          if (Minus(Plus(this.transferCount, fee), this.available) > 0) flag = false;
        } else {
          // Minus(fromChainBalance, fee) < 0 ||
          if (Minus(this.transferCount, this.available) > 0) flag = false;
        }
      } else {
        if (isMainAsset && this.currentFeeAsset.chain === tempNetwork) {
          console.log('2234')
          if (Minus(Plus(this.transferCount, fee), this.available) > 0) flag = false;
        } else {
          if (Minus(feeChainBalance, fee) < 0 || Minus(this.transferCount, this.available) > 0) flag = false;
        }
      }
      return flag
    },

    /**
     * 查询nerve链上nuls余额
     * @param address //nerveAddress
     */
    async getNulsInfo(address) {
      const data = {
        address,
        assetId: NULS_INFO.assetId,
        chainId: NULS_INFO.chainId,
        chain: "NERVE",
        refresh: true,
      }
      const res = await this.$request({
        url: "/wallet/address/asset",
        data
      });
      let balance = 0;
      if (res.code === 1000) {
        balance = divisionDecimals(res.data.balance, res.data.decimals);
      }
      return balance;
    },

    // 查询nerve链上nvt余额
    getNvtBalanceInfo() {
      const nvtInfo = this.storeAccountInfo.filter(v => v.chain === "NERVE")[0];
      // nerve链上nvt余额
      return divisionDecimals(nvtInfo.balance, nvtInfo.decimals);
    },

    // nerve转出到异构链手续费
    async getCrossOutFee(boo=false) { // toNerve=false
      if (boo) {
        this.showFeeLoading = true;
      }
      const tempFromNetwork = this.toNerve ? this.fromNetwork : "NERVE";
      const temToNetwork = this.toNerve ? "NERVE" : this.fromNetwork;
      const asset = this.currentCoin;
      const assetHeterogeneousInfo = asset.heterogeneousList.filter(
          (v) => v.chainName === temToNetwork
      )[0];
      const config = JSON.parse(sessionStorage.getItem('config'));
      const mainAsset = config['NERVE'];
      const isToken = assetHeterogeneousInfo && assetHeterogeneousInfo.token;
      const transfer = new ETransfer({chain: temToNetwork});
      const { decimals, chainId, assetId } = this.currentFeeAsset;
      const feeIsNvt = chainId === mainAsset.chainId && assetId === mainAsset.assetId;
      let feeUSD = await getSymbolUSD(this.currentFeeChain); // 获取手续费资产稳定币价格
      feeUSD = feeUSD + "";
      let heterogeneousChainUSD = await getSymbolUSD(temToNetwork);
      heterogeneousChainUSD = heterogeneousChainUSD + "";
      let res;
      if (this.currentFeeChain === temToNetwork) {
        res = await transfer.calWithdrawFee(
            "",
            "",
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
      let nvtFee = this.floatToCeil(res, this.currentFeeAsset.decimals); // 异构跨链手续费-nvt
      this.withdrawalFee = nvtFee;
      if (boo) {
        this.showFeeLoading = false;
      }
      console.log(this.withdrawalFee, this.currentFeeAsset, 'this.withdrawalFee')
      return nvtFee + chainToSymbol[this.currentFeeChain];
    },

    floatToCeil(num, decimal = 6) {
      return Math.ceil(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
    },

    // 异构链转入nerve手续费
    async getCrossInFee() {
      const tempFromNetwork = this.toNerve ? this.fromNetwork : "NERVE";
      const assetHeterogeneousInfo = this.currentCoin && this.currentCoin.heterogeneousList.filter(
          (v) => v.chainName === tempFromNetwork
      )[0];
      const isToken = assetHeterogeneousInfo && assetHeterogeneousInfo.token;
      const gasLimit = isToken ? "150000" : "33594";
      const transfer = new ETransfer();
      let fee = await transfer.getGasPrice(gasLimit);
      return fee + chainToSymbol[tempFromNetwork];
    },

    // 查询兑换一定数量nvt需要花费的异构链主资产数量
    async getSwapCost(amount) {
      const tempFromNetwork = this.toNerve ? this.$store.state.network : "NERVE";
      const tempToNetwork = this.toNerve ? "NERVE" : this.$store.state.network;
      const config = JSON.parse(sessionStorage.getItem("config"));
      const swapAssetInfo = config[tempFromNetwork]; // 需要兑换的资产信息
      const nerveInfoParams = {
        assetsChainId: swapAssetInfo.chainId,
        assetsId: swapAssetInfo.assetId,
      };
      const { chainId, assetId } = await this.getAssetNerveInfo(nerveInfoParams);
      // console.log(amount, 123465, swapScale, Times(amount, swapScale))
      const swapAmount = timesDecimals(Times(amount, swapScale), 8).split(".")[0];
      const nerveAddress = getCurrentAccount(this.fromAddress).address.NERVE;
      const params = {
        address: nerveAddress,
        toAmount: swapAmount,
        fromToken: {
          symbol: swapSymbolConfig[swapAssetInfo.symbol],
          chainId: chainId,
          assetId: assetId
        },
        toToken: {
          symbol: "NVT",
          chainId: MAIN_INFO.chainId,
          assetId: MAIN_INFO.assetId
        }
      }
      const res = await this.$request({
        url: "/tx/quantity",
        data: params
      });
      if (res.code === 1000 && res.data.data) {
        return res.data.data.quantityPlain
      } else {
        throw res.data
      }
    },

    //nuls合约资产跨链 计算手续费&其他信息
    async getContractCallData() {
      const currentAccount = getCurrentAccount(this.fromAddress);
      const NERVEAddress = currentAccount.address.NERVE;
      const price = 25;
      const res = await getContractCallData(
          this.fromAddress,
          NERVEAddress,
          price,
          this.currentCoin.contractAddress,
          "transferCrossChain",
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
          type: "warning",
          duration: 2000,
          offset: 30
        });
        return null;
      }
    },

    splitFeeSymbol(str) {
      if (!str) return { value: 0 }
      return {
        symbol: str.match(/[a-z|A-Z]+/gi)[0],
        value: str.match(/[\d|.]+/gi)[0],
      };
    },

    // 下一步
    async next() {
      if (!this.canNext) return false;
      this.transferLoading = true;
      const currentAccount = getCurrentAccount(this.fromAddress);
      const asset = this.currentCoin;
      // const nerveInfoParams = {
      //   contractAddress: asset.contractAddress,
      //   assetsChainId: asset.chainId,
      //   assetsId: asset.assetId,
      // }
      // const { chainId, assetId } = await this.getAssetNerveInfo(
      //     nerveInfoParams
      // );
      const { nerveChainId: chainId, nerveAssetId: assetId } = this.currentCoin;
      const tempFromNetwork = this.toNerve && this.$store.state.network || "NERVE";
      const tempToNetwork = this.toNerve && "NERVE" || this.$store.state.network;
      const config = JSON.parse(sessionStorage.getItem("config"));
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
        asset,
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
        fee: baseCrossFee,
        // type: 10
      }
      // 跨链转入
      // 提现
      let crossOutInfo
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
          heterogeneousChainId: heterogeneousChain_Out && heterogeneousChain_Out.heterogeneousChainId,
        };
        crossOutInfo = {
          from: nerveAddress,
          assetsChainId: chainId,
          assetsId,
          amount,
          fee: 0,
          proposalPrice,
          txData,
          // type: 43
        }
      }
      if (tempFromNetwork === "NERVE") {
        if (tempToNetwork === "NULS") {
          transferInfo.crossInfo = crossInfo
        } else {
          transferInfo.crossOutInfo = crossOutInfo
        }
      } else if (tempFromNetwork === "NULS") {
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
            fee: timesDecimals(0.1, MAIN_INFO.decimal),
            // type: 16
          }
        } else {
          crossInfo.to = nerveAddress
          transferInfo.crossInfo = crossInfo
        }
        if (tempToNetwork !== "NERVE") {
          transferInfo.crossOutInfo = crossOutInfo
        }
      } else {
        // 异构链跨链转入nerve
        const heterogeneousChain_In = asset.heterogeneousList.filter(
            (v) => v.chainName === tempFromNetwork
        )[0];
        transferInfo.crossInInfo = {
          multySignAddress: heterogeneousChain_In.heterogeneousChainMultySignAddress,
          nerveAddress: nerveAddress,
          numbers: this.transferCount,
          fromAddress: from,
          contractAddress: heterogeneousChain_In.contractAddress,
          decimals: asset.decimals
        };
        if (tempToNetwork !== "NERVE") {
          if (tempToNetwork !== "NULS") {
            transferInfo.crossOutInfo = crossOutInfo
          } else {
            crossInfo.from = nerveAddress
            transferInfo.crossInfo = crossInfo
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
        crossInInfo, // 异构链转入
      } = this.transferInfo;
      if (fromChain === "NERVE") { // 转出
        let type, transferInfo;
        if (toChain === "NULS") {
          type = 10; // 跨链交易
          transferInfo = crossInfo;
        } else {
          type = 43; // 跨链转出异构连
          transferInfo = crossOutInfo;
        }
        const txData = transferInfo.txData || {}
        await this.constructTx(fromChain, type, transferInfo, txData, this.$t("transfer.transfer5"), true);
      } else {
        // 异构链转入
        await this.constructCrossInTx(crossInInfo, this.$t("transfer.transfer2"));
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
      const fn = async () => {
        const { pub, signAddress } = this.transferInfo;
        const transfer = new NTransfer({ chain, type });
        transferInfo = {
          ...transferInfo,
          feeAsset: {
            chainId: this.currentFeeAsset.chainId,
            assetId: this.currentFeeAsset.assetId
          }
        }
        const inputOutput = await transfer.WithdrawalTransaction(transferInfo);
        // return false;
        const data = {
          inputs: inputOutput.inputs,
          outputs: inputOutput.outputs,
          txData,
          pub,
          signAddress,
        };
        this.txHex = await transfer.getTxHex(data);
        console.log(this.txHex, "==this.txHex==")
        return this.txHex;
      }
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
      const fn = async () => await transfer.crossIn(crossInInfo);
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
        txHash: "", // 第一条交易hash
      }
      try {
        //  调用metamask转账/签名hash
        let res = await this.transactionInfo.fn();
        if (!this.toNerve) {
          await this.broadcastHex(broadcastData);
        } else {
          if (res) {
            console.log(res, 'res')
            this.txHex = res.raw;
            broadcastData.txHash = res.hash;
            if (res.hash) {
              this.$message({
                message: this.$t("tips.tips10"),
                type: "success",
                offset: 30
              });
              this.transferLoading = false;
              this.reset();
              await this.broadcastToNerveHex(broadcastData);
            } else {
              throw this.$t("tips.tips15");
            }
          }
        }
      } catch (e) {
        console.error("error: " + e);
        this.transferLoading = false;
        this.$message({
          message: e.message || this.$t("tips.tips15"),
          type: "warning",
          duration: 2000,
          offset: 30
        });
      }
    },
    // 广播nerve跨链转出交易
    async broadcastHex(data) {
      const { fromChain, toChain, assetId, chainId, amount, contractAddress, fromAddress, toAddress } = data;
      const params = {
        fromChain,
        toChain,
        assetId,
        chainId,
        amount,
        contractAddress,
        fromAddress,
        toAddress,
        txHex: this.txHex
      };
      const res = await this.$request({
        url: '/swap/cross',
        data: params
      });
      if (res.code === 1000 && res.data) {
        this.$message({
          message: this.$t("tips.tips10"),
          type: "success",
          offset: 30
        });
        this.reset();
      } else {
        throw this.$t("tips.tips15");
      }
      this.transferLoading = false;
    },
    // 广播异构链跨链转入交易
    async broadcastToNerveHex(data) {
      const { fromChain, toChain, assetId, chainId, amount, contractAddress, fromAddress, toAddress, txHash } = data;
      const params = {
        fromChain,
        toChain,
        assetId,
        chainId,
        amount,
        contractAddress,
        fromAddress,
        toAddress,
        txHash,
        txHex: this.txHex
      };
      await this.$request({
        url: '/swap/cross/plugin',
        data: params
      });
    },
    // 异构链token资产转入nerve授权
    async approveERC20() {
      if (!this.canNext) return false;
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
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            duration: 2000,
            offset: 30
          });
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
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
      }, 3000)
    },
    clearGetAllowanceTimer() {
      if (!this.getAllowanceTimer) return;
      clearInterval(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    },
    /**
     * 获取资产在nerve链上的信息
     * @param data.contractAddress //token资产合约地址
     * @param data.assetsChainId //非token资产链id
     * @param data.assetsId //非token资产资产id
     */
    async getAssetNerveInfo(data) {
      const tempFromNetwork = this.toNerve ? this.fromNetwork : 'NERVE';
      const tempToNetwork = this.toNerve ? 'NERVE' : this.fromNetwork
      if (tempFromNetwork === "NULS" || tempFromNetwork === "NERVE") {
        return {
          chainId: data.assetsChainId,
          assetId: data.assetsId
        }
      }
      let result = null;
      let params = {};
      if (data.contractAddress) {
        const config = JSON.parse(sessionStorage.getItem("config"));
        const mainAsset = config[this.fromNetwork]; // 来源链(eth,bnb,heco)主资产信息
        params = {
          chainId: mainAsset.chainId,
          contractAddress: data.contractAddress,
        };
      } else {
        params = { chainId: data.assetsChainId, assetId: data.assetsId };
      }
      //console.log(params);
      try {
        const res = await this.$request({
          url: "/asset/nerve/chain/info",
          data: params,
        });
        //console.log(res);
        if (res.code === 1000) {
          result = res.data;
        }
      } catch (e) {
        console.error(e);
      }
      return result;
    },
    reset() {
      this.transferCount = '';
      this.transferFee = '';
      // this.getCoins();
      // this.getCurrentAssetInfo();
      this.getTransferAsset();
    }
  },
  beforeDestroy() {
    if (this.assetTimer) {
      clearInterval(this.assetTimer);
      this.assetTimer = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import "index";
</style>