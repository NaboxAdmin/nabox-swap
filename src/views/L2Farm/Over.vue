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
              <img v-lazy="item.icon || pictureError" alt="" @error="pictureError">
            </span>
            <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
          </div>
          <div class="farm-info mt-4 d-flex align-items-center">
            <div class="d-flex direction-column mr-100">
              <span class="text-90 size-26 min-200">
                <!--{{ item.syrupAsset && item.syrupAsset.symbol }}-->
                {{ $t("vaults.over2") }} {{ item.syrupToken && item.syrupToken.symbol }}
              </span>
              <template>
                <Loading v-if="firstRequest" class="mt-2"/>
                <span v-else class="font-500 size-36 mt-1">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
              </template>
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
            <span class="text-3a">${{ item.tvl | numberFormatLetter }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ $t("vaults.over2") }} {{ item.syrupToken && item.syrupToken.symbol }}</span>
            <el-tooltip v-if="item.lockCandy" :manual="false" :content="formatContent(item.lockDays)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <template>
                <Loading v-if="firstRequest"/>
                <span v-else class="size-40 word-break w-330 mt-2">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
              </template>
              <span class="mt-1 text-90 size-26">≈${{ (item.syrupTokenBalance != '0' && item.syrupUsdPrice || 0) | numFormatFix }}</span>
            </div>
            <span
              v-if="!item.needReceiveAuth && !item.lockCandy"
              :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' || item.syrupTokenBalance == '0' }"
              class="item-btn size-30"
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("tips.tips30") }}</span>
            <span
              v-else-if="!item.needReceiveAuth && item.lockCandy"
              :class="{ active_btn: !item.pendingReward || item.pendingReward === 0 || item.pendingReward === '0' }"
              class="item-btn size-30"
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("vaults.over7") }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ item.stakeToken && item.stakeToken.symbol || 'USDTN' }} {{ $t("vaults.vaults4") }} </span>
            <el-tooltip v-if="item.withdrawLockTime" :manual="false" :content="formatLockContent(item.withdrawLockTime)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <template>
                <Loading v-if="firstRequest"/>
                <span v-else class="size-40 word-break w-330 mt-2">{{ (item.amount || 0) | numFormat }}</span>
              </template>
              <span class="mt-1 text-90 size-26">≈${{ (item.stakeUsdPrice || 0) | numFormatFix }}</span>
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
        <div class="mt-3 size-28 text-right text-6e d-flex justify-content-end cursor-pointer" @click="$router.push({ path: '/swap' })">
          <span>{{ $t("vaults.over5") }}{{ item.stakeToken && item.stakeToken.symbol }}</span>
          <span class="arrow-icon ml-1">
            <img src="@/assets/image/link_to.png" alt="">
          </span>
        </div>
        <template v-if="item.lockCandy">
          <div class="px-cont mt-3"/>
          <div class="size-28 mt-3 d-flex space-between align-items-center">
            <span class="d-flex align-items-center text-90 size-28">
              <span>{{ $t("vaults.vaults12") }}{{ item.syrupToken && item.syrupToken.symbol || 'NABOX' }}</span>
            </span>
            <div class="d-flex align-items-center size-28">
              <template>
                <Loading v-if="firstRequest"/>
                <span v-else class="text-3a">{{ item.lockNumbers | numFormat }}</span>
              </template>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("vaults.vaults13") }}{{ item.syrupToken && item.syrupToken.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <template>
                <Loading v-if="firstRequest"/>
                <span v-else class="size-40 word-break w-330">{{ (item.unlockNumbers || 0) | numFormat }}</span>
              </template>
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
import { divisionDecimals, tofix, Division, Times } from '@/api/util';
import { MAIN_INFO } from '@/config';
import { Loading } from '@/components';

export default {
  name: 'Over',
  components: { Loading },
  props: {
    networkType: {
      type: String,
      default: 'L2'
    }
  },
  data() {
    return {
      showDropList: false,
      farmList: [],
      farmLoading: false,
      farmTimer: null,
      firstRequest: true
    };
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
    }
  },
  created() {
    this.getFarmInfo(false);
    if (this.farmTimer) {
      clearInterval(this.farmTimer);
      this.farmTimer = null;
    }
    this.farmTimer = setInterval(() => {
      this.getFarmInfo(false, true);
    }, 15000);
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
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;
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
      if (res.code === 1000 && res.data) {
        const tempFarmList = res.data.filter(item => item.chain === 'NERVE');
        this.farmList = this.farmList.length === 0 ? tempFarmList.map(item => ({ ...item, showDetail: false })) : this.farmList;
        this.farmLoading = false;
        await this.getStakeAccount(this.farmList);
        this.firstRequest = false;
      } else {
        this.farmList = [];
        this.farmLoading = false;
      }
    },
    // 获取当前质押资产详细信息
    async getStakeAccount(farmList) {
      this.farmList = (await Promise.all(farmList.map(async item => {
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
            address: this.currentAccount['address'][item.chain] || this.currentAccount['address'][this.chainNameToId[item.chain]] || this.currentAccount['address'][this.nativeId]
          }
        });
        if (accountRes.data) {
          const { amount, reward } = accountRes.data;
          return {
            ...item,
            ...accountRes.data,
            stakedAsset,
            syrupAsset,
            profitNumber: item.profit.split('%')[0] || '0',
            amount: divisionDecimals(amount || 0, item.stakeToken && item.stakeToken.decimals),
            reward: this.numberFormat(tofix(divisionDecimals(reward || 0, item.syrupToken && item.syrupToken.decimals), 4, -1), 4),
            syrupUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(reward || 0, item.syrupToken && item.syrupToken.decimals), item.syrupToken.usdPrice || 0), 4, -1), 4),
            stakeUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(amount || 0, item.stakeToken && item.stakeToken.decimals), item.stakeToken.usdPrice || 0), 4, -1), 4),
            showDetail: false
          };
        }
        return { ...item, stakedAsset, syrupAsset, showDetail: false };
      })));
      console.log(this.farmList, '==L2 ended farmList==');
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
      return !isEn ? `执行解锁操作后，收益将在${lockDay}天后解锁，你可以在下方将已解锁的Token领取到你的账户地址` : `After executing the unlocking operation, the reward will be unlocked in ${lockDay} days and then you can claim the unlocked Token to your address`;
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
