import SiteFooter from "@resources/landing/components/SiteFooter";
import styles from "@resources/landing/subpage.module.css";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service | tuanhuydev",
  description: "Learn how tuanhuydev.com collects, uses, and protects your information. Read our terms and conditions.",
  openGraph: {
    title: "Privacy Policy & Terms of Service | tuanhuydev",
    description: "Learn how tuanhuydev.com collects, uses, and protects your information.",
    url: "https://tuanhuy.dev/privacy",
    siteName: "tuanhuydev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy & Terms of Service | tuanhuydev",
    description: "Learn how tuanhuydev.com collects, uses, and protects your information.",
  },
  alternates: { canonical: "https://tuanhuy.dev/privacy" },
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
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.pageTitle}>Legal Information</h1>
        <p className={styles.pageSub}>
          Your privacy and trust matter. Learn how we protect your data and what to expect when using our services.
        </p>
        <div className={styles.anchorNav}>
          <a href="#privacy" className={styles.anchorLink}>
            Privacy Policy
          </a>
          <a href="#terms" className={styles.anchorLink}>
            Terms of Service
          </a>
        </div>
        <p className={styles.meta}>Last updated: December 8, 2025</p>
      </header>

      <main className={styles.content}>
        {/* Privacy Policy */}
        <section id="privacy" className={styles.section}>
          <h2 className={styles.sectionTitle}>Privacy Policy</h2>

          <div className={styles.block}>
            <p className={styles.blockText}>
              Welcome to <strong>tuanhuydev.com</strong>. This Privacy Policy explains how we collect, use, and protect
              your information when you use our services.
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>1. Information We Collect</h3>
            <p className={styles.blockText}>We collect information you provide when you:</p>
            <ul className={styles.list}>
              <li>Register for an account (name, email, password)</li>
              <li>Create content (projects, tasks, blog posts, comments)</li>
              <li>Upload files to AWS S3</li>
              <li>Contact us via email</li>
            </ul>
            <p className={styles.blockText}>We also automatically collect:</p>
            <ul className={styles.list}>
              <li>IP address, browser type, and device information</li>
              <li>Usage data via Google Analytics and Vercel Analytics</li>
              <li>Cookies for authentication and preferences</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>2. How We Use Your Information</h3>
            <ul className={styles.list}>
              <li>Provide and maintain our services</li>
              <li>Authenticate users and manage accounts</li>
              <li>Improve user experience and analyze usage patterns</li>
              <li>Send administrative updates and security alerts</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>3. Data Storage and Security</h3>
            <p className={styles.blockText}>Your data is stored in:</p>
            <ul className={styles.list}>
              <li>
                <strong>MongoDB:</strong> User accounts, projects, tasks, posts
              </li>
              <li>
                <strong>AWS S3:</strong> File uploads and media
              </li>
              <li>
                <strong>Vercel:</strong> Application hosting
              </li>
            </ul>
            <p className={styles.blockText}>Security measures include:</p>
            <ul className={styles.list}>
              <li>Bcrypt password encryption</li>
              <li>HTTP-only cookies with SameSite policy</li>
              <li>HTTPS encryption</li>
              <li>Role-based access control</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>4. Third-Party Services</h3>
            <p className={styles.blockText}>We use these third-party services:</p>
            <ul className={styles.list}>
              <li>Google Analytics &amp; Google Tag Manager</li>
              <li>Vercel Analytics &amp; Speed Insights</li>
              <li>AWS S3</li>
              <li>Google Generative AI (for AI features)</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>5. Your Rights</h3>
            <p className={styles.blockText}>You have the right to:</p>
            <ul className={styles.list}>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Object to data processing</li>
            </ul>
            <p className={styles.blockText}>
              Contact us at{" "}
              <a href="mailto:tuanhuydev@gmail.com" className={styles.emailLink}>
                tuanhuydev@gmail.com
              </a>{" "}
              to exercise these rights.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms" className={styles.section}>
          <h2 className={styles.sectionTitle}>Terms of Service</h2>

          <div className={styles.block}>
            <p className={styles.blockText}>
              By using <strong>tuanhuydev.com</strong>, you agree to these Terms of Service. If you do not agree, please
              do not use our services.
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>1. Services Provided</h3>
            <p className={styles.blockText}>We provide:</p>
            <ul className={styles.list}>
              <li>Blog platform for technical articles</li>
              <li>Project management tools</li>
              <li>Task management and sprint tracking</li>
              <li>User dashboard and file storage</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>2. User Accounts</h3>
            <p className={styles.blockText}>You must:</p>
            <ul className={styles.list}>
              <li>Be at least 13 years old</li>
              <li>Provide accurate registration information</li>
              <li>Keep your password secure</li>
              <li>Notify us of unauthorized account access</li>
            </ul>
            <p className={styles.blockText}>We may terminate accounts that violate these terms.</p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>3. User Content</h3>
            <ul className={styles.list}>
              <li>You own all content you create</li>
              <li>You grant us license to host and display your content</li>
              <li>You are responsible for your content</li>
              <li>We may remove content that violates our policies</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>4. Prohibited Conduct</h3>
            <p className={styles.blockText}>You may not:</p>
            <ul className={styles.list}>
              <li>Post illegal, harmful, or offensive content</li>
              <li>Infringe intellectual property rights</li>
              <li>Upload malware or viruses</li>
              <li>Attempt unauthorized access to systems</li>
              <li>Use automated scraping tools</li>
              <li>Spam or harass other users</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>5. Disclaimers</h3>
            <p className={styles.blockText}>
              The service is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted,
              error-free service.
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>6. Limitation of Liability</h3>
            <p className={styles.blockText}>
              We are not liable for indirect, incidental, or consequential damages including data loss, revenue loss, or
              service interruption.
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>7. Governing Law</h3>
            <p className={styles.blockText}>These terms are governed by the laws of Vietnam.</p>
          </div>
        </section>

        {/* Contact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.block}>
            <p className={styles.blockText}>Questions about our Privacy Policy or Terms of Service?</p>
            <p className={styles.blockText}>
              <strong>Email:</strong>{" "}
              <a href="mailto:tuanhuydev@gmail.com" className={styles.emailLink}>
                tuanhuydev@gmail.com
              </a>
            </p>
            <p className={styles.blockText}>
              <strong>Website:</strong>{" "}
              <a href="https://tuanhuydev.com" className={styles.emailLink}>
                tuanhuydev.com
              </a>
            </p>
          </div>
        </section>

        <div className={styles.note}>
          By using tuanhuydev.com, you acknowledge that you have read and agree to our Privacy Policy and Terms of
          Service.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
