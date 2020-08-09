import { startService } from 'esbuild';

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
          target: 'es2020',
          loader: 'tsx',
        },
      ),
    ]);
    console.log([a, b]);
  } finally {
    // The child process can be explicitly killed when it's no longer needed
    service.stop();
  }
})();
