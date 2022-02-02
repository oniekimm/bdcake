#include <packing>
uniform vec3 color;
uniform vec3 color2;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float reflectionOpacity;
varying vec2 vUv;
varying vec4 rUv;

#pragma glslify: cnoise = require(glsl-noise/classic/2d)

// float blendOverlay( float base, float blend ) {
// 	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
// }
//
// vec3 blendOverlay( vec3 base, vec3 blend ) {
// 	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
// }

float readDepth( sampler2D depthSampler, vec4 coord ) {
	float fragCoordZ = texture2DProj( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
	float noise = cnoise(vUv.xy * 8.0);
	vec4 base = texture2DProj( tDiffuse, rUv + noise * 0.02 );
  float depth = readDepth( tDepth, rUv + noise * 0.05 );
	float rV = smoothstep(1.5, -3.0, depth * 7000.0);
	gl_FragColor = vec4( mix( base.rgb, color, (1.0 - reflectionOpacity * rV)), 1.0 );
  gl_FragColor.rgb = mix(gl_FragColor.rgb, color2, 0.1 * smoothstep(0.5, 0.0, noise));
}
