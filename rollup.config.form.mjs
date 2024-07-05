import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import generatePackageJson from "@lomray/rollup-plugin-generate-package-json-v2";
import copy from "rollup-plugin-copy";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.js",
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
      exports: "default",
      sourcemap: true,
      entryFileNames: "[name].cjs.js",
      chunkFileNames: "[name]-[hash].cjs.js",
    },
    {
      dir: "dist/esm",
      format: "esm",
      exports: "default",
      sourcemap: true,
      entryFileNames: "[name].esm.js",
      chunkFileNames: "[name]-[hash].esm.js",
    },
  ],
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-env", "@babel/preset-react"],
    }),
    json(),
    resolve({ preferBuiltins: false }),
    commonjs({ preferBuiltins: false }),
    terser(),
    copy({
      targets: [{ src: "README.md", dest: "dist" }],
    }),
    generatePackageJson({
      baseContents: (pkg) => ({
        ...pkg,
        main: "cjs/index.cjs.js",
        module: "esm/index.esm.js",
      }),
      outputFolder: "dist",
    }),
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
