<template>
  <div v-loading="false" :class="isMobile && 'main-cont_mobile' || ''" class="main-cont">
    <NavBar :nav-title="$t('navBar.navBar4')"/>
    <div class="position-cont_nav"/>
    <div class="order-cont">
      <div class="icon-cont">
        <img v-if="detailInfo && detailInfo.status < 3" src="../../assets/image/confirmming.png" alt="">
        <img v-if="detailInfo && detailInfo.status == 4" src="../../assets/image/error.png" alt="">
        <img v-if="detailInfo && detailInfo.status == 3" src="../../assets/image/success.png" alt="">
      </div>
      <div
        :class="[detailInfo && detailInfo.status === 3 && 'text-18', detailInfo && detailInfo.status === 4 && 'text-danger', detailInfo && (detailInfo.status !== 3 && detailInfo.status !== 4) && 'text-ec',]"
        class="status-cont size-24 text-center">
        {{ detailInfo && orderType == 3 && iSwapOrderStatus(detailInfo.status) || detailInfo && liquidityOrderStatus(detailInfo.status) }}
      </div>
      <div class="pt-57 d-flex align-items-center justify-content-center">
        <div v-if="detailInfo" class="coin-icon">
          <img :src="getPicture(detailInfo && detailInfo.symbol)" alt="" @error="pictureError">
        </div>
        <div class="coin-icon">
          <img :src="getPicture(detailInfo && detailInfo.swapSymbol)" alt="" @error="pictureError">
        </div>
      </div>
      <div v-if="detailInfo" class="order-info">
        <div class="detail-info mt-2">{{ detailInfo && detailInfo.amount }} {{ detailInfo && detailInfo.symbol }}</div>
        <div class="down-icon">
          <svg t="1626399197531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1100" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#31B6A9" p-id="1101"/><path d="M753.408 527.616a36.608 36.608 0 0 0-51.2-3.84l-153.6 132.608V288a36.352 36.352 0 0 0-72.704 0v368.384l-153.6-132.608a36.608 36.608 0 1 0-47.616 55.296l213.76 184.576a41.728 41.728 0 0 0 9.728 5.632h2.048a41.472 41.472 0 0 0 11.264 1.792 41.472 41.472 0 0 0 11.264-1.792h2.048a41.728 41.728 0 0 0 9.728-5.632l213.76-184.576a36.608 36.608 0 0 0 5.12-51.456z" fill="#FFFFFF" p-id="1102"/></svg>
        </div>
        <div class="detail-info mt-2">{{ orderType == 2 && detailInfo.succAmount || (detailInfo.swapSuccAmount || 0) | numberFormat }} {{ detailInfo && detailInfo.swapSymbol }}</div>
      </div>
      <div class="dash_cont"/>
      <div class="order-detail_info">
        <div class="d-flex align-items-center space-between">
          <span class="text-aa">From</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ detailInfo && detailInfo.fromChain }}</span>
            <span class="ml-4">{{ superLong(detailInfo && detailInfo.fromAddress) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">To</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ detailInfo && detailInfo.toChain }}</span>
            <span class="ml-4">{{ superLong(detailInfo && detailInfo.toAddress) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap42') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4" @click="copyOrderId(detailInfo && detailInfo.orderId)">{{ superLong(detailInfo && detailInfo.orderId) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ detailInfo && detailInfo.platform === 'SWFT' ? $t('order.order5') : $t('order.order8') }}</span>
          <span @click="copyOrderId(detailInfo && detailInfo.txHash)">{{ detailInfo && detailInfo.platform === 'SWFT' ? superLong(detailInfo.orderId) : superLong(detailInfo && detailInfo.txHash) }}</span>
        </div>
        <!--手续费-->
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap34') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4 text-ec">
              <span class="text-0">
                {{ detailInfo && detailInfo.crossFee | numberFormat }}{{ detailInfo && (detailInfo.channel === 'NERVE' || orderType == 2) && mainAssetSymbol || 'USDT' }}
              </span>
            </span>
          </div>
        </div>
        <div v-if="orderType != 2" class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap43') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4 text-ec">
              <span class="text-0">
                {{ detailInfo && detailInfo.swapFee | numberFormat }}{{ detailInfo && detailInfo.symbol || 'USDT' }}
              </span>
            </span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('order.order7') }}</span>
          <span>{{ detailInfo && detailInfo.createTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar } from '@/components';
import { copys, tofix } from '@/api/util';

export default {
  name: 'OrderDetail',
  components: { NavBar },
  data() {
    return {
      detailInfo: null,
      orderTimer: null,
      orderType: ''
    };
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    },
    mainAssetSymbol() {
      const config = JSON.parse(sessionStorage.getItem('config'));
      return config[this.detailInfo && this.detailInfo.fromChain]['symbol'];
    }
  },
  beforeCreate() {
    // background-color:#6EB6A9;
    document.querySelector('body').setAttribute('style', 'font-size:12px');
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderType = this.$route.query.type;
      this.orderId = this.$route.query.orderId;
      this.getOrderDetail(this.$route.query.orderId, this.orderType);
      this.orderTimer = setInterval(() => {
        this.getOrderDetail(this.$route.query.orderId);
      }, 10000);
    }
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style');
    document.querySelector('body').setAttribute('style', 'font-size:12px');
    if (this.orderTimer) {
      clearInterval(this.orderTimer);
      this.orderTimer = null;
    }
  },
  methods: {
    stableOrderStatus(val) {
      switch (val) {
        case 0:
          return this.$t('swap.swap21');
        case 1:
          return this.$t('swap.swap22');
        case 2:
          return this.$t('swap.swap23');
        case 3:
          return this.$t('swap.swap24');
        case 4:
          return this.$t('swap.swap25');
        case 5:
          return this.$t('swap.swap26');
        default:
          return this.$t('swap.swap26');
      }
    },
    iSwapOrderStatus(val) {
      console.log('123123')
      switch (val) {
        case 0:
          return this.$t('swap.swap37');
        case 1:
          return this.$t('swap.swap38');
        case 2:
          return this.$t('swap.swap39');
        case 3:
          return this.$t('swap.swap40');
        case 4:
          return this.$t('swap.swap41');
        default:
          return this.$t('swap.swap41');
      }
    },
    liquidityOrderStatus(val) {
      switch (val) {
        case 0:
          return this.$t('swap.swap37');
        case 1:
          return this.$t('swap.swap38');
        case 2:
          return this.$t('swap.swap46');
        case 3:
          return this.$t('swap.swap44');
        case 4:
          return this.$t('swap.swap45');
        default:
          return this.$t('swap.swap41');
      }
    },
    async getOrderDetail(orderId, type) {
      const params = {
        orderId
      };
      if (type == 3) {
        const res = await this.$request({
          url: '/swap/tx/orderId',
          data: params
        });
        if (res.code === 1000) {
          this.detailInfo = {
            ...res.data,
            amount: this.numberFormat(tofix(res.data.amount, 6, -1), 6),
            swapSuccAmount: this.numberFormat(tofix(res.data.swapSuccAmount, 6, -1), 6) || 0
          };
          if (res.data.status > 2) {
            clearInterval(this.orderTimer);
          }
        }
      } else {
        const res = await this.$request({
          url: '/swap/lp/tx/orderId',
          data: params
        });
        if (res.code === 1000) {
          this.detailInfo = {
            ...res.data,
            amount: this.numberFormat(tofix(res.data.amount, 6, -1), 6),
            swapSuccAmount: this.numberFormat(tofix(res.data.swapSuccAmount, 6, -1), 6) || 0
          };
          if (res.data.status > 2) {
            clearInterval(this.orderTimer);
          }
        }
      }
    },
    copyOrderId(val) {
      if (!val) return;
      copys(val);
      this.$toast(this.$t('tips.tips13'));
    }
  }
};
</script>

<style scoped lang="scss">
@import "orderDetail";
</style>
