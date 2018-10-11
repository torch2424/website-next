import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';

const plugins = [
  resolve(),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/react/index.js': ['Component', 'PureComponent', 'Fragment', 'Children', 'createElement']
    }
  }),
  babel({
    exclude: 'node_modules/**',
    plugins: ['@babel/plugin-transform-react-jsx'],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
];

export default [
  // browser-friendly UMD build
  {
    output: {
      name: process.env.NAME,
      format: 'umd'
    },
    context: 'window',
    plugins: plugins
  },
];
