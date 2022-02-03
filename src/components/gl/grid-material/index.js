import * as THREE from "three";
// import fragmentShader from './noise.frag';
import glsl from "/@/lib/glsl";

const vertexShader = glsl`
    varying vec2 vUv;

    uniform sampler2D map;
    uniform float amount;

    void main() {

        vec3 nPosition = position;

        vec2 nVuv = uv;
        // nVuv.y -= 0.5;
        // nVuv.x /= 2.0;
        // nVuv.x += 0.25;
        // nVuv.x += 0.5;
        // vec4 t = texture2D(map, nVuv).rgba;
        // float tAvrg = (t.r + t.g + t.b) / 3.0;

        // nPosition.z = tAvrg * 1.3 * amount;

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
        nVuv -= vec2(0.5);

        float sinn = (sin(time * 0.1 + (vUv.x + nVuv.y)*5.0)*0.5+0.5);
        
        nVuv *= 1.0 + 10.0 * 0.5;
        nVuv.y *= 1.0 + 25.0 * 0.5;

        // nVuv.x *= 1.0 + sinn;
// 
        vec4 t2 = texture2D(map, nVuv).rgba;

        // if (t2.r < 0.5) {
        //   nVuv.y *= 1.0 - 0.5 * sinn;
        // }

        // nVuv *= 1.0 + sinn*0.1;

        vec4 t3 = texture2D(map, nVuv).rgba;
        

        vec4 outC = t3;
        // vec4 outC = vec4(1.0);
        // outC *= 1.0 - sinn;
        gl_FragColor = vec4(vec3(outC), 1);
    }
`;

class GridMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: 2,
      uniforms: {
        map: { value: null },
        time: { value: 0 },
      },
      // wireframe: true
    });
  }
}

export default GridMaterial;
