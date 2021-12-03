<template>
  <div>
    <div class="vaults-cont">
      <div class="position-fixed_loading" @touchmove.prevent v-if="showLoading" v-loading="showLoading"></div>
      <div class="coin-info">
<!--        <div class="detail-info">-->
<!--          <span class="size-28">L2 ID: {{ superLong(nerveAddress) }}</span>-->
<!--          <span class="icon ml-35" @click="crossOut">-->
<!--            <svg t="1627381264959" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1769" width="18" height="18"><path d="M193.794931 34.540951l28.424555 56.84911c-67.08195 28.424555-299.02632 154.345334-183.906872 515.621431 2.55821 4.832174 9.948594 7.390384 12.79105 0 21.034171-227.396441 160.030246-282.255833 267.759309-325.461157l26.719082 52.585427a26.150591 26.150591 0 0 0 43.205324 0l113.698221-212.331427a39.510132 39.510132 0 0 0-28.424556-56.84911L219.945521 0.71573a23.308135 23.308135 0 0 0-26.15059 33.825221z" fill="#FFFFFF" p-id="1770"></path><path d="M457.006311 495.30299h181.632908a46.332025 46.332025 0 0 1 38.94164 51.164199 46.61627 46.61627 0 0 1-38.94164 51.164199h-181.632908a46.332025 46.332025 0 0 1-38.94164-51.164199 46.047779 46.047779 0 0 1 38.94164-51.164199z" fill="#FFFFFF" p-id="1771"></path><path d="M510.16023 1023.999716a505.388591 505.388591 0 0 1-387.710933-180.495925 51.164199 51.164199 0 0 1 78.451772-65.944968A403.912929 403.912929 0 1 0 706.005415 164.725414a51.164199 51.164199 0 0 1 50.027217-89.537349A506.241327 506.241327 0 0 1 510.16023 1023.999716z" fill="#FFFFFF" p-id="1772"></path></svg>-->
<!--          </span>-->
<!--          <span class="icon ml-3" @click="crossIn">-->
<!--            <svg t="1627381295687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1939" width="18" height="18"><path d="M323.36059 579.128406l-28.444421-56.888841c67.413277-28.444421 300.088639-154.737649 184.60429-517.119569-2.559998-4.835552-10.239991-7.679994-12.799989 0-21.333316 227.555366-160.426533 284.444207-268.799776 326.257506l-27.591088-53.475511a26.453311 26.453311 0 0 0-43.519964 0l-113.777683 213.048711a39.537745 39.537745 0 0 0 28.444421 56.888841l255.999787 64.284391a23.324425 23.324425 0 0 0 25.884423-32.995528z" fill="#FFFFFF" p-id="1940"></path><path d="M457.9027 498.630696h182.044292a44.657741 44.657741 0 0 1 38.968857 48.639959A44.657741 44.657741 0 0 1 639.946992 597.332836h-182.044292a44.657741 44.657741 0 0 1-38.968857-48.924404 44.657741 44.657741 0 0 1 38.968857-49.777736z" fill="#FFFFFF" p-id="1941"></path><path d="M511.093766 1023.999147a505.172912 505.172912 0 0 1-386.844122-180.053184 48.924404 48.924404 0 1 1 74.808827-62.862169A407.892993 407.892993 0 1 0 709.066935 162.133198a48.639959 48.639959 0 1 1 47.502182-85.333262A505.172912 505.172912 0 0 1 511.093766 1023.999147z" fill="#FFFFFF" p-id="1942"></path></svg>-->
<!--          </span>-->
<!--        </div>-->
      </div>
      <div class="bg-f0">
        <div class="main-cont pb-3 pt-3">
          <div class="font-500 size-38 text-white text-center">${{ (allTvl || 0) | numFormat }}</div>
          <div class="text-center size-24 mt-1 text-e9">TVL</div>
        </div>
      </div>
    </div>
    <div class="detail-cont">
      <div class="tab ml-3 mr-3 d-flex align-items-center">
        <span class="size-30 text-90 cursor-pointer"
              @click="checkTab(index)"
              :class="{ 'active': index===currentIndex, 'ml-53': index===1 }"
              v-for="(item, index) in checkList"
              :key="index">
          {{ item }}
        </span>
        <div class="flex-1"/>
        <div class="switch-cont" @click="switchFarmType">
          <span :class="{ active_color: networkType==='L1' }">L1</span>
          <span :class="{ active_color: networkType==='L2' }">L2</span>
        </div>
      </div>
      <Progress v-if="currentIndex===0"
                :farm-list="farmList"
                :farmLoading="farmLoading"
                @stakeApprove="stakeApprove"
                @receiveApprove="receiveApprove"
                @receiveClick="progressReceive"
                @confirmUnlocked="progressReceive"
                @showClick="showClick"/>
      <Over v-if="currentIndex===1"
            :farm-list="farmList"
            :farmLoading="farmLoading"
            :network-type="networkType"
            @receiveApprove="receiveApprove"
            @receiveClick="progressReceive"
            @confirmUnlocked="progressReceive"
            @showClick="showClick"/>
    </div>
    <PopUp :show="showPop">
      <div class="pop-cont">
        <div class="size-36 font-500">{{ $t("vaults.vaults4") }}</div>
        <div class="text-right mt-2 text-90 size-26" v-if="vaultsType==='increase'">{{ $t("vaults.vaults5") }}：{{ assetsItem && assetsItem.balance || 0 }}</div>
        <div class="text-right mt-2 text-90 size-26" v-else>{{ $t("vaults.vaults5") }}：{{ assetsItem && assetsItem.amount || 0 }}</div>
        <div class="input-cont">
          <input :placeholder="$t('vaults.vaults9')"
                 @input="lpInput"
                 v-model="lpCount">
          <span @click="maxCount">{{ $t("vaults.vaults6") }}</span>
        </div>
        <div class="text-red mt-2" v-if="amountMsg">{{ amountMsg }}</div>
        <div class="pop-btn d-flex align-items-center space-between mt-4">
          <div class="btn" @click="showPop = false; lpCount=''; amountMsg=''">{{ $t("vaults.vaults7") }}</div>
          <div class="btn btn_active" v-if="!needAuth" @click="confirm">{{ $t("vaults.vaults8") }}</div>
          <div class="btn btn_active" v-if="needAuth" @click="approveERC20">{{ $t("vaults.over6") }}</div>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import {PopUp} from "@/components";
import Progress from "./Progress";
import Over from "./Over";
import { currentNet, MAIN_INFO } from "@/config";
import {divisionDecimals, getAssetNerveInfo, Minus, timesDecimals, tofix} from "@/api/util";
import {ETransfer, NTransfer, getBatchLockedFarmInfo, getBatchERC20Balance} from "@/api/api";
import {ethers} from "ethers";
import {txAbi} from "@/api/contractConfig";

const nerve = require('nerve-sdk-js');
const transfer = new NTransfer({
  chain: "NERVE",
  type: 2
});
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: "Vaults",
  components: { PopUp, Progress, Over },
  data() {
    return {
      checkList: [this.$t("vaults.vaults2"), this.$t("vaults.vaults3")],
      currentIndex: 0,
      showPop: false,
      showDropList: false,
      liquidityInfo: null, // 当前已添加流动性资产信息
      lpCount: '', // 当前选择质押的数量
      addedLiquidityInfo: null, // 当前已添加的流动性资产（USDN）
      vaultsType: '', // 挖矿类型 增加/减少
      stakedAsset: null, // 当前farm已质押资产
      amountMsg: '', // 错误提示
      awardAssetInfo: null, // 奖励的nabox资产信息
      allTvl: 0, // 总锁定价值
      farmList: [],
      currentFarmHash: '', // 当前的farmHash
      showLoading: false,
      syrupAsset: null,
      assetsItem: null,
      timer: null,
      timer1: null,
      needAuth: true, // 是否需要授权
      farmLoading: false,
      authRefresh: true, // 授权后刷新
      currentFarm: null, // 当前操作的farm
      receiveNeedAuth: false, // 领取是否需要授权
      isFirstRequest: true, // 是否为第一次请求
      networkType: "L1"
    }
  },
  created() {
    // this.getLiquidityInfo();
    this.getFarmInfo(true);
    this.getTvlInfo();
    this.timer = setInterval(() => {
      this.getFarmInfo(this.currentIndex===0, true);
      this.getTvlInfo();
    }, 15000);
  },
  watch: {
    currentAccount: {
      handler(val) {
        if (val) {
          this.refreshData()
        }
      },
      deep: true
    },
    fromNetwork: {
      handler(val) {
        val && this.refreshData()
      }
    },
    lpCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = this.stakedAsset.decimals || 8;
          const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
          if (patrn.exec(newVal) || newVal === "") {
            this.lpCount = newVal;
          } else {
            this.lpCount = oldVal;
          }
        } else {
          this.lpCount = "";
        }
      },
      deep: true
    },
    "$store.state.lang": {
      handler(val) {
        this.checkList = [this.$t("vaults.vaults2"), this.$t("vaults.vaults3")]
      }
    }
  },
  computed: {
    nerveAddress() {
      return this.currentAccount && this.currentAccount.address['NERVE'] || ''
    }
  },
  methods: {
    switchFarmType() {
      if (this.networkType==='L1') {
        this.networkType = 'L2'
      } else {
        this.networkType = 'L1'
      }
      this.getFarmInfo(true);
    },
    // 转出
    crossOut() {
      this.$router.push({ name: 'transfer', params: { nerveTo: 'true' } });
    },
    // 转入
    crossIn() {
      this.$router.push({ path: '/transfer' });
    },
    // 刷新数据
    async refreshData() {
      await this.getFarmInfo(true);
      await this.getTvlInfo();
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getFarmInfo(this.currentIndex===0, true);
      }, 10000);
    },
    // 质押/退出质押
    async showClick({ type, farmHash, item }) {
      this.showPop = true;
      this.vaultsType = type;
      this.currentFarmHash = farmHash;
      this.currentFarm = item;
      this.stakedAsset = item.stakedAsset;
      if (item.chain === "NERVE") {
        if (this.timer1) clearTimeout(this.timer1);
        this.needAuth = false
      } else {
        this.needAuth = false
      }
      if (type==="increase") {
        this.assetsItem = item.stakedAsset;
      } else {
        this.assetsItem = item;
      }
    },
    // 资产授权
    async approveERC20() {
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = this.assetsItem.contractAddress;
        const res = await transfer.approveERC20(
            contractAddress,
            this.currentFarmHash,
            this.currentAccount.address.Ethereum
        );
        if (res.hash) {
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            offset: 30,
            duration: 2000,
          });
          await this.setGetERC20Allowance();
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
            offset: 30,
            duration: 2000 });
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e);
        this.$message({
          message: e.message,
          type: "warning",
          offset: 30,
          duration: 2000 });
        this.showPop = false;
        this.showLoading = false;
      }
    },

    async setGetERC20Allowance() {
      if (this.timer1) clearTimeout(this.timer1);
      const transfer = new ETransfer();
      this.needAuth = await transfer.getERC20Allowance(
          this.assetsItem.contractAddress,
          this.currentFarmHash,
          this.currentAccount.address.Ethereum
      );
      if (!this.needAuth) {
        this.authRefresh = false;
      }
      if (this.authRefresh) {
        this.timer1 = setTimeout(() => {
          this.setGetERC20Allowance()
        }, 5000);
      }
    },

    async getTvlInfo() {
      const res = await this.$request({
        method: "get",
        url: '/farm/tvl/all'
      });
      if (res.code === 1000) {
        this.allTvl = tofix(res.data, 0, -1);
      }
    },
    // 正在进行领取奖励
    async progressReceive({ farmHash, farm, candyLock }) {
      // console.log(farm, 'farm')
      this.vaultsType = "decrease";
      if (farm.chain !== "NERVE") {
        this.currentFarm = farm;
        this.currentFarmHash = farmHash;
        this.assetsItem = farm;
        await this.LPOperation(2, '0', 'receive');
      } else {
        try {
          this.showLoading = true;
          this.assetsItem = farm;
          this.currentFarm = farm;
          await this.focusAsset(farm.syrupAsset);
          const { syrupTokenChainId: chainId, syrupTokenAssetId: assetId } = farm;
          const transferInfo = {
            from: this.nerveAddress,
            to: this.nerveAddress,
            assetsChainId: chainId,
            assetsId: assetId,
            amount: 0,
            fee: 0
          };
          const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
          const fromAddress = this.nerveAddress;
          const token = nerve.swap.token(chainId, assetId);
          const farmHash = farm.farmKey || '';
          const amount = 0;
          const tempTxData = await nerve.swap.farmWithdraw(fromAddress, token, amount, farmHash, '');
          const tAssemble = nerve.deserializationTx(tempTxData.hex);
          const data = {
            tAssemble,
            inputs: inputs,
            outputs: outputs,
            txData: {},
            pub: this.currentAccount.pub,
            signAddress: this.currentAccount.address.Ethereum,
          };
          const txHex = await transfer.getTxHex(data);
          if (txHex) {
            await this.broadcastHex({ txHex, txHash: "", amount: "0" });
            await this.getFarmInfo(true, true);
            this.showLoading = false;
          }
        } catch (e) {
          console.log(e);
          this.$message({
            type: 'warning',
            message: e.message || e,
            offset: 30,
            customClass: 'messageClass'
          });
          this.showLoading = false;
          this.showPop = false;
        }
      }
    },
    // 已结束领取奖励
    async overReceive(asset) {
      try {
        const { chainId, assetId, decimals } = asset;
        const transferInfo = {
          fromAddress: this.nerveAddress,
          toAddress: this.nerveAddress,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: 0,
          fee: 0
        };
        const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
        const fromAddress = this.nerveAddress;
        const token = nerve.swap.token(chainId, assetId);
        const farmHash = asset.farmKey || '';
        const amount = 0;
        const tempTxData = await nerve.swap.farmWithdraw(fromAddress, token, amount, farmHash, '');
        const tAssemble = nerve.deserializationTx(tempTxData.hex);
        const data = {
          tAssemble,
          inputs: inputs,
          outputs: outputs,
          txData: {},
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address.Ethereum,
        };
        const txHex = await transfer.getTxHex(data);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: "" });
          await this.getFarmInfo(false);
          this.showLoading = false;
        }
      } catch (e) {
        console.log(e);
        this.showLoading = false;
      }
    },
    // 最大
    maxCount() {
      if ((!this.assetsItem && !(this.assetsItem.balance)) || (!this.assetsItem && !(this.assetsItem.amount))) return false;
      // if (!this.assetsItem.balance) return false;
      if (this.vaultsType === "increase") {
        this.lpCount = this.assetsItem && this.assetsItem.balance || 0;
        if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        }
      } else {
        this.lpCount = this.assetsItem && this.assetsItem.amount || 0;
        if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        }
      }
    },
    lpInput() {
      if (this.vaultsType==="increase") {
        if (Minus(this.assetsItem.balance, this.lpCount) < 0) {
          this.amountMsg = this.$t("tips.tips16");
        } else if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        } else {
          this.amountMsg = '';
        }
      } else {
        if (Minus(this.assetsItem.amount, this.lpCount) < 0) {
          this.amountMsg = this.$t("tips.tips16");
        } else {
          this.amountMsg = '';
        }
      }
    },
    // 获取当前farm信息
    async getFarmInfo(enable, refresh=false) {
      if (!refresh) {
        this.farmLoading = true;
      }
      const data = { enable };
      const res = await this.$request({
        methods: 'post',
        url: '/farm/list',
        data
      });
      if (res.code === 1000) {
        // this.farmList = res.data;
        let tempList;
        if (this.networkType === 'L1') {
          tempList = res.data.filter(item => item.chain === this.$store.state.network);
        } else {
          tempList = res.data.filter(item => item.chain === "NERVE");
        }
        await this.getStakeAccount(tempList);
        this.isFirstRequest = false;
      }
    },
    async getStakeAccount(farmList) {
      // debugger;
      this.farmList = (await Promise.all(farmList.map(async item => {
        const config = JSON.parse(sessionStorage.getItem("config"));
        const batchQueryContract = config[item.chain || 'BSC']['config'].multiCallAddress || '';
        const fromAddress = this.currentAccount['address'][item.chain || 'BSC'];
        const RPCUrl = config[item.chain || 'BSC']['apiUrl'];
        let syrupAsset, stakedAsset;
        if (item.chain === "NERVE") {
          const tempParams = [
            {
              chainId: item.stakeTokenChainId,
              assetId: item.stakeTokenAssetId,
              contractAddress: item.stakeTokenContractAddress
            },
            {
              chainId: item.syrupTokenChainId,
              assetId: item.syrupTokenAssetId,
              contractAddress: item.syrupTokenContractAddress
            }
          ];
          // 通过jsonrpc去查询
          // const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
          // const url = MAIN_INFO.batchRPC;
          // const res = await this.$post(url, "getBalanceList", params);
          // if (res.result && res.result.length !== 0) {
          //   stakedAsset = res.result[0];
          //   syrupAsset = res.result[0];
          // } else {
          //
          // }
          stakedAsset = await this.getAssetInfo({
            chainId: item.stakeTokenChainId,
            assetId: item.stakeTokenAssetId,
            contractAddress: item.stakeTokenContractAddress,
            chain: item.chain
          }); // 获取当前可质押的资产
          syrupAsset = await this.getAssetInfo({
            chainId: item.syrupTokenChainId,
            assetId: item.syrupTokenAssetId,
            contractAddress: item.syrupTokenContractAddress,
            chain: item.chain
          }); // 获取当前可领取资产信息
          item.needReceiveAuth = false;
          item.needStakeAuth = false;
        } else {
          const tokenBalance = await getBatchERC20Balance([item.stakeTokenContractAddress || batchQueryContract, item.syrupTokenContractAddress || batchQueryContract], fromAddress, batchQueryContract, RPCUrl);
          stakedAsset = {
            ...tokenBalance[0],
            chainId: item.stakeTokenChainId,
            assetId: item.stakeTokenAssetId,
            contractAddress: item.stakeTokenContractAddress,
            balance: divisionDecimals(tokenBalance[0].balance || 0, tokenBalance[0].decimals || 18)
          }
          syrupAsset = {
            ...tokenBalance[1],
            chainId: item.syrupTokenChainId,
            assetId: item.syrupTokenAssetId,
            contractAddress: item.syrupTokenContractAddress,
            balance: divisionDecimals(tokenBalance[1].balance || 0, tokenBalance[1].decimals || 18)
          }
          item.needReceiveAuth = false;
          item.needStakeAuth = await this.getReceiveAuth(stakedAsset, item.farmKey);
        }
        if (item.chain === 'NERVE') {
          const res = await this.$request({
            methods: 'post',
            url: '/farm/stake/account',
            data: {
              chain: item.chain,
              farmHash: item.farmKey,
              address: this.currentAccount["address"][item.chain]
            }
          });
          if (res.data) {
            const {amount, reward} = res.data;
            return {
              ...item,
              ...res.data,
              amount: divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals),
              reward: this.numberFormat(tofix(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
              stakedAsset,
              syrupAsset,
              showDetail: false
            }
          }
          return {...item, stakedAsset, syrupAsset, showDetail: false};
        } else {
          const config = JSON.parse(sessionStorage.getItem('config'));
          const multicallAddress = config[this.fromNetwork].config.multiCallAddress;
          const fromAddress = this.currentAccount['address'][this.fromNetwork];
          const RPCUrl = config[item.chain]['apiUrl'];
          const tokens = await getBatchLockedFarmInfo(item.farmKey, item.pid, fromAddress, multicallAddress, RPCUrl);
          return {
            ...item,
            amount: divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals),
            // reward: this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['1'] || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            unlockNumbers: this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            lockNumbers: Minus(this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2), this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2)),
            reward: this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            stakedAsset,
            syrupAsset,
            showDetail: false
          }
        }
      })));
      this.farmLoading = false;
      // const tempList = resList.filter(item => item);
      console.log(this.farmList, '==farmList==');
    },
    // 关注当前这两个资产
    async focusAsset(assetInfo) {
      try {
        const infoParams = {
          network: assetInfo.chain,
          assetsChainId: assetInfo.chainId,
          assetsId: assetInfo.assetId,
          contractAddress: assetInfo.contractAddress || ""
        };
        const {chainId, assetId} = await getAssetNerveInfo(infoParams);
        const focusParams = {
          address: this.currentAccount.address[assetInfo.chain],
          assetId,
          chainId,
          chain: assetInfo.chain,
          contractAddress: assetInfo.contractAddress || "",
          focus: true
        };
        await this.$request({url: "/wallet/address/asset/focus", data: focusParams});
      } catch (e) {
        console.log(e);
      }
    },
    // 确认
    async confirm() {
      if (!this.lpCount || this.lpCount === "0" || this.amountMsg) return false;
      switch (this.vaultsType) {
        case "decrease":
          if (this.assetsItem.chain === "NERVE") {
            await this.decreaseClick();
          } else {
            await this.LPOperation(1, this.lpCount, 'withdraw');
          }
          break;
        case "increase":
          if (this.assetsItem.chain === "NERVE") {
            await this.increaseClick();
          } else {
            await this.LPOperation(0, this.lpCount, 'add');
          }
          break;
        default:
          return false;
      }
    },
    // 合约farm 添加 - 0、减少 - 1 lp, 领取收益 -2
    async LPOperation(type, value, option) {
      this.showLoading = true;
      try {
        let stakeTokenDecimals;
        const transfer = new ETransfer();
        switch (option) {
          case 'add':
            stakeTokenDecimals = this.assetsItem.decimals;
            break;
          case 'withdraw':
            stakeTokenDecimals = this.assetsItem.stakedAsset.decimals;
            break;
          case 'receive':
            stakeTokenDecimals = this.assetsItem.syrupAsset.decimals;
            break;
        }
        // const { decimals: stakeTokenDecimals } = this.vaultsType === "increase" ? this.assetsItem : this.assetsItem.syrupAsset;
        const wallet = transfer.provider.getSigner();
        const contracts = new ethers.Contract(this.currentFarmHash, txAbi, wallet);
        let res;
        const amount = timesDecimals(value, stakeTokenDecimals);
        const pid = this.currentFarm.pid || 0;
        if (type === 0) {
          res = await contracts.deposit(pid, amount);
        } else if (type === 1) {
          res = await contracts.withdraw(pid, amount);
        } else {
          res = await contracts.deposit(pid, amount);
        }
        if (res.hash) {
          await this.broadcastHex({ txHex: "", txHash: res.hash, amount });
          this.showPop = false;
        } else {
          this.$message({
            message: res.message || res,
            offset: 30,
            type: "warning" });
        }
      } catch (e) {
        console.log(e);
        this.reset();
        this.showLoading = false;
        this.showPop = false;
        this.$message({
          message: e.message || e,
          offset: 30,
          type: "warning"
        });
      }
    },
    // 完成解锁
    confirmUnlocked() {
      console.log('完成解锁')
    },
    // nerve加入矿池
    async increaseClick() {
      try {
        if (!this.lpCount) return false;
        this.showLoading = true;
        // const { chainId, assetId, decimals } = this.addedLiquidityInfo;
        // console.log(this.assetsItem, "this.assetsItem.stakedAsset");
        const { chainId, assetId, decimals } = this.assetsItem;
        const transferInfo = {
          from: this.nerveAddress,
          to: this.nerveAddress,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: timesDecimals(this.lpCount, decimals),
          fee: 0
        };
        const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
        const config =  JSON.parse(sessionStorage.getItem('config'));
        const mainChainId = config["NERVE"].chainId;
        const fromAddress = this.nerveAddress;
        const addressPrefix = this.nerveAddress && this.nerveAddress.slice(0, 4);
        const token = nerve.swap.token(chainId, assetId);
        const farmHash = this.currentFarmHash || '';
        const amount = timesDecimals(this.lpCount, decimals);
        const tempTxData = await nerve.swap.farmStake(fromAddress, token, mainChainId, addressPrefix, amount, farmHash, '');
        const tAssemble = nerve.deserializationTx(tempTxData.hex);
        const txData = {
          tAssemble,
          inputs,
          outputs,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address.Ethereum
        };
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: ""});
          this.showLoading = false;
          this.showPop = false;
          await this.getFarmInfo(true, true);
        }
      } catch (e) {
        console.log(e);
        this.reset();
        this.$message.warning(e);
        this.showLoading = false;
        this.showPop = false;
      }
    },
    // nerve撤出矿池
    async decreaseClick() {
      this.showLoading = true;
      try {
        // this.stakedAsset = await this.getAssetInfo({ chainId: 5, assetId: 37 }); // 获取当前可退出质押的资产
        const { chainId, assetId, decimals } = this.assetsItem.stakedAsset;
        const transferInfo = {
          from: this.nerveAddress,
          to: this.nerveAddress,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: timesDecimals(this.lpCount, decimals),
          fee: 0
        };
        const { inputs, outputs } = await transfer.inputsOrOutputs(transferInfo);
        const fromAddress = this.nerveAddress;
        const token = nerve.swap.token(chainId, assetId);
        const farmHash = this.currentFarmHash || '';
        const amount = timesDecimals(this.lpCount, decimals);
        const tempTxData = await nerve.swap.farmWithdraw(fromAddress, token, amount, farmHash, '');
        const tAssemble = nerve.deserializationTx(tempTxData.hex);
        const txData = {
          tAssemble,
          inputs,
          outputs,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address.Ethereum
        };
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: "" });
          this.showLoading = false;
        }
      } catch (e) {
        this.reset();
        this.$message({
          message: e.message,
          offset: 30,
          type: "warning"
        });
        this.showLoading = false;
        this.showPop = false;
      }
    },
    // 切换 tab
    checkTab(i) {
      this.currentIndex = i;
      if (i===0) {
        this.getFarmInfo(i===0);
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.getFarmInfo(this.currentIndex===0, true);
            this.getTvlInfo();
          }, 15000);
        }
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取pool流动性信息
    async getLiquidityInfo() {
      const res = await this.$request({
        method: "get",
        url: '/swap/usdn/info'
      });
      if (res.code === 1000) {
        this.liquidityInfo = res.data;
        this.liquidityInfo.total = res.data && divisionDecimals(res.data.total, res.data.decimals);
        this.liquidityInfo.balabce = res.data && divisionDecimals(res.data.balabce, res.data.decimals);
      }
    },
    // 获取资产信息
    async getAssetInfo(currentAsset) {
      if (!currentAsset) return '';
      const { chainId, assetId, contractAddress, chain } = currentAsset;
      const params = {
        chain,
        address: this.currentAccount && this.currentAccount.address[chain],
        chainId,
        assetId,
        refresh: true,
        contractAddress: contractAddress || ''
      };
      const res = await this.$request({
        url: '/wallet/address/asset',
        data: params
      });
      if (res.code === 1000) {
        res.data.balance = res.data && divisionDecimals(res.data.balance, res.data.decimals);
        return res.data;
      }
    },
    // 广播nerve nuls跨链转账交易
    async broadcastHex({txHex, txHash, amount}) {
      const isPledge = this.vaultsType === "increase"; // 是否为质押
      const { chainId: tempChainId, assetId, contractAddress, decimals } = isPledge ? this.assetsItem : this.assetsItem.syrupAsset;
      let params = {
        chain: this.currentFarm.chain,
        address: this.currentAccount.address[this.currentFarm.chain],
        type: isPledge ? 3 : 4, // 3质押 4撤出质押
        chainId: tempChainId,
        assetId: assetId,
        contractAddress: contractAddress || "",
        amount: amount || timesDecimals(this.lpCount, decimals),
        txHash
      };
      const config = JSON.parse(sessionStorage.getItem("config"));
      const url = config[this.currentFarm.chain].apiUrl;
      const chainId = config[this.currentFarm.chain].chainId;
      console.log(txHex, "---txHex---")
      if (txHex) {
        const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
        if (res.result && res.result.hash) {
          // console.log(res.result.hash, "res.result.hashres.result.hash");
          params.txHash = res.result.hash;
          const result = await this.$request({
            url: "/swap/vaults/add",
            data: params
          });
          if (result.code === 1000) {
            this.$message({
              message: this.$t("tips.tips10"),
              type: "success", duration: 2000,
              offset: 30,
            })
          } else {
            this.$message({
              message: this.$t("tips.tips15"),
              type: "warning",
              offset: 30,
              duration: 2000
            })
          }
          this.reset();
          this.showLoading = false;
        } else {
          console.error(res.error);
          this.$message({
            message: this.$t("tips.tips15"),
            offset: 30,
            type: "warning"
          });
          this.reset();
        }
      } else {
        const result = await this.$request({
          url: "/swap/vaults/add",
          data: params
        });
        if (result.code === 1000) {
          this.$message({
            message: this.$t("tips.tips10"),
            type: "success",
            offset: 30,
            duration: 2000
          })
        } else {
          this.$message({
            message: this.$t("tips.tips15"),
            type: "warning",
            offset: 30,
            duration: 2000
          })
        }
        this.reset();
        this.showLoading = false;
      }
    },
    // 获取领取的资产是否需要授权
    async getReceiveAuth(syrupAsset, farmHash) {
      const transfer = new ETransfer();
      return await transfer.getERC20Allowance(
          syrupAsset.contractAddress,
          farmHash,
          this.currentAccount.address.Ethereum
      )
    },
    // 领取资产授权
    async receiveApprove({ farmHash, farm }) {
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = farm.stakedAsset.contractAddress;
        // const multiAddress = this.assetsItem.heterogeneousList && this.assetsItem.heterogeneousList.find(item => item.chainName === this.currentFarm.chain).heterogeneousChainMultySignAddress || '';
        // console.log(multiAddress, 'contractAddress contractAddress contractAddress');
        const res = await transfer.approveERC20(
            contractAddress,
            farmHash,
            this.currentAccount.address.Ethereum
        );
        if (res.hash) {
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            duration: 2000,
            offset: 30,
          });
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
            offset: 30,
            duration: 2000
          });
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e);
        this.$message({
          message: e.message,
          type: "warning",
          offset: 30,
          duration: 2000
        });
        this.showPop = false;
        this.showLoading = false;
      }
    },
    // 质押资产授权
    async stakeApprove({ farmHash, farm }) {
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = farm.stakedAsset.contractAddress;
        // const multiAddress = this.assetsItem.heterogeneousList && this.assetsItem.heterogeneousList.find(item => item.chainName === this.currentFarm.chain).heterogeneousChainMultySignAddress || '';
        // console.log(multiAddress, 'contractAddress contractAddress contractAddress');
        const res = await transfer.approveERC20(
            contractAddress,
            farmHash,
            this.currentAccount.address.Ethereum
        );
        if (res.hash) {
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            duration: 2000,
            offset: 30,
          });
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
            offset: 30,
            duration: 2000
          });
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e);
        this.$message({
          message: e.message,
          type: "warning",
          offset: 30,
          duration: 2000
        });
        this.showPop = false;
        this.showLoading = false;
      }
    },
    reset() {
      this.lpCount = "";
      this.showPop = false;
      this.amountMsg = "";
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.timer1) clearInterval(this.timer1);
    this.timer = null;
    this.timer1 = null;
  }
}
</script>

<style scoped lang="scss">
@import "index";
.messageClass {
  width: 80vw !important;
  height: 150px;
}
</style>