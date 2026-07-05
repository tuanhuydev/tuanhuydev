import BlogSection from "./components/BlogSection";
import { ScrollFadeObserver } from "./components/ScrollFadeObserver";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./landing.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

const SkillsSection = dynamic(() => import("./components/SkillsSection"));
const CareerSection = dynamic(() => import("./components/CareerSection"));
const SiteFooter = dynamic(() => import("./components/SiteFooter"));

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <ScrollFadeObserver />

      {/* ── NAV ── */}
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLogo} href="/">
          tuanhuydev
        </Link>
        <div className={styles.navSep} />
        <Link className={styles.navLink} href="#about">
          About
        </Link>
        <Link className={styles.navLink} href="#skills">
          Skills
        </Link>
        <Link className={styles.navLink} href="#experience">
          Experience
        </Link>
        <Link className={styles.navLink} href="/posts">
          Posts
        </Link>
        <ThemeToggle />
        <Link className={styles.navCta} href="#contact">
          Contact
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div>
          <p className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            Based in Vietnam
          </p>
          <h1 className={styles.heroH1}>Hi, I&apos;m Huy.</h1>
          <p className={styles.heroRole}>Fullstack Software Engineer</p>
          <p className={styles.heroBio}>
            I create meaningful digital experiences with a focus on impact, quality, and efficiency — building solutions
            that bring real value to people and businesses.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.btnDark} href="/posts">
              Read Posts →
            </Link>
            <Link className={styles.btnGhost} href="#contact">
              Get in touch
            </Link>
          </div>
          <div className={styles.heroSocials}>
            <a className={styles.socialBtn} href="mailto:tuanhuydev@gmail.com" aria-label="Email">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
                aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 8l10 6 10-6" />
              </svg>
            </a>
            <a
              className={styles.socialBtn}
              href="https://github.com/tuanhuydev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              className={styles.socialBtn}
              href="https://www.linkedin.com/in/tuanhuydev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.heroCanvasWrap} aria-hidden="true">
          <div className={styles.heroPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/avatar.jpeg"
              alt="Huy"
              className={styles.heroPhotoImg}
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.statsWrap}>
        <div className={`${styles.stats} ${styles.fade}`}>
          <div className={styles.stat}>
            <div className={`${styles.statN} ${styles.statNTeal}`}>10+</div>
            <div className={styles.statL}>Projects shipped</div>
          </div>
          <div className={styles.stat}>
            <div className={`${styles.statN} ${styles.statNCrimson}`}>3+</div>
            <div className={styles.statL}>Companies worked with</div>
          </div>
          <div className={styles.stat}>
            <div className={`${styles.statN} ${styles.statNIndigo}`}>5+</div>
            <div className={styles.statL}>Years of experience</div>
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className={styles.section} id="about">
        <p className={`${styles.eyebrow} ${styles.fade}`}>About</p>
        <h2 className={`${styles.sectionTitle} ${styles.fade}`}>Who I am</h2>
        <div className={styles.aboutGrid}>
          <div className={`${styles.aboutText} ${styles.fade}`}>
            <p>
              I&apos;m a fullstack software engineer from Vietnam, passionate about building products that make a real
              difference. I work across the entire stack — from architecting scalable Node.js backends to crafting
              polished React interfaces.
            </p>
            <p>
              As a continuous learner, I stay at the forefront of web development. I&apos;ve grown through each
              challenge — from writing my first component to reaching senior engineer and leading architecture
              decisions.
            </p>
            <p>
              When I&apos;m not coding, I write about what I&apos;ve learned — micro frontends, AI in development, code
              reviews, and everything in between.
            </p>
          </div>
          <div className={`${styles.values} ${styles.fade}`} style={{ transitionDelay: "0.14s" }}>
            <div className={styles.valCard}>
              <div className={styles.valName}>Impact</div>
              <div className={styles.valDesc}>
                Building solutions that bring real value to people and businesses — not just technical checkboxes.
              </div>
            </div>
            <div className={styles.valCard}>
              <div className={styles.valName}>Quality</div>
              <div className={styles.valDesc}>
                Writing clean, maintainable code with a long-term reliability mindset.
              </div>
            </div>
            <div className={styles.valCard}>
              <div className={styles.valName}>Continuous Improvement</div>
              <div className={styles.valDesc}>
                Always learning, always refining — from engineering practices to personal growth.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS (lazy) ── */}
      <Suspense fallback={<SectionPlaceholder height={320} />}>
        <SkillsSection />
      </Suspense>

      {/* ── EXPERIENCE (lazy) ── */}
      <Suspense fallback={<SectionPlaceholder height={220} />}>
        <CareerSection />
      </Suspense>

      {/* ── POSTS PREVIEW ── */}
      <div className={styles.sectionSoft}>
        <div className={styles.sectionInner}>
          <p className={`${styles.eyebrow} ${styles.fade}`}>Writing</p>
          <h2 className={`${styles.sectionTitle} ${styles.fade}`}>Recent Posts</h2>
          <Suspense fallback={<PostsPlaceholder />}>
            <BlogSection />
          </Suspense>
          <div className={`${styles.postsMore} ${styles.fade}`}>
            <Link className={styles.btnGhost} href="/posts">
              All Posts →
            </Link>
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <section className={styles.section} id="contact">
        <div className={`${styles.contactCard} ${styles.fade}`}>
          <h2 className={styles.contactH}>Let&apos;s work together.</h2>
          <p className={styles.contactSub}>
            Have a project in mind or just want to say hi? I&apos;d love to hear from you.
          </p>
          <a className={styles.contactBtn} href="mailto:tuanhuydev@gmail.com">
            tuanhuydev@gmail.com
          </a>
        </div>
      </section>

      {/* ── FOOTER (lazy) ── */}
      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}

function SectionPlaceholder({ height }: { height: number }) {
  return <div style={{ height, background: "transparent" }} aria-hidden="true" />;
}

function PostsPlaceholder() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 160,
            borderRadius: 12,
            background: "rgba(0,0,0,0.06)",
          }}
        />
      ))}
    </div>
  );
}
