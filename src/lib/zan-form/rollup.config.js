import babel from 'rollup-plugin-babel';

export default {
  input: "src/index.js",
  external: ["react", "zent"],
  output: [{
    format: 'es',
    file: 'es/index.js'
  }, {
    format: 'cjs',
    file: 'cjs/index.js'
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
