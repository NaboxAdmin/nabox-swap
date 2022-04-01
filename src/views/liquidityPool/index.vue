<template>
  <div :class="{ mobile_class: !isMobile }">
    <div class="pool-cont">
      <div class="title-cont bg-f0 size-26">
        <div class="title-text">{{ $t('tips.tips41') }}</div>
        <div class="tvl-cont">
          <div class="size-34 font-500 text-center">${{ poolTvl | numFormatFix }}</div>
          <div class="mt-1 text-90 size-26 text-center">TVL</div>
        </div>
      </div>
      <div class="d-flex align-items-center mt-3">
        <div class="flex-1 d-flex align-items-center">
          <template v-if="!poolLoading">
            <div class="size-30">{{ $t("airdrop.airdrop3") }}</div>
            <div :class="{ 'switch-active': isStaked }" class="switch-cont d-flex align-items-center" @click="isStaked=!isStaked">
              <div class="switch-item"/>
            </div>
          </template>
        </div>
        <div class="search-cont d-flex align-items-center">
          <span class="search-icon">
            <img src="@/assets/image/search.png" alt="">
          </span>
          <input v-model="searchVal" :placeholder="$t('tips.tips49')" type="text" >
        </div>
      </div>
      <div
        v-loading="poolLoading"
        v-if="poolLoading"
        class="loading-cont"
        element-loading-background="rgba(255, 255, 255, 0.1)" />
      <template v-else-if="poolList.length>0">
        <div v-for="(item, index) in poolList" :key="index" class="pool-item mt-3">
          <div class="pool-icon_cont d-flex align-items-center">
            <div class="pool-icon">
              <img v-lazy="item.depositIcon || getPicture(item.depositAssetSymbol)" alt="" @error="pictureError">
            </div>
            <div class="ml-12 font-500 size-30">{{ item.depositAssetSymbol }}</div>
          </div>
          <div>
            <div class="d-flex align-items-center space-between mt-3">
              <div class="size-28 text-90">{{ $t('tips.tips42') }}</div>
              <div class="size-28 text-3a font-500">{{ item.totalLp | numberFormatLetter }} {{ item.tokenLp.symbol }}</div>
            </div>
            <div class="d-flex align-items-center space-between mt-3">
              <div class="size-28 text-90">{{ $t('tips.tips43') }}</div>
              <div class="size-28 text-3a font-500">{{ item.myShare | numberFormatLetter }} {{ item.tokenLp.symbol }} | {{ (item.poolRate || 0) | rateFormat }}</div>
            </div>
            <div class="d-flex align-items-center space-between mt-3">
              <div class="size-28 text-90">{{ $t('tips.tips44') }}</div>
              <div class="d-flex align-items-center">
                <div v-for="(chain, Cindex) in item.supportNetwork" :key="Cindex" class="network-icon">
                  <img v-lazy="getPicture(chain)" alt="" @error="pictureError">
                </div>
              </div>
            </div>
            <div :class="{ 'disabled_btn': fromNetwork !== 'NERVE' && item.supportNetwork.indexOf(fromNetwork) === -1 }" class="option-btn cursor-pointer" @click="optionClick(item)">{{ (fromNetwork == 'NERVE' || fromNetwork !== 'NERVE' && item.supportNetwork.indexOf(fromNetwork) !== -1) && $t('tips.tips45') || $t('tips.tips50') }}</div>
          </div>
        </div>
      </template>
      <div v-else class="text-center mt-4 text-grey">{{ $t('modal.modal3') }}</div>
    </div>
  </div>
</template>

<script>
import { Division, divisionDecimals, Times, tofix } from '@/api/util';
import { ETransfer, getBatchERC20Balance } from '@/api/api';

export default {
  name: 'LiquidityPool',
  filters: {
    rateFormat(val) {
      if (val < 0.01) {
        return '<0.01%';
      } else {
        return `${val}%`;
      }
    }
  },
  data() {
    return {
      poolList: [],
      poolLoading: true,
      poolTimer: null,
      isStaked: false,
      searchVal: '',
      poolTvl: 0
    };
  },
  watch: {
    isStaked: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.searchVal) {
            const tempList = this.originalPoolList.filter(item => {
              const depositAssetSymbol = item.depositAssetSymbol.toLocaleUpperCase();
              const searchKey = this.searchVal.toLocaleUpperCase();
              return depositAssetSymbol.indexOf(searchKey) !== -1;
            });
            this.poolList = tempList.filter(item => item.myShare != 0);
          } else {
            this.poolList = this.originalPoolList.filter(item => item.myShare != 0);
          }
        } else {
          console.log(1111, this.searchVal);
          if (this.searchVal) {
            console.log(this.originalPoolList, 'this.originalPoolList');
            this.poolList = this.originalPoolList.filter(item => {
              const depositAssetSymbol = item.depositAssetSymbol.toLocaleUpperCase();
              const searchKey = this.searchVal.toLocaleUpperCase();
              return depositAssetSymbol.indexOf(searchKey) !== -1;
            });
          } else {
            this.poolList = this.originalPoolList;
          }
        }
      }
    },
    searchVal: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.isStaked) {
            const tempList = this.originalPoolList.filter(item => item.myShare != 0);
            this.poolList = tempList.filter(item => {
              const depositAssetSymbol = item.depositAssetSymbol.toLocaleUpperCase();
              const searchKey = newVal.toLocaleUpperCase();
              return depositAssetSymbol.indexOf(searchKey) !== -1;
            });
          } else {
            this.poolList = this.originalPoolList.filter(item => {
              const depositAssetSymbol = item.depositAssetSymbol.toLocaleUpperCase();
              const searchKey = newVal.toLocaleUpperCase();
              return depositAssetSymbol.indexOf(searchKey) !== -1;
            });
          }
        } else {
          if (this.isStaked) {
            const tempList = this.originalPoolList.filter(item => item.myShare != 0);
            this.poolList = tempList.filter(item => {
              const depositAssetSymbol = item.depositAssetSymbol.toLocaleUpperCase();
              const searchKey = this.searchVal.toLocaleUpperCase();
              return depositAssetSymbol.indexOf(searchKey) !== -1;
            });
          } else {
            this.poolList = this.originalPoolList;
          }
        }
      }
    }
  },
  created() {
    this.getLiquidityPoolList();
    if (this.poolTimer) {
      clearInterval(this.poolTimer);
      this.poolTimer = null;
    }
    this.poolTimer = setInterval(() => {
      this.getLiquidityPoolList();
    }, 15000);
  },
  beforeDestroy() {
    if (this.poolTimer) {
      clearInterval(this.poolTimer);
      this.poolTimer = null;
    }
  },
  methods: {
    optionClick(item) {
      if (this.fromNetwork !== 'NERVE' && item.supportNetwork.indexOf(this.fromNetwork) === -1) {
        return false;
      }
      sessionStorage.setItem('liquidityItem', JSON.stringify(item));
      this.$router.push({ path: '/liquidity' });
    },
    async getLiquidityPoolList() {
      try {
        const res = await this.$request({
          method: 'get',
          url: '/swap/stable/info'
        });
        if (res.code === 1000 && res.data.length !== 0) {
          this.poolTvl = 0;
          for (let i = 0; i < res.data.length; i++) {
            this.poolTvl += res.data[i].tvl;
          }
          const tempData = res.data.sort((a, b) => b.tvl - a.tvl);
          const tempFormatList = tempData.map(item => ({
            ...item,
            supportNetwork: item.swapAssets.map(asset => asset.chain),
            totalLp: this.numberFormat(tofix(divisionDecimals(item.tokenLp.amount, item.tokenLp.decimals), 2, -1), 2),
            depositIcon: item.swapAssets.find(asset => asset.chain === this.fromNetwork) && item.swapAssets.find(asset => asset.chain === this.fromNetwork).icon || item.swapAssets[0].icon,
            depositAssetSymbol: item.swapAssets.find(asset => asset.chain === this.fromNetwork) && item.swapAssets.find(asset => asset.chain === this.fromNetwork).symbol || item.swapAssets[0].symbol
          }));
          // const tempData = this.fromNetwork === 'NERVE' ? res.data : res.data.filter(item => item.swapAssets.map(asset => asset.chain).indexOf(this.fromNetwork) > -1);
          // this.poolList = (this.poolList.length === 0 && (!this.searchVal || !this.isStaked)) ? tempFormatList : this.poolList;
          if (this.poolList.length === 0 && (this.searchVal || this.isStaked)) {
            this.poolList = this.poolList;
          } else if (this.poolList.length === 0) {
            this.poolList = tempFormatList;
          }
          this.poolLoading = false;
          let assetBalanceList = [];
          if (this.fromNetwork === 'NERVE') {
            const assetList = tempFormatList.map(item => ({ chainId: item.tokenLp.chainId, assetId: item.tokenLp.assetId, contractAddress: item.tokenLp.contractAddress }));
            assetBalanceList = await this.getNerveBatchData(assetList);
          } else {
            // fixme：预防节点调用超时抛错影响后面代码
            try {
              const config = JSON.parse(sessionStorage.getItem('config'));
              const batchQueryContract = config[this.fromNetwork]['config'].multiCallAddress || '';
              const fromAddress = this.currentAccount['address'][this.fromNetwork];
              const RPCUrl = config[this.fromNetwork]['apiUrl'];
              const addresses = tempFormatList.map(asset => {
                if (asset.tokenLp.heterogeneousList) {
                  const currentAsset = asset.tokenLp.heterogeneousList && asset.tokenLp.heterogeneousList.find(item => item.chainName === this.fromNetwork);
                  if (currentAsset && currentAsset.contractAddress) {
                    return currentAsset.contractAddress;
                  }
                  return '';
                }
                return this.currentAccount['address'][this.fromNetwork]; // 占位
              });
              console.log(addresses, 'addresses');
              assetBalanceList = await getBatchERC20Balance(addresses, fromAddress, batchQueryContract, RPCUrl);
            } catch (e) {
              console.log(e, 'error');
            }
          }
          console.log(assetBalanceList, 'assetBalanceList')
          const tempPoolList = await Promise.all(tempFormatList.map(async(item, index) => ({
            ...item,
            myShare: await this.formatUserShare(index, assetBalanceList, item)
          })));
          const tempPoolListRate = tempPoolList.map(item => ({
            ...item,
            poolRate: tofix(Times(Division(item.myShare, item.totalLp), 100), 2, -1) || 0
          }));
          if (this.isStaked && this.searchVal) {
            const tempList = tempPoolListRate.filter(item => item.myShare != 0);
            this.poolList = tempList.filter(item => item.depositAssetSymbol.toLocaleUpperCase().indexOf(this.searchVal.toLocaleUpperCase()) > -1);
          } else if (this.isStaked) {
            this.poolList = tempPoolListRate.filter(item => item.myShare != 0);
          } else if (this.searchVal) {
            this.poolList = tempPoolListRate.filter(item => item.depositAssetSymbol.toLocaleUpperCase().indexOf(this.searchVal.toLocaleUpperCase()) > -1);
          } else {
            this.poolList = tempPoolListRate;
          }
          this.originalPoolList = tempPoolListRate;
        } else {
          this.poolList = [];
        }
        this.poolLoading = false;
      } catch (e) {
        this.poolLoading = false;
        console.log(e, 'error');
      }
    },
    async getUserShare(asset) {
      if (this.fromNetwork === 'NERVE') {
        return await this.getNerveAssetBalance(asset);
      } else {
        const transfer = new ETransfer({
          chain: this.fromNetwork
        });
        if (asset.heterogeneousList) {
          const currentAsset = asset.heterogeneousList && asset.heterogeneousList.find(item => item.chainName === this.fromNetwork);
          if (currentAsset.contractAddress) {
            const tempAvailable = await transfer.getERC20Balance(currentAsset.contractAddress, asset.decimals, this.fromAddress);
            return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
          } else {
            const tempAvailable = await transfer.getEthBalance(this.fromAddress);
            return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
          }
        } else {
          return 0;
        }
      }
    },
    async formatUserShare(i, balanceList, asset) {
      if (balanceList.length === 0) return 0;
      if (this.fromNetwork === 'NERVE') {
        return this.numberFormat(tofix(divisionDecimals(balanceList[i] && balanceList[i].balance || 0, asset.tokenLp.decimals), 2, -1), 2);
      } else {
        if (asset.tokenLp.heterogeneousList) {
          return this.numberFormat(tofix(divisionDecimals(balanceList[i] && balanceList[i].balance || 0, balanceList[i].decimals), 2, -1), 2);
        }
        return 0;
        // const transfer = new ETransfer({
        //   chain: this.fromNetwork
        // });
        // if (asset.heterogeneousList) {
        //   const currentAsset = asset.heterogeneousList && asset.heterogeneousList.find(item => item.chainName === this.fromNetwork);
        //   if (currentAsset.contractAddress) {
        //     const tempAvailable = await transfer.getERC20Balance(currentAsset.contractAddress, asset.decimals, this.fromAddress);
        //     return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
        //   } else {
        //     const tempAvailable = await transfer.getEthBalance(this.fromAddress);
        //     return this.numberFormat(tofix(tempAvailable, 2, -1), 2);
        //   }
        // } else {
        //   return 0;
        // }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "index";
</style>
