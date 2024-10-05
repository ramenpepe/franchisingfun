const webpack = require('webpack');

module.exports = {
    // Other configurations...
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
            // Other fallbacks if needed
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            // You can add more polyfills here if necessary
        }),
    ],
};
