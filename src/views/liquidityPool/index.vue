<template>
  <div class="pool-cont">
    <div class="title-cont bg-f0 size-26">
      {{ $t('tips.tips41') }}
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
            <img :src="item.depositIcon || getPicture(item.depositAssetSymbol)" alt="" @error="pictureError">
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
                <img :src="getPicture(chain)" alt="" @error="pictureError">
              </div>
            </div>
          </div>
          <div class="option-btn cursor-pointer" @click="optionClick(item)">{{ $t('tips.tips45') }}</div>
        </div>
      </div>
    </template>
    <div v-else class="text-center mt-4 text-grey">{{ $t('modal.modal3') }}</div>
  </div>
</template>

<script>
import { tofix, divisionDecimals, Times, Division } from '../../api/util';
import { ETransfer } from '../../api/api';

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
      poolTimer: null
    };
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
          const tempData = this.fromNetwork === 'NERVE' ? res.data : res.data.filter(item => item.swapAssets.map(asset => asset.chain).indexOf(this.fromNetwork) > -1);
          this.poolList = this.poolList.length === 0 ? tempData.map(item => ({
            ...item,
            supportNetwork: item.swapAssets.map(asset => asset.chain),
            totalLp: this.numberFormat(tofix(divisionDecimals(item.tokenLp.amount, item.tokenLp.decimals), 2, -1), 2),
            depositIcon: item.swapAssets.find(asset => asset.chain === this.fromNetwork) && item.swapAssets.find(asset => asset.chain === this.fromNetwork).icon || item.swapAssets[0].icon,
            depositAssetSymbol: item.swapAssets.find(asset => asset.chain === this.fromNetwork) && item.swapAssets.find(asset => asset.chain === this.fromNetwork).symbol || item.swapAssets[0].symbol
          })) : this.poolList;
          this.poolLoading = false;
          const tempPoolList = await Promise.all(this.poolList.map(async item => ({
            ...item,
            myShare: await this.getUserShare(item.tokenLp)
          })));
          this.poolList = tempPoolList.map(item => ({
            ...item,
            poolRate: tofix(Times(Division(item.myShare, item.totalLp), 100), 2, -1) || 0
          }));
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "index";
</style>
