<template>
  <div :class="isDapp && 'cont_shadow'" class="layout-page">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'LoginLayout',
  created() {
    let tempData;
    if (typeof window._naboxAccount === 'string') {
      tempData = window._naboxAccount && JSON.parse(window._naboxAccount);
    } else {
      tempData = window._naboxAccount;
    }
    if (tempData && tempData.isTabbarSwap) {
      this.$store.commit('changeNetwork', tempData.chain);
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style scoped lang="scss">
.layout-page {
  //max-width: 800px;
  margin: 0 auto;
}
@media screen and (min-width: 1000px) {
  .layout-page {
    overflow: auto;
    max-width: 800px;
    &::-webkit-scrollbar {
      width: 0px !important;
      height: 0px !important;
    }
  }
  .cont_shadow {
    border: 2px solid #6eb6a9;
    height: 1560px;
    box-shadow: 3px 3px 29px 3px rgba(178, 199, 217, 29%);
  }
}
</style>
