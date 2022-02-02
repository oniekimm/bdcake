<template>
  <div
    class="control"
    :class="{ down: mouseDown }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="val-disp">{{ val.toFixed(2) }}</div>
    <div class="c-inner">
      <div class="val" :style="`transform: scale3d(${val}, 1, 1);`" />
      <div class="bg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    offsetLeft: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      val: 0,
      mouseDown: false,
    };
  },
  watch: {
    val: {
      handler(to) {
        this.$store.commit('setVal', { index: this.index, val: this.val });
      },
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.onWMouseMove);
    window.addEventListener('mouseup', this.onWMouseUp);

    window.addEventListener('touchmove', this.onWTouchMove);
    window.addEventListener('touchend', this.onWTouchEnd);

    this.mx = 0;
    this.my = 0;

    this.val = this.$store.state['val' + this.index];
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onWMouseUp);

    window.removeEventListener('touchmove', this.onWTouchMove);
    window.removeEventListener('touchend', this.onWTouchEnd);
  },
  methods: {
    onMouseDown(e) {
      this.mx = e.clientX;
      this.my = e.clientY;

      this.mouseDown = true;

      this.$store.commit('setSlider', true);
    },
    onWMouseMove(e) {
      this.mx = e.clientX;
      this.my = e.clientY;

      if (this.mouseDown) {
        this.val = (this.mx - this.offsetLeft) / (this.width - 2);
      }
    },
    onWMouseUp(e) {
      this.mx = e.clientX;
      this.my = e.clientY;

      if (this.val > 1) {
        this.val = 1;
      } else if (this.val < 0) {
        this.val = 0;
      }

      this.$store.commit('setSlider', false);
      if (this.mouseDown) {
        this.$store.commit('setAction', true);
        this.$nextTick(() => {
          this.$store.commit('setAction', false);
        });
      }
      this.mouseDown = false;
    },
    onTouchStart(e) {
      // e.preventDefault();
      this.mx = e.touches[0].clientX;
      this.my = e.touches[0].clientY;

      this.mouseDown = true;
    },

    onWTouchMove(e) {
      // e.preventDefault();
      this.mx = e.touches[0].clientX;
      this.my = e.touches[0].clientY;

      if (this.mouseDown) {
        this.val = (this.mx - this.offsetLeft) / (this.width - 2);
      }
    },
    onWTouchEnd(e) {
      // e.preventDefault();
      this.mx = e.changedTouches[0].clientX;
      this.my = e.changedTouches[0].clientY;

      if (this.val > 1) {
        this.val = 1;
      } else if (this.val < 0) {
        this.val = 0;
      }

      this.mouseDown = false;
    },
  },
};
</script>

<style lang="scss">
.control {
  position: relative;
  padding: 20px 0px;
  cursor: pointer;

  .val-disp {
    position: absolute;
    right: 0;
    top: 0px;
    transform: scale3d(1, 1, 1);
    backface-visibility: hidden;
    transform-origin: 100% 100%;
    @include fontS();
  }

  &.down {
    .val-disp {
      transform: scale3d(2, 2, 1);
      transition: none;
    }
  }

  &:hover {
    .c-inner {
      transform: scale3d(1, 4, 1);
    }
  }

  .c-inner {
    height: 1px;
    width: 100%;
    position: relative;
    transition: transform 0.2s ease-out;
    backface-visibility: hidden;

    & > div {
      width: 100%;
      height: 100%;
      background: white;
    }

    .val {
      positon: relative;
      z-index: 1;
      transform-origin: 0% 50%;
    }

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.5;
    }
  }
}
</style>
