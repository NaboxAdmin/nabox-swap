<template>
  <div v-if="$route.path==='/swap' || $route.path==='/buy'" class="tab-header-cont">
    <span
      :class="{'active': $route.path==='/swap', 'mr-3': true}"
      class="size-36 text-3a cursor-pointer tab-item"
      @click="$router.push('/swap')">{{ $t("navBar.navBar5") }}</span>
    <span
      :class="{'active': $route.path==='/buy', 'mr-3': true}"
      class="size-36 text-3a cursor-pointer tab-item"
      @click="$router.push('/buy')">{{ $t("buy.buy9") }}</span>
    <div class="flex-1"/>
  </div>
</template>

<script>
export default {
  name: 'Tab'
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
    color: #5622CE;
    //font-weight: bold;
    &:after {
      content: '';
      position: absolute;
      width: 30px;
      height: 4px;
      background: #5622CE;
      border-radius: 1.5px;
      left: 50%;
      bottom: -3px;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
