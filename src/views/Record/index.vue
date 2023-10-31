<template>
  <div ref="scrollContainer" :class="{'mobile_class': !isMobile}" class="record-cont" @scroll="recordScroll">
    <div class="size-28 pt-2 pb-2">Start Date</div>
    <el-date-picker
      v-model="startDate"
      :picker-options="startPickerOptions"
      :append-to-body="false"
      popper-class="date-popper"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="Select Start Date"/>
    <div class="size-28 pt-2 pb-2">End Date</div>
    <el-date-picker
      v-model="endDate"
      :picker-options="endPickerOptions"
      :append-to-body="false"
      popper-class="date-popper"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="Select End Date"/>
    <div class="size-28 pt-2 pb-2">Channel Key</div>
    <el-input v-model="key" placeholder="Enter Channel Key"/>
    <div class="btn-group d-flex align-items-center space-between">
      <el-button :disabled="!endDate || !startDate || !key" @click="searchRecords(true)">Search Records</el-button>
      <el-button :disabled="!endDate || !startDate || !key" @click="excelExport">Excel Export</el-button>
    </div>
    <div class="record-list">
      <div class="font-bold size-36">Swap Records</div>
      <div class="record-list-cont">
        <div v-if="!!recordList.length" class="record-item d-flex mt-2">
          <span class="text-cross">Order Id</span>
          <span class="flex-1 text-cross">From-To</span>
          <span class="text-cross">Swap Amount</span>
        </div>
        <div v-for="(item, index) in recordList" :key="index" class="record-item d-flex mt-2">
          <span>{{ superLong(item.orderId) }}</span>
          <span class="flex-1">{{ item.fromChain }}-{{ item.toChain }}</span>
          <span>{{ item.amount | numFormatFix }}{{ item.symbol }}</span>
        </div>
      </div>
      <div v-if="recordList.length===0" class="text-center text-cross mt-3">No Data</div>
      <div v-if="recordList.length !== 0 && recordList.length === totalCount" class="text-center text-cross mt-3">No More</div>
    </div>
  </div>
</template>

<script>
import { SWAP_BOX_API_URL } from '@/config';
export default {
  name: 'Record',
  data() {
    return {
      startPickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      endPickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      startDate: '',
      endDate: '',
      key: '',
      recordList: [],
      pageNo: 1,
      totalCount: 0
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    recordScroll() {
      if (this.$refs.scrollContainer.scrollTop + this.$refs.scrollContainer.clientHeight >= (this.$refs.scrollContainer.scrollHeight - 10) && this.recordList.length < this.totalCount) {
        console.log(123);
        this.pageNo = this.pageNo + 1;
        this.searchRecords();
      }
    },
    async searchRecords(click) {
      if (click) {
        this.pageNo = 1;
        this.recordList = [];
      }
      const params = {
        endDate: this.endDate,
        startDate: this.startDate,
        platformCode: this.key,
        page: this.pageNo,
        size: 30
      };
      const res = await this.$request({
        url: '/swap/cross/tx/query',
        data: params
      });
      if (res && res.code === 1000) {
        this.recordList = this.recordList.concat(res.data.list);
        this.totalCount = res.data && res.data.totalCount;
      }
    },
    async excelExport() {
      window.open(`${SWAP_BOX_API_URL}/swap/excel?startDate=${this.startDate}&endDate=${this.startDate}&platformCode=${this.key}`);
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight && this.recordList.length < this.totalCount) { // 滚动到底部，逻辑代码
        this.pageNo = this.pageNo + 1;
        this.searchRecords();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.record-cont {
  margin: 15px;
  .el-date-editor.el-input {
    width: 100%;
  }
}
.date-popper {
  background-color: red !important;
  /deep/ .el-date-table__row .el-date-table td.today span {
    color: red !important;
  }
}
/deep/ .el-input__inner {
  &:focus {
    border-color: #5622CE
  }
}
.btn-group {
  margin-top: 40px;
  button {
    width: 100%;
    background-color: #5622CE;
    color: #FFFFFF;
    &:disabled {
      opacity: .7;
    }
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    background-color: #5622CE;
    opacity: .7;
    color: #FFFFFF;
  }
}
.record-list {
  margin-top: 40px;
}
.record-list-cont {
  .record-item {
    span {
      font-size: 28px;
    }
    span:first-child {
      width: 40%;
    }
  }
}
@media screen and (min-width: 1000px) {
  .mobile_class {
    height: 1560px;
    overflow-y: auto;
  }
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
}
</style>
