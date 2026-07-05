import SiteFooter from "@resources/landing/components/SiteFooter";
import styles from "@resources/landing/subpage.module.css";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support Me | tuanhuydev",
  description: "Support my open-source and content work via donation or sponsorship.",
  openGraph: {
    title: "Support Me | tuanhuydev",
    description: "Support my open-source and content work via donation or sponsorship.",
    url: "https://tuanhuy.dev/support",
    siteName: "tuanhuydev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Support Me | tuanhuydev",
    description: "Support my open-source and content work via donation or sponsorship.",
  },
  alternates: { canonical: "https://tuanhuy.dev/support" },
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.navLogo} href="/">
          tuanhuydev
        </Link>
        <Link className={styles.navCta} href="/#contact">
          Contact
        </Link>
      </nav>

      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Support</p>
        <h1 className={styles.pageTitle}>Support My Work</h1>
        <p className={styles.pageSub}>
          If you find my work helpful, consider supporting me. Your contributions help me maintain open-source projects,
          write tutorials, and create more content.
        </p>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ways to contribute</h2>
          <div className={styles.grid}>
            <a href="https://www.buymeacoffee.com/tuanhuydev" target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.cardTitle}>Buy Me a Coffee</div>
              <div className={styles.cardSub}>A quick way to say thanks ☕</div>
            </a>

            <a href="https://github.com/sponsors/tuanhuydev" target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.cardTitle}>GitHub Sponsors</div>
              <div className={styles.cardSub}>Sponsor monthly to support ongoing work</div>
            </a>

            <a href="https://paypal.me/tuanhuydev" target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.cardTitle}>PayPal</div>
              <div className={styles.cardSub}>One-time support via PayPal</div>
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Vietnamese only</h2>
          <p className={styles.blockText}>Quét mã VietQR để ủng hộ qua ngân hàng nội địa.</p>
          <div className={styles.qrWrap}>
            <Image
              src="/assets/images/support.jpeg"
              alt="VietQR — ngân hàng Việt Nam"
              width={224}
              height={224}
              className="object-contain"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
