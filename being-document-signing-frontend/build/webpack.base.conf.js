'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const PATHS = {
    src: path.join(__dirname, 'src')
};

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
});

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath:
            process.env.DEPLOY_ENV === 'prod' || process.env.DEPLOY_ENV === 'sit'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    externals: {
        Web3: 'Web3',
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        axios: 'axios',
        qs: 'Qs',
        moment: 'window.moment',
        vuetify: 'Vuetify',
        PhoneNumber: 'awesome-phonenumber'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new WorkboxPlugin.GenerateSW({
            cacheId: 'being-sign',
            clientsClaim: true,
            skipWaiting: true,
            navigationPreload: true,
            exclude: [/\.(?:png|jpg|jpeg|svg|map)$/],
            runtimeCaching: [
                {
                    urlPattern: ({ event }) => event.request.mode === 'navigate',
                    handler: 'NetworkOnly'
                },
                {
                    urlPattern:
                        process.env.DEPLOY_ENV === 'prod'
                            ? new RegExp('^https://api.beingsign.com/')
                            : new RegExp('^https://gw-signing-test.beingtech.org/prod/'),
                    handler: 'NetworkFirst',
                    options: {
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'being-sign-images',
                        expiration: {
                            maxEntries: 10
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        backgroundSync: {
                            name: 'being-queue-name',
                            options: {
                                maxRetentionTime: 60 * 60
                            }
                        },
                        fetchOptions: {
                            mode: 'no-cors'
                        },
                        matchOptions: {
                            ignoreSearch: true
                        }
                    }
                },
                {
                    urlPattern: /\.js$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'being-sign-js',
                        expiration: {
                            maxEntries: 20,
                            maxAgeSeconds: 7 * 24 * 60 * 60
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        }),
        new DynamicCdnWebpackPlugin({
            exclude: ['core-js', 'object-assign', 'vuex']
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/*`)
        })
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};
