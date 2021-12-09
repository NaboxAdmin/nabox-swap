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
            <div class="d-flex direction-column mr-100">
              <span class="text-90 size-26">
                <!--{{ item.syrupAsset && item.syrupAsset.symbol }}-->
                {{ $t("vaults.over2") }}
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
          <span class="text-90 size-28">{{ $t("navBar.navBar2") }}</span>
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
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
            <span
              v-else-if="!item.needReceiveAuth && item.lockCandy"
              :class="{ active_btn: !item.pendingReward || item.pendingReward === 0 || item.pendingReward === '0' }"
              class="item-btn size-30"
              @click.stop="receiveClick(item.farmKey, item)">{{ $t("vaults.over7") }}</span>
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
                  :class="{ disabled_btn: !item.amount || item.amount == 0 || !item.reward || item.reward==0 || item.reward<0 }"
                  class="btn-item"
                  @click="showClick('decrease', item.farmKey, item)">-</div>
                <div class="btn-item ml-3 disabled_btn">+</div>
              </template>
              <div
                v-else
                class="item-btn size-30"
                @click="stakeApprove(item.farmKey, item)">{{ $t("vaults.over6") }}</div>
            </div>
          </div>
        </div>
        <div class="mt-3 size-28 text-right text-6e d-flex justify-content-end" @click="$router.push({ path: '/swap' })">
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
              <span class="size-40 word-break w-330">{{ (item.unlockNumbers || 0) | numFormat }}</span>
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
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;
      if (type === 'decrease' && (!Number(item.amount) || !item.amount || item.amount == 0 || !item.reward || item.reward == 0 || item.reward < 0)) return false;
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
        // const stakedAsset = await this.getAssetInfo({
        //   chainId: item.stakeToken && item.stakeToken.chainId,
        //   assetId: item.stakeToken && item.stakeToken.assetId,
        //   contractAddress: item.stakeToken && item.stakeToken.contractAddress,
        //   chain: item.chain
        // }); // 获取当前可质押的资产
        // const syrupAsset = await this.getAssetInfo({
        //   chainId: item.syrupToken && item.syrupToken.chainId,
        //   assetId: item.syrupToken && item.syrupToken.assetId,
        //   contractAddress: item.syrupToken && item.syrupToken.contractAddress,
        //   chain: item.chain
        // }); // 获取当前可领取资产信息
        item.needReceiveAuth = false;
        item.needStakeAuth = false;
        const accountRes = await this.$request({
          methods: 'post',
          url: '/farm/stake/account',
          data: {
            chain: item.chain,
            farmHash: item.farmKey,
            address: this.currentAccount['address'][item.chain]
          }
        });
        if (accountRes.data) {
          const { amount, reward } = accountRes.data;
          return {
            ...item,
            ...accountRes.data,
            stakedAsset,
            syrupAsset,
            amount: this.numberFormat(tofix(divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals), 2, -1), 2),
            reward: this.numberFormat(tofix(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            syrupUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), item.syrupToken.usdPrice || 0), 2, -1), 2),
            stakeUsdPrice: this.numberFormat(tofix(Times(divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals), item.stakeToken.usdPrice || 0), 2, -1), 2),
            showDetail: false
          };
        }
        return { ...item, stakedAsset, syrupAsset, showDetail: false };
      })));
      this.farmLoading = false;
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
