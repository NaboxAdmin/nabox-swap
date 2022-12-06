<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="maskClick" @touchmove.prevent>
    <div :class="{'show_modal-cont': showModal}" class="modal-cont" @click.stop @touchmove.stop>
      <div class="header-cont size-36 font-500 mt-2">
        {{ picList[currentIndex] }}
        <div class="back-icon" @click="back">
          <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
        </div>
      </div>
      <div class="search-cont">
        <span class="search-icon">
          <img src="@/assets/image/search.png" alt="">
        </span>
        <input v-model="searchVal" :placeholder="$t('modal.modal2')" type="text" @focus="searchInput" >
      </div>
      <div class="search-result mt-2">
        <div v-if="modalType==='receive'" class="select-cont">
          <div
            v-for="(item, index) in picList"
            :class="['nav-cont_' + index, index===currentIndex && 'active_image']"
            :key="item"
            @click="navClick(item, index)"/>
        </div>
        <div class="flex-1 position-relative">
          <div v-if="showLoading" class="text-center loading-contain">
            <van-loading v-if="showLoading" size="40px" color="#49a3ff" />
          </div>
          <div v-if="pinAsset.length" :class="{ 'recommend-assets': modalType==='receive' }" class="d-flex flex-wrap mr-4 cursor-pointer">
            <div v-for="(item, index) in pinAsset" :key="index" :class="{'disabled_asset': item.isDisabled}" class="asset-item mt-1" @click.stop="selectCoin(item)">
              <span class="asset-item-icon">
                <img :src="item.icon || getPicture(item.symbol) || pictureError" alt="">
              </span>
              <span>{{ item.symbol }}</span>
            </div>
          </div>
          <div v-if="showCoinList.length > 0" ref="coinLisCont" :class="modalType==='receive' && 'pl-4'" class="coin-list">
            <div v-for="(item, index) in showCoinList" :key="`${index}_${item.symbol}`" :class="{'disabled_asset': item.isDisabled}" class="list-item cursor-pointer">
              <div class="d-flex align-items-center space-between pr-4 flex-1" @click.stop="selectCoin(item)">
                <div class="coin-item">
                  <span class="coin-icon">
                    <img v-lazy="item.icon || getPicture(item.symbol) || pictureError" alt="">
                  </span>
                  <span :class="(modalType==='receive' && picList[currentIndex] === 'NERVE' || modalType==='send' && fromNetwork === 'NERVE') && 'space-between' || 'justify-content-center'" class="d-flex direction-column h-40">
                    <span class="text-3a font-500 text-truncate w-150">{{ item.symbol }}</span>
                    <span v-if="!item.contractAddress && (fromNetwork === 'NERVE' || fromNetwork === 'NULS')" class="text-90 size-24">{{ `${item.chainId}-${item.assetId}` }}</span>
                    <span v-else class="text-90 size-24">{{ superLong(item.contractAddress) }} <span v-if="!userQuery && item.isCustom">{{ `(${$t('tips.tips74')})` }}</span></span>
                  </span>
                </div>
                <template v-if="!userQuery">
                  <span v-if="item.showBalanceLoading" class="box_loading">
                    <img src="@/assets/image/loading.svg" alt="">
                  </span>
                  <span v-else class="text-3a font-500 size-30">{{ (item.balance || 0) | numFormatFixSix }}</span>
                </template>
                <template v-else>
                  <span class="import-btn mr-0" @click.stop.prevent="importAsset(item)">{{ $t('tips.tips71') }}</span>
                </template>
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
import { divisionDecimals, isBeta, tofix, TRON } from '@/api/util';
import { getBatchERC20Balance } from '@/api/api';
import { TRON_TRX_ADDRESS } from '@/config';

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
    fromAsset: {
      type: Object,
      default: () => {}
    },
    toAsset: {
      type: Object,
      default: () => {}
    },
    assetList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      picList: ['Ethereum', 'BSC', 'Polygon', 'Heco', 'OKC', 'Avalanche', TRON, 'Harmony', 'KCC', 'Cronos', 'Arbitrum', 'ETC', 'Fantom', 'Optimism', 'IoTeX', 'Metis', 'Klaytn', 'Aurora', 'Gnosis', 'smartBCH', 'Kava', 'ETHW', 'NULS', 'NERVE'],
      currentIndex: 0,
      showCoinList: [],
      searchVal: '',
      allList: [],
      showLoading: false,
      timer: null,
      userQuery: false,
      pinAsset: []
    };
  },
  watch: {
    async searchVal(val) {
      if (val) {
        this.showCoinList = this.allList.filter(v => {
          const search = val.toUpperCase();
          const symbol = v.symbol.toUpperCase();
          const contractAddress = v.contractAddress.toUpperCase();
          return symbol.indexOf(search) > -1 || contractAddress.indexOf(search) > -1;
        });
        if (this.showCoinList.length === 0 && val.length > 35) {
          this.showCoinList = await this.searchAsset(val);
          this.userQuery = true;
        } else {
          this.userQuery = false;
        }
      } else {
        this.showCoinList = this.allList;
        this.userQuery = false;
      }
    },
    showModal: {
      handler(val) {
        if (val) {
          const chainConfig = Object.keys(JSON.parse(sessionStorage.getItem('config')));
          if (this.modalType === 'receive') {
            this.currentIndex = this.picList.findIndex(item => this.fromNetwork === item) === -1 ? 0 : this.picList.findIndex(item => this.fromNetwork === item);
            // const tempConfig = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];
            this.picList = ['Ethereum', 'BSC', 'Polygon', 'Heco', 'OKC', 'Avalanche', TRON, 'Harmony', 'KCC', 'Cronos', 'Arbitrum', 'ETC', 'Fantom', 'Optimism', 'IoTeX', 'Metis', 'Klaytn', 'Aurora', 'Gnosis', 'smartBCH', 'Kava', 'ETHW', 'NULS', 'NERVE'];
            if (this.assetList.length > 0 && this.fromNetwork === this.picList[this.currentIndex]) {
              this.setSwapAssetList(this.assetList);
            } else {
              this.getSwapAssetList(this.picList[this.currentIndex]);
            }
          } else {
            if (this.picList.findIndex(item => item === this.fromNetwork) === -1) {
              this.currentIndex = chainConfig.findIndex(item => item === this.fromNetwork);
              this.picList = chainConfig;
            } else {
              this.currentIndex = this.picList.findIndex(item => this.fromNetwork === item);
            }
            if (this.assetList.length > 0) {
              this.setSwapAssetList(this.assetList);
            } else {
              this.getSwapAssetList(this.fromNetwork);
            }
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
    searchInput(event) {
      event.currentTarget.select();
    },
    maskClick() {
      this.$emit('update:showModal', false);
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
      if (this.userQuery || coin.isDisabled) return;
      this.$nextTick(() => {
        this.$refs.coinLisCont && this.$refs.coinLisCont.scrollTo(0, 0);
      });
      this.searchVal = '';
      this.$emit('select', { coin, type: this.modalType, network: this.picList[this.currentIndex] });
    },
    importAsset(coin) {
      this.$emit('importAsset', { coin, type: this.modalType, network: this.picList[this.currentIndex] });
    },
    async searchAsset(val) {
      try {
        this.showLoading = true;
        const data = {
          chain: this.fromNetwork,
          searchKey: val
        };
        const res = await this.$request({
          url: '/swap/asset/query',
          data
        });
        if (res && res.data && res.code === 1000) {
          const balance = await this.getHeterogeneousAssetBalance({
            contractAddress: res.data.contractAddress,
            decimals: res.data.decimals
          });
          this.showLoading = false;
          return res.data && [{ ...res.data, balance, isCustom: true }] || [];
        }
        this.showLoading = false;
        return [];
      } catch (e) {
        this.showLoading = false;
        return [];
      }
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
      this.allList = [];
      await this.getSwapAssetList(chain);
    },
    async getSwapAssetList(chain) {
      try {
        this.showLoading = true;
        const localAssetList = localStorage.getItem('userAssetList') && JSON.parse(localStorage.getItem('userAssetList')) || [];
        const chainAsset = localAssetList.filter(item => item.chain === chain);
        this.pinAsset = [];
        const data = {
          chain: chain || this.fromNetwork || ''
        };
        if (isBeta) {
          const res = await this.$request({
            url: '/swap/assets',
            data
          });
          if (res.code === 1000 && res.data) {
            const swapAssets = [...res.data, ...chainAsset];
            await this.setSwapAssetList(swapAssets);
          } else {
            await this.setSwapAssetList([]);
          }
          this.showLoading = false;
        } else {
          const res = await this.$request({
            url: '/swap/assets',
            data
          });
          if (res.code === 1000 && res.data.length > 0) {
            const swapAssets = [...res.data, ...chainAsset];
            await this.setSwapAssetList(swapAssets);
          } else {
            await this.setSwapAssetList([]);
          }
        }
      } catch (e) {
        this.showLoading = false;
      }
    },
    // 获取当前支持的兑换的列表
    async setSwapAssetList(swapAssetList) {
      try {
        if (swapAssetList && swapAssetList.length > 0) {
          let tempCoins = swapAssetList.map(coin => ({
            ...coin,
            showBalanceLoading: true
          }));
          this.fromNetwork === 'NERVE' && sessionStorage.setItem('nerveSwapAssetList', JSON.stringify(tempCoins || []));
          if (!this.fromAsset && this.modalType === 'receive') {
            tempCoins = [];
          } else if (this.fromAsset && this.modalType === 'receive') {
            if (this.picList[this.currentIndex] === this.fromNetwork) {
              // tempCoins = tempCoins.filter(coin => coin.symbol !== this.fromAsset.symbol);
              if (this.fromAsset.contractAddress) {
                tempCoins = tempCoins.map(coin => {
                  if (coin.contractAddress !== this.fromAsset.contractAddress) {
                    return coin;
                  }
                  return {
                    ...coin,
                    isDisabled: true
                  };
                });
              } else {
                if (this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'NULS') {
                  // tempCoins = tempCoins.filter(coin => coin.assetId !== this.fromAsset.assetId);
                  tempCoins = tempCoins.map(coin => {
                    if (coin.assetId !== this.fromAsset.assetId) {
                      return coin;
                    }
                    return {
                      ...coin,
                      isDisabled: true
                    };
                  });
                } else {
                  // tempCoins = tempCoins.filter(coin => coin.registerChain !== this.fromAsset.registerChain || coin.registerChain === this.fromAsset.registerChain && (coin.nerveAssetId !== this.fromAsset.nerveAssetId && coin.assetId !== this.fromAsset.assetId));
                  tempCoins = tempCoins.map(coin => {
                    if (coin.registerChain !== this.fromAsset.registerChain || coin.registerChain === this.fromAsset.registerChain && (coin.nerveAssetId !== this.fromAsset.nerveAssetId && coin.assetId !== this.fromAsset.assetId)) {
                      return coin;
                    }
                    return {
                      ...coin,
                      isDisabled: true
                    };
                  });
                }
              }
            } else {
              // tempCoins = tempCoins.filter(coin => coin.registerChain !== this.fromAsset.registerChain || coin.registerChain === this.fromAsset.registerChain && coin.assetId !== this.fromAsset.assetId);
              tempCoins = tempCoins.map(coin => {
                if (coin.registerChain !== this.fromAsset.registerChain || coin.registerChain === this.fromAsset.registerChain && coin.assetId !== this.fromAsset.assetId) {
                  return coin;
                }
                return {
                  ...coin,
                  isDisabled: true
                };
              });
            }
          } else if (this.toAsset && this.modalType === 'send') {
            if (this.toAsset.chain === this.fromNetwork) {
              // tempCoins = tempCoins.filter(coin => coin.symbol !== this.toAsset.symbol);
              if (this.toAsset.contractAddress) {
                // tempCoins = tempCoins.filter(coin => coin.contractAddress !== this.toAsset.contractAddress);
                tempCoins = tempCoins.map(coin => {
                  if (coin.contractAddress !== this.toAsset.contractAddress) {
                    return coin;
                  }
                  return {
                    ...coin,
                    isDisabled: true
                  };
                });
              } else {
                if (this.fromNetwork !== 'NERVE' && this.fromNetwork !== 'NULS') {
                  // tempCoins = tempCoins.filter(coin => coin.assetId !== this.toAsset.assetId);
                  tempCoins = tempCoins.map(coin => {
                    if (coin.assetId !== this.toAsset.assetId) {
                      return coin;
                    }
                    return {
                      ...coin,
                      isDisabled: true
                    };
                  });
                } else {
                  // tempCoins = tempCoins.filter(coin => coin.registerChain !== this.toAsset.registerChain || coin.registerChain === this.toAsset.registerChain && coin.assetId !== this.toAsset.assetId);
                  // tempCoins = tempCoins.filter(coin => coin.chainId !== this.toAsset.chainId && coin.assetId !== this.toAsset.assetId);
                  tempCoins = tempCoins.map(coin => {
                    if (coin.registerChain !== this.toAsset.registerChain || coin.registerChain === this.toAsset.registerChain && coin.assetId !== this.toAsset.assetId) {
                      return coin;
                    }
                    return {
                      ...coin,
                      isDisabled: true
                    };
                  });
                }
              }
            } else {
              // tempCoins = tempCoins.filter(coin => coin.registerChain !== this.toAsset.registerChain || coin.registerChain === this.toAsset.registerChain && coin.assetId !== this.toAsset.assetId);
              tempCoins = tempCoins.map(coin => {
                if (coin.registerChain !== this.toAsset.registerChain || coin.registerChain === this.toAsset.registerChain && coin.assetId !== this.toAsset.assetId) {
                  return coin;
                }
                return {
                  ...coin,
                  isDisabled: true
                };
              });
            }
          }
          this.pinAsset = tempCoins.filter(item => item.recommend);
          const tempList = tempCoins.length > 0 && tempCoins.sort((a, b) => a.symbol > b.symbol ? 1 : -1) || [];
          const tempNetwork = this.modalType === 'send' ? this.fromNetwork : this.picList[this.currentIndex];
          this.showCoinList = [...tempList];
          this.allList = [...tempList];
          this.showLoading = false;
          if (tempNetwork === 'NULS' || tempNetwork === 'NERVE') {
            const tempData = await this.getNulsNerveBatchData(this.allList, tempNetwork);
            for (let i = 0; i < this.allList.length; i++) {
              const asset = this.allList[i];
              this.allList[i].balance = divisionDecimals(tempData[i].balance, asset.decimals);
              this.allList[i].showBalanceLoading = false;
            }
          } else if (tempNetwork === TRON) {
            const config = JSON.parse(sessionStorage.getItem('config'));
            const batchQueryContract = config[tempNetwork]['config'].multiCallAddress || '';
            // TODO
            const fromAddress = this.currentAccount['address'][this.picList[this.currentIndex]] || this.currentAccount['address'][this.chainNameToId[this.picList[this.currentIndex]]] || 'TFtN2JUP5Zi1i487oZKLK25sPBTTSdYMWy';
            const addresses = this.allList.map(asset => {
              if (asset.contractAddress) {
                return asset.contractAddress;
              }
              return TRON_TRX_ADDRESS;
            });
            const balanceData = await this.getTronAssetBalances(batchQueryContract, fromAddress, addresses);
            for (let i = 0; i < this.allList.length; i++) {
              const asset = this.allList[i];
              this.allList[i].balance = divisionDecimals(balanceData[i], asset.decimals);
              this.allList[i].showBalanceLoading = false;
            }
          } else {
            const config = JSON.parse(sessionStorage.getItem('config'));
            const batchQueryContract = config[tempNetwork]['config'].multiCallAddress || '';
            // TODO
            const fromAddress = this.currentAccount['address'][this.picList[this.currentIndex]] || this.currentAccount['address'][this.chainNameToId[this.picList[this.currentIndex]]];
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
          }
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
        } else {
          this.showCoinList = [];
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.showLoading = false;
      }
    },
    // 更新当前的swap资产列表
    updateSwapAssetList(chain, assetList) {
      const localSwapAssetMap = localStorage.getItem('localSwapAssetMap') && JSON.parse(localStorage.getItem('localSwapAssetMap'));
      localSwapAssetMap[chain || this.fromNetwork] = assetList || [];
      localStorage.setItem('localSwapAssetMap', JSON.stringify(localSwapAssetMap));
    }
  }
};
</script>

<style scoped lang="scss">
@import "Modal";
.asset-item {
  border: 1px solid #E9EBF3;
  border-radius: 20px;
  padding: 12px 15px;
  font-weight: 500;
  font-size: 28px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  //&:nth-child(4n + 4) {
  //  margin-right: 0;
  //}
  .asset-item-icon {
    width: 46px;
    height: 46px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 15px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
.mr-0 {
  margin-right: 0 !important;
}
.disabled_asset {
  opacity: .7;
  cursor: not-allowed;
}
.recommend-assets {
  margin-left: 50px;
}
</style>
