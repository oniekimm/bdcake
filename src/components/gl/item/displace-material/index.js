import * as THREE from 'three';
import vertexShader from './displace-material.vert?raw';
import fragmentShader from './displace-material.frag?raw';
import _ from 'underscore';

class DisplaceMaterial extends THREE.MeshBasicMaterial {
  constructor(params = {}) {
    super();
    this.type = 'PlaneDisplaceMaterial';

    this.uniforms = _.extend({}, THREE.ShaderLib.basic.uniforms, {
      time: { value: 0 },
    });

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.setValues(params);
  }
}
export default DisplaceMaterial;

// DisplaceMaterial.prototype.isMeshBasicMaterial = true;
