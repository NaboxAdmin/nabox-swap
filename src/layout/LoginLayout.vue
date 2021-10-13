<template>
    <div class="layout-page">
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
    export default {
      name: "LoginLayout",
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
        window.scrollTo(0,0);
      }
    }
</script>

<style scoped>
.layout-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>