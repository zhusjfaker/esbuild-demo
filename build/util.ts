import paths from './paths';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';

export const getStyleLoaders = (
  _cssOptions,
  preProcessor,
  ismodules = true,
) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined,
      ),
    },
    ismodules
      ? {
          loader: require.resolve('typings-for-css-modules-loader'),
          options: {
            modules: ismodules,
            namedExport: true,
            camelCase: true,
            minimize: true,
            localIdentName: '[local]_[hash:base64:5]',
          },
        }
      : {
          loader: require.resolve('css-loader'),
          options: {
            modules: ismodules,
            namedExport: true,
            camelCase: true,
            minimize: true,
            localIdentName: '[local]_[hash:base64:5]',
          },
        },
    // {
    //   loader: require.resolve('postcss-loader'),
    //   options: {
    //     ident: 'postcss',
    //     plugins: () => [
    //       require('postcss-flexbugs-fixes'),
    //       require('postcss-preset-env')({
    //         autoprefixer: {
    //           flexbox: 'no-2009',
    //         },
    //         stage: 3,
    //       }),
    //     ],
    //   },
    // },
  ];
  if (preProcessor) {
    // 添加额外的loader
    loaders.push(preProcessor);
  }
  return loaders;
};
