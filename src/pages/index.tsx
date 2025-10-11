import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Own your interview prep.
        </Heading>
        <p className={styles.heroSubtitle}>
          {siteConfig.tagline}. InterDocs curates dense topics into deliberate
          learning tracks so you know what to read, what to recall, and what to
          rehearse next.
        </p>
        <div className={styles.ctaGroup}>
          <Link
            className="button button--primary button--lg"
            to="/docs/outline"
          >
            Browse the Roadmap
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/dbms/ch1-introduction"
          >
            Start Chapter 1
          </Link>
        </div>
        <p className={styles.heroFootnote}>
          Built for solo study sprints, mock interview clubs, and spaced
          repetition refreshers.
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const quickLinks = [
    {
      title: "Database Curriculum Roadmap",
      description:
        "See the entire sequence at a glance and choose the modules that match your timeline.",
      href: "/docs/outline",
    },
    {
      title: "Chapter 1 · Foundations",
      description:
        "Reset the fundamentals around data, databases, and the DIKW ladder before diving deeper.",
      href: "/docs/dbms/ch1-introduction",
    },
    {
      title: "Chapter 5 · Advanced SQL",
      description:
        "Master window functions, CTEs, and performance-focused patterns that keep interviewers engaged.",
      href: "/docs/dbms/ch5-advanced-sql",
    },
  ];

  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} · ${siteConfig.tagline}`}
      description="InterDocs delivers interview-ready technical playbooks with structured roadmaps, long-form explanations, and practical checkpoints."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.quickStartSection}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Pick your next move
            </Heading>
            <p className={styles.sectionSubtitle}>
              Every InterDocs module pairs deep context with repeatable prompts
              so you can teach it back under pressure.
            </p>
            <div className={styles.quickStartGrid}>
              {quickLinks.map((card) => (
                <Link
                  key={card.href}
                  className={styles.quickStartCard}
                  to={card.href}
                >
                  <Heading as="h3" className={styles.cardTitle}>
                    {card.title}
                  </Heading>
                  <p className={styles.cardBody}>{card.description}</p>
                  <span className={styles.cardCta}>Open module →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
