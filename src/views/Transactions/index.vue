<template>
  <div>
    <div class="tab-header-cont">
      <span :class="{'active': orderType === 1}" class="tab-item cursor-pointer" @click="getTxList()">{{ $t('tips.tips32') }}</span>
      <span :class="{'active': orderType === 3}" class="tab-item ml-3 cursor-pointer" @click="getOrderList(currentAccount['address'][fromNetwork] || currentAccount['address'][nativeId])">{{ $t('tips.tips40') }}</span>
      <span :class="{'active': orderType === 2}" class="tab-item ml-3 cursor-pointer" @click="getLiquidityOrderList(currentAccount['address'][fromNetwork] || currentAccount['address'][nativeId])">{{ $t('navBar.navBar2') }}</span>
      <div class="flex-1"/>
    </div>
    <div v-loading="orderLoading" class="customer-p pt-1">
      <div class="order-list mt-3">
        <div class="fix-cont">
          <div
            v-for="item in orderList"
            :key="item.orderId"
            class="d-flex align-items-center mb-3 cursor-pointer space-between"
            @click="linkToUrl(item.fromHash || item.txHash || item.hash, item)">
            <template>
              <span v-if="orderType===3" class="w-240 text-primary flex-1 size-28">{{ item.swapType == 3 ? $t("tips.tips33") : $t("navBar.navBar5") }}</span>
              <span v-else class="w-240 text-primary flex-1 d-flex align-items-center">
                <span class="mr-1 m-width size-28">{{ orderType!==2 && superLong(item.txHash) || superLong(item.orderId) }}</span>
                <span v-if="orderType === 1" class="sign">{{ item.type }}</span>
              </span>
            </template>
            <div class="d-flex align-items-center size-28">
              <template>
                <span v-if="orderType === 1 || orderType !== 1 && item.status !== 0">{{ item.createTime }}</span>
                <span v-else class="size-28 text-danger">{{ $t('swap.swap51') }}</span>
              </template>
              <span v-if="orderType === 1 || orderType !== 1 && item.status !== 0" class="status-icon">
                <!--L1网络订单-->
                <i v-if="orderType === 1 && item.status === 0" class="el-icon-loading" style="color: #3a3c44"/>
                <img v-if="orderType === 1 && item.status === 1" src="@/assets/svg/success_icon.svg" alt="">
                <img v-if="orderType === 1 && item.status === -1" src="@/assets/svg/error_icon.svg" alt="">
                <!--添加/退出流动性订单-->
                <img v-if="orderType === 2 && item.status === 3" src="@/assets/svg/success_icon.svg" alt="">
                <i v-if="orderType === 2 && item.status < 3 && item.status !== 0" class="el-icon-loading" style="color: #3a3c44"/>
                <img v-if="orderType === 2 && item.status === 4" src="@/assets/svg/error_icon.svg" alt="">
                <!--跨链/swap订单-->
                <template>
                  <img v-if="orderType === 3 && item.status === 3" src="@/assets/svg/success_icon.svg" alt="">
                  <i v-if="orderType === 3 && item.status < 3 && item.status !== 0" class="el-icon-loading" style="color: #3a3c44"/>
                  <img v-if="orderType === 3 && item.status === 4" src="@/assets/svg/error_icon.svg" alt="">
                </template>
              </span>
            </div>
          </div>
          <div v-if="orderList.length === 0" class="text-center size-28 mb-3">{{ $t('modal.modal3') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supportChainList } from '@/api/util';

export default {
  name: 'Transactions',
  data() {
    return {
      orderType: this.orderTypeIndex || 1,
      orderLoading: false,
      orderList: []
    };
  },
  computed: {
    hashLinkList() {
      const hashLinkList = {};
      const tempSupportChainList = supportChainList.length === 0 && sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || supportChainList;
      tempSupportChainList.forEach(item => {
        hashLinkList[item.chain] = item.hashLink;
      });
      return hashLinkList;
    }
  },
  watch: {
    '$store.state.orderTypeIndex': {
      handler(val) {
        this.orderType = val;
        if (val === 2) {
          this.currentAccount && this.getLiquidityOrderList(this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId]);
        } else if (val === 3) {
          this.currentAccount && this.getOrderList(this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId]);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.orderType === 1) {
      this.getTxList();
    }
  },
  methods: {
    // 获取普通交易列表
    getTxList(switchType = true) {
      this.orderType = switchType && 1;
      this.$store.commit('changeOrderTypeIndex', 1);
      this.orderLoading = false;
      const tempL1List = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'))[this.fromNetwork] || [];
      const tempL2List = localStorage.getItem('l2HashList') && JSON.parse(localStorage.getItem('l2HashList')) || [];
      const allList = tempL1List.concat(tempL2List).filter(item => item.userAddress === this.fromAddress && (item.chain === this.fromNetwork || item.chain === 'NERVE'));
      this.orderList = [...(allList.sort((a, b) => b.createTimes - a.createTimes) || [])];
      // this.getTxStatus();
      // console.log(this.orderList.length, 'this.orderList');
    },
    async getOrderList(val) {
      try {
        this.orderList = [];
        this.$nextTick(() => {
          this.orderLoading = true;
        });
        this.orderType = 3;
        this.$store.commit('changeOrderTypeIndex', 3);
        const params = {
          address: val,
          chain: this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/tx/query',
          data: params
        });
        if (res.code === 1000) {
          this.orderList = res.data.map(item => {
            return {
              ...item,
              createTime: this.formatTime(item.createTime)
            };
          });
        }
        this.orderLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.orderLoading = false;
      }
    },
    async getLiquidityOrderList(val) {
      try {
        this.orderList = [];
        this.$nextTick(() => {
          this.orderLoading = true;
        });
        this.orderType = 2;
        this.$store.commit('changeOrderTypeIndex', 2);
        const params = {
          address: val,
          chain: this.fromNetwork
        };
        const res = await this.$request({
          url: '/swap/lp/tx/query',
          data: params
        });
        if (res.code === 1000) {
          this.orderList = res.data.map(item => {
            return {
              ...item,
              createTime: this.formatTime(item.createTime)
            };
          });
        }
        this.orderLoading = false;
      } catch (e) {
        console.log(e, 'error');
        this.orderLoading = false;
      }
    },
    // 跳转查看当前的交易详情
    linkToUrl(hash, item) {
      this.$store.commit('changeShowOrderModal', false);
      if (this.orderType === 1) {
        const chain = item.type === 'L2' ? 'NERVE' : this.currentChain;
        this.isMobile ? window.location.href = `${this.hashLinkList[chain]}${hash}` : window.open(`${this.hashLinkList[chain]}${hash}`);
      } else {
        this.toOrderDetail(item);
      }
    },
    // 订单详情
    toOrderDetail(item) {
      this.$router.push({ path: '/orderDetail', query: { orderId: item.orderId, type: this.orderType }});
    }
  }
};
</script>

<style scoped lang="scss">
.tab-header-cont {
  display: flex;
  margin: 0 32px;
  border-bottom: 1px solid #E6E9F0;
  .tab-item {
    padding: 30px 0;
    font-size: 32px;
  }
  .active {
    position: relative;
    color: #1BD0AA;
    //font-weight: bold;
    &:after {
      content: '';
      position: absolute;
      width: 30px;
      height: 4px;
      background: #1BD0AA;
      border-radius: 1.5px;
      left: 50%;
      bottom: -3px;
      transform: translate(-50%, -50%);
    }
  }
}
.order-list {
  padding: 0 32px;
  .fix-cont {
    .order-icon {
      height: 34px;
      width: 34px;
    }
  }
}
.status-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-left: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sign {
  font-size: 16px;
  //margin-left: 13px;
  padding: 5px 11px;
  background: #E7F2F0;
  border-radius: 4px;
  text-align: center;
  //line-height: 26px;
  color: #6EB6A9;
}
</style>
