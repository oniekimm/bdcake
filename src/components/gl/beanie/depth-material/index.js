import * as THREE from "three";
// import fragmentShader from './noise.frag';
import glsl from "/@/lib/glsl";

const vertexShader = glsl`
    varying vec2 vUv;

    uniform sampler2D map;
    uniform float amount;
    uniform float time;

    void main() {

        vec3 nPosition = position;

        vec2 nVuv = uv;

        vec4 mvPosition = modelViewMatrix * vec4(nPosition, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
`;

const fragmentShader = glsl`
    #include <packing>
    varying vec2 vUv;
    uniform sampler2D map;
    uniform float time;


    void main() {

        vec2 nVuv = vUv;
        vec4 t2 = texture2D(map, nVuv).rgba;
      
        gl_FragColor = vec4(vec3(t2), 1.0);
    }
`;

class DepthMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      uniforms: {
        map: { value: null },
        time: { value: 0 },
      },
    });
  }
}

export default DepthMaterial;
