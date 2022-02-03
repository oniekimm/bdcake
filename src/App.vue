<template>
  <div class="body" ref="body">
    <h1 class="title-top">happy birthday</h1>
    <h1 class="title-bottom">robert</h1>
    <!-- <p ref="logo" style="opacity: 0">i love u</p> -->

    <div ref="logo" class="lightOn" style="opacity: 0">
      <div class="text1">
        <img
          src="tex/letter1.png"
          alt="Girl in a jacket"
          width="500"
          height="600"
        />
      </div>
      <div class="text2">
        <img
          src="tex/letter1.png"
          alt="Girl in a jacket"
          width="500"
          height="600"
        />
      </div>
    </div>
  </div>
  <!-- <div>
    <div class="text1">
      <img
        src="tex/letter1.png"
        alt="Girl in a jacket"
        width="500"
        height="600"
      />
    </div>
  </div> -->

  <GL />
</template>

<script>
import GL from "./components/GL.vue";

export default {
  components: {
    GL,
  },
  data() {
    return {
      opacity: 0,
      lightOn: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    // navigator.mediaDevices
    //   .getUserMedia({ video: false, audio: true })
    //   .then((stream) => {
    //     const audioContext = new AudioContext();
    //     const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
    //       stream
    //     );
    //     this.analyserNode = audioContext.createAnalyser();
    //     mediaStreamAudioSourceNode.connect(this.analyserNode);
    //     this.pcmData = new Float32Array(this.analyserNode.fftSize);
    //     this.animFrame = window.requestAnimationFrame(this.tick);
    //   })
    //   .catch((err) => {
    //     console.log("u got an error:" + err);
    //   });
  },
  beforeUnmount() {
    // window.cancelAnimationFrame(this.animFrame);
    // this.animFrame = null;
  },
  methods: {
    tick() {
      this.analyserNode.getFloatTimeDomainData(this.pcmData);
      let sumSquares = 0.0;
      for (const amplitude of this.pcmData) {
        sumSquares += amplitude * amplitude;
      }

      if ((sumSquares / this.pcmData.length) * 5 > 1) {
        this.lightOn = true;
      }

      if (this.lightOn == true) {
        this.$refs.logo.style.opacity = 1;
        this.$refs.body.style.background = "rgba(0, 0, 0, 0)";
      } else {
        this.$refs.logo.style.opacity = (sumSquares / this.pcmData.length) * 10;
        this.$refs.body.style.background =
          "radial-gradient(circle, transparent, rgba(0,0,0, " +
          (1 - (sumSquares / this.pcmData.length) * 10) +
          "), black, black )";
        this.animFrame = window.requestAnimationFrame(this.tick);
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
  background: white;
  // background-color: rgba(0, 0, 0, 1);
  transition: background 0.5s;
  margin: 0;
  padding: 0;
}

.body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  // background: radial-gradient(
  //   circle,
  //   transparent,
  //   rgba(0, 0, 0, 1),
  //   black,
  //   black
  // );
  // background-color: rgba(0, 0, 0, 1);
  transition: background-color 0.5s;
}

h1 {
  position: fixed;
  z-index: 100;
  // top: $padding;
  // left: $padding;
  mix-blend-mode: difference;
  font-weight: normal;
  @include fontS();
  margin: 0;
  padding: 0;
}

.title-top {
  top: $padding;
  left: 50%;
  transform: translate(-50%, 0%);
}

.title-bottom {
  bottom: $padding;
  left: 50%;
  transform: translate(-50%, 0%);
}

.test {
  position: fixed;
  z-index: 100;
  // top: $padding;
  // left: $padding;
  mix-blend-mode: difference;
  font-weight: normal;
  @include fontS();
  margin: 0;
  padding: 0;
  opacity: 1.5;
}

.lightOn {
  transition: opacity 0.5s;
  position: relative;
  z-index: 100;
}

.text1 {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 30vw;
  height: 100vh;
  padding: 5vw;
  box-sizing: border-box;
  // background-color: pink;
}

.text2 {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  width: 30vw;
  height: 100vh;
  padding: 5vw;
  box-sizing: border-box;

  // background-color: pink;
}

img {
  width: 100%;
  height: auto;
  z-index: 100;
  position: relative;
}

p {
  position: relative;
  z-index: 100;
  color: black;
}
</style>
