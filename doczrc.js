import * as path from 'path';
import externalLinks from 'remark-external-links';

const Assets = path.resolve(__dirname, 'assets');
const Src    = path.resolve(__dirname, 'src');

export default {
  src: './docs/langs',
  files: '**/*.mdx',
  base: '/',
  title: 'AssemblyScript',
  description: 'AssemblyScript - A TypeScript to WebAssembly compiler 🚀',
  ordering: 'ascending',
  hashRouter: true,
  propsParser: false,
  indexHtml: './index.html',
  htmlContext: {
    favicon: '/assets/favicon.ico'
  },
  mdPlugins: [externalLinks.default],
  plugins: [],
  modifyBundlerConfig: config => {
    config.resolve.alias = { ...config.resolve.alias,
      '@fonts':      `${Assets}/fonts`,
      '@images':     `${Assets}/images`,
      '@components': `${Src}/theme/components`,
      '@styles':     `${Src}/theme/styles`,
    };
    return config;
  }
};
