<template>
  <div class="farm-animated">
    <div class="farm-loading__item"/>
  </div>
</template>
<script>
export default {
  name: 'FarmLoading'
};
</script>

<style lang="scss" scoped>
.farm-animated .farm-loading__item {
  background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
}
.farm-loading__item {
  background: #f2f2f2;
  display: inline-block;
  height: 40px;
  border-radius: 4px;
  width: 15%;
}
@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%
  }

  to {
    background-position: 0 50%
  }
}
</style>
