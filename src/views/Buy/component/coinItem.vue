<template>
  <div class="coin-item" @click="coinClick">
    <template v-if="assetItem">
      <img :src="assetItem && assetItem.icon || pictureError" class="asset_icon" alt="" @error="pictureError">
      <span class="asset-name text-truncate">{{ assetItem && (assetItem.fiatCurrency || assetItem.cryptoCurrency) || '' }}</span>
      <img class="drop_down_icon" src="@/assets/svg/drop_down_active.svg" alt="">
    </template>
    <div v-else class="w-160 d-flex align-items-center space-between">
      <span class="flex-1 size-28 w-150 text-90">{{ type === 'pay' ? $t('swap.swap65') : $t('swap.swap66') }}</span>
      <img class="drop_down_icon" src="@/assets/svg/drop_down_active.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoinItem',
  props: {
    assetItem: {
      type: Object,
      default: () => null
    },
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    coinClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped lang="scss">
.coin-item {
  display: flex;
  align-items: center;
  background-color: #f0f7f7;
  height: 100%;
  padding: 0 24px;
  overflow: hidden;
  cursor: pointer;
  width: 170px;
  .asset-name {
    flex: 1;
    margin: 0 12px;
    color: #333;
    font-size: 30px;
  }
  .asset_icon {
    flex-shrink: 0;
    height: 48px;
    width: 48px;
    border-radius: 50%;
  }
  .drop_down_icon {
    width: 16px;
    height: 10px;
  }
}
.w-160 {
  width: 160px;
}
</style>
