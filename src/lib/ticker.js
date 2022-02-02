class Ticker {
    callbacks = [];
    add = (cb, side) => {
        if (side === -1) this.callbacks = [cb, ...this.callbacks];
        else this.callbacks = [...this.callbacks, cb];
    };
    remove = cb => {
        this.callbacks = this.callbacks.filter(_cb => _cb !== cb);
    };
    start = () => {
        this.loop();
    };
    loop = () => {
        const ms = performance.now();
        this.callbacks.forEach(cb => cb(ms));
        requestAnimationFrame(this.loop);
    };
}

const ticker = new Ticker();
window.ticker = ticker;

export default ticker;
