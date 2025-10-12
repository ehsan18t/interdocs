import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "InterDocs",
  tagline: "Interview-ready technical playbooks",
  favicon: "img/favicon.ico",

  // Enable Mermaid support
  themes: ["@docusaurus/theme-mermaid"],
  // In order for Mermaid code blocks in Markdown to work,
  // you also need to enable the Remark plugin with this option
  markdown: {
    mermaid: true,
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://interdocs.ehsankhan.me",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "interdocs", // Usually your GitHub org/user name.
  projectName: "site", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "InterDocs",
      logo: {
        alt: "InterDocs logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Curriculum",
        },
        {
          href: "https://github.com/ehsan18t/interdocs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Curriculum",
          items: [
            {
              label: "Getting Started",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Connect",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/ehsan18t/interdocs",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/ehsan18t",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} InterDocs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
