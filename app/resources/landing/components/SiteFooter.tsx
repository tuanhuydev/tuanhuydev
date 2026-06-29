import styles from "./site-footer.module.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.footerCopy}>© {year} tuanhuydev. Built with love and coffee.</p>
      <div className={styles.footerLinks}>
        <a href="/privacy">Privacy</a>
        <a href="/support">Support</a>
        <a href="https://github.com/tuanhuydev" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
