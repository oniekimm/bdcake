import * as THREE from 'three';

// import DisplaceMaterial from './displace-material';
import DepthMaterial from './depth-material';

import { store } from '/@/store/index';

// const svgLoader = new SVGLoader();
const textureLoader = new THREE.TextureLoader();

const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
const planeGeo200 = new THREE.PlaneBufferGeometry(1, 1, 200, 200);

// const edges = new THREE.EdgesGeometry(planeGeo);

class Item {
  constructor({ addTo, id, tileSize, totalItems, data, camera } = {}) {
    this.addTo = addTo;
    this.id = id;
    this.tileSize = tileSize;
    this.totalItems = totalItems;
    this.data = data;
    this.camera = camera;

    this.object = new THREE.Object3D();
    this.object.position.z = -20;
    this.addTo.add(this.object);

    this.totalWidth = this.totalItems * this.tileSize;

    this.offset = 0;
    this.baseScale = 8;
    this.itemEase = Math.random() * 0.05 + 0.05;
    this.itemOffsetR = Math.random() * 1;
    this.itemScaleR = Math.random() * 0.6 + 0.7;

    this.itemYAffect = Math.random() * 0.7 + 0.3;

    this.offsetMulti = 0.05;

    this.counterOffset = 0;

    this.lastUpdate = Date.now();

    // scale

    this.baseScale = this.tileSize;
    const scale = this.baseScale; // * this.itemScaleR;
    if (this.data.ratio < 0) {
      this.scaleX = scale;
      this.scaleY = this.scaleX / this.data.ratio;
    } else {
      this.scaleY = scale;
      this.scaleX = this.scaleY * this.data.ratio;
    }

    this.ox = 0; //this.id * this.tileSize;
    this.oy = -this.id * this.tileSize;
    this.targetX = 0;
    this.targetY = 0;

    this.texture = new THREE.Texture();
    if (this.data.type === 'image') {
      this.texture = new THREE.TextureLoader().load(this.data.src);
      this.material = new DepthMaterial();
      this.material.uniforms.map.value = this.texture;
      this.material.uniforms.ratio.value = this.data.ratio;
      this.mesh = new THREE.Mesh(planeGeo200, this.material);
    } else if (this.data.type === 'video') {
      this.video = document.createElement('video');
      this.video.muted = true;
      // this.video.playsinline = 'playsinline';
      this.video.setAttribute('playsinline', 'playsinline');
      this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      this.video.loop = true;
      this.video.crossOrigin = 'anonymous';
      // this.video.autoplay = true;
      this.video.preload = true;

      this.video.src = this.data.src;

      this.texture = new THREE.Texture(this.video);

      this.material = new DepthMaterial();
      this.material.uniforms.map.value = this.texture;
      this.material.uniforms.ratio.value = this.data.ratio;

      this.mesh = new THREE.Mesh(planeGeo200, this.material);

      window.addEventListener('click', this.onWClick);
      window.addEventListener('touchend', this.onWClick);
    }

    if (this.scaleX > 20) {
      this.scaleY = 13;
      this.scaleX = this.scaleY * this.data.ratio;
    }

    this.mesh.scale.set(this.scaleX, this.scaleY, this.scaleX);

    this.object.add(this.mesh);

    // LINE

    // DIV

    // controls

    this.val1Watcher = store.watch(
      // When the returned result changes...
      function (state) {
        return state.val1;
      },
      // Run this callback
      (to) => {
        // this.setMutedState();
        if (this.data.depth) {
          this.material.uniforms.amount.value = store.state.val1;
        }
      }
    );

    this.val2Watcher = store.watch(
      // When the returned result changes...
      function (state) {
        return state.val2;
      },
      // Run this callback
      (to) => {
        // this.setMutedState();
        if (this.data.depth) {
          this.material.uniforms.offset.value = store.state.val2;
        }
      }
    );

    this.val3Watcher = store.watch(
      // When the returned result changes...
      function (state) {
        return state.val3;
      },
      // Run this callback
      (to) => {
        // this.setMutedState();
        if (this.data.depth) {
          this.material.uniforms.contrast.value = store.state.val3;
        }
      }
    );

    if (this.id === 0) {
      this.isActive = true;
      console.log('active');
    }
  }

  onWClick = () => {
    if (this.isActive) {
      this.video.play();
    }
  };

  setDivPosition = () => {
    this.divEl.style.transform = `translate3d(${innerWidth / 2}px, ${
      -this.divPosX + innerHeight / 2
    }px, 0)`;
  };

  destroy() {
    window.removeEventListener('click', this.onWClick);
    window.removeEventListener('touchend', this.onWClick);

    this.isActive = false;

    this.video = null;

    this.texture.dispose();
    this.mesh = null;
    // this.removeEvents();

    window.removeEventListener('click', this.onWClick);
    if (this.val1Watcher) {
      this.val1Watcher();
      this.val2Watcher();
      this.val3Watcher();
    }
  }

  onWClick = () => {
    this.video.play();
  };

  // methods

  tick = (t, offset, x, y) => {
    this.offset = offset;
    this.curX = x;
    this.targetX += (this.curX - this.targetX) * 0.3; //this.itemEase;

    if (this.material.uniforms.time) {
      this.material.uniforms.time.value = t;
    }
    this.itemPosY = this.curY + (this.offset / innerHeight) * this.tileSize;

    // this.object.position.y = this.itemPosY;
    // this.object.rotation.y = this.targetX * 0.3 + this.itemPosY * 0.05;

    // check active
    // const edge = 30;
    // if (this.itemPosY < edge && this.itemPosY > -edge) {
    //   this.isActive = true;
    // } else {
    //   this.isActive = false;
    // }
  };

  // props

  set isActive(active) {
    if (this._isActive === active) return;
    this._isActive = active;

    if (active) {
      if (this.video) {
        this.video.src = this.data.src;
        this.video.play();

        // add update interval
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
          this.updateInterval = null;
        }
        this.updateInterval = setInterval(this.checkVideo, 1000 / 29.97);
      }

      this.mesh.visible = true;
    } else {
      if (this.video) {
        this.video.pause();
        this.video.removeAttribute('src');

        // clear update interval
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
          this.updateInterval = null;
        }
      }

      this.mesh.visible = false;
    }
  }

  checkVideo = () => {
    if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
      this.texture.needsUpdate = true;
    }
  };

  get isActive() {
    return this._isActive;
  }
}

export default Item;
