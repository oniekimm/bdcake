import * as THREE from 'three';
import glsl from '/@/lib/glsl';

const vertexShader = glsl`
    varying vec2 vUv;

    uniform sampler2D map;

    void main() {

        vec3 nPosition = position;

        vec2 nVuv = uv;
        nVuv.x -= 0.5;
        nVuv.x /= 2.0;
        nVuv.x += 0.25;
        nVuv.x += 0.5;
        vec4 t = texture2D(map, nVuv).rgba;
        float tAvrg = (t.r + t.g + t.b) / 3.0;

        nPosition.z = tAvrg * 1.0;

        vec4 mvPosition = modelViewMatrix * vec4(nPosition, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
`;

const fragmentShader = glsl`
    #include <packing>
    varying vec2 vUv;
    uniform sampler2D map;
    uniform sampler2D map2;
    uniform sampler2D stageMap;
    uniform float wolrdToStageProgress;
    uniform float time;
    uniform float ratio;

    uniform float start;
    uniform float stop;
    uniform float speed;
    uniform float contrast;
    uniform float amount;
    uniform vec2 mouse;

    void main() {
        vec4 m = texture2D(map, vUv).rgba;
        vec4 m2 = texture2D(map2, vUv).rgba;

        vec4 outC = mix(m, m2, 1.0-m.a);

        gl_FragColor = vec4(vec3(outC), 1.0);
    }
`;

class CompMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        map: { value: null },
        map2: { value: null },
        time: { value: 0 },
        ratio: { value: 1 },
      },
    });
  }
}

export default CompMaterial;
