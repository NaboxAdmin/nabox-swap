<template>
  <div class="nav-bar">
    {{ navTitle }}
    <span class="back-icon" @click="back">
      <svg t="1626423514494" class="icon" viewBox="0 0 1127 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="784" width="17" height="15"><path d="M1058.133333 443.733333H233.130667l326.997333-327.338666a68.266667 68.266667 0 0 0 0-96.256 68.266667 68.266667 0 0 0-96.256 0l-443.733333 443.733333a68.266667 68.266667 0 0 0 0 96.256l443.733333 443.733333a68.266667 68.266667 0 0 0 96.256-96.256L233.130667 580.266667H1058.133333a68.266667 68.266667 0 1 0 0-136.533334z" fill="#ffffff" p-id="785"></path></svg>
    </span>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    navTitle: {
     type: String,
     default: '订单确认'
    }
  },
  data() {
    return {}
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="scss">
@import "NavBar";
</style>