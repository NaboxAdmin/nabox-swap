<template>
  <div :class="{'show_modal': showModal}" class="mask-cont" @click="$emit('update:showModal', false)" @click.stop @touchmove.stop>
    <div :class="{'show_modal-cont': showModal}" class="modal-cont" @click.stop @touchmove.stop>
      <div class="header-cont size-36 font-500 mt-2">
        <span>{{ type === 'pay' ? $t('swap.swap64') : $t('swap.swap67') }}</span>
        <div class="back-icon" @click.stop="back">
          <img src="@/assets/svg/exit.svg" alt="">
        </div>
      </div>
      <div class="search-cont">
        <span class="search-icon">
          <img src="@/assets/image/search.png" alt="">
        </span>
        <input v-model="searchVal" :placeholder="type === 'pay' ? $t('modal.modal4') : $t('modal.modal5')" type="text" >
      </div>
      <div class="search-result">
        <div v-if="showList.length > 0" class="coin-list">
          <div v-for="(item, index) in showList" :key="index" class="list-item cursor-pointer">
            <div class="d-flex align-items-center space-between pr-4 flex-1" @click="selectAsset(item)">
              <div class="coin-item">
                <span class="coin-icon">
                  <img v-lazy="item.icon || getPicture(item.symbol) || pictureError" @error="pictureError">
                </span>
                <span :class="type==='assets' && 'space-between' || 'justify-content-center'" class="d-flex direction-column">
                  <span v-if="type==='pay'" class="text-3a font-500">{{ item.fiatCurrency }}</span>
                  <span v-else class="d-flex text-3a font-500">
                    <span>{{ item.cryptoCurrency }}</span>
                    <span class="text-90">-{{ item.cryptoCurrencyCode }}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-90 flex-1 pt-4 size-28">{{ $t('modal.modal3') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from '@/components';

export default {
  name: 'PayCoinModal',
  components: { Loading },
  props: {
    tokenList: {
      type: Array,
      default: () => []
    },
    showModal: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'pay'
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
    tokenList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.allList = val;
          if (this.searchVal) {
            this.showList = this.allList.filter(v => {
              const search = val.toUpperCase();
              const currency = this.type === 'pay' ? v.fiatCurrency.toUpperCase() : v.cryptoCurrency.toUpperCase();
              return currency.indexOf(search) > -1;
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
          const currency = this.type === 'pay' ? v.fiatCurrency.toUpperCase() : v.cryptoCurrency.toUpperCase();
          return currency.indexOf(search) > -1;
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
.mask-cont {
  //display: flex;
  //align-items: center;
  padding: 40px;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  opacity: 0;
  z-index: 20;
  background: rgba(0,0,0,.45);
  overflow: auto;
  &.show_modal {
    visibility: visible;
    opacity: 1;
    transition: all linear .2s;
  }
}
.modal-cont {
  //width: calc(100vw - 120px);
  margin-top: 100px;
  //width: 690px;
  //height: 1152px;
  padding: 40px;
  padding-bottom: 40px;
  padding-right: 0;
  background-color: #FFFFFF;
  border-radius: 20px;
  &.show_modal-cont {
    animation: showPop linear .2s;
  }
  .header-cont {
    padding-right: 40px;
    position: relative;
    display: flex;
    align-items: center;
    color: #3A3C44;
    .back-icon {
      cursor: pointer;
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      width: 34px;
      height: 30px;
    }
  }
  .search-cont {
    margin-top: 30px;
    //width: calc(100vw - 220px);
    //max-width: 580px;
    height: 88px;
    padding: 0 30px;
    margin-right: 40px;
    //background: #F0F7F7;
    border: 1px solid #E9EBF3;
    border-radius: 20px;
    display: flex;
    align-items: center;
    .search-icon {
      width: 30px;
      height: 30px;
      img {
        height: 100%;
        width: 100%;
        vertical-align: center;
      }
    }
    input {
      flex: 1;
      outline: none;
      border: none;
      font-size: 30px;
      background-color: transparent;
      margin-left: 21px;
      &::placeholder {
        color: #ABB1BA;
      }
    }
  }
  .search-result {
    margin-top: 40px;
    display: flex;
    .select-cont {
      width: 80px;
      //height: calc(1072px - 238px);
      height: 870px;
      border-right: 1px solid #E9EBF3;
      overflow: auto;
      .choose-chain-list {
        opacity: .25;
        height: 52px;
        width: 52px;
        border-radius: 50%;
        margin-bottom: 30px;
        overflow: hidden;
        cursor: pointer;
        &.active-chain {
          opacity: 1;
        }
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .coin-list {
      flex: 1;
      height: 800px;
      overflow: auto;
      .list-item {
        display: flex;
        align-items: center;
        height: 109px;
        //border-bottom: 1px solid #E9EBF3;
        .coin-item {
          display: flex;
          align-items: center;
          font-size: 30px;
          .coin-icon {
            flex-shrink: 0;
            height: 52px;
            width: 52px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 18px;
            img {
              height: 100%;
              width: 100%;
            }
          }
        }
      }
    }
  }
}
@keyframes showPop {
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}
@media screen and (min-width: 1000px) {
  .mask-cont {
    position: absolute;
  }
}
.loading-contain {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: rgba(255, 255, 255, .5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.h-800 {
  height: 800px;
}
.box_loading {
  height: 30px;
  width: 30px;
  animation: rotate_loading 1.5s linear infinite;
  img {
    height: 100%;
    width: 100%;
  }
}
@keyframes rotate_loading {
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
.sign {
  width: 130px;
  padding: 3px 3px;
  background: #E7F2F0;
  border-radius: 4px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #6EB6A9;
}
.h-40 {
  height: 70px;
}

</style>
