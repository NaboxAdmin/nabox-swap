<template>
  <div class="p-3">
    <div class="loading-cont" v-if="farmLoading" element-loading-background="rgba(255, 255, 255, 0.1)" v-loading="farmLoading"/>
    <div class="detail-item mt-3" v-else-if="farmList.length !== 0" v-for="(item, index) in farmList" :key="item.farmKey">
      <div class="d-flex align-items-center space-between border-bottom">
        <div class="d-flex align-items-center pl-3">
          <span class="icon">
            <img :src="item.icon || pictureError" @error="pictureError" alt="">
          </span>
          <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
        </div>
        <div class="d-flex direction-column pt-3 pb-4 pr-3">
          <span class="text-center size-34 font-500">{{ item.profit || '0%' }}</span>
          <!--          <span class="text-center size-24 text-90 mt-1">{{ $t("vaults.over1") }}</span>-->
        </div>
      </div>
      <div class="mt-3">
        <div class="size-28 d-flex space-between align-items-center pl-3 pr-3">
          <span class="text-90 size-28">TVL</span>
          <div class="d-flex align-items-center size-28">
            <span class="text-3a">${{ item.tvl }}</span>
          </div>
        </div>
        <div class="d-flex pl-3 mt-3 align-items-center">
          <span class="tips-icon mr-2">
            <img src="@/assets/image/tips_icon.png" alt="">
          </span>
          <span>{{ $t("vaults.vaults10") }}XXX{{ $t("vaults.vaults11") }}</span>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28">{{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}</div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 w-330 word-break">{{ (item.reward || 0) | numFormat }}</span>
            <span class="item-btn size-30"
                  :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' }"
                  @click="receiveClick(item)">{{ $t("vaults.over3") }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28">{{ $t("vaults.vaults4") }}</div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 w-330 word-break">{{ (item.amount || 0) | numFormat }}</span>
            <div class="btn-group">
              <div class="btn-item disabled_btn">-</div>
              <div class="btn-item disabled_btn ml-3">+</div>
            </div>
          </div>
        </div>
        <div class="pl-72 size-28 text-right text-6e">{{ $t("vaults.over5") }}{{ item.stakedAsset && item.stakedAsset.symbol }}</div>
        <template>
          <div class="px-cont w-80 mt-3"></div>
          <div class="size-28 mt-3 d-flex space-between align-items-center pl-3 pr-3">
            <span class="text-90 size-28">{{ $t("vaults.vaults12") }}Nabox</span>
            <div class="d-flex align-items-center size-28">
              <span class="text-3a">2345874</span>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("vaults.vaults13") }}{{ item.syrupAsset && item.syrupAsset.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <span class="size-40 word-break w-330">{{ (item.reward || 0) | numFormat }}</span>
              <span
                  class="item-btn size-30"
                  v-if="!item.needReceiveAuth"
                  @click="receiveClick(item.farmKey, item)">{{ $t("vaults.vaults14") }}</span>
              <span
                  class="item-btn size-30"
                  v-else
                  @click="receiveApprove(item.farmKey, item)">{{ $t("vaults.over6") }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="text-center mt-4 text-grey">No Data</div>
  </div>
</template>

<script>
import {divisionDecimals} from "@/api/util";

export default {
  name: "Over",
  data() {
    return {
      showDropList: false,
      farmList: [],
      farmLoading: false,
      farmTimer: null
    }
  },
  created() {
    this.getFarmInfo(false);
    this.farmTimer = setInterval(() => {
      this.getFarmInfo(false, true);
    }, 20000);
  },
  methods: {
    // 领取
    receiveClick(asset) {
      if (!asset.reward) return false;
      this.$emit('receiveClick', { asset })
    },
    // 获取当前farm信息
    async getFarmInfo(enable, refresh=false) {
      if (!refresh) {
        this.farmLoading = true;
      }
      const data = { enable };
      const res = await this.$request({
        methods: 'post',
        url: '/swap/farm/list',
        data
      });
      if (res.code === 1000) {
        // this.farmList = res.data;
        const tempList = res.data.filter(item => item.chain === "NERVE" || item.chain === this.$store.state.network);
        await this.getStakeAccount(tempList);
        this.isFirstRequest = false;
      }
    },
    // 获取当前质押资产详细信息
    async getStakeAccount(farmList) {
      // debugger;
      this.farmList = (await Promise.all(farmList.map(async item => {
        const stakedAsset = await this.getAssetInfo({
          chainId: item.stakeTokenChainId,
          assetId: item.stakeTokenAssetId,
          contractAddress: item.stakeTokenContractAddress,
          chain: item.chain
        }); // 获取当前可质押的资产
        // this.stakedAsset = stakedAsset;
        const syrupAsset = await this.getAssetInfo({
          chainId: item.syrupTokenChainId,
          assetId: item.syrupTokenAssetId,
          contractAddress: item.syrupTokenContractAddress,
          chain: item.chain
        }); // 获取当前可领取资产信息
        if (item.chain === "NERVE") {
          item.needReceiveAuth = false;
          item.needStakeAuth = false;
        } else {
          item.needReceiveAuth = false;
          item.needStakeAuth = await this.getReceiveAuth(stakedAsset, item.farmKey);
        }
        const res = await this.$request({
          methods: 'post',
          url: '/swap/stake/account',
          data: {
            chain: item.chain,
            farmHash: item.farmKey,
            address: this.currentAccount["address"][item.chain]
          }
        });
        if (res.data) {
          const {amount, reward} = res.data;
          return {
            ...item,
            ...res.data,
            amount: divisionDecimals(amount, stakedAsset && stakedAsset.decimals),
            reward: divisionDecimals(reward, syrupAsset && syrupAsset.decimals),
            stakedAsset,
            syrupAsset
          }
        }
        return {...item, stakedAsset, syrupAsset};
      })));
      this.farmLoading = false;
      // const tempList = resList.filter(item => item);
      console.log(this.farmList, '==over farmList==');
    },
    // 获取资产信息
    async getAssetInfo(currentAsset) {
      if (!currentAsset) return '';
      const { chainId, assetId, contractAddress, chain } = currentAsset;
      const params = {
        chain,
        address: this.currentAccount && this.currentAccount.address[chain],
        chainId,
        assetId,
        refresh: true,
        contractAddress: contractAddress || ''
      };
      const res = await this.$request({
        url: '/wallet/address/asset',
        data: params
      });
      if (res.code === 1000) {
        res.data.balance = res.data && divisionDecimals(res.data.balance, res.data.decimals);
        return res.data;
      }
    },
  },
  beforeDestroy() {
    if (this.farmTimer) {
      clearInterval(this.farmTimer);
      this.farmTimer = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import "index";
.active_btn {
  background-color: #ABB1BA;
}
.border-bottom {
  border-bottom: 1px solid #DBDEE8;
}
.pb-4 {
  padding-bottom: 40px;
}
.tips-icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  img {
    height: 100%;
    width: 100%;
  }
}
.arrow-icon {
  width: 30px;
  height: 28px;
  img {
    height: 100%;
    width: 100%;
  }
}
.px-cont {
  height: 1px;
  background: #DBDEE8;
}
.w-80 {
  width: 90%;
  margin: 0 auto;
}
</style>