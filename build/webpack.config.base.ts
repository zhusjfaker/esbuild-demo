import paths from './paths';
import path from 'path';
import fs from 'fs';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';

// style files regexes
const useTypeScript = fs.existsSync(paths.appTsConfig);
const getStyleLoaders = require('./util').getStyleLoaders;

const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev ? '/' : `//s3.bytecdn.cn/toutiao/videoarch-fe/`;
const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

export function getbaseConfig(key, _env) {
  const webpackModule = {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: `${key}/static/media/[name].[hash:8].[ext]`,
            },
          },
          {
            test: /\.ts$/,
            loader: 'esbuild-loader',
            options: {
              target: 'es2020', // default, or 'es20XX', 'esnext'
              sourcemap: true,
              loader: 'ts', 
            },
          },
          {
            test: /\.tsx$/,
            loader: 'esbuild-loader',
            options: {
              // All options are optional
              loader: 'tsx',
              target: 'es2018',
              sourcemap: true, 
            },
          },
          // {
          //   test: /\.(js|mjs|jsx|ts|tsx)$/,
          //   include: [paths.appSrc, paths.resolveApp('config')],
          //   loader: require.resolve('babel-loader'),
          //   options: {
          //     presets: [
          //       '@babel/preset-typescript',
          //       '@babel/preset-react',
          //       '@babel/env',
          //     ],
          //     plugins: [
          //       [
          //         require.resolve('babel-plugin-named-asset-import'),
          //         {
          //           loaderMap: {
          //             svg: {
          //               ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
          //             },
          //           },
          //         },
          //       ],
          //       [
          //         '@babel/plugin-proposal-decorators',
          //         {
          //           legacy: true,
          //         },
          //       ],
          //       [
          //         '@babel/plugin-proposal-class-properties',
          //         {
          //           loose: true,
          //         },
          //       ],
          //       [
          //         'babel-plugin-import',
          //         {
          //           libraryName: '@bytedesign/web-react',
          //           libraryDirectory: env == 'server' ? 'lib' : 'es',
          //           camel2DashComponentName: false,
          //           style: true,
          //         },
          //         '@bytedesign/web-react',
          //       ],
          //       [
          //         'babel-plugin-import',
          //         {
          //           libraryName: '@lego/lego',
          //           // libraryDirectory:
          //           //   env == 'server' ? 'lib/components' : 'es/components',
          //           customName: name => {
          //             const path =
          //               env == 'server' ? 'lib/components' : 'es/components';
          //             return `@lego/lego/${path}/${name}`;
          //           },
          //           camel2DashComponentName: true,
          //           style: name => {
          //             const componentName = name.replace(
          //               /^.*\/components\//,
          //               '',
          //             );
          //             // 这里还可以排除一些你需要完全覆盖的样式，减小包体积大小
          //             const themeName = 'toutiao';
          //             return `@lego/lego/lib/theme/${themeName}/${componentName}`;
          //           },
          //         },
          //         '@lego/lego',
          //       ],
          //       [
          //         '@babel/plugin-transform-runtime',
          //         {
          //           absoluteRuntime: false,
          //           corejs: false,
          //           helpers: true,
          //           regenerator: true,
          //           useESModules: false,
          //         },
          //       ],
          //     ],
          //     cacheDirectory: true,
          //     cacheCompression: false,
          //   },
          // },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: getStyleLoaders(
              {
                importLoaders: 1,
              },
              null,
              false,
            ),
          },
          {
            test: /\.module\.css$/,
            use: getStyleLoaders(
              {
                importLoaders: 1,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              null,
              true,
            ),
          },
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: true,
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                },
              },
              false,
            ),
            sideEffects: true,
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: true,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                },
              },
              true,
            ),
          },
          {
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: `${key}/static/media/[name].[hash:8].[ext]`,
              publicPath: publicPath,
            },
          },
        ],
      },
    ],
  };

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../web'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: webpackModule,
    plugins: [
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          async: false,
          typescript: {
            configFile: paths.appTsConfig,
          },
          formatter: typescriptFormatter,
        }),
    ].filter(Boolean),
    performance: false,
  };
}
