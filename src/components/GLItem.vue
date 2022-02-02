<script>
import * as THREE from 'three';

const planeGeo = new THREE.PlaneBufferGeometry(1, 1);

export default {
  props: {
    mouse: {
      type: Number,
    },
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    tick() {
      // console.log('TICK', this)
    },
  },
};
</script>
