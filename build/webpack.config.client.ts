'use strict';

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { getbaseConfig } from './webpack.config.base';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import paths from './paths';
import ManifestPlugin from 'webpack-manifest-plugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ESBuildPlugin } from 'esbuild-loader';
// import EsHtmlPlguin from './custom-plugin/es-html-plugin';
// import { getDevServerConfig } from './webpackDevServer.config';

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev ? '/' : `//s3.bytecdn.cn/toutiao/videoarch-fe/`;
const devtool = isDev
  ? 'cheap-module-source-map'
  : shouldUseSourceMap
  ? 'source-map'
  : false;

const optimization: any = {
  runtimeChunk: true,
  splitChunks: {
    chunks: 'all',
    name: false,
    cacheGroups: {
      vendors: {
        test: module => {
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.match('node_modules')
          );
        },
        name: 'vendor',
      },
    },
  },
};
if (!isDev) {
  optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: shouldUseSourceMap,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parser: safePostCssParser,
        map: shouldUseSourceMap
          ? {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            }
          : false,
      },
    }),
  ];
}

/**
 * webpack设置方法
 * @param {*} originkey 当前入口key值
 * @param {*} rootpath 当前入口
 * @param {*} entry 所有入口对象
 */
function setClientBuildConfigTask(originkey, rootpath, _entry) {
  const key = String(originkey).toLowerCase();
  const plugins = [
    new webpack.DefinePlugin({
      __isBrowser__: true,
    }),
    new ModuleNotFoundPlugin(paths.appPath),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: isDev
        ? `${key}/static/css/[name].css`
        : `${key}/static/css/[name].[contenthash:8].css`,
      chunkFilename: isDev
        ? `${key}/static/css/[name].chunk.css`
        : `${key}/static/css/[name].[contenthash:8].css`,
    }),
    new ManifestPlugin({
      fileName: `${key}/app-client.json`,
      publicPath: publicPath,
    }),
    // new EsHtmlPlguin(),
    new HtmlWebpackPlugin({
      template: paths.template,
      filename: `${key}/index.html`,
    }),
  ];

  const baseConfig = getbaseConfig(key, 'client');

  const config = merge(baseConfig, {
    mode: process.env.NODE_ENV,
    devtool: devtool,
    entry: {},
    output: {
      path: paths.appBuild,
      pathinfo: true,
      filename: isDev
        ? `${key}/static/js/[name].js`
        : `${key}/static/js/[name].[contenthash:8].js`,
      chunkFilename: isDev
        ? `${key}/static/js/[name].chunk.js`
        : `${key}/static/js/[name].[contenthash:8].chunk.js`,
      publicPath: publicPath,
      hotUpdateChunkFilename: '[hash].hot-update.js',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    optimization: optimization,
    plugins: plugins.filter(Boolean),
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    performance: false,
  });

  if (process.env.npm_config_report === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }

  Reflect.set(config.entry, key, rootpath);
  // config.devServer = getDevServerConfig(entry);

  config.plugins.unshift(new ESBuildPlugin());
  return config;
}

const task_config = setClientBuildConfigTask(
  'index',
  path.resolve(__dirname, '../src/page.tsx'),
  [{ key: 'index', rootpath: path.resolve(__dirname, '../src/page.tsx') }],
);

export { task_config };

// const compiler = webpack(task_config);

// compiler.watch({}, (err, stats) => {
//   if (err) {
//     console.log('build has error \n', err);
//   }
//   console.log(stats, '\n');
// });
