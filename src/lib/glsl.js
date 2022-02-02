export default function glsl(...args) {
    return args[0].raw.reduce((memo, r, i) => memo + r + (args[i + 1] || ''), '');
}
