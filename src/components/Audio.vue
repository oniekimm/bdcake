<template></template>

<script>
import * as Tone from 'tone';

export default {
  components: {},
  data() {
    return {
      playClicked: false,
    };
  },
  computed: {
    scrollDif() {
      return this.$store.state.scrollDif;
    },
    actionTrigger() {
      return this.$store.state.actionTrigger;
    },
    sliderTrigger() {
      return this.$store.state.sliderTrigger;
    },

    val1() {
      return this.$store.state.val1;
    },
    val2() {
      return this.$store.state.val2;
    },
    val3() {
      return this.$store.state.val3;
    },
    muted() {
      return this.$store.state.muted;
    },
    allVals() {
      return (this.val1 + this.val2 + this.val3) / 3.0;
    },
  },
  watch: {
    scrollDif: {
      handler(to, from) {
        // console.log(to);
        if (this.playClicked) {
          this.scrollAmount = to / 150;
          if (this.scrollAmount > 0.01) {
            this.scrollAudio.play();
          } else {
            this.scrollAudio.pause();
          }
          this.scrollAudioVolume = Math.max(
            0.0,
            Math.min(this.scrollAmount, 0.3)
          );
          //   console.log(this.scrollAudioVolume);
          this.scrollAudio.volume = this.scrollAudioVolume;
          // this.cheby._order = 10 + this.scrollAmount * 10.11;
          // this.distortion.distortion = this.scrollAmount * 0.1;
          this.lowpass.frequency.value = 20 + this.scrollAmount * 2000;
        }
      },
    },
    actionTrigger: {
      handler(to, from) {
        if (to) {
          this.actionAudio.currentTime = 0;
          this.actionAudio.play();
        }
      },
    },
    sliderTrigger: {
      handler(to, from) {
        if (to) {
          this.sliderAudio.currentTime = 0;
          this.sliderAudio.play();
        } else {
          this.sliderAudio.pause();
        }
      },
    },
    allVals: {
      handler(to, from) {
        if (this.playClicked) {
          this.pitchShift.pitch = this.allVals * 10;
        }
      },
    },
    muted: {
      handler(to) {
        if (to) {
          this.ambientAudio.volume = 0;
          this.actionAudio.volume = 0;
        } else {
          this.ambientAudio.volume = 0.6;
          this.actionAudio.volume = 0.2;
        }
      },
    },
  },
  mounted() {
    this.ambientSrc = '/audio/BC_HE_AW21_-_Room_Tone_03.mp3';
    this.ambientAudio = new Audio();
    this.ambientAudio.src = this.ambientSrc;
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 1;

    this.scrollSrc = '/audio/BC_HE_AW21_-_Vert_Scroll_04_short.mp3';
    this.scrollAudio = new Audio();
    this.scrollAudio.src = this.scrollSrc;
    this.scrollAudio.loop = true;
    this.scrollAudio.volume = 0.15;

    this.sliderSrc = '/audio/BC_HE_AW21_-_Slider_New_Short_01.mp3';
    this.sliderAudio = new Audio();
    this.sliderAudio.src = this.sliderSrc;
    this.sliderAudio.loop = true;
    this.sliderAudio.volume = 0.05;

    this.actionSrc = '/audio/BC_HE_AW21_-_Menu_Press_01.mp3';
    this.actionAudio = new Audio();
    this.actionAudio.src = this.actionSrc;
    // this.actionAudio.loop = true;
    this.actionAudio.volume = 0.2;

    window.addEventListener('click', this.onWClick);
  },
  beforeUnmount() {
    window.removeEventListener('click', this.onWClick);
  },
  methods: {
    onWClick() {
      window.removeEventListener('click', this.onWClick);

      this.playClicked = true;

      // Create context
      this.context = Tone.context.rawContext;

      // Create source
      const source = this.context.createMediaElementSource(this.ambientAudio);

      // Create effects with defaults
      this.pitchShift = new Tone.PitchShift();
      //   this.gain = new Tone.Gain();
      this.distortion = new Tone.Distortion();
      this.lowpass = new Tone.Filter(10000, 'highpass');
      this.cheby = new Tone.Chebyshev(10);

      // Connect effects (starting with source, ending with Tone.context.destination)
      Tone.connect(source, this.pitchShift);
      Tone.connect(this.pitchShift, this.lowpass);
      //   Tone.connect(this.gain, this.cheby);
      // Tone.connect(this.distortion, this.lowpass);
      //   Tone.connect(this.lowpass, this.cheby);
      Tone.connect(this.lowpass, Tone.context.destination);

      this.ambientAudio.play();

      this.pitchShift.pitch = this.allVals * 10;

      console.log('play');
    },
  },
};
</script>
