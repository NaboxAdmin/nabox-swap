<template>
  <div class="p-3 main-cont">
    <div
      v-loading="farmLoading"
      v-if="farmLoading"
      class="loading-cont"
      element-loading-background="rgba(255, 255, 255, 0.1)" />
    <div
      v-for="(item, index) in farmList"
      v-else-if="farmList.length !== 0"
      :key="`${item.farmKey}-${item.pid}`"
      class="d-flex direction-column mb-3 border_d8"
      @click="showDetailInfo(item)">
      <div
        :class="{ 'farm_item_show': item.showDetail, 'farm_item_hide': !item.showDetail }"
        class="farm-item p-3 bg-white d-flex align-items-center space-between">
        <div class="d-flex direction-column">
          <div class="farm-icon d-flex align-items-center">
            <span class="icon">
              <img v-lazy="item.icon || pictureError" alt="" @error="pictureError">
            </span>
            <span class="size-30 ml-1 font-500">{{ item.farmName || '' }}</span>
          </div>
          <div class="farm-info mt-4 d-flex align-items-center">
            <div class="d-flex direction-column mr-100 min-200">
              <span class="text-90 size-26">
                {{ $t("vaults.over2") }} {{ item.syrupToken && item.syrupToken.symbol }}
              </span>
              <template>
                <Loading v-if="firstLoading" class="mt-2"/>
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
          <div class="d-flex align-items-center text-90 size-28">
            <span>{{ $t("vaults.over2") }} {{ item.syrupToken && item.syrupToken.symbol }} </span>
            <!--            <span v-if="item.lockCandy">({{ formatContent(item.lockDays || 1) }})</span>-->
            <el-tooltip v-if="item.lockCandy" :manual="false" :content="formatContent(item.lockDays)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <template>
                <Loading v-if="firstLoading"/>
                <span v-else class="size-40 word-break w-330 mt-2">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
              </template>
              <span class="mt-1 text-90 size-26">≈${{ (item.syrupUsdPrice || 0) | numFormatFix }}</span>
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
            <span>{{ item.stakeToken && item.stakeToken.symbol || 'USDTN' }} {{ $t("vaults.vaults4") }} </span>
            <!--<span v-if="item.withdrawLockTime">({{ formatLockContent(item.withdrawLockTime) }})</span>-->
            <el-tooltip v-if="item.withdrawLockTime" :manual="false" :content="formatLockContent(item.withdrawLockTime)" class="tooltip-item ml-1" effect="dark" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png">
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <div class="d-flex direction-column">
              <template>
                <Loading v-if="firstLoading" class="mt-1"/>
                <span v-else class="size-40 word-break w-330 mt-2">{{ (item.amount || 0) | numFormat }}</span>
              </template>
              <span class="mt-1 text-90 size-26">≈${{ (item.stakeUsdPrice || 0) | numFormatFix }}</span>
            </div>
            <div class="btn-group">
              <template>
                <Loading v-if="firstLoading" class="mt-1"/>
                <template v-else>
                  <template>
                    <div
                      :class="{ disabled_btn: !item.amount || item.amount == 0 }"
                      class="btn-item cursor-pointer"
                      @click="showClick('decrease', item.farmKey, item)">-</div>
                    <div
                      class="btn-item cursor-pointer ml-3"
                      @click="showClick('increase', item.farmKey, item)">+</div>
                  </template>
                  <!--                  <div-->
                  <!--                    v-else-->
                  <!--                    class="item-btn size-30"-->
                  <!--                    @click="stakeApprove(item.farmKey, item, index)">-->
                  <!--                    <span :class="{'mr-1': item.approveLoading}">{{ $t("vaults.over6") }}</span>-->
                  <!--                    <Loading v-if="item.approveLoading" :is-active="false"/>-->
                  <!--                  </div>-->
                </template>
              </template>
            </div>
          </div>
        </div>
        <div class="mt-3 size-28 text-right text-6e d-flex justify-content-end cursor-pointer" @click="toSwap(item)">
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
              <!--              <el-tooltip :manual="false" class="tooltip-item ml-1" effect="dark" :content="formatContent(item.lockDays || 1)" placement="top">-->
              <!--                <span class="info-icon">-->
              <!--                  <img src="@/assets/image/info.png"/>-->
              <!--                </span>-->
              <!--              </el-tooltip>-->
            </span>
            <div class="d-flex align-items-center size-28">
              <template>
                <Loading v-if="firstLoading" class="mt-1"/>
                <span v-else class="text-3a">{{ item.lockNumbers || 0 | numFormat }}</span>
              </template>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("airdrop.airdrop5") }} {{ item.syrupToken && item.syrupToken.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <div class="d-flex direction-column">
                <template>
                  <Loading v-if="firstLoading" class="mt-1"/>
                  <span v-else class="size-40 word-break w-330 mt-2">{{ (item.unlockNumbers || 0) | numFormat }}</span>
                </template>
                <span class="mt-1 text-90 size-26">≈${{ (item.unlockUsdPrice || 0) | numFormatFix }}</span>
              </div>
              <span
                v-if="!item.needReceiveAuth"
                :class="{ active_btn: !item.unlockNumbers || item.unlockNumbers == 0 }"
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
import { Division } from '@/api/util';
import { Loading, FarmLoading } from '@/components';

export default {
  name: 'Progress',
  components: { Loading, FarmLoading },
  props: {
    farmList: {
      type: Array,
      default: () => []
    },
    farmLoading: {
      type: Boolean,
      default: false
    },
    approveLoading: {
      type: Boolean,
      default: false
    },
    firstLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showDropList: false,
      progressFarmList: [],
      showApproveLoading: false
      // showDetail: true
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
            if (item.showDetail && this.farmList[index]) {
              this.farmList[index].showDetail = item.showDetail;
            }
          });
        }
      }
    }
  },
  methods: {
    toSwap(farm) {
      this.isMobile ? window.location.href = `${farm.lpUrl}` : window.open(`${farm.lpUrl}`);
    },
    showClick(type, farmHash, item) {
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;  || !item.reward || item.reward == 0 || item.reward < 0
      if (type === 'decrease' && (!Number(item.amount) || !item.amount || item.amount == 0)) return false;
      this.$emit('showClick', { type, farmHash: item.farmKey, item });
    },
    // 领取
    receiveClick(farmHash, farm) {
      if (!farm.lockCandy && (!farm.reward || farm.reward === '0' || farm.reward === 0)) return false;
      if (farm.lockCandy && (!farm.pendingReward || farm.pendingReward === 0 || farm.pendingReward === '0')) return false;
      this.$emit('receiveClick', { farmHash, farm });
    },
    // 质押资产授权
    stakeApprove(farmHash, farm, index) {
      if (farm.approveLoading) return false;
      this.$emit('stakeApprove', { farmHash, farm, index });
    },
    // 显示Farm详细信息
    showDetailInfo(farm) {
      for (const item of this.farmList) {
        if (`${item.farmKey}-${item.pid}` === `${farm.farmKey}-${farm.pid}`) {
          farm.showDetail = !farm.showDetail;
        } else {
          item.showDetail = false;
        }
      }
    },
    // 完成解锁
    confirmUnlocked(farmHash, farm) {
      if (farm.unlockNumbers == 0) return false;
      this.$emit('confirmUnlocked', { farmHash, farm });
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
.main-cont {
  .el-loading-mask {
    background-color: transparent !important;
  }
}
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
.mr-100 {
  margin-right: 40px;
}
.min-200 {
  min-width: 250px;
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
.p_custom {
  padding: 30px 30px 0 30px;
}
.border_d8 {
  border: 1px solid #DBDEE8;
  border-radius: 20px;
}
</style>
