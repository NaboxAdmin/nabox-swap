<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="maskClick" @touchmove.prevent>
    <div :class="{'show_modal-cont': showModal}" class="modal-cont" @click.stop @touchmove.stop>
      <div class="header-cont size-36 font-500 mt-2">
        {{ $t('tips.tips70') }}
        <div class="back-icon" @click="back">
          <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
        </div>
      </div>
      <div class="import-cont mt-4">
        <div class="tip-text">
          <p>{{ $t('tips.tips68') }}</p>
          <p>{{ $t('tips.tips69') }}</p>
        </div>
        <div class="asset-import">
          <div class="asset-info flex-1">
            <span class="asset-icon">
              <img v-lazy="assetInfo.icon || getPicture(assetInfo.symbol) || pictureError" alt="">
            </span>
            <span class="asset-detail flex-1 d-flex direction-column">
              <span class="size-30 text-3a">{{ assetInfo.symbol }}</span>
              <span class="size-24">{{ superLong(assetInfo.contractAddress) }}</span>
            </span>
          </div>
          <div class="show-explorer text-6e d-flex mr-4" @click="viewClick">
            <span class="explorer-icon">
              <img src="@/assets/image/link.svg" alt="">
            </span>
            <span class="ml-1 size-16">{{ $t('tips.tips72') }}</span>
          </div>
        </div>
      </div>
      <div class="confirm-cont">
        <div class="d-flex flex-1" @click="isChoose = !isChoose">
          <template>
            <span class="radio-cont">
              <img v-if="!isChoose" src="@/assets/image/nochoose.svg" alt="">
              <img v-else src="@/assets/image/choose.svg" alt="">
            </span>
          </template>
          <span class="text-3a size-16">{{ $t('tips.tips73') }}</span>
        </div>
        <div :class="{'disabled_btn': !isChoose }" class="import-btn" @click="submitImport">{{ $t('tips.tips71') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportModal',
  props: {
    showModal: {
      type: Boolean,
      default: true
    },
    assetInfo: {
      type: Object,
      default: () => {}
    },
    modalType: {
      type: String,
      default: 'send'
    }
  },
  data() {
    return {
      isChoose: false
    };
  },
  methods: {
    back() {
      this.$emit('update:showModal', false);
    },
    maskClick() {
      this.$emit('update:showModal', false);
    },
    viewClick() {
      const config = JSON.parse(sessionStorage.getItem('supportChainList'));
      const currentChainInfo = config.find(item => this.nativeId === item.nativeId);
      if (currentChainInfo.chainType == 1) {
        this.isMobile ? window.location.href = `${currentChainInfo.origin}token/info?contractAddress=${this.assetInfo.contractAddress}` : window.open(`${currentChainInfo.origin}token/info?contractAddress=${this.assetInfo.contractAddress}`);
      } else if (currentChainInfo.chainType == 2) {
        this.isMobile ? window.location.href = `${currentChainInfo.origin}token/${this.assetInfo.contractAddress}` : window.open(`${currentChainInfo.origin}token/${this.assetInfo.contractAddress}`);
      } else if (currentChainInfo.chainType == 3) {
        this.isMobile ? window.location.href = `${currentChainInfo.origin}token20/${this.assetInfo.contractAddress}` : window.open(`${currentChainInfo.origin}token20/${this.assetInfo.contractAddress}`);
      }
    },
    submitImport() {
      if (!this.isChoose) return false;
      const userAssetList = localStorage.getItem('userAssetList') && JSON.parse(localStorage.getItem('userAssetList')) || [];
      userAssetList.push(this.assetInfo);
      localStorage.setItem('userAssetList', JSON.stringify(userAssetList));
      this.$emit('select', { coin: this.assetInfo, type: this.modalType });
    }
  }
};
</script>

<style scoped lang="scss">
@import "Modal";
.tip-text {
  //width: 550px;
  //height: 220px;
  margin-right: 40px;
  padding: 50px 40px;
  background: #FEF6E5;
  border-radius: 20px;
  color: #F3AD41;
  font-size: 30px;
  p {
    line-height: 45px;
  }
}
.asset-import {
  margin-top: 60px;
  display: flex;
  align-items: center;
  .asset-info {
    display: flex;
    align-items: center;
    .asset-icon {
      height: 52px;
      width: 52px;
      margin-right: 18px;
      border-radius: 50%;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
}
.explorer-icon {
  height: 29px;
  width: 29px;
  img {
    height: 100%;
    width: 100%;
  }
}
.text-6e {
  color: #6EB6A9;
}
.confirm-cont {
  margin-top: 70px;
  display: flex;
  align-items: center;
  .radio-cont {
    width: 26px;
    height: 26px;
    //border: 1px solid #AAB2C9;
    border-radius: 4px;
    margin-right: 13px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
.modal-cont {
  height: 860px;
}
</style>
