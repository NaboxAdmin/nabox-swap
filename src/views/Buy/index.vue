<template>
  <div>
    <Tab/>
    <div class="buy-cont">
      <span class="text-3a size-28 mt-48">{{ $t("buy.buy13") }}</span>
      <assetInput
        :type="'pay'"
        :asset-item="currentPayType"
        :input-value="payAmount"
        class="mt-16"
        @selectCoin="selectCoin('pay')"
        @input="payAmountDebounce"
      />
      <div v-if="errorMsg" class="text-red mt-2 ml-2 size-28">{{ errorMsg }}</div>
      <div class="change-cont">
        <img src="@/assets/svg/change_icon.svg" alt="">
      </div>
      <span class="text-3a size-28 mt-48">{{ $t("buy.buy14") }}</span>
      <assetInput
        :type="'get'"
        :disabled="true"
        :asset-item="currentGetToken"
        :input-value="tokenAmount"
        class="mt-16"
        @selectCoin="selectCoin('get')"
      />
      <div v-if="currentOption && currentOption.cryptoCurrencyUnitPrice" class="mt-2">
        <span class="size-28">{{ $t('swap.swap62') }} </span>
        <span class="text-1b size-28">1{{ currentOption.cryptoCurrency }}≈{{ currentOption.cryptoCurrencyUnitPrice }}{{ currentOption.fiatCurrency }}</span>
      </div>
      <template>
        <div v-if="showComputedLoading" class="btn size-30 cursor-pointer opacity_btn mt-145">
          <span>
            {{ $t("swap.swap35") }}<span class="point_cont"/>
          </span>
        </div>
        <div v-else :class="!canNext && 'opacity_btn'" class="btn cursor-pointer size-30 mt-145" @click="nextStep">{{ $t('swap.swap8') }}</div>
      </template>
      <payCoinModal
        :show-modal.sync="showModal"
        :token-list="showTokenList"
        :type="coinType"
        @selectAsset="selectAsset"/>
    </div>
  </div>
</template>

<script>
import coinItem from '@/views/Buy/component/coinItem';
import assetInput from '@/views/Buy/component/assetInput';
import payCoinModal from '@/views/Buy/component/payCoinModal';
import Tab from '@/views/Swap/component/Tab';
import {debounce, Minus, replaceBrowserHistory} from '@/api/util';
export default {
  name: 'Buy',
  components: { coinItem, assetInput, payCoinModal, Tab },
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
      tokenAmount: '',
      payAmount: '',
      showComputedLoading: false
    };
  },
  computed: {
    canNext() {
      return this.payAmount && this.currentPayType && this.currentGetToken && !this.errorMsg;
    }
  },
  created() {
    this.getPayTypes();
    this.getPayTokens();
  },
  methods: {
    async amountInput(amount) {
      try {
        if (!amount || !this.currentPayType || !this.currentGetToken) {
          this.errorMsg = '';
          this.currentOption = null;
          this.tokenAmount = '';
          return;
        }
        this.payAmount = amount;
        const limit = this.checkPayMethodLimit(amount);
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
    nextStep() {
      if (!this.canNext) return;
      sessionStorage.setItem('CURRENT_TOKEN', JSON.stringify(this.currentGetToken));
      sessionStorage.setItem('CURRENT_PAY_TYPE', JSON.stringify(this.currentPayType));
      sessionStorage.setItem('CURRENT_PAY_OPTION', JSON.stringify(this.currentOption));
      this.$router.push('/buyDetail');
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
        replaceBrowserHistory('currency', asset && asset.fiatCurrency);
        this.showModal = false;
        this.payAmount = '';
        this.tokenAmount = '';
        this.errorMsg = '';
        this.currentOption = null;
      } else {
        this.showModal = false;
        this.tokenAmount = '';
        if (asset.cryptoCurrencyCode !== this.currentGetToken.cryptoCurrencyCode) {
          this.currentGetToken = asset;
          replaceBrowserHistory('token', asset && asset.cryptoCurrencyCode);
          this.currentOption = null;
          this.payAmountDebounce(this.payAmount);
        }
      }
    },
    // 获取支持的token
    async getPayTokens() {
      try {
        const res = await this.$request({
          method: 'get',
          url: '/currency/fatpay/tokens'
        });
        if (res.code === 1000 && res.data) {
          this.payTokens = res.data;
          if (this.$route.query.token) {
            const tempCurrentGetToken = res.data.find(item => item.cryptoCurrencyCode === this.$route.query.token);
            this.currentGetToken = tempCurrentGetToken || res.data && res.data[0];
          } else {
            this.currentGetToken = res.data && res.data[0];
          }
          replaceBrowserHistory('token', this.currentGetToken && this.currentGetToken.cryptoCurrencyCode);
          sessionStorage.setItem('GET_TOKENS', JSON.stringify(this.payTokens));
        }
      } catch (e) {
        console.error(e, 'error');
      }
    },
    // 获取支持的支付方式
    async getPayTypes() {
      try {
        const res = await this.$request({
          method: 'get',
          url: '/currency/fatpay/type'
        });
        if (res.code === 1000 && res.data) {
          this.payTypes = res.data;
          if (this.$route.query.currency) {
            const tempCurrentPayType = res.data.find(item => item.fiatCurrency === this.$route.query.currency);
            this.currentPayType = tempCurrentPayType || res.data && res.data[0];
          } else {
            this.currentPayType = res.data && res.data[0];
          }
          replaceBrowserHistory('currency', this.currentPayType && this.currentPayType.fiatCurrency);
          sessionStorage.setItem('PAY_TYPES', JSON.stringify(this.payTypes));
        }
      } catch (e) {
        console.error(e, 'error');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.buy-cont {
  margin-top: 48px;
  padding: 0 32px;
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
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98px;
  //margin-top: 50px;
  //margin-bottom: 50px;
  color: #FFFFFF;
  text-align: center;
  line-height: 98px;
  background: #53b8a9;
  border-radius: 20px;
}
.mt-145 {
  margin-top: 290px;
}
.mt-48 {
  margin-top: 48px;
}
.point_cont{
  height: 5px;
  width: 5px;
  display: inline-block;
  border-radius: 50%;
  animation: dotting 1.4s infinite step-start;
}
@keyframes dotting {
  25%{
    box-shadow: 6px 0 0 #FFFFFF;
  }
  50%{
    box-shadow: 6px 0 0 #FFFFFF ,20px 0 0 #FFFFFF;
  }
  75%{
    box-shadow: 6px 0 0 #FFFFFF ,20px 0 0 #FFFFFF, 34px 0 0 #FFFFFF;
  }
}
</style>
