<template>
  <div class="controls" :style="`width: ${width}px;`">
    <Control :index="1" :offset-left="offsetLeft" :width="width" />
    <Control :index="2" :offset-left="offsetLeft" :width="width" />
    <Control :index="3" :offset-left="offsetLeft" :width="width" />
  </div>
</template>

<script>
import Control from '/@/components/Control.vue';

export default {
  components: {
    Control,
  },
  data() {
    return {
      offsetLeft: 0,
      width: 0,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);

    this.onResize();
    this.$nextTick(() => {
      this.onResize();
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      const offset = this.$el.offsetLeft;
      if (offset) {
        this.offsetLeft = offset;
      }

      this.width = innerWidth * 0.3;
      if (this.width < 200) {
        this.width = 200;
      }
    },
  },
};
</script>

<style lang="scss">
.controls {
  position: fixed;
  z-index: 5;
  bottom: $padding - 10;
  right: $padding;
  // transform: translate3d(-50%, 0, 0);

  .control {
    margin-bottom: 15px;

    &:last-child {
      margin: 0;
    }
  }
}
</style>
