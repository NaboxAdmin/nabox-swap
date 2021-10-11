<template>
  <div class="main-cont">
    <div class="coin-info">
<!--      <div class="d-flex justify-content-end">-->
<!--        <div class="detail-info">-->
<!--          <span class="size-28">L2 ID: {{ superLong(nerveAddress) }}</span>-->
<!--          <span class="icon ml-35" @click="crossOut">-->
<!--            <svg t="1627381264959" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1769" width="18" height="18"><path d="M193.794931 34.540951l28.424555 56.84911c-67.08195 28.424555-299.02632 154.345334-183.906872 515.621431 2.55821 4.832174 9.948594 7.390384 12.79105 0 21.034171-227.396441 160.030246-282.255833 267.759309-325.461157l26.719082 52.585427a26.150591 26.150591 0 0 0 43.205324 0l113.698221-212.331427a39.510132 39.510132 0 0 0-28.424556-56.84911L219.945521 0.71573a23.308135 23.308135 0 0 0-26.15059 33.825221z" fill="#FFFFFF" p-id="1770"></path><path d="M457.006311 495.30299h181.632908a46.332025 46.332025 0 0 1 38.94164 51.164199 46.61627 46.61627 0 0 1-38.94164 51.164199h-181.632908a46.332025 46.332025 0 0 1-38.94164-51.164199 46.047779 46.047779 0 0 1 38.94164-51.164199z" fill="#FFFFFF" p-id="1771"></path><path d="M510.16023 1023.999716a505.388591 505.388591 0 0 1-387.710933-180.495925 51.164199 51.164199 0 0 1 78.451772-65.944968A403.912929 403.912929 0 1 0 706.005415 164.725414a51.164199 51.164199 0 0 1 50.027217-89.537349A506.241327 506.241327 0 0 1 510.16023 1023.999716z" fill="#FFFFFF" p-id="1772"></path></svg>-->
<!--          </span>-->
<!--          <span class="icon ml-3" @click="crossIn">-->
<!--            <svg t="1627381295687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1939" width="18" height="18"><path d="M323.36059 579.128406l-28.444421-56.888841c67.413277-28.444421 300.088639-154.737649 184.60429-517.119569-2.559998-4.835552-10.239991-7.679994-12.799989 0-21.333316 227.555366-160.426533 284.444207-268.799776 326.257506l-27.591088-53.475511a26.453311 26.453311 0 0 0-43.519964 0l-113.777683 213.048711a39.537745 39.537745 0 0 0 28.444421 56.888841l255.999787 64.284391a23.324425 23.324425 0 0 0 25.884423-32.995528z" fill="#FFFFFF" p-id="1940"></path><path d="M457.9027 498.630696h182.044292a44.657741 44.657741 0 0 1 38.968857 48.639959A44.657741 44.657741 0 0 1 639.946992 597.332836h-182.044292a44.657741 44.657741 0 0 1-38.968857-48.924404 44.657741 44.657741 0 0 1 38.968857-49.777736z" fill="#FFFFFF" p-id="1941"></path><path d="M511.093766 1023.999147a505.172912 505.172912 0 0 1-386.844122-180.053184 48.924404 48.924404 0 1 1 74.808827-62.862169A407.892993 407.892993 0 1 0 709.066935 162.133198a48.639959 48.639959 0 1 1 47.502182-85.333262A505.172912 505.172912 0 0 1 511.093766 1023.999147z" fill="#FFFFFF" p-id="1942"></path></svg>-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="info-cont text-white flex-wrap space-evenly" v-if="lpCoinList && lpCoinList.length !== 0">-->
<!--        <div class="d-flex align-items-center direction-column mt-2 w-50"-->
<!--             v-for="(item, index) in lpCoinList"-->
<!--             :key="index">-->
<!--          <span class="font-bold size-30">$ {{ item.balance || 0  | numFormatFix}}</span>-->
<!--          <span class="size-24 mt-1 text-e9">{{ item.chain }} TVL</span>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="pool-cont">
      <div class="d-flex size-32 font-400">
        <span v-for="(item, index) in poolList"
              :key="item"
              @click="switchPool(index)"
              class="size-36 text-90 pool-item"
              :class="{'active_color': index===currentIndex, 'ml-3': index===1}">{{ item }}</span>
      </div>
    </div>
    <template>
      <Join v-if="currentIndex===0"
            :current-account=currentAccount
            :nerve-address="nerveAddress"/>
      <Withdraw v-if="currentIndex===1"
                :current-account=currentAccount
                :nerve-address="nerveAddress"/>
    </template>
  </div>
</template>

<script>
import Join from "./Join";
import Withdraw from "./Withdraw";
import { divisionDecimals } from "@/api/util"

export default {
  name: "Pool",
  components: { Join, Withdraw },
  props: {
    // 当前的账户
    // currentAccount: {
    //   type: Object,
    //   default: () => null
    // },
    // fromAddress: {
    //   type: String,
    //   default: ""
    // }
  },
  data() {
    return {
      poolList: [this.$t("pool.join6"), this.$t("pool.join7")],
      currentIndex: 0,
      liquidityInfo: null
    }
  },
  created() {
    // this.getLiquidityInfo();
  },
  watch: {
    currentAccount: {
      handler(val) {
        if (val) {
          // this.getLiquidityInfo();
        }
      },
      deep: true
    },
    "$store.state.lang": {
      handler(val) {
        this.poolList = [this.$t("pool.join6"), this.$t("pool.join7")]
      }
    }
  },
  computed: {
    nerveAddress() {
      return this.currentAccount && this.currentAccount.address['NERVE'] || ''
    },
    // 当前资金池里面的总额
    lpCoinList() {
      const tempList = this.liquidityInfo && this.liquidityInfo.lpCoinList || [];
      tempList.forEach(item => {
        item.balance = divisionDecimals(item.balance, item.decimals);
      });
      return this.liquidityInfo && this.liquidityInfo.lpCoinList || []
    },
  },
  methods: {
    switchPool(i) {
      this.currentIndex = i;
    },
    // 获取pool流动性信息
    async getLiquidityInfo() {
      const res = await this.$request({
        method: "get",
        url: '/swap/usdn/info'
      });
      if (res.code === 1000 && res.data) {
        this.liquidityInfo = res.data;
        this.liquidityInfo["total"] = divisionDecimals(res.data.total, res.data.decimals);
      }
    },
    // 转出
    crossOut() {
      this.$router.push({ name: 'transfer', params: { nerveTo: 'true' } });
    },
    // 转入
    crossIn() {
      this.$router.push({ path: '/transfer' });
    }
  }
}
</script>

<style scoped lang="scss">
@import "index.scss";
</style>