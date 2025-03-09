import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/**/*.ts",
    "!**/*.{d.ts,spec.ts,test.ts}"
  ],
  outDir: "build",
  format: ["esm", "cjs"],  
  target: "esnext",
  clean: true,
  minify: true,
  splitting: false,
  bundle: false,
  dts: true, 
});
