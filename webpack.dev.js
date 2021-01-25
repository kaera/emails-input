const { merge } = require('webpack-merge');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new WebpackPluginServe({
            host: 'localhost',
            port: 8080,
            static: 'dist',
            liveReload: true,
            waitForBuild: true,
        }),
    ],
    watch: true,
});
