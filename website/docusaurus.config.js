// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hal9',
  tagline: 'Build AI apps in Python, then deploy them to Cloudish.',
  favicon: 'img/favicon.ico',
  url: 'https://hal9.com',
  baseUrl: '/docs/',
  organizationName: 'hal9ai',
  projectName: 'hal9',
  plugins: [
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
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/hal9ai/hal9/tree/main/website/blog',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-188412659-2',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      announcementBar: {
        id: 'hal9-platform-transitioning-to-cloudish',
        content:
          'Hal9 Platform is transitioning to Cloudish. <a href="https://cloudish.ai">Deploy your Python apps to Cloudish →</a>',
        backgroundColor: '#f4f4f5',
        textColor: '#1f2937',
        isCloseable: true,
      },
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
          { to: '/learn/code', label: 'Developers', position: 'left' },
          { to: '/learn/genai', label: 'Concepts', position: 'left' },
          { to: '/learn/enterprise', label: 'Enterprise', position: 'left' },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://cloudish.ai',
            label: 'Cloudish',
            position: 'right',
          },
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
