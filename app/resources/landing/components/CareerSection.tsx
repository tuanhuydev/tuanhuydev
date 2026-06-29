import styles from "../landing.module.css";

export default function CareerSection() {
  return (
    <section className={styles.section} id="experience">
      <p className={`${styles.eyebrow} ${styles.fade}`}>Experience</p>
      <h2 className={`${styles.sectionTitle} ${styles.fade}`}>Career</h2>
      <div className={styles.timeline}>
        <div className={`${styles.tlItem} ${styles.fade}`}>
          <div className={styles.tlDot} />
          <div className={styles.tlDate}>Jul 2025 — Present</div>
          <div>
            <div className={styles.tlTitle}>Senior Software Engineer</div>
            <div className={styles.tlDesc}>
              Reached senior level after years of consistent growth. Leading architecture decisions, mentoring peers,
              and building scalable full-stack solutions across the product.
            </div>
          </div>
        </div>
        <div className={`${styles.tlItem} ${styles.fade}`} style={{ transitionDelay: "0.1s" }}>
          <div className={styles.tlDot} />
          <div className={styles.tlDate}>2022 — Jul 2025</div>
          <div>
            <div className={styles.tlTitle}>Software Engineer</div>
            <div className={styles.tlDesc}>
              Built and shipped production applications across multiple companies. Working across the full stack with
              React, Next.js, Node.js, and AWS to deliver high-quality products.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
