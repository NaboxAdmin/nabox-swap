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
        :first-loading="isFirstRequest"
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
          <div v-else class="size-36 font-500">{{ assetsItem && assetsItem.stakedAsset && assetsItem.stakedAsset.symbol }} {{ $t("vaults.vaults16") }}</div>
        </template>
        <div v-if="vaultsType==='increase'" class="text-right mt-2 text-90 size-26">{{ $t("vaults.vaults5") }}：{{ (assetsItem && assetsItem.balance || 0) | numFormat }}</div>
        <div v-else class="text-right mt-2 text-90 size-26">{{ $t("vaults.vaults5") }}：{{ (assetsItem && assetsItem.amount || 0) | numFormat }}</div>
        <div class="input-cont">
          <input
            :placeholder="$t('vaults.vaults9')"
            v-model="lpCount"
            @input="lpInput">
          <span @click="maxCount">{{ $t("vaults.vaults6") }}</span>
        </div>
        <div v-if="amountMsg" class="text-red mt-2">{{ amountMsg }}</div>
        <div class="pop-btn d-flex align-items-center space-between mt-4">
          <div class="btn cursor-pointer" @click="showPop = false; lpCount=''; amountMsg=''">{{ $t("vaults.vaults7") }}</div>
          <div class="btn btn_active cursor-pointer" @click="confirm">{{ $t("vaults.vaults8") }}</div>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
import { PopUp } from '@/components';
import Progress from './Progress';
import Over from './Over';
import { currentNet, MAIN_INFO } from '@/config';
import { divisionDecimals, Minus, timesDecimals, tofix, Times, TRON } from '@/api/util';
import { ETransfer, NTransfer } from '@/api/api';

const nerve = require('nerve-sdk-js');
const transfer = new NTransfer({
  chain: 'NERVE',
  type: 2
});
// 测试环境
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default {
  name: 'Vaults',
  components: { PopUp, Progress, Over },
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
      networkType: 'L2',
      approveLoading: false,
      approveList: [] // 授权列表
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
    if (this.fromNetwork === TRON) {
      this.$router.replace({ path: '/swap' });
    }
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
      if (this.timer1) clearTimeout(this.timer1);
      if (type === 'increase') {
        this.assetsItem = item.stakedAsset;
      } else {
        this.assetsItem = item;
      }
    },
    async setGetERC20Allowance() {
      if (this.timer1) clearTimeout(this.timer1);
      const transfer = new ETransfer();
      this.needAuth = await transfer.getERC20Allowance(
        this.assetsItem.contractAddress,
        this.currentFarmHash,
        this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount['address'][3]
      );
      if (!this.needAuth) {
        this.authRefresh = false;
      }
      if (this.authRefresh) {
        this.timer1 = setTimeout(() => {
          this.setGetERC20Allowance();
        }, 5000);
      }
    },

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
    async harvestReward({ farmHash, farm, candyLock }) {
      // console.log(farm, 'farm')
      this.vaultsType = 'decrease';
      try {
        this.showLoading = true;
        this.assetsItem = farm;
        this.currentFarm = farm;
        const { chainId, assetId } = farm.syrupToken;
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
          signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount['address'][97]
        };
        const txHex = await transfer.getTxHex(data);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: '', amount: '0' });
          await this.getFarmInfo(true, true);
          this.showLoading = false;
        }
      } catch (e) {
        console.log(e);
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30,
          customClass: 'messageClass'
        });
        this.showLoading = false;
        this.showPop = false;
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
        const tempFarmList = res.data.filter(item => item.chain === 'NERVE');
        this.farmList = this.farmList.length === 0 ? tempFarmList.map(item => ({ ...item, showDetail: false })) : this.farmList;
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
        let stakedAsset, syrupAsset;
        const tempParams = [
          {
            chainId: item.stakeToken && item.stakeToken.chainId,
            assetId: item.stakeToken && item.stakeToken.assetId,
            contractAddress: item.stakeToken && item.stakeToken.contractAddress
          },
          {
            chainId: item.syrupToken && item.syrupToken.chainId,
            assetId: item.syrupToken && item.syrupToken.assetId,
            contractAddress: item.syrupToken && item.syrupToken.contractAddress
          }
        ];
        // 通过jsonrpc去查询
        const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
        const url = MAIN_INFO.batchRPC;
        const res = await this.$post(url, 'getBalanceList', params);
        if (res.result && res.result.length !== 0) {
          stakedAsset = {
            ...res.result[0],
            ...item.stakeToken,
            balance: divisionDecimals(res.result[0].balance, item.stakeToken.decimals)
          };
          syrupAsset = {
            ...res.result[1],
            ...item.syrupToken,
            balance: divisionDecimals(res.result[1].balance, item.syrupToken.decimals)
          };
        } else {
          console.log('getBalanceList error');
        }
        item.needReceiveAuth = false;
        item.needStakeAuth = false;
        const accountRes = await this.$request({
          methods: 'post',
          url: '/farm/stake/account',
          data: {
            chain: item.chain,
            farmHash: item.farmKey,
            address: this.currentAccount['address'][item.chain] || this.currentAccount['address'][this.chainNameToId[item.chain]]
          }
        });
        if (accountRes.data) {
          const { amount, reward } = accountRes.data;
          return {
            ...item,
            ...accountRes.data,
            stakedAsset,
            syrupAsset,
            approveLoading: this.farmList && this.farmList.length > 0 && this.farmList[index].approveLoading || false,
            amount: divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals),
            reward: this.numberFormat(tofix(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), 4, -1), 4),
            syrupUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 4, -1), 4),
            stakeUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals), item.stakeToken.usdPrice || 0), 4, -1), 4),
            showDetail: false
          };
        }
        return {
          ...item,
          stakedAsset,
          syrupAsset,
          showDetail: false,
          approveLoading: this.farmList && this.farmList.length > 0 && this.farmList[index].approveLoading || false
        };
      })));
      console.log(this.farmList, '==L2 farmList==');
    },
    // 确认
    async confirm() {
      if (!this.lpCount || this.lpCount === '0' || this.amountMsg) return false;
      switch (this.vaultsType) {
        case 'decrease':
          await this.decreaseClick();
          break;
        case 'increase':
          await this.increaseClick();
          break;
        default:
          return false;
      }
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
        const config = JSON.parse(sessionStorage.getItem('config'));
        const mainChainId = config['NERVE'].chainId;
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
          signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount.address[97]
        };
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: '' });
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
          signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount.address[97]
        };
        const txHex = await transfer.getTxHex(txData);
        if (txHex) {
          await this.broadcastHex({ txHex, txHash: '' });
          this.showLoading = false;
        }
      } catch (e) {
        this.reset();
        this.$message({
          message: e.message,
          offset: 30,
          type: 'warning'
        });
        this.showLoading = false;
        this.showPop = false;
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
    // 广播nerve nuls跨链转账交易
    async broadcastHex({ txHex, txHash, amount }) {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const url = config['NERVE'].apiUrl;
      const chainId = config['NERVE'].chainId;
      console.log(txHex, '---txHex---');
      if (txHex) {
        const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
        if (res.result && res.result.hash) {
          this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.result.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            message: this.$t('tips.tips10'),
            type: 'success',
            duration: 2000,
            offset: 30
          });
          this.reset();
          this.showLoading = false;
        } else {
          console.error(res.error);
          this.$message({
            message: res.error && `${res.error.code}:${res.error.data}` || res.error && res.error.message || this.$t('tips.tips15'),
            offset: 30,
            type: 'warning'
          });
          this.reset();
          this.showLoading = false;
        }
      }
    },
    // 质押资产授权
    async stakeApprove({ farmHash, farm, index }) {
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = farm.stakedAsset.contractAddress;
        // const multiAddress = this.assetsItem.heterogeneousList && this.assetsItem.heterogeneousList.find(item => item.chainName === this.currentFarm.chain).heterogeneousChainMultySignAddress || '';
        // console.log(multiAddress, 'contractAddress contractAddress contractAddress');
        const res = await transfer.approveERC20(
          contractAddress,
          farmHash,
          this.currentAccount.address[this.fromNetwork] || this.currentAccount.address[1] || this.currentAccount.address[3]
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
        console.log(e);
        this.$message({
          message: e.message,
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
