<template>
  <div v-if="assetItem" class="coin-item" @click="coinClick">
    <img :src="assetItem && assetItem.icon || pictureError" class="asset_icon" alt="" @error="pictureError">
    <span class="asset-name">{{ assetItem && (assetItem.fiatCurrency || assetItem.cryptoCurrency) || '' }}</span>
    <img class="drop_down_icon" src="@/assets/svg/drop_down_active.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'CoinItem',
  props: {
    assetItem: {
      type: Object,
      default: () => null
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
  width: 224px;
  .asset-name {
    margin: 0 12px;
    max-width: 200px;
    width: 100%;
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
</style>
