import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import commonConfig from './webpack.common';

const productionConfig: Configuration = {
    mode: 'production',
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, '..', 'build'),
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'ie 11' }]],
                    },
                },
                exclude: /node_modules[\/\\](?!(swiper|dom7|load-script2)[\/\\])/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, '..', 'postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].css',
        }),
    ],
};

export default merge(commonConfig, productionConfig);
