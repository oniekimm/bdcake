<template>
  <canvas ref="canvas" />
  <!-- <span class="cur">{{ currentIndex + 1 }}/{{ imagesAmount }}</span> -->
</template>

<script>
import * as THREE from "three";
// import Item from './gl/item';
import Beanie from "./gl/beanie";
import GridMaterial from "./gl/grid-material";
// import BGMaterial from './gl/bg-material';
// import CompMaterial from './gl/comp-material';
// import * as Vue from 'vue';
// import GLItem from './GLItem.vue';
// import Data from './../data/media';

const planeGeo = new THREE.PlaneBufferGeometry(1, 1);

export default {
  props: {},
  data() {
    return {
      center: -1,
      imagesAmount: 0,
      currentIndex: 0,
    };
  },
  watch: {
    center: {
      handler(to) {
        // console.log(to);
        // this.changeBackground(this.images[to]);
      },
    },
  },
  mounted() {
    this.tileSize = 21;

    this.offset = 0;
    this.targetOffset = 0;
    this.prevTargetOffset = 0;

    this.mx = 0;
    this.mxA = 0;
    this.mxTarget = 0;
    this.my = 0;
    this.myA = 0;
    this.myTarget = 0;

    this.targetXRotation = 20;
    this.currentRotationX = 5;

    this.time = 0;

    this.rotationY = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas,
      alpha: true,
    });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(innerWidth, innerHeight);
    // this.renderer.setPixelRatio = ;
    // this.renderer.setClearColor(0xffffff, 1.0);

    this.ocamera = new THREE.OrthographicCamera(
      innerWidth / -2,
      innerWidth / 2,
      innerHeight / 2,
      innerHeight / -2,
      1,
      1000
    );
    // this.bgScene = new THREE.Scene();

    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.FogExp2(0xff0000, 0.9);

    this.camera = new THREE.PerspectiveCamera(
      35,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;
    this.camera.position.y = 0;
    // this.camera.lookAt(new THREE.Vector3(0, 100, 0));

    this.beanie = new Beanie({
      addTo: this.scene,
    });

    const radius = 100;
    const tgeometry = new THREE.CylinderBufferGeometry(
      radius,
      radius,
      10000,
      32
    );

    // const uniforms = {
    //   mouse: { type: '2f', value: [0, 0] },
    //   startTime: { type: 'f', value: Date.now() },
    //   time: { type: 'f', value: 1.0 },
    //   tex: { type: 't', value: checkerBoardTex },
    // };

    this.gridTex = new THREE.TextureLoader().load("tex/checkerboard.jpg");
    this.gridTex.wrapS = THREE.RepeatWrapping;
    this.gridTex.wrapT = THREE.RepeatWrapping;
    this.gridTex.repeat.set(22, 22);

    this.tmaterial = new GridMaterial();
    this.tmaterial.uniforms.map.value = this.gridTex;

    // LINES
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // const geometry = new THREE.BufferGeometry();
    // geometry.vertices.push(new THREE.Vector3(0, -100000, 0));
    // geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    // geometry.vertices.push(new THREE.Vector3(0, 100000, 0));

    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -10.0,
      0.0,
      0.0,
      10.0,
      0.0,
      0.0,
      //  1.0,  1.0,  1.0,

      //  1.0,  1.0,  1.0,
      // -1.0,  1.0,  1.0,
      // -1.0, -1.0,  1.0
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    this.linesObject = new THREE.Object3D();
    this.scene.add(this.linesObject);

    var line = new THREE.Line(geometry, material);
    // this.linesObject.add(line);

    var lineX = new THREE.Line(geometry, material);
    lineX.rotation.y = (90 * Math.PI) / 180;
    // this.linesObject.add(lineX);

    var lineZ = new THREE.Line(geometry, material);
    lineZ.rotation.z = (90 * Math.PI) / 180;
    // this.linesObject.add(lineZ);

    // this.tmaterial = new THREE.ShaderMaterial( {

    //     uniforms:       uniforms,
    //     vertexShader: $('.vertexShader2')[0].textContent,
    //     fragmentShader: $('.fragmentShader2')[0].textContent,
    //     // blending:       THREE.AdditiveBlending,
    //     depthTest:      true,
    //     transparent:    true,
    //     wireframe: false,
    //     side: 1
    // });

    // var tmaterial = new THREE.MeshNormalMaterial({side: 1, wireframe: false});
    this.tube = new THREE.Mesh(tgeometry, this.tmaterial);
    // this.scene.add(this.tube);

    // EVENTS
    window.addEventListener("resize", this.onResize);

    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);

    // window.addEventListener('deviceorientation', this.onDeviceOrientation);

    // ANIM FRAME
    this.animFrame = window.requestAnimationFrame(this.tick);

    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);

    window.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);

    // window.removeEventListener('deviceorientation', this.onDeviceOrientation);

    window.cancelAnimationFrame(this.animFrame);
    this.animFrame = null;

    this.renderer = null;

    // this.bgTarget.dispose();
    // this.imagesTarget.dispose();

    // for (let index = 0; index < this.images.length; index++) {
    //   const element = this.images[index];
    //   element.destroy();
    // }
  },
  methods: {
    tick() {
      this.time += 0.1;

      this.mxTarget += (this.mxA - this.mxTarget) * 0.1;
      this.myTarget += (this.myA - this.myTarget) * 0.1;

      this.targetOffset += (this.offset - this.targetOffset) * 0.1;

      this.rotationY += 0.003;
      this.totalRotation = this.rotationY + this.targetOffset * 0.01;
      // this.totalRotation = 0.1;

      if (this.mouseDown) {
        this.currentRotationX = this.myA * 15.0 + 5;
      } else {
        // this.currentRotationX = 5;
      }

      this.targetXRotation +=
        (this.currentRotationX - this.targetXRotation) * 0.1;

      this.camera.position.y = this.targetXRotation;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      this.tmaterial.uniforms.time.value = this.time;
      this.tube.rotation.y = this.totalRotation * 0.5;
      this.linesObject.rotation.y = this.totalRotation * 0.5;
      this.beanie.tick(this.time, this.totalRotation);
      // this.tube.rotation.y += 0.001;

      this.renderer.setRenderTarget(null);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);

      this.animFrame = window.requestAnimationFrame(this.tick);

      // console.log('yp');
    },

    onResize() {
      this.wW = innerWidth;
      this.wH = innerHeight;

      this.ocamera.left = -innerWidth / 2;
      this.ocamera.right = innerWidth / 2;
      this.ocamera.top = innerHeight / 2;
      this.ocamera.bottom = -innerHeight / 2;
      this.ocamera.updateProjectionMatrix();

      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.wW, this.wH);
    },
    onMouseDown(e) {
      this.mouseDown = true;

      this.startMx = e.clientX;
      this.startMy = e.clientY;

      this.lastMx = this.startMx;
    },
    onMouseUp(e) {
      this.mouseDown = false;
    },
    onMouseMove(e) {
      this.mx = e.clientX;
      this.my = e.clientY;

      this.mxA = e.clientX / innerWidth - 0.5;
      this.myA = e.clientY / innerHeight - 0.5;

      if (this.mouseDown) {
        this.offset += this.mx - this.lastMx;

        this.lastMx = this.mx;
      }
    },
    onDeviceOrientation(e) {
      this.mx = e.gamma / 45;
      // console.log(e.alpha, e.beta, e.gamma);
      this.mxA = Math.max(-0.5, Math.min(0.5, this.mx));
    },
  },
};
</script>

<style lang="scss" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  cursor: grab;
}

.cur {
  position: fixed;
  top: 50%;
  right: $padding;
}
</style>
