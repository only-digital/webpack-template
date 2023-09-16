import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import path from 'path';
import commonConfig from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import middlewares from "./middlewares";
import fs from "fs";
import proxy from "./proxy";

const config = {
    port: 3000,
}

if (fs.existsSync('env.config.js')) {
    const envConfig = require('../env.config').devServer || {};
    config.port = envConfig.port || config.port;
}

const developmentConfig: any & Configuration = {
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
        port: config.port,
        hot: true,
        open: false,
        onAfterSetupMiddleware: middlewares,
        proxy
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
    ],
};

export default merge(commonConfig, developmentConfig);
