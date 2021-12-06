<template>
  <div>
    <div class="box_loading d-flex align-items-center justify-content-center">
      <img v-if="isActive" src="@/assets/image/loading.svg" alt="">
      <img v-else src="@/assets/image/loading_white.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>