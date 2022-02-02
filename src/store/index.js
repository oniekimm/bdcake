import 'es6-promise/auto';
import { createStore } from 'vuex';

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      val1: 0.8,
      val2: 0.5,
      val3: 0.8,

      scrollDif: 0,
      actionTrigger: false,
      sliderTrigger: false,

      muted: false,
    };
  },
  mutations: {
    setVal(state, data) {
      switch (data.index) {
        case 1:
          state.val1 = data.val;
          break;
        case 2:
          state.val2 = data.val;
          break;
        case 3:
          state.val3 = data.val;
          break;
      }
    },
    setScrollDif(state, val) {
      state.scrollDif = val;
    },
    setSlider(state, val) {
      state.sliderTrigger = val;
    },
    setAction(state, val) {
      state.actionTrigger = val;
    },
    setMute(state, val) {
      state.muted = val;
    },
  },
});
