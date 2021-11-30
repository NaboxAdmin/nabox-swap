<template>
  <div class="main-cont" :class="isMobile && 'main-cont_mobile' || ''" v-loading="false">
    <NavBar :nav-title="$t('navBar.navBar4')"/>
    <div class="position-cont_nav"/>
    <div class="order-cont">
      <div class="icon-cont">
        <img v-if="detailInfo && (detailInfo.status == 0 || detailInfo.status == 1 || detailInfo.status == 2 || detailInfo.status == 3)" src="../../assets/image/confirmming.png" alt="">
        <img v-if="detailInfo && detailInfo.status == 5" src="../../assets/image/error.png" alt="">
        <img v-if="detailInfo && detailInfo.status == 4" src="../../assets/image/success.png" alt="">
      </div>
      <div class="status-cont size-24 text-center"
           :class="[detailInfo && detailInfo.status === 4 && 'text-18', detailInfo && detailInfo.status === 5 && 'text-danger', detailInfo && (detailInfo.status !== 5 && detailInfo.status !== 4) && 'text-ec',]">
        {{ detailInfo && stableOrderStatus(detailInfo.status) }}
      </div>
      <div class="pt-57 d-flex align-items-center justify-content-center">
        <div class="coin-icon" v-if="detailInfo">
          <img :src="getPicture(detailInfo && detailInfo.symbol)" @error="pictureError" alt="">
        </div>
        <div class="coin-icon">
          <img :src="getPicture(detailInfo && detailInfo.swapSymbol)" @error="pictureError" alt="">
        </div>
      </div>
      <div class="order-info" v-if="detailInfo">
        <div class="detail-info mt-2">{{ detailInfo && detailInfo.amount }} {{ detailInfo && detailInfo.symbol }}</div>
        <div class="down-icon">
          <svg t="1626399197531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1100" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#31B6A9" p-id="1101"></path><path d="M753.408 527.616a36.608 36.608 0 0 0-51.2-3.84l-153.6 132.608V288a36.352 36.352 0 0 0-72.704 0v368.384l-153.6-132.608a36.608 36.608 0 1 0-47.616 55.296l213.76 184.576a41.728 41.728 0 0 0 9.728 5.632h2.048a41.472 41.472 0 0 0 11.264 1.792 41.472 41.472 0 0 0 11.264-1.792h2.048a41.728 41.728 0 0 0 9.728-5.632l213.76-184.576a36.608 36.608 0 0 0 5.12-51.456z" fill="#FFFFFF" p-id="1102"></path></svg>
        </div>
        <div class="detail-info mt-2">{{ detailInfo && detailInfo.swapSuccAmount || 0 }} {{ detailInfo && detailInfo.swapSymbol }}</div>
      </div>
      <div class="dash_cont"></div>
      <div class="order-detail_info">
        <div class="d-flex align-items-center space-between">
          <span class="text-aa">From</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ detailInfo &&  detailInfo.fromChain }}</span>
            <span  class="ml-4">{{ superLong(detailInfo && detailInfo.fromAddress) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">To</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ detailInfo && detailInfo.toChain }}</span>
            <span  class="ml-4">{{ superLong(detailInfo && detailInfo.toAddress) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ detailInfo && detailInfo.platform === 'SWFT' ? $t('order.order5') : $t('order.order8') }}</span>
          <span @click="copyOrderId(detailInfo && detailInfo.orderId || detailInfo.txHash)">{{ detailInfo && detailInfo.platform === 'SWFT' ? superLong(detailInfo.orderId) : superLong(detailInfo && detailInfo.txHash) }}</span>
        </div>
        <!--汇率-->
<!--        <div class="d-flex align-items-center space-between mt-5">-->
<!--          <span class="text-aa">{{ $t('swap.swap5') }}</span>-->
<!--          <div class="d-flex align-items-center justify-content-end" v-if="orderInfo.swapRate">-->
<!--            <span  class="ml-4">1{{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }} ≈ {{ orderInfo && orderInfo.swapRate }} {{ orderInfo && orderInfo.fromAsset && orderInfo.toAsset.symbol }}</span>-->
<!--          </div>-->
<!--          <div class="d-flex align-items-center justify-content-end" v-else>-->
<!--            <span  class="ml-4">1{{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }} ≈ 1{{ orderInfo && orderInfo.fromAsset && orderInfo.toAsset.symbol }}</span>-->
<!--          </div>-->
<!--        </div>-->
        <!--手续费-->
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('swap.swap6') }}</span>
<!--          <div class="d-flex align-items-center justify-content-end" v-if="!detailInfo.fee">-->
<!--            <span  class="ml-4 text-ec"><span class="text-3a" v-if="orderInfo.withdrawFee">-->
<!--              <span v-if="orderInfo.transferFee">{{ orderInfo.transferFee }}{{ orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</span> {{ orderInfo.withdrawFee }}{{orderInfo.toAsset && orderInfo.toAsset.symbol}}</span></span>-->
<!--          </div>-->
          <div class="d-flex align-items-center justify-content-end">
            <span  class="ml-4 text-ec">
              <span class="text-3a">
                {{ detailInfo && detailInfo.fee | numberFormat }}{{ (detailInfo && detailInfo.platform === 'nabox') && (detailInfo && detailInfo.symbol) || (detailInfo && detailInfo.swapSymbol) }}
              </span>
            </span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('order.order7') }}</span>
          <span>{{ detailInfo && detailInfo.createTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar } from "@/components";
import {divisionDecimals, copys} from "../../api/util";

export default {
  name: "orderDetail",
  components: { NavBar },
  data() {
    return {
      detailInfo: null
    }
  },
  filters: {
    orderStatus(val) {
      switch (val) {
        case 0:
          return '等待兑换'
        case 1:
          return '兑换已确认'
        case 2:
          return '等待跨链'
        case 3:
          return '跨链已确认'
        case 4:
          return '目标链等待接收'
        case 5:
          return '目标地址接收已确认'
        case 6:
          return '兑换失败'
      }
    },
    stableOrderStatus(val) {
      switch (val) {
        case 0:
          return 'swap跨链交易未确认'
        case 1:
          return 'swap跨链交易已确认'
        case 2:
          return 'swap跨链交易,swap交易已广播'
        case 3:
          return 'swap跨链交易，链跨出交易已广播'
        case 4:
          return 'swap跨链交易，目标链已确认'
        case 5:
          return 'swap跨链交易失败'
      }
    }
  },
  beforeCreate() {
    // background-color:#6EB6A9;
    document.querySelector('body').setAttribute('style', 'font-size:12px');
  },
  created() {
    if (this.$route.query.txHash) {
      this.txHash = this.$route.query.txHash;
      this.getOrderDetail(this.$route.query.txHash);
    }
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    },
  },
  methods: {
    stableOrderStatus(val) {
      switch (val) {
        case 0:
          return this.$t("swap.swap21")
        case 1:
          return this.$t("swap.swap22")
        case 2:
          return this.$t("swap.swap23")
        case 3:
          return this.$t("swap.swap24")
        case 4:
          return this.$t("swap.swap25")
        case 5:
          return this.$t("swap.swap26")
        default:
          return this.$t("swap.swap26")
      }
    },
    async getOrderDetail(txHash) {
      const params = {
        txHash
      };
      const res = await this.$request({
        url: '/swap/get/tx',
        data: params
      });
      if (res.code === 1000) {
        const tempData = {
          ...res.data,
          fee: divisionDecimals(res.data.fee, res.data.decimal),
          amount: divisionDecimals(res.data.amount, res.data.decimal),
          swapSuccAmount: res.data.swapSuccAmount && divisionDecimals(res.data.swapSuccAmount, res.data.swapDecimal) || 0
        }
        this.detailInfo = tempData;
      }
    },
    copyOrderId(val) {
      if (!val) return;
      copys(val);
      this.$toast(this.$t("tips.tips13"))
    }
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style');
    document.querySelector('body').setAttribute('style', 'font-size:12px');
  }
}
</script>

<style scoped lang="scss">
@import "orderDetail";
</style>