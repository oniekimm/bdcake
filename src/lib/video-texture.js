import * as THREE from 'three';

class VideoTexture extends THREE.VideoTexture {
    constructor(url, onCanplay = () => {}, { loop, autoplay } = { loop: true, autoplay: true }) {
        const el = document.createElement('video');
        // document.body.appendChild(el)
        // el.style.position = 'fixed'
        // el.style.bottom = '62px'
        // el.style.right = '10px'
        //
        // el.width = 300
        // el.style.zIndex = 999

        el.autoplay = false;
        el.loop = loop;

        el.autobuffer = true;
        el.preload = 'preload';

        el.setAttribute('webkit-playsinline', 'webkit-playsinline');
        el.setAttribute('playsinline', 'playsinline');

        el.muted = true;
        el.src = url;
        super(el);
        this.url = url;

        if (autoplay) el.play();
        else el.pause();
        // el.playbackRate = 3
        this._el = el;
        el.addEventListener('canplay', () => {
            // el.pause();
            onCanplay(el);
        });
    }

    clone() {
        return new this.constructor(this.url).copy(this);
    }

    setUrl(url) {
        if (this._el.src.match(url)) return;
        this._el.src = url;
    }

    play() {
        // this._el.currentTime = 0.1;
        // this._el.play();
    }

    getElement() {
        return this._el;
    }

    destroy() {
        // console.log('[] VIDEO TEXTURE DESTROY');

        this.dispose();

        this._el = null;
    }
}

export default VideoTexture;
