import ignoredFiles from 'react-dev-utils/ignoredFiles';
import paths from './paths';

export function getDevServerConfig(entry) {
  const keys = entry.map(p => String(p.key).toLowerCase());
  const rewrites_list: any[] = [];

  keys.forEach(p => {
    const reg = eval(`/^\\/${p}/`);
    const val = `/${p}/index.html`;
    rewrites_list.push({
      from: reg,
      to: val,
    });
  });

  rewrites_list.push({
    from: /\//,
    to: function (info) {
      const ua = info.request.headers['user-agent'];
      let isMobile = false;
      if (ua && /(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        isMobile = true;
      } else if (ua && /(Android)/i.test(ua)) {
        isMobile = true;
      }
      if (isMobile) {
        return `/livemobile/index.html`;
      } else {
        return `/livepc/index.html`;
      }
    },
  });

  const config = {
    compress: true,
    port: 8000,
    clientLogLevel: 'info',
    contentBase: './dist',
    watchContentBase: true,
    hot: true,
    publicPath: '/',
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    https: false,
    host: '127.0.0.1',
    overlay: false,
    historyApiFallback: {
      rewrites: rewrites_list,
      disableDotRule: true,
    },
    proxy: {},
  };

  return config;
}
