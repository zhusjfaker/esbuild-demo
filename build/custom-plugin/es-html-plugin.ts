import webpack from 'webpack';

export default class EsHtmlPlguin {
  apply(compiler: webpack.Compiler): void {
    
    compiler.hooks.emit.tap('Hello World Plugin', compilation => {
      compilation.assets['index/test.txt'] = {
        source() {
          return 'var a=1';
        },
        size() {
          return this.source().length;
        },
      };

      const assets = compilation.assets;
      const client_json = Reflect.get(assets, 'index/app-client.json');
      console.log(client_json?.source() ?? '没有找到client.json');
    });

    compiler.hooks.done.tap('Hello World Plugin', status => {
      console.log(
        '.............. Hello World!',
        JSON.stringify(
          status.toJson().modules?.map(p => p.id),
          null,
          4,
        ),
      );

      return;
    });

    compiler.plugin('emit', function (_compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行
      callback();
    });
  }
}
