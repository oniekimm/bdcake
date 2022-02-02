export default function modulo(value, length) {
    return ((value % length) + length) % length;
}
