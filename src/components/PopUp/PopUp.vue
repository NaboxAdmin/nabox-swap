<template>
  <div
    :class="[show && 'show_pop', !customClass && 'defaultClass']"
    class="mask-cont"
    @touchmove="touchmoveEvent"
    @click.stop="maskClick">
    <div :class="[show && 'show-main', customClass && 'customClass']" @click.stop>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopUp',
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
      this.$emit('update:show', false);
    }
  }
};
</script>

<style scoped lang="scss">
@import "PopUp";
</style>
