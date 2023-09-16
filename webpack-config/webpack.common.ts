import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import colors from 'colors';
import getPages from './pages';
import createDataJson from './dataJson';
import fs from "fs";

console.log(`[ ${colors.green.bold('START')} ] Сборка проекта\n`);

const pages = getPages();

const dataJson = createDataJson();

const config: Configuration =  {
    entry: {
        common: './src/app/js/common.ts',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attributes: {
                                list: [
                                    {
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'video',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'video',
                                        attribute: 'data-src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'picture',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'source',
                                        attribute: 'srcset',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'source',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'link',
                                        attribute: 'href',
                                        type: 'src',
                                    },
                                ],
                            },
                        },
                    },
                    {
                        loader: 'pug-html-loader',
                        options: {
                            data: { dataJson },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|avif|webp|gif|svg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name].[hash:8].[ext]',
                    },
                },
                include: [path.join(__dirname, '..', 'src', 'assets', 'images')],
            },
            {
                test: /\.(cur)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name].[ext]',
                    },
                },
                include: [path.join(__dirname, '..', 'src', 'assets', 'icons')],
            },
            {
                test: /\.(svg|png)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/favicons/[name].[ext]',
                    },
                },
                include: [path.join(__dirname, '..', 'src', 'assets', 'favicons')],
            },
            {
                test: /\.(mp4|avi)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/videos/[name].[ext]',
                    },
                },
            },
            {
                test: /\.(woff2|woff|ttf|otf)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts',
                        publicPath: './../assets/fonts',
                    },
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            outputPath: 'assets/sprites',
                        },
                    },
                    'svg-transform-loader',
                ],
                include: [path.join(__dirname, '..', 'src', 'assets', 'icons')],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.pug'],
        alias: {
            "@/helpers": path.resolve(__dirname, '..', 'src', 'app', 'js', 'helpers'),
            "@/base": path.resolve(__dirname, '..', 'src', 'app', 'js', 'base'),
            "@/variables": path.resolve(__dirname, '..', 'src', 'app', 'js', 'variables'),
            "@/types": path.resolve(__dirname, '..', 'src', 'app', 'types'),
            "@/components": path.resolve(__dirname, '..', 'src', 'components'),
            "@/pages": path.resolve(__dirname,  '..','src', 'pages')
        }
    },
    target: ['web', 'es5'],
    plugins: [
        ...pages,
        new SpriteLoaderPlugin({ plainSprite: true }) as { apply(...args: any[]): void; },
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'dev',
                    noErrorOnMissing: true,
                }
            ],
        }),
        // new BundleAnalyzerPlugin()
    ],
};

export default config;
