import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    "outline",
    {
      type: "category",
      label: "Database Foundations",
      link: {
        type: "doc",
        id: "dbms/outline",
      },
      items: [
        "dbms/ch0-foundations",
        "dbms/ch1-introduction",
        "dbms/ch2-relational-design",
        "dbms/ch3-modeling",
        "dbms/ch4-sql-fundamentals",
        "dbms/ch5-advanced-sql",
        "dbms/ch6-dba-basics",
        "dbms/ch7-performance",
        "dbms/ch8-transactions",
      ],
    },
  ],
};

export default sidebars;
