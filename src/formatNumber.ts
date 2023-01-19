export function formatNumber(value: number) {
    let text = value.toString().split('.');
    text[0] = text[0].length > 9? `${text[0].slice(0, -9)} ${text[0].slice(-9)}` : text[0];
    text[0] = text[0].length > 6? `${text[0].slice(0, -6)} ${text[0].slice(-6)}` : text[0];
    text[0] = text[0].length > 3? `${text[0].slice(0, -3)} ${text[0].slice(-3)}` : text[0];
    return text.join('.');
}
