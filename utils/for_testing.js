const reverse = (string) => string
        .split('')
        .reverse()
        .join('')

const average = (array) => {
    const plus = (a, b) => a + b;
    return array.length === 0
        ? 0
        : array.reduce(plus, 0) / array.length;
}

module.exports = {
    reverse,
    average,
}