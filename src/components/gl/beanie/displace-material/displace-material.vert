#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
uniform sampler2D map;
uniform float time;


void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>

	#ifdef USE_ENVMAP

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#endif

	vec3 color = texture2D(map, uv).rgb;
	float value = (color.r + color.g + color.b) / 3.0;
	#include <begin_vertex>
	transformed.z -= sin(time * 0.0015 + transformed.y*5.0 + transformed.x*2.5) * 0.05;
	transformed.y -= cos(time * 0.0015 + transformed.y*4.0 + transformed.x*2.5) * 0.05;
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>


	#include <logdepthbuf_vertex>

	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}