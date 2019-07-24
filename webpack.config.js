const path = require('path');
const webpack = require('webpack');

// Share plguins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Dev plugins
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Prod plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SafeParser = require('postcss-safe-parser');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const paths = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  public: path.resolve(__dirname, 'public'),
  entry: path.resolve(__dirname, 'src', 'main.tsx'),
  publicPath: '/'
};

const getStyleLoaders = isDevEnv => {
  if (isDevEnv) {
    return {
      test: /\.(sa|sc|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    };
  }

  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: false
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009'
              },
              stage: 3
            })
          ],
          sourceMap: false
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: false
        }
      }
    ]
  };
};

module.exports = env => {
  const isDevEnv = env.NODE_ENV === 'development' ? true : false;

  const config = {
    mode: isDevEnv ? 'development' : 'production',
    entry: paths.entry,
    output: {
      filename: `static/js/[name]${isDevEnv ? '' : '.[contenthash:8]'}.js`,
      chunkFilename: `static/js/[name]${isDevEnv ? '' : '.[contenthash:8]'}.chunk.js`,
      path: paths.dist,
      pathinfo: isDevEnv,
      publicPath: paths.publicPath
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        {
          parser: {
            requireEnsure: false
          }
        }
      ],
      rules: [
        {
          oneOf: [
            {
              exclude: /node_modules/,
              include: /src/,
              test: /\.(j|t)sx?$/,
              use: {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        modules: false,
                        targets: {
                          browsers: isDevEnv
                            ? [
                                'last 1 chrome version',
                                'last 1 firefox version',
                                'last 1 safari version'
                              ]
                            : ['>0.2%', 'not dead', 'not op_mini all']
                        }
                      }
                    ],
                    '@babel/preset-typescript',
                    '@babel/preset-react'
                  ],
                  plugins: [
                    isDevEnv && '@babel/plugin-transform-runtime',
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-proposal-object-rest-spread',
                    !isDevEnv && '@babel/plugin-transform-react-inline-elements',
                    !isDevEnv && '@babel/plugin-transform-react-constant-elements',
                    !isDevEnv && 'transform-react-remove-prop-types',
                    [
                      'transform-imports',
                      {
                        '@material-ui/core': {
                          transform: function(importName) {
                            return `@material-ui/core/${importName}`;
                          },
                          preventFullImport: true
                        },
                        '@material-ui/lab': {
                          transform: function(importName) {
                            return `@material-ui/lab/${importName}`;
                          },
                          preventFullImport: true
                        },
                        '@material-ui/styles': {
                          transform: function(importName) {
                            return `@material-ui/styles/${importName}`;
                          },
                          preventFullImport: true
                        },
                        '@material-ui/icons': {
                          transform: function(importName) {
                            return `@material-ui/icons/${importName}`;
                          },
                          preventFullImport: true
                        }
                      }
                    ],
                    isDevEnv && 'react-hot-loader/babel'
                  ].filter(Boolean),
                  cacheDirectory: true,
                  cacheCompression: !isDevEnv,
                  compact: false,
                  highlightCode: true,
                  sourceMaps: isDevEnv
                }
              }
            },
            getStyleLoaders(isDevEnv),
            {
              test: /\.(bmp|gif|jpe?g|png|svg)$/,
              use: {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[contenthash:8].[ext]'
                }
              }
            },
            {
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              use: {
                loader: 'file-loader',
                options: {
                  name: 'static/media/[name].[contenthash:8].[ext]'
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      modules: ['node_modules', 'src'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    target: 'web',
    bail: true,
    cache: true,
    plugins: [
      !isDevEnv && new CleanWebpackPlugin(),
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: './public/index.html',
        baseUrl: paths.publicPath,
        minify: isDevEnv
          ? false
          : {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': isDevEnv ? '"development"' : '"production"'
      }),
      !isDevEnv &&
        new CopyPlugin([
          {
            from: paths.public,
            to: paths.dist,
            ignore: ['index.html']
          }
        ]),
      new MiniCssExtractPlugin({
        filename: `static/css/[name]${isDevEnv ? '' : '.[contenthash:8]'}'}.css`,
        chunkFilename: `static/css/[name]${isDevEnv ? '' : '.[contenthash:8]'}'}.chunk.css`
      }),
      isDevEnv && new webpack.NamedModulesPlugin(),
      isDevEnv && new webpack.HotModuleReplacementPlugin(),
      isDevEnv && new CaseSensitivePathsPlugin(),
      isDevEnv && new BundleAnalyzerPlugin(),
      !isDevEnv &&
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html)$/,
          threshold: 10240,
          minRatio: 0.99
        }),
      !isDevEnv &&
        new BrotliPlugin({
          asset: '[path].br[query]',
          test: /\.(js|css|html)$/,
          threshold: 10240,
          minRatio: 0.99
        }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      !isDevEnv &&
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /\.gz$/],
          importWorkboxFrom: 'cdn',
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [new RegExp('^/_'), new RegExp('/[^/]+\\.[^/]+$')],
          swDest: 'service-worker.js',
          skipWaiting: true,
          precacheManifestFilename: 'precache-manifest.[manifestHash].js'
        })
    ].filter(Boolean),
    stats: {
      colors: true,
      errors: true,
      modules: false
    },
    performance: false,
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      minimize: !isDevEnv,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: false
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            parser: SafeParser,
            map: false,
            discardComments: {
              removeAll: true
            }
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\\/]node_modules[\\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single'
    },
    node: {
      node: 'empty',
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  };

  if (isDevEnv) {
    config.devtool = 'cheap-module-source-map';
    config.output.devtoolModuleFilenameTemplate = info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');

    config.devServer = {
      compress: true,
      contentBase: paths.src,
      disableHostCheck: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      inline: true,
      open: true,
      overlay: true,
      port: 3000,
      public: 'http://localhost:3000',
      publicPath: paths.publicPath,
      stats: {
        colors: true,
        errors: true,
        modules: false
      },
      useLocalIp: true,
      watchContentBase: false
    };
  }

  return config;
};
