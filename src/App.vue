<template>
  <p style="color: black">hi</p>
  <!-- <GL :scroll="scrollY" /> -->
  <!-- <Controls /> -->
  <div class="scroll-wrap" ref="scrollwrap">
    <div class="scrollH" ref="scrollH" />
  </div>
</template>

<script>
import GL from './components/GL.vue';
import Controls from './components/Controls.vue';
import Data from './data/media';

export default {
  components: {
    GL,
    Controls,
  },
  data() {
    return {
      scrollY: 0,
      // scrollDif: 0,
    };
  },
  computed: {
    muted() {
      return this.$store.state.muted;
    },
  },
  // watch: {
  //   scrollDif: {
  //     handler(to, from) {
  //       this.$store.commit('setScrollDif', this.scrollDif);
  //     },
  //   },
  // },
  mounted() {
    this.scrollY = 0;
    // this.prevScrollY = 0;
    // this.scrollDif = 0;

    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    this.$nextTick(() => {
      this.onResize();
    });

    // IF MOBILE request deviceorientation
    // Check if is IOS 13 when page loads.
    this.gyroPresent = false;
    window.addEventListener('devicemotion', (event) => {
      if (
        event.rotationRate.alpha ||
        event.rotationRate.beta ||
        event.rotationRate.gamma
      )
        this.gyroPresent = true;
    });
    setTimeout(() => {
      if (
        !this.gyroPresent &&
        window.DeviceMotionEvent &&
        typeof window.DeviceMotionEvent.requestPermission === 'function'
      ) {
        // Everything here is just a lazy banner. You can do the banner your way.
        this.banner = document.createElement('div');
        this.banner.classList.add('devicemotion');
        this.banner.innerHTML = `<div style="z-index: 100; position: absolute; width: 100%; color: #fff"><p style="padding: 10px">Click here to enable DeviceMotion</p></div>`;
        this.banner.onclick = this.clickRequestDeviceMotionEvent; // You NEED to bind the function into a onClick event. An artificial 'onClick' will NOT work.
        document.body.appendChild(this.banner);
      }
    }, 1000);
  },
  beforeUnmount() {
    this.banner.onclick = null;
    document.body.removeChild(this.banner);

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onScroll(e) {
      this.scrollY = window.scrollY;
    },
    onResize(e) {
      this.$refs.scrollH.style.height = innerHeight * Data.length + 'px';
    },
    clickRequestDeviceMotionEvent() {
      this.banner.onclick = null;
      document.body.removeChild(this.banner);

      window.DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener(
              'devicemotion',
              () => {
                console.log('DeviceMotion permissions granted.');
              },
              (e) => {
                throw e;
              }
            );
          } else {
            console.log('DeviceMotion permissions not granted.');
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    onMuteClick() {
      if (this.muted) {
        this.$store.commit('setMute', false);
      } else {
        this.$store.commit('setMute', true);
      }
    },
  },
};
</script>

<style lang="scss">
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @include fontS();
}

h1 {
  position: fixed;
  z-index: 100;
  top: $padding;
  left: $padding;
  mix-blend-mode: difference;
  font-weight: normal;
  @include fontS();
  margin: 0;
  padding: 0;
}

.preorder {
  position: fixed;
  z-index: 100;
  top: $padding * 4;
  left: $padding;
  mix-blend-mode: difference;
  @include fontS();
  text-decoration: none;
}

.film {
  position: fixed;
  z-index: 100;
  top: $padding * 3;
  left: $padding;
  mix-blend-mode: difference;
  @include fontS();
  text-decoration: none;
}

.collec {
  padding-left: 50px;
}

.scroll-wrap {
  overflow-x: hidden;
  overflow-y: scroll;
  display: none;

  .scrollH {
    width: 1px;
    height: 300vh;
  }
}

.item {
  position: fixed;
  top: 50%;
  @include fontS();
  z-index: 10;
  // right: $padding;
  will-change: true;
}
.devicemotion {
  position: fixed;
  z-index: 100;
  top: 50%;
  width: 50%;
}

.mute {
  position: fixed;
  z-index: 500;
  top: $padding;
  right: $padding;
  cursor: pointer;
  mix-blend-mode: difference;
}
</style>
