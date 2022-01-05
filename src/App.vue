<template>
  <!--  <keep-alive>-->
  <router-view />
<!--  </keep-alive>-->
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss">
@import "stylus/public.css"; // 公共的样式
body, div, dl, dt, dd, ul, ol, li, p, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea {
  font-family: poppins,inter,PingFangSC-Regular,microsoft yahei,sans-serif !important;
}
body {
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

::-webkit-scrollbar {
  background-color: rgba(27,27,27,.4);
  border-radius: 20px;
  width: 3px; // y轴滚动条宽度
  height: 3px; // x轴滚动条高度
}

::-webkit-scrollbar-thumb {
  border-radius: 20px; // 滚动条的圆角
  background: rgba(27,27,27,.4); // 滚动条的背景颜色
}

::-webkit-scrollbar-track {
  border-radius: 20px; // 滚动条的背景区域的圆角
  background: #fff; // 滚动条的背景颜色
}
.el-message {
  min-width: 700px !important;
  max-width: 700px !important;
}
</style>
