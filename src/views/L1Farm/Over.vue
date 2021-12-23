<template>
  <div class="p-3">
    <div v-loading="farmLoading" v-if="farmLoading" class="loading-cont" element-loading-background="rgba(255, 255, 255, 0.1)"/>
    <div
      v-for="item in farmList"
      v-else-if="farmList.length !== 0"
      :key="`${item.farmKey}-${item.pid}`"
      class="d-flex direction-column mb-3 border_d8"
      @click.stop="showDetailInfo(item)">
      <div
        :class="{ 'farm_item_show': item.showDetail, 'farm_item_hide': !item.showDetail }"
        class="farm-item p-3 bg-white d-flex align-items-center space-between">
        <div class="d-flex direction-column">
          <div class="farm-icon d-flex align-items-center">
            <span class="icon">
              <img :src="item.icon || pictureError" alt="" @error="pictureError">
            </span>
            <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
          </div>
          <div class="farm-info mt-4 d-flex align-items-center">
            <div class="d-flex direction-column mr-100 min-200">
              <span class="text-90 size-26">
                {{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}
              </span>
              <span class="font-500 size-36 mt-1">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
            </div>
            <div class="d-flex direction-column">
              <span class="text-90 size-26">APR</span>
              <span class="font-500 size-36 mt-1">{{ item.profit || '0%' }}</span>
            </div>
          </div>
        </div>
        <div :class="{'rotate_x': item.showDetail}" class="drop-icon">
          <img src="@/assets/image/dorp_active.png" alt="">
        </div>
      </div>
      <div
        v-if="item.showDetail"
        :class="{ 'show_transition': item.showDetail }"
        class="farm-detail_info"
        @click.stop>
        <div class="d-flex align-items-center space-between">
          <span class="text-90 size-28">{{ $t("airdrop.airdrop3") }}</span>
          <div class="d-flex align-items-center size-28">
            <span class="text-3a">${{ item.tvl }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}</span>
            <el-tooltip v-if="item.lockCandy" :manual="false" :content="formatContent(item.lockDays)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <span class="size-40 word-break w-330 mt-2">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
              <span class="mt-1 text-90 size-26">≈${{ item.syrupUsdPrice || 0 }}</span>
            </div>
            <span
              v-if="!item.needReceiveAuth && !item.lockCandy"
              :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' }"
              class="item-btn size-30"
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("tips.tips30") }}</span>
            <span
              v-else-if="!item.needReceiveAuth && item.lockCandy"
              :class="{ active_btn: !item.pendingReward || item.pendingReward === 0 || item.pendingReward === '0' }"
              class="item-btn size-30"
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("tips.tips30") }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ item.stakedAsset && item.stakedAsset.symbol || 'USDTN' }} {{ $t("vaults.vaults4") }} </span>
            <el-tooltip v-if="item.withdrawLockTime" :manual="false" :content="formatLockContent(item.withdrawLockTime)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <span class="size-40 word-break w-330 mt-2">{{ (item.amount || 0) | numFormat }}</span>
              <span class="mt-1 text-90 size-26">≈${{ item.stakeUsdPrice || 0 }}</span>
            </div>
            <div class="btn-group">
              <template v-if="!item.needStakeAuth">
                <div
                  :class="{ disabled_btn: !item.amount || item.amount == 0 }"
                  class="btn-item"
                  @click="showClick('decrease', item.farmKey, item)">-</div>
                <div class="btn-item ml-3 disabled_btn">+</div>
              </template>
            </div>
          </div>
        </div>
        <div class="mt-3 size-28 text-right text-6e d-flex justify-content-end" @click="toSwap(item)">
          <span>{{ $t("vaults.over5") }}{{ item.stakedAsset && item.stakedAsset.symbol }}</span>
          <span class="arrow-icon ml-1">
            <img src="@/assets/image/link_to.png" alt="">
          </span>
        </div>
        <template v-if="item.lockCandy">
          <div class="px-cont mt-3"/>
          <div class="size-28 mt-3 d-flex space-between align-items-center">
            <span class="d-flex align-items-center text-90 size-28">
              <span>{{ $t("vaults.vaults12") }}{{ item.syrupAsset && item.syrupAsset.symbol || 'NABOX' }}</span>
            </span>
            <div class="d-flex align-items-center size-28">
              <span class="text-3a">{{ item.lockNumbers | numFormat }}</span>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("vaults.vaults13") }}{{ item.syrupAsset && item.syrupAsset.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <div class="d-flex direction-column">
                <span class="size-40 word-break w-330 mt-2">{{ (item.unlockNumbers || 0) | numFormat }}</span>
                <span class="mt-1 text-90 size-26">≈${{ item.unlockUsdPrice || 0 }}</span>
              </div>
              <span
                v-if="!item.needReceiveAuth"
                :class="{ active_btn: item.unlockNumbers == 0 }"
                class="item-btn size-30"
                @click="confirmUnlocked(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="text-center mt-4 text-grey">{{ $t('modal.modal3') }}</div>
  </div>
</template>

<script>
import { divisionDecimals, tofix, Minus, Division } from '@/api/util';
import { getBatchLockedFarmInfo, getBatchERC20Balance } from '@/api/api';
import { Times } from '../../api/util';

export default {
  name: 'Over',
  props: {
    networkType: {
      type: String,
      default: 'L1'
    }
  },
  data() {
    return {
      showDropList: false,
      farmList: [],
      farmLoading: false,
      farmTimer: null
    };
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    }
  },
  watch: {
    farmList: {
      handler(newVal, oldVal) {
        if (newVal && oldVal) {
          oldVal.forEach((item, index) => {
            if (item.showDetail) {
              this.farmList[index].showDetail = item.showDetail;
            }
          });
        }
      }
    },
    networkType: {
      handler(newVal) {
        if (newVal) {
          this.getFarmInfo(false);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getFarmInfo(false);
    this.farmTimer = setInterval(() => {
      this.getFarmInfo(false, true);
    }, 20000);
  },
  beforeDestroy() {
    if (this.farmTimer) {
      clearInterval(this.farmTimer);
      this.farmTimer = null;
    }
  },
  methods: {
    toSwap(farm) {
      this.isMobile ? window.location.href = `${farm.lpUrl}` : window.open(`${farm.lpUrl}`);
    },
    // 领取
    receiveClick(farmHash, farm) {
      if (!farm.lockCandy && (!farm.reward || farm.reward === '0' || farm.reward === 0)) return false;
      if (farm.lockCandy && (!farm.pendingReward || farm.pendingReward === 0 || farm.pendingReward === '0')) return false;
      this.$emit('receiveClick', { farmHash, farm });
    },
    showClick(type, farmHash, item) {
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;  || !item.reward || item.reward == 0 || item.reward < 0
      if (type === 'decrease' && (!Number(item.amount) || !item.amount || item.amount == 0)) return false;
      this.$emit('showClick', { type, farmHash: item.farmKey, item });
    },
    // 完成解锁
    confirmUnlocked(farmHash, farm) {
      if (farm.unlockNumbers == 0) return false;
      this.$emit('confirmUnlocked', { farmHash, farm });
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
      if (res.code === 1000) {
        // this.farmList = res.data;
        let tempList = res.data.filter(item => item.chain === 'NERVE' || item.chain === this.$store.state.network);
        if (this.networkType === 'L1') {
          tempList = res.data.filter(item => item.chain === this.$store.state.network);
        } else {
          tempList = res.data.filter(item => item.chain === 'NERVE');
        }
        await this.getStakeAccount(tempList);
        this.isFirstRequest = false;
      }
    },
    // 获取当前质押资产详细信息
    async getStakeAccount(farmList) {
      this.farmList = (await Promise.all(farmList.map(async item => {
        const config = JSON.parse(sessionStorage.getItem('config'));
        const batchQueryContract = config[item.chain || 'BSC']['config'].multiCallAddress || '';
        const fromAddress = this.currentAccount['address'][item.chain || 'BSC'];
        const RPCUrl = config[item.chain || 'BSC']['apiUrl'];
        const tokenBalance = await getBatchERC20Balance([item.stakeToken && item.stakeToken.contractAddress || batchQueryContract, item.syrupToken && item.syrupToken.contractAddress || batchQueryContract], fromAddress, batchQueryContract, RPCUrl);
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
        item.needStakeAuth = false;
        const multicallAddress = config[this.fromNetwork].config.multiCallAddress;
        const tokens = await getBatchLockedFarmInfo(item.farmKey, item.pid, fromAddress, multicallAddress, RPCUrl);
        return {
          ...item,
          amount: divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals),
          unlockNumbers: this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
          lockNumbers: Minus(this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['3'] || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2), this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2)),
          reward: this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
          pendingReward: this.numberFormat(tofix(divisionDecimals(tokens[4].pendingReward || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
          syrupUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[4].pendingReward || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 2, -1), 2),
          stakeUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals), item.stakeToken.usdPrice || 0), 2, -1), 2),
          unlockUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 2, -1), 2),
          stakedAsset,
          syrupAsset,
          showDetail: false
        };
      })));
      this.farmLoading = false;
      console.log(this.farmList, '==L1 ended farmList==');
    },
    showDetailInfo(farm) {
      for (const item of this.farmList) {
        if (item.farmKey === farm.farmKey) {
          farm.showDetail = !farm.showDetail;
        } else {
          item.showDetail = false;
        }
      }
    },
    formatContent(lockDay) {
      const isEn = this.$store.state.lang === 'en';
      return !isEn ? `执行收获操作${lockDay}天后，你可以将收益领取到你的地址` : `${lockDay} days after the harvesting operation, you can claim the rewards to your address`;
    },
    formatLockContent(lockSeconds) {
      if (!lockSeconds) return false;
      const lockDay = Division(lockSeconds, 3600);
      const isEn = this.$store.state.lang === 'en';
      return !isEn ? `质押的资产退出时将被锁定${lockDay}小时` : `Staked token will be locked for ${lockDay} hours when withdrawing`;
    }
  }
};
</script>

<style scoped lang="scss">
@import "index";
.active_btn {
  background-color: #ABB1BA;
}
.border-bottom {
  border-bottom: 1px solid #DBDEE8;
}
.pb-4 {
  padding-bottom: 40px;
}
.tips-icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  img {
    height: 100%;
    width: 100%;
  }
}
.arrow-icon {
  width: 30px;
  height: 28px;
  img {
    height: 100%;
    width: 100%;
  }
}
.px-cont {
  height: 1px;
  background: #DBDEE8;
}
.w-80 {
  width: 90%;
  margin: 0 auto;
}
.mr-100 {
  margin-right: 100px;
}
.border_d8 {
  border: 1px solid #DBDEE8;
  border-radius: 20px;
}
</style>
