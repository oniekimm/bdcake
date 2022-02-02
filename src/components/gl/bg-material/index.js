import * as THREE from 'three';
import glsl from '/@/lib/glsl';

const vertexShader = glsl`
    varying vec2 vUv;

    uniform sampler2D map;

    void main() {

        vec3 nPosition = position;

        vec2 nVuv = uv;
        // nVuv.x -= 0.5;
        // nVuv.x /= 2.0;
        // nVuv.x += 0.25;
        // nVuv.x += 0.5;
        // vec4 t = texture2D(map, nVuv).rgba;
        // float tAvrg = (t.r + t.g + t.b) / 3.0;

        // nPosition.z = tAvrg * 1.0;

        vec4 mvPosition = modelViewMatrix * vec4(nPosition, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
`;

const fragmentShader = glsl`
    #include <packing>
    varying vec2 vUv;
    uniform sampler2D map;
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
        // vec2 st = gl_FragCoord.xy/1000.0;

        vec2 nVuv3 = vUv;
        nVuv3.x -= 0.5;
        nVuv3.x /= 2.0;
        nVuv3.x -= 0.25;
        nVuv3.x += 0.5;
        // nVuv3.x -= nVuv3.x / 2.0;
        vec4 d = texture2D(map, nVuv3).rgba;
        float dAvrg = (d.r + d.g + d.b) / 3.0;

        vec2 nVuv = vUv;
        nVuv.x -= 0.5;
        nVuv.x /= 2.0;
        nVuv.x += 0.25;
        nVuv.x += 0.5;
        nVuv.y *= 1.0 - sin(time * 0.1 + dAvrg + vUv.y)*2.0;
        nVuv.x *= 1.0 - sin(time * 0.1 + dAvrg + vUv.y)*2.0;
        vec4 t = texture2D(map, nVuv).rgba;
        float tAvrg = (d.r + d.g + d.b) / 3.0;

        // if (dAvrg + mouse.y > start) {
        //     nVuv -= 0.5;
        //     nVuv.x -= (1.0-tAvrg) * (23.0 * (mouse.x*0.2-0.3) + tAvrg);
        //     nVuv += 0.5;
        // }
        // if (dAvrg + mouse.y < stop) {
        //     nVuv -= 0.5;
        //     nVuv.x += (1.0-tAvrg) * (13.0 * (mouse.x*0.2-0.3) + tAvrg);
        //     nVuv += 0.5;
        // }

        nVuv.x /= 1.0 + 1.7 * (1.0-dAvrg)*tAvrg;
        vec4 t2 = texture2D(map, nVuv).rgba;

        t2.rgb = vec3((t2.r + t2.b + t2.g) / 3.0);

        // Use the noise function
        // float n = snoise3(vec3(st.x, st.y, time * .1) * 4.) * .5;

        vec4 outC = t2 * (1.0 + contrast) * dAvrg;

        gl_FragColor = vec4(vec3(outC), 0.3);
    }
`;

class BGMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        map: { value: null },
        time: { value: 0 },
        ratio: { value: 1 },
        start: { value: 1 },
        stop: { value: 1 },
        amount: { value: 1 },
        speed: { value: 1 },
        contrast: { value: 1 },
        mouse: { value: [0, 0] },
      },
    });
  }
}

export default BGMaterial;
