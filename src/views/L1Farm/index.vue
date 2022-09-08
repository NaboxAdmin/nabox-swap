<template>
  <div :class="{ mobile_class: !isMobile }">
    <div class="vaults-cont">
      <div v-loading="showLoading" v-if="showLoading" class="position-fixed_loading" @touchmove.prevent/>
      <div class="coin-info"/>
      <div class="bg-f0">
        <div class="main-cont pb-3 pt-3">
          <div class="font-500 size-38 text-white text-center">${{ (allTvl || 0) | numFormat }}</div>
          <div class="text-center size-24 mt-1 text-e9">TVL</div>
        </div>
      </div>
    </div>
    <div class="detail-cont">
      <div class="tab ml-3 mr-3 d-flex align-items-center">
        <span
          v-for="(item, index) in checkList"
          :class="{ 'active': index===currentIndex, 'ml-53': index===1 }"
          :key="index"
          class="size-30 text-90 cursor-pointer"
          @click="checkTab(index)">
          {{ item }}
        </span>
        <div class="flex-1"/>
      </div>
      <Progress
        v-if="currentIndex===0"
        :farm-list="farmList"
        :farmLoading="farmLoading"
        :firstLoading="isFirstRequest"
        @stakeApprove="stakeApprove"
        @receiveClick="harvestReward"
        @confirmUnlocked="harvestReward"
        @showClick="showClick"/>
      <Over
        v-if="currentIndex===1"
        :farm-list="farmList"
        :farm-loading="farmLoading"
        :network-type="networkType"
        @receiveClick="harvestReward"
        @confirmUnlocked="harvestReward"
        @showClick="showClick"/>
    </div>
    <PopUp :show.sync="showPop">
      <div class="pop-cont">
        <template>
          <div v-if="vaultsType==='increase'" class="size-36 font-500">{{ assetsItem && assetsItem.symbol }} {{ $t("vaults.vaults15") }}</div>
          <div v-else class="size-36 font-500">{{ assetsItem && assetsItem.stakeToken && assetsItem.stakeToken.symbol }} {{ $t("vaults.vaults16") }}</div>
        </template>
        <template v-if="vaultsType==='increase'">
          <div class="text-right mt-2 text-90 size-26 d-flex justify-content-end">
            {{ $t("vaults.vaults5") }}：
            <span v-if="availableLoading" class="text-3a"><i class="el-icon-loading"/></span>
            <span v-else>{{ (assetsItem && assetsItem.balance || 0) | numFormat }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-right mt-2 text-90 size-26">
            {{ $t("vaults.vaults5") }}：
            <span v-if="availableLoading" class="text-3a"><i class="el-icon-loading"/></span>
            <span v-else>{{ (assetsItem && assetsItem.amount || 0) | numFormat }}</span>
          </div>
        </template>
        <div class="input-cont">
          <input
            :placeholder="$t('vaults.vaults9')"
            v-model="lpCount"
            @input="lpInput">
          <span @click="maxCount">{{ $t("vaults.vaults6") }}</span>
        </div>
        <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
        <div class="pop-btn d-flex align-items-center space-between mt-4">
          <div class="btn" @click="showPop = false; lpCount=''; amountMsg=''">{{ $t("vaults.vaults7") }}</div>
          <div class="btn btn_active" @click="confirm">{{ $t("vaults.vaults8") }}</div>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import { PopUp, FarmLoading } from '@/components';
import Progress from './Progress';
import Over from './Over';
import { currentNet, MAIN_INFO } from '@/config';
import { divisionDecimals, Minus, timesDecimals, tofix, Times } from '@/api/util';
import { ETransfer, NTransfer, getBatchLockedFarmInfo, getBatchERC20Balance } from '@/api/api';
import { ethers } from 'ethers';
import { txAbi } from '@/api/contractConfig';

const nerve = require('nerve-sdk-js');
// eslint-disable-next-line no-unused-vars
const transfer = new NTransfer({
  chain: 'NERVE',
  type: 2
});
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Vaults',
  components: { PopUp, Progress, Over, FarmLoading },
  data() {
    return {
      checkList: [this.$t('vaults.vaults2'), this.$t('vaults.vaults3')],
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
      farmLoading: false,
      authRefresh: true, // 授权后刷新
      currentFarm: null, // 当前操作的farm
      receiveNeedAuth: false, // 领取是否需要授权
      isFirstRequest: true, // 是否为第一次请求
      networkType: 'L1',
      approveLoading: false,
      approveList: [], // 授权列表
      firstRequest: true,
      availableLoading: false
    };
  },
  computed: {
    nerveAddress() {
      return this.currentAccount && this.currentAccount.address['NERVE'] || '';
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    }
  },
  watch: {
    currentAccount: {
      handler(val) {
        if (val) {
          this.refreshData();
        }
      },
      deep: true
    },
    fromNetwork: {
      handler(val) {
        val && this.refreshData();
      }
    },
    lpCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = this.stakedAsset.decimals || 8;
          const patrn = new RegExp('^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$');
          if (patrn.exec(newVal) || newVal === '') {
            this.lpCount = newVal;
          } else {
            this.lpCount = oldVal;
          }
        } else {
          this.lpCount = '';
        }
      },
      deep: true
    },
    '$store.state.lang': {
      handler(val) {
        this.checkList = [this.$t('vaults.vaults2'), this.$t('vaults.vaults3')];
      }
    }
  },
  created() {
    this.getFarmInfo(true);
    this.getTvlInfo();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(() => {
      this.getFarmInfo(this.currentIndex === 0, true);
      this.getTvlInfo();
    }, 15000);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.timer1) clearInterval(this.timer1);
    this.timer = null;
    this.timer1 = null;
  },
  methods: {
    // 刷新数据
    async refreshData() {
      await this.getFarmInfo(true);
      await this.getTvlInfo();
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getFarmInfo(this.currentIndex === 0, true);
      }, 10000);
    },
    // 质押/退出质押
    async showClick({ type, farmHash, item }) {
      this.showPop = true;
      this.vaultsType = type;
      this.currentFarmHash = farmHash;
      this.currentFarm = item;
      this.stakedAsset = item.stakedAsset;
      if (type === 'increase') {
        this.assetsItem = item.stakedAsset;
        if (this.assetsItem.balance == 0) {
          this.availableLoading = true;
          const assetBalance = await this.getBalance(this.assetsItem);
          this.assetsItem.balance = assetBalance == '0.0' && '0' || assetBalance;
          this.availableLoading = false;
        }
      } else {
        this.assetsItem = item;
      }
    },
    // 获取余额
    async getBalance(asset) {
      try {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        if (asset.contractAddress) {
          return await transfer.getERC20Balance(asset.contractAddress, asset.decimals, this.fromAddress);
        } else {
          return await transfer.getEthBalance(this.fromAddress);
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 获取tvl
    async getTvlInfo() {
      const res = await this.$request({
        method: 'get',
        url: '/farm/tvl/all'
      });
      if (res.code === 1000) {
        this.allTvl = tofix(res.data, 0, -1);
      }
    },
    // 正在进行领取奖励
    async harvestReward({ farmHash, farm }) {
      this.vaultsType = 'decrease';
      this.currentFarm = farm;
      this.currentFarmHash = farmHash;
      this.assetsItem = farm;
      if (this.fromNetwork === 'NERVE') {
        await this.harvestNerveReward();
      } else {
        await this.LPOperation(2, '0', 'receive');
      }
    },
    // 最大
    maxCount() {
      if ((!this.assetsItem && !(this.assetsItem.balance)) || (!this.assetsItem && !(this.assetsItem.amount))) return false;
      // if (!this.assetsItem.balance) return false;
      if (this.vaultsType === 'increase') {
        this.lpCount = this.assetsItem && this.assetsItem.balance || 0;
        if (Minus(this.lpCount, 0) == '0') {
          this.amountMsg = this.$t('tips.tips18');
        }
      } else {
        this.lpCount = this.assetsItem && this.assetsItem.amount || 0;
        if (Minus(this.lpCount, 0) == '0') {
          this.amountMsg = this.$t('tips.tips18');
        }
      }
    },
    lpInput() {
      if (this.vaultsType === 'increase') {
        if (Minus(this.assetsItem.balance, this.lpCount) < 0) {
          this.amountMsg = this.$t('tips.tips16');
        } else if (Minus(this.lpCount, 0) == '0') {
          this.amountMsg = this.$t('tips.tips18');
        } else {
          this.amountMsg = '';
        }
      } else {
        if (Minus(this.assetsItem.amount, this.lpCount) < 0) {
          this.amountMsg = this.$t('tips.tips16');
        } else {
          this.amountMsg = '';
        }
      }
    },
    // 获取当前farm信息
    async getFarmInfo(enable, refresh = false) {
      if (!refresh) {
        this.farmLoading = true;
      }
      const data = { enable };
      const res = await this.$request({
        methods: 'post',
        url: '/farm/list',
        data
      });
      if (res.code === 1000 && res.data) {
        const tempFarmList = res.data.filter(item => item.chain === this.$store.state.network);
        this.farmList = this.farmList.length === 0 ? tempFarmList.map(item => ({
          ...item,
          showDetail: false,
          stakedAsset: {
            chainId: item.stakeToken && item.stakeToken.chainId,
            assetId: item.stakeToken && item.stakeToken.assetId,
            decimals: item.stakeToken && item.stakeToken.decimals,
            contractAddress: item.stakeToken && item.stakeToken.contractAddress,
            balance: 0
          }
        })) : this.farmList;
        if (this.fromNetwork === 'NERVE') {
          this.farmList = [];
        }
        this.farmLoading = false;
        await this.getStakeAccount(this.farmList);
        this.isFirstRequest = false;
      } else {
        this.farmList = [];
        this.farmLoading = false;
      }
    },
    async getStakeAccount(farmList) {
      this.farmList = (await Promise.all(farmList.map(async(item, index) => {
        const config = JSON.parse(sessionStorage.getItem('config'));
        const batchQueryContract = config[item.chain || 'BSC']['config'].multiCallAddress || '';
        const fromAddress = this.currentAccount['address'][item.chain] || this.currentAccount['address'][this.chainNameToId[item.chain] || 'BSC'] || this.currentAccount['address'][this.nativeId];
        const RPCUrl = config[item.chain || 'BSC']['apiUrl'];
        console.log(fromAddress, '0xdeff0ee83ba00be152bcff88795f1577bf5be806');
        const tokenBalance = await getBatchERC20Balance([item.stakeToken && item.stakeToken.contractAddress || batchQueryContract, item.syrupToken && item.syrupToken.contractAddress || batchQueryContract], fromAddress, batchQueryContract, RPCUrl);
        console.log(tokenBalance, 'tokenBalance');
        const stakedAsset = {
          ...tokenBalance[0],
          chainId: item.stakeToken && item.stakeToken.chainId,
          assetId: item.stakeToken && item.stakeToken.assetId,
          contractAddress: item.stakeToken && item.stakeToken.contractAddress,
          balance: divisionDecimals(tokenBalance[0].balance || 0, tokenBalance[0].decimals || 18)
        };
        const syrupAsset = {
          ...tokenBalance[1],
          chainId: item.syrupToken && item.syrupToken.chainId,
          assetId: item.syrupToken && item.syrupToken.assetId,
          contractAddress: item.syrupToken && item.syrupToken.contractAddress,
          balance: divisionDecimals(tokenBalance[1].balance || 0, tokenBalance[1].decimals || 18)
        };
        item.needReceiveAuth = false;
        if (this.firstRequest) {
          item.needStakeAuth = await this.getReceiveAuth(stakedAsset, item.farmKey);
        } else {
          item.needStakeAuth = this.farmList[index] && this.farmList[index].needStakeAuth && await this.getReceiveAuth(stakedAsset, item.farmKey);
        }
        const multicallAddress = config[this.fromNetwork].config.multiCallAddress;
        const tokens = await getBatchLockedFarmInfo(item.farmKey, item.pid, fromAddress, multicallAddress, RPCUrl);
        return {
          ...item,
          stakedAsset,
          syrupAsset,
          profit: item.pid == 5 && item.farmKey === '0x28Cb8a295b8A78AA78d9E8E8b76e2777fEcD3818' && '0%' || item.profit,
          showDetail: false,
          amount: divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals),
          approveLoading: this.farmList && this.farmList[index] && this.farmList.length > 0 && this.farmList[index].approveLoading || false,
          unlockNumbers: this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4),
          lockNumbers: Minus(this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['3'] || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4), this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4)),
          reward: this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4),
          pendingReward: this.numberFormat(tofix(divisionDecimals(tokens[4].pendingReward || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4),
          syrupUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[4].pendingReward || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 4, -1), 4),
          stakeUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals), item.stakeToken.usdPrice || 0), 4, -1), 4),
          unlockUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 4, -1), 4)
        };
      })));
      this.firstRequest = false;
      // const tempList = resList.filter(item => item);
      console.log(this.farmList, '==L1 farmList==');
    },
    // 确认
    async confirm() {
      if (!this.lpCount || this.lpCount === '0' || this.amountMsg) return false;
      switch (this.vaultsType) {
        case 'decrease':
          await this.LPOperation(1, this.lpCount, 'withdraw');
          break;
        case 'increase':
          await this.LPOperation(0, this.lpCount, 'add');
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
        // TODO:前端保存交易记录
        if (res.hash) {
          this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            message: this.$t('tips.tips10'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.reset();
          this.showLoading = false;
          this.showPop = false;
        } else {
          this.$message({
            message: res.message || res,
            offset: 30,
            type: 'warning'
          });
        }
      } catch (e) {
        console.log(e);
        this.reset();
        this.showLoading = false;
        this.showPop = false;
        this.$message({
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30,
          type: 'warning'
        });
      }
    },
    // 切换 tab
    checkTab(i) {
      this.currentIndex = i;
      this.isFirstRequest = true;
      if (i === 0) {
        this.getFarmInfo(i === 0);
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.getFarmInfo(this.currentIndex === 0, true);
            this.getTvlInfo();
          }, 15000);
        }
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取领取的资产是否需要授权
    async getReceiveAuth(syrupAsset, farmHash) {
      const transfer = new ETransfer();
      return await transfer.getERC20Allowance(
        syrupAsset.contractAddress,
        farmHash,
        this.currentAccount.address[this.fromNetwork] || this.currentAccount.address[1] || this.currentAccount['address'][3]
      );
    },
    // 质押资产授权
    async stakeApprove({ farmHash, farm, index }) {
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = farm.stakedAsset.contractAddress;
        const res = await transfer.approveERC20(
          contractAddress,
          farmHash,
          this.currentAccount.address[this.fromNetwork] || this.currentAccount.address[1] || this.currentAccount['address'][3]
        );
        if (res.hash) {
          this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            message: this.$t('tips.tips14'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.farmList[index].approveLoading = true;
          const tempItem = this.farmList[index];
          this.$set(this.farmList, index, tempItem);
        } else {
          this.$message({
            message: res.msg,
            type: 'warning',
            offset: 30,
            duration: 2000
          });
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e, 'stake error');
        this.$message({
          message: e.reason || e.message || e,
          type: 'warning',
          offset: 30,
          duration: 2000
        });
        this.showPop = false;
        this.showLoading = false;
      }
    },
    reset() {
      this.lpCount = '';
      this.showPop = false;
      this.amountMsg = '';
    }
  }
};
</script>

<style scoped lang="scss">
@import "index";
.messageClass {
  width: 80vw !important;
  height: 150px;
}
</style>
