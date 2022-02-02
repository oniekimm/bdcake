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
        // nVuv.y -= 0.5;
        // nVuv.x /= 2.0;
        // nVuv.x += 0.25;
        // nVuv.x += 0.5;
        // vec4 t = texture2D(map, nVuv).rgba;
        // float tAvrg = (t.r + t.g + t.b) / 3.0;

        // nPosition.z = tAvrg * 1.3 * amount;


        float val = abs(sin(time*0.12+position.y*1.1));
        if (val > 0.99) {
          // nPosition = vec3(position.x, 12.0 * cos(time*0.01+uv.y*50.1), 0.0);
          // nPosition.z *= 1.0 + (sin(time+uv.y)*0.5+0.5)*50.0;
          nPosition = vec3(position.x, position.y, position.z);// * (cos(time*0.1+uv.y)*0.5+0.5));

        }

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
        // nVuv.y -= 0.5;
        vec4 t2 = texture2D(map, nVuv).rgba;

        // vec4 outC = t2 * (1.0 + 0.5) * dAvrg;
      
        gl_FragColor = vec4(vec3(t2), 0.5);
    }
`;

class DepthMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.FrontSide,
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
