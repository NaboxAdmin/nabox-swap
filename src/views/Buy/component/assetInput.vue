<template>
  <div class="pay-asset-const">
    <input :disabled="disabled" v-model="payAmount" placeholder="0" type="number" @input="payAmountInput">
    <coinItem :asset-item="assetItem" @click="selectCoin"/>
  </div>
</template>

<script>
import coinItem from '@/views/Buy/component/coinItem';
export default {
  name: 'AssetInput',
  components: {
    coinItem
  },
  props: {
    assetItem: {
      type: Object,
      default: () => null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      payAmount: ''
    };
  },
  watch: {
    inputValue: {
      handler(val) {
        if (val) {
          this.payAmount = val;
        } else {
          this.payAmount = '';
        }
      },
      deep: true
    }
  },
  methods: {
    selectCoin() {
      this.$emit('selectCoin');
    },
    payAmountInput() {
      this.$emit('input', this.payAmount);
    }
  }
};
</script>

<style scoped lang="scss">
.pay-asset-const {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border: 1px solid #E6E9F0;
  height: 96px;
  overflow: hidden;
  input {
    color: #3A3C44;
    flex: 1;
    width: 50px;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 36px;
    font-weight: 500;
    padding: 0 32px;
    border-right: 1px solid #E6E9F0;
    height: 100%;
    &::placeholder {
      color: #ABB1BA;
      font-size: 36px;
    }
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
