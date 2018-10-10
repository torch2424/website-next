import externalLinks from 'remark-external-links';

export default {
  src: './langs',
  files: '**/*.mdx',
  base: '/',
  title: 'AssemblyScript',
  description: 'AssemblyScript - A TypeScript to WebAssembly compiler 🚀',
  ordering: 'descending',
  propsParser: false,
  indexHtml: './index.html',
  htmlContext: {
    favicon: '/assets/favicon.ico'
  },
  mdPlugins: [externalLinks.default],
  plugins: []
};
