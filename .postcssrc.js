module.exports = {
    plugins: [
        require('postcss-px-to-viewport')({
            viewportWidth: 375,
            unitToConvert: 'mpx',
            minPixelValue: 0,
            unitPrecision: 3,
            viewportUnit: 'vmin',
            fontViewportUnit: 'vmin',
        }),
        require('postcss-calc'),
    ],
};
