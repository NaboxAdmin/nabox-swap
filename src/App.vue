<template>
<!--  <keep-alive>-->
    <router-view :key="$route.fullPath"/>
<!--  </keep-alive>-->
</template>
<script>
    export default {
        data() {
            return {}
        },
        created() {},
        methods: {},
    }
</script>
<style lang="scss">
@import "stylus/public.css"; // 公共的样式
body, div, dl, dt, dd, ul, ol, li, p, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea {
  font-family: Robot, Helvetica, Arial, sans-serif, serif !important;
  //word-break: break-all;
}
body {
  //max-width: 1000px;
  //margin: 0 auto !important;
  /* 适配齐刘海*/
  padding-top: constant(safe-area-inset-top);
  /* 适配底部黑条*/
  padding-bottom: constant(safe-area-inset-bottom);
}

@supports (bottom: constant(safe-area-inset-bottom)) {
  body {
    padding-bottom: constant(safe-area-inset-bottom);
  }
}
</style>
