import { build } from "esbuild";

build({
  entryPoints: ["src/index.tsx"],
  outfile: "dist/main.js",
  minify: true,
  bundle: true,
  sourcemap: true,
}).catch(() => process.exit(1));
