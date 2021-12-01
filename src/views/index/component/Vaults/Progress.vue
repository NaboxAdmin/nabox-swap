<template>
  <div class="p-3 main-cont">
    <div class="loading-cont" v-if="farmLoading"
         element-loading-background="rgba(255, 255, 255, 0.1)"
         v-loading="farmLoading" />
    <div class="d-flex direction-column mb-3"
         v-for="(item, index) in farmList"
         :key="`${item.farmKey}-${item.pid}`"
         @click.stop="showDetailInfo(item)"
         v-else-if="farmList.length !== 0">
      <div class="farm-item p-3 bg-white d-flex align-items-center space-between"
           :class="{ 'farm_item_show': item.showDetail, 'farm_item_hide': !item.showDetail }">
        <div class="d-flex direction-column">
          <div class="farm-icon d-flex align-items-center">
          <span class="icon">
            <img :src="item.icon || pictureError" @error="pictureError" alt="">
          </span>
            <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
          </div>
          <div class="farm-info mt-2 d-flex align-items-center">
            <div class="d-flex direction-column mr-100">
              <span class="text-90 size-26">
                {{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}
              </span>
              <span class="font-500 size-36 mt-1">{{ (item.reward || 0) | numFormat }}</span>
            </div>
            <div class="d-flex direction-column">
              <span class="text-90 size-26">APR</span>
              <span class="font-500 size-36 mt-1">{{ item.profit || '0%' }}</span>
            </div>
          </div>
        </div>
        <div class="drop-icon" :class="{'rotate_x': item.showDetail}">
          <img src="@/assets/image/dorp_active.png" alt="">
        </div>
      </div>
      <div class="farm-detail_info"
           :class="{ 'show_transition': item.showDetail }"
           @click.stop
           v-if="item.showDetail">
        <div class="d-flex align-items-center space-between">
          <span class="text-90 size-28">TVL</span>
          <div class="d-flex align-items-center size-28">
            <span class="text-3a">${{ item.tvl }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28">{{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}</div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 word-break w-330">{{ (item.reward || 0) | numFormat }}</span>
            <span
                class="item-btn size-30"
                :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' }"
                v-if="!item.needReceiveAuth"
                @click.stop="receiveClick(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
            <span
                class="item-btn size-30"
                v-else
                @click="receiveApprove(item.farmKey, item)">{{ $t("vaults.over6") }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28">{{ $t("vaults.vaults4") }}</div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 word-break w-330">{{ (item.amount || 0) | numFormat }}</span>
            <div class="btn-group">
              <template v-if="!item.needStakeAuth">
                <div class="btn-item"
                     :class="{ disabled_btn: !item.amount || item.amount == 0 || !item.reward || item.reward==0 || item.reward<0 }"
                     @click="showClick('decrease', item.farmKey, item)">-</div>
                <div class="btn-item ml-3"
                     @click="showClick('increase', item.farmKey, item)">+</div>
              </template>
              <div
                  class="item-btn size-30"
                  v-else
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
          <div class="px-cont mt-3"></div>
          <div class="size-28 mt-3 d-flex space-between align-items-center">
            <span class="d-flex align-items-center text-90 size-28">
              <span>{{ $t("vaults.vaults12") }}{{ item.syrupAsset && item.syrupAsset.symbol || 'NABOX' }}</span>
              <el-tooltip :manual="false" class="tooltip-item ml-1" effect="dark" :content="formatContent(item.lockDays || 1)" placement="top">
                <span class="info-icon">
                  <img src="@/assets/image/info.png"/>
                </span>
              </el-tooltip>
            </span>
            <div class="d-flex align-items-center size-28">
              <span class="text-3a">{{ item.lockNumbers || 0 | numFormat }}</span>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("vaults.vaults13") }}{{ item.syrupAsset && item.syrupAsset.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <span class="size-40 word-break w-330">{{ (item.unlockNumbers || 0) | numFormat }}</span>
              <span
                  class="item-btn size-30"
                  v-if="!item.needReceiveAuth"
                  :class="{ active_btn: item.unlockNumbers == 0 }"
                  @click="confirmUnlocked(item.farmKey, item)">{{ $t("vaults.vaults14") }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="text-center mt-4 text-grey">{{ $t('modal.modal3') }}</div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  props: {
    farmList: {
      type: Array,
      default: () => []
    },
    farmLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDropList: false,
      progressFarmList: [],
      // showDetail: true
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
          })
        }
      }
    }
  },
  methods: {
    showClick(type, farmHash, item) {
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;
      if (type === 'decrease' && (!Number(item.amount) || !item.amount || item.amount == 0 || !item.reward || item.reward==0 || item.reward<0)) return false;
      this.$emit('showClick', { type, farmHash: item.farmKey, item });
    },
    // 领取
    receiveClick(farmHash, farm) {
      if (!farm.reward || farm.reward==="0") return false;
      this.$emit('receiveClick', { farmHash, farm });
    },
    // 领取资产授权
    receiveApprove(farmHash, farm) {
      if (!farm.reward) return false;
      this.$emit('receiveApprove', { farmHash, farm });
    },
    // 质押资产授权
    stakeApprove(farmHash, farm) {
      this.$emit('stakeApprove', { farmHash, farm });
    },
    // 显示Farm详细信息
    showDetailInfo(farm) {
      for (let item of this.farmList) {
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
      return !isEn ? `领取的收益将在${lockDay}天内处于锁定状态` : `The received income will be locked for ${lockDay} days`
    }
  }
}
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
  margin-right: 100px;
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
</style>