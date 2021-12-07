<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="maskClick" @touchmove.prevent>
    <div :class="{'show_modal-cont': showModal}" class="modal-cont" @click.stop>
      <div class="header-cont size-36 font-500 mt-2">
        {{ $t('modal.modal1') }}
        <div class="back-icon" @click="back">
          <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
        </div>
      </div>
      <div class="search-cont">
        <span class="search-icon">
          <img src="@/assets/image/search.png" alt="">
        </span>
        <input v-model="searchVal" :placeholder="$t('modal.modal2')" type="text" >
      </div>
      <div class="search-result">
        <div v-if="modalType==='receive'" class="select-cont">
          <span
            v-for="(item, index) in picList"
            :class="['nav-cont_' + index, index===currentIndex && 'active_image']"
            :key="item"
            @click="navClick(item, index)"/>
        </div>
        <div v-loading="showLoading" class="flex-1">
          <div v-if="showCoinList.length > 0" :class="modalType==='receive' && 'pl-4'" class="coin-list">
            <div v-for="item in showCoinList" :key="item.coinId" class="list-item">
              <div class="d-flex align-items-center space-between pr-4 flex-1" @click="selectCoin(item)">
                <div class="coin-item">
                  <span class="coin-icon">
                    <img :src="getPicture(item.symbol)" alt="" @error="pictureError">
                  </span>
                  <span class="text-3a font-500">{{ item.symbol }}</span>
                </div>
                <span class="text-3a font-500 size-30">{{ item.balance }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center size-28 text-90 flex-1 pt-4">{{ $t('modal.modal3') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { networkToChain, valideNetwork } from '../../views/index/component/Swap';
import { divisionDecimals } from '../../api/util';

export default {
  name: 'CoinModal',
  props: {
    modalType: {
      type: String,
      default: 'receive'
    },
    showModal: {
      type: Boolean,
      default: false
    },
    coinList: {
      type: Array,
      default: () => []
    },
    fromChain: {
      type: String,
      default: ''
    },
    supportAdvanced: {
      type: Boolean,
      default: false
    },
    fromNetwork: String,
    fromAddress: String
  },
  data() {
    return {
      picList: ['Ethereum', 'BSC', 'Heco', 'OKExChain'],
      currentIndex: 0,
      showCoinList: [],
      searchVal: '',
      allList: [],
      showLoading: false
    };
  },
  watch: {
    coinList: {
      immediate: true,
      handler(val) {
        this.showCoinList = val;
        this.allList = val;
      },
      deep: true
    },
    async modalType(val) {
      if (val === 'receive') {
        this.showCoinList = await this.getCoins(this.picList[this.currentIndex]);
        this.showCoinList = this.coinList.filter(coin => {
          return coin.mainNetwork === this.picList[this.currentIndex] && coin.symbol !== this.fromChain;
        });
      }
    },
    searchVal(val) {
      if (val) {
        this.showCoinList = this.allList.filter(v => {
          const search = val.toUpperCase();
          const symbol = v.symbol.toUpperCase();
          const contractAddress = v.contractAddress.toUpperCase();
          return symbol.indexOf(search) > -1 || contractAddress.indexOf(search) > -1;
        });
      } else {
        this.showCoinList = this.allList;
      }
    },
    async showModal(val) {
      if (val) {
        if (this.modalType === 'receive') {
          await this.getCoins(this.picList[this.currentIndex]);
        }
      }
    }
  },
  methods: {
    maskClick() {
      this.$emit('update:showModal', false);
    },
    setUrl(index) {
      return this.currentIndex === index ? `../../assets/image/${this.picList[index]}_active.png` : `../../assets/image/${this.picList[index]}.png`;
    },
    back() {
      this.$emit('update:showModal', false);
    },
    getPicture(suffix) {
      const baseUrl = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/';
      return `${baseUrl}${suffix}.png`;
    },
    pictureError(e) {
      e.target.src = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png';
    },
    // 选择发送资产
    selectCoin(coin) {
      this.$emit('select', { coin, type: this.modalType });
    },
    // 点击nav
    navClick(item, i) {
      this.currentIndex = i;
      this.getCoins(item);
    },
    // 获取swft支持的闪兑列表
    async getCoins(val) {
      this.showLoading = true;
      this.showCoinList = [];
      const res = await this.$request({
        url: '/swap/exchange/coins',
        data: {
          chain: val || this.fromNetwork || '',
          address: this.fromAddress
        }
      });
      if (res.code === 1000) {
        let coins = [];
        let tempCoins = [];
        coins = res.data.filter(v => valideNetwork.indexOf(v.mainNetwork) > -1);
        coins.map(v => {
          const chain = networkToChain[v.mainNetwork];
          v.chain = chain.chain;
          v.balance = divisionDecimals(v.balance, v.decimals);
          v.symbol = v.coinCode.split('(')[0];
          v.contractAddress = v.contact;
        });
        // 当前选择的链是否支持跨链
        if (this.supportAdvanced) {
          if (this.picList[this.currentIndex] === this.fromNetwork) {
            tempCoins = coins;
          } else {
            tempCoins = coins.filter(coin => coin.isSupportAdvanced === 'Y');
          }
        } else {
          if (this.picList[this.currentIndex] === this.fromNetwork) {
            tempCoins = coins;
          } else {
            tempCoins = [];
          }
        }
        const tempList = tempCoins.length > 0 && tempCoins.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
        if (this.modalType === 'receive') {
          this.showCoinList = tempList.filter(coin => coin.mainNetwork === this.picList[this.currentIndex] && coin.symbol !== this.fromChain);
        } else {
          this.showCoinList = tempList;
        }
        this.allList = [...this.showCoinList];
      }
      this.showLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "Modal";
</style>
