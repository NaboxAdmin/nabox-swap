<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="$emit('update:showModal', false)">
    <div :class="{'show_modal-cont': showModal}" class="modal-cont">
      <div class="header-cont size-36 font-500 mt-2">
        {{ $t('modal.modal1') }}
        <div class="back-icon" @click="back">
          <svg t="1626400145141" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1446" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#333333" p-id="1447"/></svg>
        </div>
      </div>
      <div class="search-cont">
        <span class="search-icon">
          <img src="@/assets/image/search.png" alt="">
        </span>
        <input v-model="searchVal" :placeholder="$t('modal.modal2')" type="text" >
      </div>
      <div class="search-result">
        <div v-if="showList.length > 0" class="coin-list">
          <div v-for="(item, index) in showList" :key="index" class="list-item cursor-pointer">
            <div class="d-flex align-items-center space-between pr-4 flex-1" @click="selectAsset(item)">
              <div class="coin-item">
                <span class="coin-icon">
                  <img :src="item.icon || getPicture(item.symbol) || pictureError" @error="pictureError">
                </span>
                <span :class="type==='assets' && 'space-between' || 'justify-content-center'" class="d-flex direction-column h-40">
                  <span class="text-3a font-500">{{ item.symbol }}</span>
                  <span v-if="type==='assets'" class="sign size-16">{{ item.registerChain }}</span>
                </span>
              </div>
              <template>
                <Loading v-if="item.showBalanceLoading"/>
                <span v-else class="text-3a font-500 size-30">{{ (item.balance || 0) | numberFormat }}</span>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-90 flex-1 pt-4">{{ $t('modal.modal3') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from '@/components';

export default {
  name: 'Modal',
  components: { Loading },
  props: {
    assetList: {
      type: Array,
      default: () => []
    },
    showModal: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'assets'
    }
  },
  data() {
    return {
      searchVal: '',
      allList: [],
      showList: []
    };
  },
  watch: {
    assetList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.allList = val;
          if (this.searchVal) {
            this.showList = this.allList.filter(v => {
              const search = val.toUpperCase();
              const symbol = v.symbol.toUpperCase();
              return symbol.indexOf(search) > -1;
            });
          } else {
            this.showList = val;
          }
        }
      }
    },
    searchVal(val) {
      if (val) {
        this.showList = this.allList.filter(v => {
          const search = val.toUpperCase();
          const symbol = v.symbol.toUpperCase();
          return symbol.indexOf(search) > -1;
        });
      } else {
        this.showList = this.allList;
      }
    }
  },
  methods: {
    back() {
      this.searchVal = '';
      this.$emit('update:showModal', false);
    },
    selectAsset(asset) {
      this.searchVal = '';
      this.$emit('selectAsset', asset);
    }
  }
};
</script>

<style scoped lang="scss">
@import "Modal";
</style>
