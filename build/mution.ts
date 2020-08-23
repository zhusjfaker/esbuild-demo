import { startService } from 'esbuild';

(async () => {
  const service = await startService();

  try {
    // Call transform() many times without the overhead of starting a service
    const [a, b] = await Promise.all([
      service.build({
        entryPoints: ['src/index.ts'],
        outfile: 'dist/index.js',
        bundle: true,
        platform: 'node',
        target: 'node12',
        sourcemap: true,
      }),
      service.build({
        entryPoints: ['src/page.tsx'],
        outfile: 'dist/page.js',
        bundle: true,
        platform: 'node',
        target: 'node12',
        define: { 'process.env.NODE_ENV': "'development'" },
      }),
    ]);
    console.log([a, b]);
  } finally {
    // The child process can be explicitly killed when it's no longer needed
    service.stop();
  }
})();
