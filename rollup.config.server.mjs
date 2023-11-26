import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import generatePackageJson from "@lomray/rollup-plugin-generate-package-json-v2";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: ["src/server/index.js", "src/query.js"],
  output: [
    { dir: "dist/server", format: "cjs", sourcemap: true },
    { dir: "dist/server", format: "esm", sourcemap: true },
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
        dependencies: { "node-fetch": "^3.3.1" },
      }),
      outputFolder: "dist/server",
    }),
  ],
  external: Object.keys(pkg.peerDependencies),
};
