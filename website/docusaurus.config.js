// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hal9: Create AI Coworkers',
  tagline: 'Hal9 provides enterprise-ready, secure, customizable, model-agnostic AI coworkers powered by the best AI libraries.',
  favicon: 'img/favicon.ico',
  url: 'https://hal9.com',
  baseUrl: '/docs/',
  organizationName: 'hal9ai',
  projectName: 'hal9',
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/learn/hal9',
            from: '/docs',
          },
        ],
      },
    ],
  ],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/hal9ai/hal9/tree/main/website/learn',
          path: 'learn',
          routeBasePath: 'learn',
        },
        /*
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/hal9ai/hal9/tree/main/website/blog',
        },
        */
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-188412659-2',
        },
      }),
    ],
  ],
  plugins: [
    ['@docusaurus/plugin-content-docs', {
      id: 'reference',
      path: 'reference',
      routeBasePath: 'reference',
    }]
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'Hal9 Logo',
          href: 'https://hal9.com/',
          src: 'img/hal9.png',
          srcDark: 'img/hal9-white.png',
          target: '_self'
        },
        items: [
          /*
          {
            to: '/docs',
            label: 'Docs',
            position: 'left',
          },
          */
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Learn',
          },
          { to: '/reference/code', label: 'Reference', position: 'left' },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: 'https://hal9.com/news', label: 'News', position: 'left' },
          {
            href: 'https://github.com/hal9ai/hal9',
            className: 'github-link',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} Hal9 Inc.`,
      },
      prism: {
        theme: prismThemes.shadesOfPurple,
        darkTheme: prismThemes.shadesOfPurple,
      },
      metadata: [
        { property: 'og:image', content: 'https://hal9.com/images/hal9-social-preview.png?1' },
      ]
    }),
  scripts: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-188412659-2',
      async: true,
    },
    {
      src: 'https://tools.luckyorange.com/core/lo.js?site-id=f19acd01',
      async: true,
    },
  ],
};

export default config;
