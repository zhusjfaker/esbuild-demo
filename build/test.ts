import { startService } from 'esbuild';
// import fs from 'fs';
// import path from 'path';

(async () => {
  const service = await startService();

  try {
    // Call transform() many times without the overhead of starting a service
    const [a, b] = await Promise.all([
      service.transform(
        `
        enum Test {
          测试 = 123,
        }
        
        export { Test };
        `,
        {
          target: 'node4',
          loader: 'ts',
        },
      ),
    ]);
    // fs.writeFileSync(path.resolve(__dirname, '../test.js'), a.js, {
    //   encoding: 'utf8',
    // });
    console.log([a, b]);
  } finally {
    // The child process can be explicitly killed when it's no longer needed
    service.stop();
  }
})();
