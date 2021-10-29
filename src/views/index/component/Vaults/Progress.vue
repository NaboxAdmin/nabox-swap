<template>
  <div class="p-3 main-cont">
    <div class="loading-cont" v-if="farmLoading"
         element-loading-background="rgba(255, 255, 255, 0.1)"
         v-loading="farmLoading" />
    <div class="detail-item mt-3"
         v-for="(item, index) in farmList"
         v-else-if="farmList.length !== 0"
         :key="item.farmKey">
      <div class="d-flex align-items-center pl-3">
        <span class="icon">
          <img :src="getPicture(item.icon)" @error="pictureError" alt="">
        </span>
        <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
      </div>
      <div class="d-flex direction-column pt-3 pb-3 border-bottom">
        <span class="text-center size-48 font-500">{{ item.profit || '0%' }}</span>
        <span class="text-center size-24 text-90 mt-1">{{ $t("vaults.over1") }}</span>
      </div>
      <div class="mt-3">
        <div class="size-28 d-flex space-between align-items-center pl-3 pr-3">
          <span class="text-90 size-28">TVL</span>
          <div class="d-flex align-items-center size-28">
            <span class="text-3a">${{ item.tvl }}</span>
<!--            <span class="drop_down ml-1" :class="{'rotate_x': showDropList}">-->
<!--                  <img src="@/assets/image/drop_down_black.png" alt="">-->
<!--                </span>-->
          </div>
        </div>
<!--        <div class="drop_info" v-if="showDropList">-->
<!--          <div class="size-28 mt-3 d-flex space-between align-items-center">-->
<!--            <span class="text-90 size-28">ETH</span>-->
<!--            <span class="text-3a font-bold">$ 2739,367,212.27</span>-->
<!--          </div>-->
<!--          <div class="size-28 mt-3 d-flex space-between align-items-center">-->
<!--            <span class="text-90 size-28">BSC</span>-->
<!--            <span class="text-3a font-bold">$ 2739,367,212.27</span>-->
<!--          </div>-->
<!--          <div class="size-28 mt-3 d-flex space-between align-items-center">-->
<!--            <span class="text-90 size-28">Heco</span>-->
<!--            <span class="text-3a font-bold">$ 2739,367,212.27</span>-->
<!--          </div>-->
<!--        </div>-->
        <div class="vaults-item">
          <div class="text-90 size-28">{{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}</div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 word-break w-330">{{ (item.reward || 0) | numFormat }}</span>
            <span
                class="item-btn size-30"
                :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' }"
                v-if="!item.needReceiveAuth"
                @click="receiveClick(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
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
        <div class="pl-72 size-28 text-right text-6e" @click="$router.push({ path: '/swap' })">{{ $t("vaults.over5") }}{{ item.stakedAsset && item.stakedAsset.symbol }}</div>
      </div>
    </div>
    <div v-else class="text-center mt-4 text-grey">No Data</div>
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
      showDropList: false
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
</style>