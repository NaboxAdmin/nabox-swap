<template>
  <div class="buy-detail-cont">
    <span class="text-3a size-30">{{ $t('buy.buy10') }}</span>
    <div class="d-flex align-items-center mt-16">
      <assetInput
        :type="'pay'"
        :asset-item="currentPayType"
        :input-value="payAmount"
        :class="errorMsg && 'border-red'"
        class="flex-1"
        @selectCoin="selectCoin('pay')"
        @input="payAmountDebounce"
      />
      <span class="text-3a size-26 mr-2 ml-2">{{ $t('buy.buy10') }}</span>
      <div class="coin-wrap">
        <coinItem :type="'get'" :asset-item="currentGetToken" @click="selectCoin('get')"/>
      </div>
    </div>
    <div v-if="errorMsg" class="text-red mt-2 size-26">{{ errorMsg }}</div>
    <div :class="addressErrorMsg && 'border-red'" class="address-input">
      <input
        v-model="userWalletAddress"
        class="size-28"
        type="text"
        @focus="addressFocus($event)"
        @input="addressInput">
      <img class="copy-icon" src="@/assets/svg/copyIcon.svg" alt="" @click="pasteClick">
    </div>
    <div v-if="addressErrorMsg" class="text-red size-26 mt-16">{{ addressErrorMsg }}</div>
    <div v-loading="showComputedLoading" class="position-relative">
      <div/>
      <div class="text-3a size-30 mt-48">{{ $t('buy.buy11') }}</div>
      <div class="channel-cont">
        <div :class="'active-channel'" class="channel-item">
          <div class="radio-item"/>
          <div class="channel-info d-flex">
            <img class="channel-img" src="https://ramp.fatpay.xyz/favicon.png" alt="">
            <div class="channel-detail d-flex direction-column flex-1">
              <span class="text-3a size-30 font-500">{{ 'FaTPay' }}</span>
              <span class="text-90 size-24 mt-1">{{ currentOption && currentOption.cryptoCurrencyUnitPrice || '--' }}{{ currentOption && currentOption.fiatCurrency }}</span>
            </div>
            <div v-if="currentPayType && currentPayType.paymentOptions" class="pay-cont d-flex">
              <div v-for="item in currentPayType.paymentOptions" :key="item.name" class="pay-item">
                <img :src="item.icon" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-3a size-30 mt-48">{{ $t('buy.buy12') }}</div>
      <div class="buy-info">
        <div class="buy-info-item">
          <span class="tag-title">{{ $t('buy.buy1') }}</span>
          <span class="tag-info">FaTPay</span>
        </div>
        <div class="buy-info-item">
          <span class="tag-title">{{ $t('buy.buy3') }}</span>
          <span v-if="currentOption" class="tag-info">{{ currentOption.currencyAmount }}<span class="tag-title">{{ currentOption.fiatCurrency }}</span></span>
          <span v-else>--</span>
        </div>
        <div class="buy-info-item">
          <span class="tag-title">{{ $t('buy.buy2') }}</span>
          <span v-if="currentOption" class="tag-info">1{{ currentOption.cryptoCurrency }}≈{{ currentOption.cryptoCurrencyUnitPrice }}<span class="tag-title">{{ currentOption.fiatCurrency }}</span></span>
          <span v-else>--</span>
        </div>
        <div class="buy-info-item">
          <span class="tag-title">{{ $t('buy.buy4') }}</span>
          <span v-if="currentOption" class="tag-info">{{ currentOption.cryptoCurrencyAmount }}<span class="tag-title">{{ currentOption.cryptoCurrency }}</span></span>
          <span v-else>--</span>
        </div>
        <div class="buy-info-item">
          <span class="tag-title">{{ $t('buy.buy5') }}</span>
          <span v-if="currentOption" class="tag-info">{{ currentOption.network }}</span>
          <span v-else>--</span>
        </div>
      </div>
    </div>
    <div :class="!canNext && 'opacity_btn'" class="btn cursor-pointer size-30 mt-145 mt-8" @click="nextStep">{{ $t('swap.swap8') }}</div>
    <payCoinModal
      :show-modal.sync="showModal"
      :token-list="showTokenList"
      :type="coinType"
      @selectAsset="selectAsset"/>
    <pop-up :prevent-boo="false" :show.sync="showTips">
      <div class="address-detail_pop">
        <div class="customer-p4">
          <div class="icon-cont d-flex space-between">
            <div class="font-500">{{ $t('buy.buy15') }}</div>
            <span class="cursor-pointer" @click="showTips=false">
              <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"/></svg>
            </span>
          </div>
          <div style="line-height: 24px" class="mt-4 size-28">{{ $t('buy.buy17') }}</div>
          <div class="d-flex flex-1 mt-3 align-items-center cursor-pointer" @click="isChoose = !isChoose">
            <template>
              <span class="radio-cont">
                <img v-if="!isChoose" src="@/assets/image/nochoose.svg" alt="">
                <img v-else src="@/assets/image/choose.svg" alt="">
              </span>
            </template>
            <span class="text-primary size-14">{{ $t('buy.buy16') }}</span>
          </div>
          <div :class="!isChoose && 'opacity_btn'" class="btn cursor-pointer mt-2" @click="confirmLink">{{ $t('pool.join4') }}</div>
        </div>
      </div>
    </pop-up>
  </div>
</template>

<script>
import assetInput from '@/views/Buy/component/assetInput';
import coinItem from '@/views/Buy/component/coinItem';
import Button from '@/views/Buy/component/button';
import payCoinModal from '@/views/Buy/component/payCoinModal';
import PopUp from '@/components/PopUp/PopUp';
import { debounce, FAT_PAY_PARTNER_ID, Minus, TRON } from '@/api/util';
import { validateAddress, validateNerveAddress } from '@/api/api';
import TronLink from '@/api/tronLink';
export default {
  name: 'BuyDetail',
  components: {
    assetInput,
    coinItem,
    Button,
    payCoinModal,
    PopUp
  },
  data() {
    this.payAmountDebounce = debounce(this.amountInput, 800);
    return {
      showModal: false,
      coinType: '',
      payTokens: [],
      payTypes: [],
      showTokenList: [],
      currentPayType: null,
      currentGetToken: null,
      currentOption: null,
      errorMsg: '',
      addressErrorMsg: '',
      tokenAmount: '',
      payAmount: '',
      showComputedLoading: false,
      userWalletAddress: '',
      showTips: false,
      isChoose: false
    };
  },
  computed: {
    canNext() {
      return !this.showComputedLoading && !this.errorMsg && !this.addressErrorMsg && this.currentOption && this.userWalletAddress;
    }
  },
  created() {
    this.currentPayType = sessionStorage.getItem('CURRENT_PAY_TYPE') && JSON.parse(sessionStorage.getItem('CURRENT_PAY_TYPE')) || null;
    this.currentGetToken = sessionStorage.getItem('CURRENT_TOKEN') && JSON.parse(sessionStorage.getItem('CURRENT_TOKEN')) || null;
    this.currentOption = sessionStorage.getItem('CURRENT_PAY_OPTION') && JSON.parse(sessionStorage.getItem('CURRENT_PAY_OPTION')) || null;
    this.payTokens = sessionStorage.getItem('GET_TOKENS') && JSON.parse(sessionStorage.getItem('GET_TOKENS')) || null;
    this.payTypes = sessionStorage.getItem('PAY_TYPES') && JSON.parse(sessionStorage.getItem('PAY_TYPES')) || null;
    setTimeout(() => {
      this.payAmount = this.currentOption && this.currentOption.currencyAmount;
      if (this.currentGetToken && this.currentGetToken.network === 'tron') {
        this.userWalletAddress = this.currentAccount && this.currentAccount['address'] && this.currentAccount['address']['TRON'];
      } else {
        this.userWalletAddress = this.currentAccount && this.currentAccount['address'] && this.currentAccount['address']['1'] || this.currentAccount['address']['BSC'] || this.currentAccount['address']['97'] || '';
      }
    });
  },
  methods: {
    async confirmLink() {
      try {
        const nonce = Math.floor(Math.random() * 900000) + 100000;
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const evmAddress = this.currentAccount && this.currentAccount['address'] && this.currentAccount['address']['1'] || this.currentAccount['address']['BSC'] || this.currentAccount['address']['97'];
        const params = {
          requestParam: {
            nonce: nonce.toString(),
            partnerId: FAT_PAY_PARTNER_ID,
            timestamp: timestamp.toString(),
            walletAddress: this.userWalletAddress || evmAddress
            // walletAddressLocked: '1'
          }
        };
        const res = await this.$request({
          url: '/currency/fatpay/sign',
          data: params
        });
        if (res.code === 1000) {
          const encodedString = res.data;
          const url = `https://ramp.fatpay.xyz/home?amount=${this.payAmount}&defaultFiatCurrency=${this.currentPayType.fiatCurrency}&defaultCurrency=${this.currentGetToken.cryptoCurrencyCode.toLocaleUpperCase()}&nonce=${nonce}&partnerId=${FAT_PAY_PARTNER_ID}&timestamp=${timestamp}&walletAddress=${this.userWalletAddress || evmAddress}&windowOpen=1&signature=${encodedString}`;
          this.isMobile ? window.location.href = `${url}` : window.open(`${url}`);
        }
        this.showTips = false;
        this.isChoose = false;
      } catch (e) {
        console.log(e, 'error');
        const url = `https://ramp.fatpay.xyz/home`;
        this.isMobile ? window.location.href = `${url}` : window.open(`${url}`);
        this.showTips = false;
        this.isChoose = false;
      }
    },
    async pasteClick() {
      try {
        const clipBoard = navigator.clipboard;
        const text = await clipBoard.readText();
        if (text) {
          this.userWalletAddress = text;
          this.addressInput();
        }
      } catch (error) {
        console.error('Failed to read clipboard data:', error);
      }
    },
    addressFocus(event) {
      event.currentTarget.select();
    },
    addressInput() {
      console.log(this.currentGetToken && this.userWalletAddress, 'this.currentGetToken && this.userWalletAddress');
      if (this.currentGetToken && this.userWalletAddress) {
        if (this.currentGetToken.network === 'NULS' && !validateNerveAddress(this.userWalletAddress, 'NULS')) {
          this.addressErrorMsg = this.$t('swap.swap61');
        } else if (this.currentGetToken.currentGetToken === 'NERVE' && !validateNerveAddress(this.userWalletAddress, 'NERVE')) {
          this.addressErrorMsg = this.$t('swap.swap61');
        } else if (this.currentGetToken.network === 'tron') {
          const tron = new TronLink();
          if (!tron.validAddress(this.userWalletAddress)) {
            this.addressErrorMsg = this.$t('swap.swap61');
          } else {
            this.addressErrorMsg = '';
          }
        } else if (this.currentGetToken.network !== 'NULS' && this.currentGetToken.network !== 'NERVE' && this.currentGetToken.network !== 'tron' && !validateAddress(this.userWalletAddress)) {
          this.addressErrorMsg = this.$t('swap.swap61');
        } else {
          this.addressErrorMsg = '';
        }
      } else if (!this.toAddress) {
        this.addressErrorMsg = this.$t('swap.swap61');
      } else {
        this.addressErrorMsg = '';
      }
    },
    async amountInput(amount) {
      try {
        if (!this.currentPayType || !this.currentGetToken) {
          this.errorMsg = '';
          return;
        }
        if (!amount) {
          this.errorMsg = this.$t('swap.swap63');
          return;
        }
        this.payAmount = amount || this.payAmount;
        const limit = this.checkPayMethodLimit(amount || this.payAmount);
        if (limit) return;
        this.showComputedLoading = true;
        const tempOption = this.currentPayType && this.currentPayType.paymentOptions;
        const tempPriceOptions = await Promise.allSettled(tempOption.map(async item => {
          const res = await this.getPaymentPrice(item.name);
          if (res) {
            return res;
          }
        }));
        const priceOptions = tempPriceOptions.map(item => item.value);
        this.currentOption = priceOptions && priceOptions[0];
        this.tokenAmount = this.currentOption && this.currentOption.cryptoCurrencyAmount || '';
        this.showComputedLoading = false;
      } catch (e) {
        console.error(e, 'error');
        this.showComputedLoading = false;
      }
    },
    async nextStep() {
      if (!this.canNext) return;
      sessionStorage.setItem('CURRENT_TOKEN', JSON.stringify(this.currentGetToken));
      sessionStorage.setItem('CURRENT_PAY_TYPE', JSON.stringify(this.currentPayType));
      sessionStorage.setItem('CURRENT_PAY_OPTION', JSON.stringify(this.currentOption));
      this.showTips = true;
    },
    checkPayMethodLimit(amount) {
      const tempOption = this.currentPayType.paymentOptions[0];
      const { maxAmount, minAmount } = tempOption;
      if (Minus(amount, minAmount) < 0) {
        this.errorMsg = `${this.$t('swap.swap60')}${minAmount}${this.currentPayType && this.currentPayType.fiatCurrency}`;
        return true;
      } else if (Minus(amount, maxAmount) > 0) {
        this.errorMsg = `${this.$t('swap.swap59')}${maxAmount}${this.currentPayType && this.currentPayType.fiatCurrency}`;
        return true;
      } else {
        this.errorMsg = '';
      }
      return false;
    },
    getBestOption(options) {
      const tempList = options.reduce((p, v) => Minus(p.minReceive || 0, v.minReceive || 0) < 0 ? v : p);
      this.channelConfigList = options.map(item => {
        if (item.channel === tempList.channel) {
          return {
            ...item,
            isBest: true,
            isChoose: true
          };
        }
        return {
          ...item,
          isBest: false,
          isChoose: false
        };
      });
      console.log(this.channelConfigList, '==channelConfigList==');
      return this.channelConfigList.reduce((p, v) => Minus(p.minReceive || 0, v.minReceive || 0) < 0 ? v : p);
    },
    async getPaymentPrice(payType) {
      const params = {
        fiatCurrency: this.currentPayType.fiatCurrency,
        currencyAmount: this.payAmount,
        cryptoCurrencyCode: this.currentGetToken.cryptoCurrencyCode,
        payment: payType
      };
      try {
        const res = await this.$request({
          url: '/currency/fatpay/price',
          data: params
        });
        if (res.code === 1000) {
          return res.data;
        }
        return null;
      } catch (e) {
        console.error(e, 'error');
        return null;
      }
    },
    selectCoin(type) {
      this.coinType = type;
      this.showModal = true;
      if (type === 'pay') {
        this.showTokenList = this.payTypes;
      } else {
        this.showTokenList = this.payTokens;
      }
    },
    selectAsset(asset) {
      if (this.coinType === 'pay') {
        this.currentPayType = asset;
        this.showModal = false;
        this.payAmount = '';
        this.errorMsg = '';
        this.currentOption = null;
      } else {
        this.showModal = false;
        if (asset.cryptoCurrencyCode !== this.currentGetToken.cryptoCurrencyCode) {
          this.currentGetToken = asset;
          if (this.currentGetToken && this.currentGetToken.network === 'tron') {
            this.userWalletAddress = this.currentAccount && this.currentAccount['address'] && this.currentAccount['address']['TRON'];
          } else {
            this.userWalletAddress = this.currentAccount && this.currentAccount['address'] && this.currentAccount['address']['1'] || this.currentAccount['address']['BSC'] || this.currentAccount['address']['97'] || '';
          }
          this.addressErrorMsg = '';
          this.payAmountDebounce(this.payAmount);
        }
      }
    }
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
    //width: 200px;
    height: 96px;
    border: 1px solid #E6E9F0;
    border-radius: 20px;
    overflow: hidden;
  }
  .address-input {
    display: flex;
    align-items: center;
    margin-top: 24px;
    padding: 0 24px 0 24px;
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
      margin-left: 15px;
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
      cursor: pointer;
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
            height: 45px;
            width: 45px;
            border-radius: 50%;
            margin-left: 10px;
            img {
              height: 100%;
              width: 100%;
            }
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
.mt-8 {
  margin-top: 80px;
}
.border-red {
  border: 1px solid red !important;
}
/deep/ .el-loading-spinner .path {
  stroke: #53b8a9;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98px;
  color: #FFFFFF;
  text-align: center;
  line-height: 98px;
  background: #53b8a9;
  border-radius: 20px;
}
.address-detail_pop {
  //padding: 40px 40px 60px 40px;
  z-index: 120;
  padding-bottom: 40px;
  background-color: #FFFFFF;
  width: 670px;
  font-size: 32px;
  border-radius: 20px;
}
.customer-p4 {
  padding: 40px 40px 0 40px;
}
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
</style>
