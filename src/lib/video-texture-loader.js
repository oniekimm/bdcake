import * as THREE from 'three';

function VideoTextureLoader(manager) {
    THREE.Loader.call(this, manager);
}

VideoTextureLoader.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
    constructor: VideoTextureLoader,

    load: function(url, onLoad, onProgress, onError) {
        const el = document.createElement('video');
        el.autoplay = false;
        el.loop = true;
        el.autobuffer = true;
        el.preload = 'preload';

        el.setAttribute('webkit-playsinline', 'webkit-playsinline');
        el.setAttribute('playsinline', 'playsinline');

        el.muted = true;

        // debug
        // document.body.appendChild(el);
        // el.style.position = 'fixed';
        // el.style.bottom = '62px';
        // el.style.right = '10px';
        // el.width = 300;
        // el.style.zIndex = 999;

        const canplay = () => {
            el.play();
            if (onLoad) onLoad(this);
            this.manager.itemEnd(url);
            el.removeEventListener('canplay', canplay);
        };

        el.addEventListener('canplay', canplay);

        const texture = new THREE.VideoTexture(el);

        this.manager.itemStart(url);
        url = this.manager.resolveURL(url);
        el.src = url;

        texture.clone = () => {
            return new this.constructor(el);
        };

        return texture;
    }
});

export default VideoTextureLoader;
