<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="maskClick" @touchmove.prevent>
    <div :class="{'show_modal-cont': showModal}" class="modal-cont" @click.stop @touchmove.stop>
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
        <div class="flex-1 position-relative">
          <div v-if="showLoading" class="text-center loading-contain">
            <van-loading v-if="showLoading" size="40px" color="#49a3ff" />
          </div>
          <div v-if="showCoinList.length > 0" ref="coinLisCont" :class="modalType==='receive' && 'pl-4'" class="coin-list">
            <div v-for="item in showCoinList" :key="item.coinId" class="list-item cursor-pointer">
              <div class="d-flex align-items-center space-between pr-4 flex-1" @click="selectCoin(item)">
                <div class="coin-item">
                  <span class="coin-icon">
                    <img :src="item.icon || pictureError" alt="" @error="pictureError">
                  </span>
                  <span class="text-3a font-500">{{ item.symbol }}</span>
                </div>
                <span v-if="item.showBalanceLoading" class="box_loading">
                  <img src="@/assets/image/loading.svg" alt="">
                </span>
                <span v-else class="text-3a font-500 size-30">{{ item.balance | numberFormat }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center size-28 text-90 flex-1 pt-4 h-800">{{ $t('tips.tips25') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { divisionDecimals, tofix } from '@/api/util';
import { getBatchERC20Balance } from '@/api/api';
import { bscData, hecoData } from '../util/tempData';

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
    supportAdvanced: {
      type: Boolean,
      default: false
    },
    fromAsset: {
      type: Object,
      default: () => {}
    },
    toAsset: {
      type: Object,
      default: () => {}
    },
    usdtInfo: {
      type: Object,
      default: () => null
    },
    usdtnInfo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      picList: ['Ethereum', 'BSC', 'Polygon', 'Heco', 'OKExChain', 'NULS', 'NERVE'],
      currentIndex: 0,
      showCoinList: [],
      searchVal: '',
      allList: [],
      showLoading: false,
      timer: null
    };
  },
  watch: {
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
    showModal: {
      handler(val) {
        if (val) {
          const chainConfig = Object.keys(JSON.parse(sessionStorage.getItem('config')));
          if (this.modalType === 'receive') {
            this.currentIndex = this.picList.findIndex(item => this.fromNetwork === item) === -1 ? 0 : this.picList.findIndex(item => this.fromNetwork === item);
            this.picList = ['Ethereum', 'BSC', 'Polygon', 'Heco', 'OKExChain', 'NULS', 'NERVE'];
            this.timer = setTimeout(() => {
              this.getSwapAssetList(this.picList[this.currentIndex]);
              // this.getTempSwapAssetList('Heco');
            }, 0);
          } else {
            if (this.picList.findIndex(item => item === this.fromNetwork) === -1) {
              this.currentIndex = chainConfig.findIndex(item => item === this.fromNetwork);
              this.picList = chainConfig;
            } else {
              this.currentIndex = this.picList.findIndex(item => this.fromNetwork === item);
            }
            this.timer = setTimeout(() => {
              this.getSwapAssetList(this.fromNetwork);
              // this.getTempSwapAssetList(this.fromNetwork);
            }, 0);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0);
    });
  },
  methods: {
    getTempSwapAssetList(chain) {
      console.log(chain, 'chain');
      if (chain === 'Heco') {
        this.showCoinList = hecoData;
        this.allList = [...this.showCoinList];
        console.log(this.showCoinList, 'showCoinList');
      } else {
        this.showCoinList = bscData;
        this.allList = [...this.showCoinList];
        console.log(this.showCoinList, 'showCoinList');
      }
    },
    maskClick() {
      this.$emit('update:showModal', false);
    },
    setUrl(index) {
      return this.currentIndex === index ? `../../assets/image/${this.picList[index]}_active.png` : `../../assets/image/${this.picList[index]}.png`;
    },
    back() {
      this.searchVal = '';
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
      this.$nextTick(() => {
        this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0);
      });
      this.searchVal = '';
      this.$emit('select', { coin, type: this.modalType, network: this.picList[this.currentIndex] });
    },
    // 点击nav
    async navClick(chain, i) {
      if (this.currentIndex === i) return false;
      this.$nextTick(() => {
        this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0);
      });
      this.searchVal = '';
      this.currentIndex = i;
      this.showCoinList = [];
      await this.getSwapAssetList(chain);
    },
    // 获取当前支持的兑换的列表
    async getSwapAssetList(chain) {
      try {
        this.showLoading = true;
        const data = {
          chain: chain || this.fromNetwork || ''
        };
        const res = await this.$request({
          url: '/swap/assets',
          data
        });
        if (res.code === 1000) {
          let tempCoins = res.data.map(coin => ({
            ...coin,
            showBalanceLoading: true
          }));
          if (!this.fromAsset && this.modalType === 'receive') {
            tempCoins = [];
          } else if (this.fromAsset && this.modalType === 'receive') {
            if (this.picList[this.currentIndex] === this.fromNetwork) {
              tempCoins = tempCoins.filter(coin => coin.symbol !== this.fromAsset.symbol);
            }
          } else if (this.toAsset && this.modalType === 'send') {
            if (this.picList[this.currentIndex] === this.fromNetwork) {
              tempCoins = tempCoins.filter(coin => coin.symbol !== this.toAsset.symbol);
            }
          }
          const tempList = tempCoins.length > 0 && tempCoins.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
          const tempNetwork = this.modalType === 'send' ? this.fromNetwork : this.picList[this.currentIndex];
          this.showCoinList = [...tempList];
          this.allList = [...tempList];
          // console.log(JSON.stringify(this.allList));
          localStorage.setItem('showList', JSON.stringify(this.allList));
          this.showLoading = false;
          if (tempNetwork === 'NULS') {
            const tempData = await this.getNulsBatchData(this.allList);
            for (let i = 0; i < this.allList.length; i++) {
              const asset = this.allList[i];
              this.allList[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
              this.allList[i].showBalanceLoading = false;
            }
            this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
          } else if (tempNetwork === 'NERVE') {
            const tempData = await this.getNerveBatchData(this.allList);
            for (let i = 0; i < this.allList.length; i++) {
              const asset = this.allList[i];
              this.allList[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
              this.allList[i].showBalanceLoading = false;
            }
            this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
          } else {
            const config = JSON.parse(sessionStorage.getItem('config'));
            const batchQueryContract = config[tempNetwork]['config'].multiCallAddress || '';
            const fromAddress = this.currentAccount['address'][this.picList[this.currentIndex]];
            const RPCUrl = config[this.picList[this.currentIndex]]['apiUrl'];
            const addresses = this.allList.map(asset => {
              if (asset.contractAddress) {
                return asset.contractAddress;
              }
              return batchQueryContract;
            });
            const balanceData = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
            this.allList.forEach((item, index) => {
              balanceData.forEach(data => {
                if (data.contractAddress === item.contractAddress && item.showBalanceLoading) {
                  this.allList[index].balance = data.balance && tofix(divisionDecimals(data.balance, item.decimals), 6, -1) || 0;
                  this.allList[index].showBalanceLoading = false;
                }
              });
            });
            if (this.searchVal) {
              this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])].filter(v => {
                const search = this.searchVal.toUpperCase();
                const symbol = v.symbol.toUpperCase();
                const contractAddress = v.contractAddress.toUpperCase();
                return symbol.indexOf(search) > -1 || contractAddress.indexOf(search) > -1;
              });
            } else {
              this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
            }
          }
        } else {
          this.showCoinList = [];
        }
      } catch (e) {
        console.log(e, 'error');
        this.showLoading = false;
      }
    },
    // 获取swft支持的闪兑列表
    async getCoins(val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.showLoading = true;
      this.showCoinList = [];
      const res = await this.$request({
        url: '/swap/exchange/coins',
        data: {
          chain: val || this.fromNetwork || '',
          address: this.fromAddress
        }
      });
      const supportChainList = JSON.parse(sessionStorage.getItem('supportChainList')) || [];
      const validNetwork = supportChainList.map(chain => chain.SwftChain);
      if (res.code === 1000) {
        const coins = res.data.filter(v => validNetwork.indexOf(v.chain) > -1) || [];
        let tempCoins = coins.map(v => ({
          ...v,
          balance: this.numberFormat(tofix(divisionDecimals(v.balance, v.decimals), 6, -1), 6),
          symbol: v.swftInfo && v.swftInfo.coinCode || v.symbol,
          symbolImg: v.swftInfo && v.swftInfo.coinCode.split('(')[0] || v.symbol,
          showBalanceLoading: true,
          ...v.swftInfo
        }));
        // 当前选择的资产是否支持跨链
        if (!this.fromAsset && this.modalType === 'recieve') {
          tempCoins = [];
        }
        const tempList = tempCoins.length > 0 && tempCoins.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
        const tempNetwork = this.modalType === 'send' ? this.fromNetwork : this.picList[this.currentIndex];
        const { chainId: usdtChainId, assetId: usdtAssetId, contractAddress: usdtContractAddress } = this.usdtInfo[this.fromNetwork] || {};
        const { chainId: usdtnChainId, assetId: usdtnAssetId, contractAddress: usdtnContractAddress } = this.usdtnInfo[this.fromNetwork] || {};
        const { chainId: fromChainId, assetId: fromAssetId, contractAddress: fromContractAddress } = this.fromAsset || {};
        const { chainId: toChainId, assetId: toAssetId, contractAddress: toContractAddress } = this.toAsset || {};
        const currentNetwork = this.picList[this.currentIndex];
        if (this.modalType === 'receive' && this.fromAsset) {
          if (this.fromAsset.isSupportAdvanced !== 'Y') {
            this.showCoinList = [];
          } else {
            const tempCoinList = tempList.filter(item => {
              return this.fromAsset.noSupportCoin && this.fromAsset.noSupportCoin.indexOf(item.symbol === -1) || true;
            });
            if (fromChainId === usdtnChainId && (fromContractAddress && usdtnContractAddress && fromContractAddress === usdtnContractAddress || this.fromNetwork === 'NERVE' && fromAssetId === usdtnAssetId)) { // from资产为usdtn
              if (this.fromNetwork === this.picList[this.currentIndex]) {
                this.showCoinList = tempCoinList.filter(item => {
                  if (item.contractAddress) {
                    return item.contractAddress === usdtContractAddress;
                  } else {
                    return (item.chainId === usdtChainId && item.assetId === usdtAssetId);
                  }
                });
              } else {
                this.showCoinList = [];
              }
            } else if (fromChainId === usdtChainId && (fromContractAddress && usdtContractAddress && fromContractAddress === usdtContractAddress || this.fromNetwork === 'NERVE' && fromAssetId === usdtAssetId)) { // from资产为usdt
              if (this.fromNetwork !== this.picList[this.currentIndex]) {
                this.showCoinList = tempCoinList.filter(coin => {
                  if (coin.contractAddress) {
                    return (coin.chain === this.picList[this.currentIndex] && coin.contractAddress !== this.fromAsset.contractAddress && coin.contractAddress !== usdtnContractAddress) && coin.symbol !== 'USDTN';
                  } else {
                    return (coin.chain === this.picList[this.currentIndex] && (coin.chainId !== this.fromAsset.chainId && coin.assetId !== this.fromAsset.assetId) && (coin.chainId !== usdtnChainId && coin.assetId !== usdtnAssetId)) && coin.symbol !== 'USDTN';
                  }
                });
              } else {
                this.showCoinList = tempCoinList.filter(coin => {
                  if (coin.contractAddress) {
                    return coin.chain === this.picList[this.currentIndex] && coin.contractAddress !== this.fromAsset.contractAddress;
                  } else {
                    return coin.chain === this.picList[this.currentIndex] && (coin.chainId !== this.fromAsset.chainId || coin.assetId !== this.fromAsset.assetId) && (coin.chainId !== usdtChainId || coin.assetId !== usdtAssetId);
                  }
                });
              }
            } else {
              // console.log('233333', tempList, currentNetwork)
              this.showCoinList = tempCoinList.filter(coin => {
                if (coin.contractAddress) {
                  return coin.chain === currentNetwork && coin.contractAddress !== this.fromAsset.contractAddress && coin.contractAddress !== (this.usdtnInfo[currentNetwork] && this.usdtnInfo[currentNetwork].contractAddress);
                } else {
                  // console.log('123', coin.chain === currentNetwork, coin.chainId !== this.fromAsset.chainId, coin.assetId !== this.fromAsset.assetId)
                  return coin.chain === currentNetwork && (coin.chainId !== this.fromAsset.chainId) && coin.symbol !== 'USDTN';
                  //  && (coin.chainId !== this.usdtnInfo['NERVE'].chainId && coin.assetId !== this.usdtnInfo['NERVE'].assetId)
                }
              });
            }
          }
        } else if (this.modalType === 'send' && this.toAsset) {
          const tempShowCoinList = tempList.filter(coin => {
            return coin.isSupportAdvanced === 'Y' && (this.toAsset.noSupportCoin && this.toAsset.noSupportCoin.indexOf(coin.symbol) === -1 || true);
          });
          if (toChainId === usdtnChainId && (toContractAddress && usdtnContractAddress && toContractAddress === usdtnContractAddress || this.fromNetwork === 'NERVE' && toAssetId === usdtnAssetId)) {
            this.showCoinList = tempShowCoinList.filter(coin => {
              if (coin.contractAddress) {
                return this.fromNetwork === this.picList[this.currentIndex] && coin.contractAddress === usdtContractAddress;
              } else {
                return this.fromNetwork === this.picList[this.currentIndex] && (coin.chain === usdtChainId && coin.assetId === usdtAssetId);
              }
            });
          } else if (toChainId === usdtChainId && (toContractAddress && usdtContractAddress && toContractAddress === usdtContractAddress || this.fromNetwork === 'NERVE' && toAssetId === usdtAssetId)) {
            this.showCoinList = tempShowCoinList.filter((coin, index) => {
              if (coin.contractAddress) {
                return coin.contractAddress !== this.toAsset.contractAddress || coin.contractAddress !== usdtContractAddress;
              } else {
                return (coin.chainId === this.toAsset.chainId) && (coin.assetId !== this.toAsset.assetId);
              }
            });
          } else {
            this.showCoinList = tempShowCoinList.filter(coin => {
              if (coin.contractAddress) {
                return coin.contractAddress !== this.toAsset.contractAddress && coin.contractAddress !== usdtnContractAddress;
              } else {
                return (coin.chainId !== this.toAsset.chainId) && (coin.assetId !== this.toAsset.assetId) && coin.symbol !== 'USDTN';
              }
            });
          }
        } else {
          if (this.modalType === 'send') {
            this.showCoinList = tempList.filter(coin => {
              return coin.isSupportAdvanced === 'Y';
            });
          } else {
            this.showCoinList = [];
          }
        }
        this.showLoading = false;
        this.allList = [...this.showCoinList];
        if (tempNetwork === 'NULS') {
          const tempData = await this.getNulsBatchData(this.allList);
          for (let i = 0; i < this.allList.length; i++) {
            const asset = this.allList[i];
            this.allList[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
            this.allList[i].showBalanceLoading = false;
          }
          this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
        } else if (tempNetwork === 'NERVE') {
          const tempData = await this.getNerveBatchData(this.allList);
          for (let i = 0; i < this.allList.length; i++) {
            const asset = this.allList[i];
            this.allList[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
            this.allList[i].showBalanceLoading = false;
          }
          this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
        } else {
          const config = JSON.parse(sessionStorage.getItem('config'));
          const batchQueryContract = config[tempNetwork]['config'].multiCallAddress || '';
          const fromAddress = this.currentAccount['address'][this.picList[this.currentIndex]];
          const RPCUrl = config[this.picList[this.currentIndex]]['apiUrl'];
          const addresses = this.allList.map(asset => {
            if (asset.contractAddress) {
              return asset.contractAddress;
            }
            return batchQueryContract;
          });
          const balanceData = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
          this.allList.forEach((item, index) => {
            balanceData.forEach(data => {
              if (data.contractAddress === item.contractAddress && item.showBalanceLoading) {
                this.allList[index].balance = data.balance && tofix(divisionDecimals(data.balance, item.decimals), 6, -1) || 0;
                this.allList[index].showBalanceLoading = false;
              }
            });
          });
          this.showCoinList = [...(this.allList.sort((a, b) => b.balance - a.balance) || [])];
          // console.log(this.allList, "allList")
        }
      } else {
        this.showLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "Modal";
</style>
