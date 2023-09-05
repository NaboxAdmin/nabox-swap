<template>
  <div class="buy-cont">
    <span class="text-3a size-28">支付</span>
    <assetInput/>
    <div class="change-cont">
      <img src="@/assets/svg/change_icon.svg" alt="">
    </div>
    <span class="text-3a size-28">获得</span>
    <assetInput/>
  </div>
</template>

<script>
import coinItem from '@/views/Buy/component/coinItem';
import assetInput from '@/views/Buy/component/assetInput';
export default {
  name: 'Buy',
  components: { coinItem, assetInput }
};
</script>

<style scoped lang="scss">
.buy-cont {
  padding: 16px;
  .pay-asset-const {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20px;
    border: 1px solid #E6E9F0;
    height: 96px;
    input {
      color: #3A3C44;
      flex: 1;
      width: 50px;
      border: none;
      background-color: transparent;
      outline: none;
      font-size: 36px;
      font-weight: 500;
      padding: 0px 32px;
      border-right: 1px solid #E6E9F0;
      height: 100%;
      &::placeholder {
        color: #ABB1BA;
        font-size: 30px;
      }
    }
  }
  .change-cont {
    padding-left: 88px;
    margin: 16px 0;
    img {
      height: 112px;
      width: 56px;
    }
  }
}
.mt-16 {
  margin-top: 16px;
}
</style>
