import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "rollup-plugin-json";
import generatePackageJson from "@lomray/rollup-plugin-generate-package-json-v2";
import pkg from "./package.json";

export default {
  input: ["src/api/index.js", "src/query.js"],
  output: [
    { dir: "dist/server", format: "cjs" },
    { dir: "dist/server", format: "esm" },
  ],
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    json(),
    resolve({ preferBuiltins: false }),
    commonjs({ preferBuiltins: false }),
    terser(),
    generatePackageJson({
      baseContents: (pkg) => ({
        name: pkg.name,
        version: pkg.version,
        main: "index.cjs.js",
        module: "index.esm.js",
        dependencies: { "isomorphic-fetch": "^3.0.0" },
      }),
      outputFolder: "dist/server",
    }),
  ],
  external: Object.keys(pkg.peerDependencies),
};
