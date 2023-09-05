<template>
  <div class="coin-item">
    <img class="asset_icon" src="" alt="">
    <span class="asset-name">USDT</span>
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
    background-color: red;
    border-radius: 50%;
  }
  .drop_down_icon {
    width: 16px;
    height: 10px;
  }
}
</style>
