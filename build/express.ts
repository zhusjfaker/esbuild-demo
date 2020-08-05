import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import proxyMiddleware from 'http-proxy-middleware';
import webpack from 'webpack';
import { task_config } from './webpack.config.client';
if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development';
}

const app = express();

let compiler = webpack(task_config);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: task_config.output.publicPath,
  }),
);

// app.use(
//   webpackHotMiddleware(compiler, {
//     log: console.log,
//     path: config.output.publicPath + '__webpack_hmr',
//     heartbeat: 2000,
//   }),
// );

// app.use(
//   proxyMiddleware('**', {
//     target: 'http://localhost:3000',
//     xfwd: true,
//   }),
// );

app.listen(8000, _err => {
  console.log('Dev server listening on port 8000 http://127.0.0.1:8000');
});
