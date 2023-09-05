<template>
  <div class="buy-detail-cont">
    <span class="text-3a size-30">购买</span>
    <div class="d-flex align-items-center mt-16">
      <assetInput class="flex-1"/>
      <span class="text-3a size-30 mr-2 ml-2">Buy</span>
      <div class="coin-wrap">
        <coinItem/>
      </div>
    </div>
    <div class="address-input">
      <input type="text">
      <img class="copy-icon" src="@/assets/svg/copyIcon.svg" alt="">
    </div>
    <div class="text-red size-26 mt-16">123123</div>
    <div class="text-3a size-30 mt-48">渠道</div>
    <div class="channel-cont">
      <div :class="'active-channel'" class="channel-item">
        <div class="radio-item"/>
        <div class="channel-info d-flex">
          <img class="channel-img" src="" alt="">
          <div class="channel-detail d-flex direction-column flex-1">
            <span class="text-3a size-30 font-500">Coinify</span>
            <span class="text-90 size-24 mt-1">1.02USD</span>
          </div>
          <div class="pay-cont d-flex">
            <div class="pay-item"/>
            <div class="pay-item"/>
            <div class="pay-item"/>
          </div>
        </div>
      </div>
    </div>
    <div class="text-3a size-30 mt-48">购买详情</div>
    <div class="buy-info">
      <div class="buy-info-item">
        <span class="tag-title">123</span>
        <span class="tag-info">112323</span>
      </div>
      <div class="buy-info-item">
        <span class="tag-title">123</span>
        <span class="tag-info">112323<span class="tag-title">USD</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import assetInput from '@/views/Buy/component/assetInput';
import coinItem from '@/views/Buy/component/coinItem';
export default {
  name: 'BuyDetail',
  components: {
    assetInput,
    coinItem
  }
};
</script>

<style scoped lang="scss">
.mt-16 {
  margin-top: 16px;
}
.mt-48 {
  margin-top: 48px;
}
.buy-detail-cont {
  padding: 60px 32px 32px 32px;
  .coin-wrap {
    width: 200px;
    height: 96px;
    border: 1px solid #E6E9F0;
    border-radius: 20px;
  }
  .address-input {
    display: flex;
    align-items: center;
    margin-top: 24px;
    padding: 0 24px 0 32px;
    border: 1px solid #E6E9F0;
    border-radius: 20px;
    height: 96px;
    input {
      flex: 1;
      width: 50px;
      border: none;
      background-color: transparent;
      outline: none;
      font-size: 38px;
      font-weight: 500;
      &::placeholder {
        color: #ABB1BA;
        font-size: 30px;
      }
    }
    .copy-icon {
      height: 28px;
      width: 28px;
      cursor: pointer;
    }
  }
  .channel-cont {
    .channel-item {
      padding: 24px 32px;
      border: 1px solid #E6E9F0;
      border-radius: 20px;
      margin-top: 32px;
      display: flex;
      align-items: center;
      .radio-item {
        height: 22px;
        width: 22px;
        border: 1px solid #DBDEE8;
        border-radius: 50%;
      }
      .channel-info {
        flex: 1;
        margin-left: 20px;
        .channel-img {
          height: 64px;
          width: 64px;
          border-radius: 50%;
          background-color: red;
        }
        .channel-detail {
          margin-left: 12px;
          span {
            line-height: 1;
          }
        }
        .pay-cont {
          align-items: center;
          .pay-item {
            height: 30px;
            width: 45px;
            background-color: red;
            border-radius: 8px;
            margin-left: 10px;
          }
        }
      }
      &.active-channel {
        border: 1px solid #1BD0AA;
        .radio-item {
          border: 1px solid #1BD0AA;
          background-color: #1BD0AA;
        }
      }
    }
  }
  .buy-info {
    .buy-info-item {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
      .tag-title {
        color: #9095A6;
        font-size: 28px;
      }
      .tag-info {
        color: #000000;
        font-size: 28px;
      }
    }
  }
}
</style>
