const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ProgressPlugin } = require('webpack');
const path = require('path');

module.exports = {
    entry: { 'emails-input': './src/emails-input.ts', index: './src/index.ts' },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    plugins: [
        new ProgressPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/index.html',
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts?$/,
                use: ['ts-loader'],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
        ],
    },
};
