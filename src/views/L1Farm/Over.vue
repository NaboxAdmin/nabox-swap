<template>
  <div class="p-3">
    <div class="loading-cont" v-if="farmLoading" element-loading-background="rgba(255, 255, 255, 0.1)" v-loading="farmLoading"/>
    <div class="d-flex direction-column mb-3 border_d8"
         v-for="(item, index) in farmList"
         :key="`${item.farmKey}-${item.pid}`"
         @click.stop="showDetailInfo(item)"
         v-else-if="farmList.length !== 0">
      <div class="farm-item p-3 bg-white d-flex align-items-center space-between"
           :class="{ 'farm_item_show': item.showDetail, 'farm_item_hide': !item.showDetail }">
        <div class="d-flex direction-column">
          <div class="farm-icon d-flex align-items-center">
          <span class="icon">
            <img :src="item.icon || pictureError" @error="pictureError" alt="">
          </span>
            <span class="size-30 ml-1">{{ item.farmName || '' }}</span>
          </div>
          <div class="farm-info mt-4 d-flex align-items-center">
            <div class="d-flex direction-column mr-100">
              <span class="text-90 size-26">
                <!--{{ item.syrupAsset && item.syrupAsset.symbol }}-->
                {{ $t("vaults.over2") }}
              </span>
              <span class="font-500 size-36 mt-1">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
            </div>
            <div class="d-flex direction-column">
              <span class="text-90 size-26">APR</span>
              <span class="font-500 size-36 mt-1">{{ item.profit || '0%' }}</span>
            </div>
          </div>
        </div>
        <div class="drop-icon" :class="{'rotate_x': item.showDetail}">
          <img src="@/assets/image/dorp_active.png" alt="">
        </div>
      </div>
      <div class="farm-detail_info"
           :class="{ 'show_transition': item.showDetail }"
           @click.stop
           v-if="item.showDetail">
        <div class="d-flex align-items-center space-between">
          <span class="text-90 size-28">TVL</span>
          <div class="d-flex align-items-center size-28">
            <span class="text-3a">${{ item.tvl }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ $t("vaults.over2") }} {{ item.syrupAsset && item.syrupAsset.symbol }}</span>
            <el-tooltip v-if="item.lockCandy" :manual="false" class="tooltip-item ml-1" effect="dark" :content="formatContent(item.lockDays)" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png"/>
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 word-break w-330">{{ (item.lockCandy && item.pendingReward || item.reward || 0) | numFormat }}</span>
            <span
                class="item-btn size-30"
                :class="{ active_btn: !item.reward || item.reward===0 || item.reward === '0' }"
                v-if="!item.needReceiveAuth && !item.lockCandy"
                @click.stop="receiveClick(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
            <span
                class="item-btn size-30"
                :class="{ active_btn: !item.pendingReward || item.pendingReward === 0 || item.pendingReward === '0' }"
                v-else-if="!item.needReceiveAuth && item.lockCandy"
                @click.stop="receiveClick(item.farmKey, item)">{{  $t("vaults.over7") }}</span>
          </div>
        </div>
        <div class="vaults-item">
          <div class="text-90 size-28 d-flex align-items-center">
            <span>{{ item.stakedAsset && item.stakedAsset.symbol || 'USDTN' }} {{ $t("vaults.vaults4") }} </span>
            <el-tooltip v-if="item.withdrawLockTime" :manual="false" class="tooltip-item ml-1" effect="dark" :content="formatLockContent(item.withdrawLockTime)" placement="top">
              <span class="info-icon">
                <img src="@/assets/image/question.png"/>
              </span>
            </el-tooltip>
          </div>
          <div class="d-flex align-items-center space-between mt-1">
            <span class="size-40 word-break w-330">{{ (item.amount || 0) | numFormat }}</span>
            <div class="btn-group">
              <template v-if="!item.needStakeAuth">
                <div class="btn-item"
                     :class="{ disabled_btn: !item.amount || item.amount == 0 || !item.reward || item.reward==0 || item.reward<0 }"
                     @click="showClick('decrease', item.farmKey, item)">-</div>
                <div class="btn-item ml-3 disabled_btn">+</div>
              </template>
            </div>
          </div>
        </div>
        <div class="mt-3 size-28 text-right text-6e d-flex justify-content-end" @click="$router.push({ path: '/swap' })">
          <span>{{ $t("vaults.over5") }}{{ item.stakedAsset && item.stakedAsset.symbol }}</span>
          <span class="arrow-icon ml-1">
            <img src="@/assets/image/link_to.png" alt="">
          </span>
        </div>
        <template v-if="item.lockCandy">
          <div class="px-cont mt-3"></div>
          <div class="size-28 mt-3 d-flex space-between align-items-center">
            <span class="d-flex align-items-center text-90 size-28">
              <span>{{ $t("vaults.vaults12") }}{{ item.syrupAsset && item.syrupAsset.symbol || 'NABOX' }}</span>
            </span>
            <div class="d-flex align-items-center size-28">
              <span class="text-3a">{{ item.lockNumbers | numFormat }}</span>
            </div>
          </div>
          <div class="vaults-item">
            <div class="text-90 size-28">{{ $t("vaults.vaults13") }}{{ item.syrupAsset && item.syrupAsset.symbol }}</div>
            <div class="d-flex align-items-center space-between mt-1">
              <span class="size-40 word-break w-330">{{ (item.unlockNumbers || 0) | numFormat }}</span>
              <span
                  class="item-btn size-30"
                  v-if="!item.needReceiveAuth"
                  :class="{ active_btn: item.unlockNumbers == 0 }"
                  @click="confirmUnlocked(item.farmKey, item)">{{ $t("vaults.over3") }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="text-center mt-4 text-grey">{{ $t('modal.modal3') }}</div>
  </div>
</template>

<script>
import { divisionDecimals, tofix, Minus, Division } from "@/api/util";
import { getBatchLockedFarmInfo, getBatchERC20Balance } from "@/api/api";

export default {
  name: "Over",
  props: {
    networkType: {
      type: String,
      default: 'L1'
    }
  },
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
  watch: {
    farmList: {
      handler(newVal, oldVal) {
        if (newVal && oldVal) {
          oldVal.forEach((item, index) => {
            if (item.showDetail) {
              this.farmList[index].showDetail = item.showDetail;
            }
          })
        }
      },
    },
    networkType: {
      handler(newVal) {
        if (newVal) {
          this.getFarmInfo(false);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 领取
    receiveClick(farmHash, farm) {
      if (!farm.lockCandy && (!farm.reward || farm.reward==="0" || farm.reward===0)) return false;
      if (farm.lockCandy && (!farm.pendingReward || farm.pendingReward === 0 || farm.pendingReward === '0') ) return false;
      this.$emit('receiveClick', { farmHash, farm });
    },
    showClick(type, farmHash, item) {
      // if (!item.amount || item.amount == 0 || !item.reward || item.reward==0) return false;
      if (type === 'decrease' && (!Number(item.amount) || !item.amount || item.amount == 0 || !item.reward || item.reward==0 || item.reward<0)) return false;
      this.$emit('showClick', { type, farmHash: item.farmKey, item });
    },
    // 完成解锁
    confirmUnlocked(farmHash, farm) {
      if (farm.unlockNumbers == 0) return false;
      this.$emit('confirmUnlocked', { farmHash, farm });
    },
    // 获取当前farm信息
    async getFarmInfo(enable, refresh=false) {
      if (!refresh) {
        this.farmLoading = true;
      }
      const data = { enable };
      const res = await this.$request({
        methods: 'post',
        url: '/farm/list',
        data
      });
      if (res.code === 1000) {
        // this.farmList = res.data;
        let tempList = res.data.filter(item => item.chain === "NERVE" || item.chain === this.$store.state.network);
        if (this.networkType==='L1') {
          tempList = res.data.filter(item => item.chain === this.$store.state.network);
        } else {
          tempList = res.data.filter(item => item.chain === "NERVE");
        }
        await this.getStakeAccount(tempList);
        this.isFirstRequest = false;
      }
    },
    // 获取当前质押资产详细信息
    async getStakeAccount(farmList) {
      // debugger;
      this.farmList = (await Promise.all(farmList.map(async item => {
        const config = JSON.parse(sessionStorage.getItem("config"));
        const batchQueryContract = config[item.chain || 'BSC']['config'].multiCallAddress || '';
        const fromAddress = this.currentAccount['address'][item.chain || 'BSC'];
        const RPCUrl = config[item.chain || 'BSC']['apiUrl'];
        let syrupAsset, stakedAsset;
        if (item.chain === "NERVE") {
          stakedAsset = await this.getAssetInfo({
            chainId: item.stakeTokenChainId,
            assetId: item.stakeTokenAssetId,
            contractAddress: item.stakeTokenContractAddress,
            chain: item.chain
          }); // 获取当前可质押的资产
          syrupAsset = await this.getAssetInfo({
            chainId: item.syrupTokenChainId,
            assetId: item.syrupTokenAssetId,
            contractAddress: item.syrupTokenContractAddress,
            chain: item.chain
          }); // 获取当前可领取资产信息
          item.needReceiveAuth = false;
          item.needStakeAuth = false;
        } else {
          const tokenBalance = await getBatchERC20Balance([item.stakeTokenContractAddress || batchQueryContract, item.syrupTokenContractAddress || batchQueryContract], fromAddress, batchQueryContract, RPCUrl);
          stakedAsset = {
            ...tokenBalance[0],
            chainId: item.stakeTokenChainId,
            assetId: item.stakeTokenAssetId,
            contractAddress: item.stakeTokenContractAddress,
            balance: divisionDecimals(tokenBalance[0].balance || 0, tokenBalance[0].decimals || 18)
          }
          syrupAsset = {
            ...tokenBalance[1],
            chainId: item.syrupTokenChainId,
            assetId: item.syrupTokenAssetId,
            contractAddress: item.syrupTokenContractAddress,
            balance: divisionDecimals(tokenBalance[1].balance || 0, tokenBalance[1].decimals || 18)
          }
          item.needReceiveAuth = false;
          item.needStakeAuth = false;
        }
        if (item.chain === 'NERVE') {
          const res = await this.$request({
            methods: 'post',
            url: '/farm/stake/account',
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
              amount: divisionDecimals(amount || 0, stakedAsset && stakedAsset.decimals),
              reward: this.numberFormat(tofix(divisionDecimals(reward || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
              stakedAsset,
              syrupAsset,
              showDetail: false
            }
          }
          return {...item, stakedAsset, syrupAsset, showDetail: false};
        } else {
          const config = JSON.parse(sessionStorage.getItem('config'));
          const multicallAddress = config[this.fromNetwork].config.multiCallAddress;
          const fromAddress = this.currentAccount['address'][this.fromNetwork];
          const RPCUrl = config[item.chain]['apiUrl'];
          const tokens = await getBatchLockedFarmInfo(item.farmKey, item.pid, fromAddress, multicallAddress, RPCUrl);
          console.log(tokens, "tokensssss")
          return {
            ...item,
            amount: divisionDecimals(tokens[0].userInfo['0'] || 0, stakedAsset && stakedAsset.decimals),
            // reward: this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['1'] || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            unlockNumbers: this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            // lockNumbers: Minus(this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2), this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2)),
            // lockNumbers: this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['3'] || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            lockNumbers: Minus(this.numberFormat(tofix(divisionDecimals(tokens[0].userInfo['3'] || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2), this.numberFormat(tofix(divisionDecimals(tokens[2].unlockedToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2)),
            reward: this.numberFormat(tofix(divisionDecimals(tokens[3].pendingToken || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            pendingReward: this.numberFormat(tofix(divisionDecimals(tokens[4].pendingReward || 0, syrupAsset && syrupAsset.decimals), 2, -1), 2),
            stakedAsset,
            syrupAsset,
            showDetail: false
          }
        }
      })));
      this.farmLoading = false;
      // const tempList = resList.filter(item => item);
      console.log(this.farmList, '==ended farmList==');
    },
    showDetailInfo(farm) {
      for (let item of this.farmList) {
        if (item.farmKey === farm.farmKey) {
          farm.showDetail = !farm.showDetail;
        } else {
          item.showDetail = false;
        }
      }
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
    formatContent(lockDay) {
      const isEn = this.$store.state.lang === 'en';
      return !isEn ? `执行解锁操作后，收益将在${lockDay}天后解锁，你可以在下方将已解锁的Token领取到你的账户地址` : `After executing the unlocking operation, the reward will be unlocked in ${lockDay} days and then you can claim the unlocked Token to your address`
    },
    formatLockContent(lockSeconds) {
      if (!lockSeconds) return false;
      const lockDay = Division(lockSeconds, 3600);
      const isEn = this.$store.state.lang === 'en';
      return !isEn ? `质押的资产退出时将被锁定${lockDay}小时` : `Staked token will be locked for ${lockDay} hours when withdrawing`
    }
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
.mr-100 {
  margin-right: 100px;
}
.border_d8 {
  border: 1px solid #DBDEE8;
  border-radius: 20px;
}
</style>