<template>
  <div class="mask-cont"
       @touchmove="touchmoveEvent"
       @click.stop="maskClick"
       :class="[show && 'show_pop', !customClass && 'defaultClass']">
    <div @click.stop :class="[show && 'show-main', customClass && 'customClass']">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: Boolean,
      default: false
    },
    preventBoo: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    touchmoveEvent(e) {
      this.preventBoo && e.preventDefault();
    },
    maskClick() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import "PopUp";
</style>