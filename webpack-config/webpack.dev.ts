import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import path from 'path';
import commonConfig from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const PORT = 3000;

const developmentConfig: Configuration = {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '..', 'build'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.m?[jt]s$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'swc-loader',
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, '..', 'postcss.config.js'),
                                sourceMap: true,
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'source-map',
    devServer: {
        port: PORT,
        hot: true,
        open: false
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
    ],
};

export default merge(commonConfig, developmentConfig);
