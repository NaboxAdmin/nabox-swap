<template>
  <div class="mask-cont" @touchmove.prevent :class="{'show_modal': showModal}">
    <div class="modal-cont" @touchmove.stop :class="{'show_modal-cont': showModal}">
      <div class="header-cont size-36 font-bold mt-2">
          {{ $t('modal.modal1') }}
        <div class="back-icon" @click="back">
          <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"></path></svg>
        </div>
      </div>
      <div class="search-cont">
        <span class="search-icon">
          <img src="@/assets/image/search.png" alt="">
        </span>
        <input type="text" v-model="searchVal" :placeholder="$t('modal.modal2')" >
      </div>
      <div class="search-result">
        <div class="select-cont" v-if="modalType==='receive'">
          <span v-for="(item, index) in picList"
                :class="['nav-cont_' + index, index===currentIndex && 'active_image']"
                @click="navClick(item, index)"
                :key="item">
          </span>
        </div>
        <div v-loading="showLoading" class="flex-1">
          <div class="coin-list" ref="coinLisCont" :class="modalType==='receive' && 'pl-4'" v-if="showCoinList.length > 0">
            <div class="list-item" v-for="item in showCoinList" :key="item.coinId">
              <div class="d-flex align-items-center space-between pr-4 flex-1" @click="selectCoin(item)">
                <div class="coin-item">
                  <span class="coin-icon">
                    <img :src="getPicture(item.symbolImg)" @error="pictureError" alt="">
                  </span>
                  <span class="text-3a font-bold">{{ item.symbol }}</span>
                </div>
                <span class="text-3a font-bold size-30">{{ item.balance | numberFormat }}</span>
              </div>
            </div>
          </div>
          <div class="text-center size-28 text-90 flex-1 pt-4" v-else>{{ $t('modal.modal3') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {networkToChain, valideNetwork} from "@/views/index/component/Swap";
import {divisionDecimals} from "@/api/util";
import {tofix} from "../../../../../api/util";

export default {
  name: "CoinModal",
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
    },
    supportAdvanced: {
      type: Boolean,
      default: false
    },
    fromAsset: {
      type: Object,
      default: () => null
    },
    toAsset: {
      type: Object,
      default: () => null
    }
    // fromNetwork: String,
    // fromAddress: String
  },
  data() {
    return {
      picList: ['Ethereum', 'BSC', 'Heco', 'OKExChain'],
      currentIndex: 0,
      showCoinList: [],
      searchVal: '',
      allList: [],
      showLoading: false
    }
  },
  // created() {
  //   this.modalType == 'send' && this.getCoins(this.fromChain)
  // },
  watch: {
    coinList: {
      immediate: true,
      handler(val) {
        if (this.toAsset) {
          this.showCoinList = val.filter(coin => {
            if (this.toAsset.contractAddress) {
              return coin.contractAddress !== this.toAsset.contractAddress;
            } else {
              return coin.chainId !== this.toAsset.chainId && coin.assetId !== this.toAsset.assetId
            }
          });
          this.allList = this.showCoinList;
        } else {
          this.showCoinList = val;
          this.allList = val;
        }
      },
      deep: true
    },
    modalType(val) {
      if (val === 'receive') {
        // this.showCoinList = await this.getCoins(this.picList[this.currentIndex]);
        this.showCoinList = this.coinList.filter(coin => {
          if (this.fromAsset && this.fromAsset.contractAddress) {
            return coin.mainNetwork === this.picList[this.currentIndex] && coin.contractAddress !== this.fromAsset.contractAddress;
          } else {
            return coin.mainNetwork === this.picList[this.currentIndex] && coin.chainId !== this.fromAsset.chainId && coin.assetId !== this.fromAsset.assetId
          }
        });
        // console.log(this.showCoinList, "this.showCoinList");
      } else if (val === 'send') {
        if (this.toAsset) {
          this.showCoinList = this.coinList.filter(coin => {
            if (this.toAsset.contractAddress) {
              return coin.contractAddress !== this.toAsset.contractAddress;
            } else {
              return coin.chainId !== this.toAsset.chainId && coin.assetId !== this.toAsset.assetId
            }
          });
        }
      }
    },
    searchVal(val) {
      if (val) {
        this.showCoinList = this.allList.filter(v => {
          const search  = val.toUpperCase();
          const symbol = v.symbol.toUpperCase();
          const contractAddress = v.contractAddress.toUpperCase();
          return symbol.indexOf(search) > -1 || contractAddress.indexOf(search) > -1;
        })
      } else {
        this.showCoinList = this.allList;
      }
    },
    async showModal(val) {
      if (val) {
        if (this.modalType === 'receive') {
          await this.getCoins(this.picList[this.currentIndex]);
        } else {
          await this.getCoins(this.fromNetwork);
        }
      }
    }
  },
  methods: {
    setUrl(index) {
      return this.currentIndex===index ? `../../assets/image/${this.picList[index]}_active.png` : `../../assets/image/${this.picList[index]}.png`
    },
    back() {
      this.searchVal = '';
      this.$emit('update:showModal', false)
    },
    getPicture(suffix) {
      let baseUrl = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/';
      return `${baseUrl}${suffix}.png`
    },
    pictureError(e) {
      e.target.src = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png';
    },
    // 选择发送资产
    selectCoin(coin) {
      this.$nextTick(() => {
        this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0)
      });
      this.searchVal = '';
      this.$emit('select', { coin, type: this.modalType });
    },
    // 点击nav
    async navClick(item, i) {
      this.$nextTick(() => {
        this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0)
      });
      this.currentIndex = i;
      this.showCoinList = [];
      await this.getCoins(item);
    },
    // 获取swft支持的闪兑列表
    async getCoins(val) {
      this.showLoading = true;
      this.showCoinList = [];
      const res = await this.$request({
        url: "/swap/exchange/coins",
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
          const chain = networkToChain[v.mainNetwork]
          v.chain = chain.chain
          v.balance = tofix(divisionDecimals(v.balance, v.decimals), 6, -1)
          v.symbol = v.coinCode; // .split("(")[0]
          v.symbolImg = v.coinCode.split("(")[0]
          v.contractAddress = v.contact
        });
        // 当前选择的资产是否支持跨链
        if (this.modalType === 'send') {
          tempCoins = coins;
        } else if (this.supportAdvanced && this.modalType === 'receive') {
          tempCoins = coins.filter(coin => coin.isSupportAdvanced === "Y");
        } else {
          tempCoins = [];
        }
        const tempList = tempCoins.length > 0 && tempCoins.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
        if (this.modalType === "receive" && this.fromAsset) {
          this.showCoinList = tempList.filter(coin => {
            if (this.fromAsset && this.fromAsset.contractAddress) {
              return coin.mainNetwork === this.picList[this.currentIndex] && coin.contractAddress !== this.fromAsset.contractAddress;
            } else {
              return coin.mainNetwork === this.picList[this.currentIndex] && (coin.chainId !== this.fromAsset.chainId || coin.assetId !== this.fromAsset.assetId)
            }
          });
        } else if (this.modalType === "send" && this.toAsset) {
          this.showCoinList = tempList.filter(coin => {
            if (this.toAsset.contractAddress) {
              return coin.contractAddress !== this.toAsset.contractAddress;
            } else {
              return coin.chainId !== this.toAsset.chainId && coin.assetId !== this.toAsset.assetId
            }
          });
          this.allList = this.showCoinList;
        } else {
          if (this.modalType==='send') {
            this.showCoinList = tempList.filter(coin => {
              return coin.isSupportAdvanced === 'Y'
            })
          } else {
            this.showCoinList = tempList;
          }
        }
        this.allList = [...this.showCoinList];
      }
      this.showLoading = false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0)
    });
  }
}
</script>

<style scoped lang="scss">
@import "Modal";
</style>