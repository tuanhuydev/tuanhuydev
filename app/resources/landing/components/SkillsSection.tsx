import styles from "../landing.module.css";

export default function SkillsSection() {
  return (
    <div className={styles.sectionSoft} id="skills">
      <div className={styles.sectionInner}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>Tech Stack</p>
        <h2 className={`${styles.sectionTitle} ${styles.fade}`}>Skills</h2>
        <div className={styles.skillGroups}>
          <div className={styles.fade}>
            <p className={styles.skillGroupLabel}>
              AI
              <span className={styles.skillBadge}>New</span>
            </p>
            <div className={styles.skillTags}>
              <span className={`${styles.skillTag} ${styles.skillTagHighlight}`}>Prompt Engineering</span>
              <span className={`${styles.skillTag} ${styles.skillTagHighlight}`}>Claude</span>
              <span className={`${styles.skillTag} ${styles.skillTagHighlight}`}>GitHub Copilot</span>
              <span className={`${styles.skillTag} ${styles.skillTagHighlight}`}>Cursor</span>
            </div>
          </div>
          <div className={styles.fade} style={{ transitionDelay: "0.08s" }}>
            <p className={styles.skillGroupLabel}>Frontend</p>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>React</span>
              <span className={styles.skillTag}>Next.js</span>
              <span className={styles.skillTag}>TypeScript</span>
              <span className={styles.skillTag}>Tailwind CSS</span>
              <span className={styles.skillTag}>HTML &amp; CSS</span>
            </div>
          </div>
          <div className={styles.fade} style={{ transitionDelay: "0.16s" }}>
            <p className={styles.skillGroupLabel}>Backend</p>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>NestJS</span>
              <span
                className={`${styles.skillTag} ${styles.skillTagHighlight} ${styles.skillTagNew}`}
                style={{ position: "relative" }}>
                Kotlin
                <span className={styles.skillTagNewBadge}>New</span>
              </span>
              <span className={styles.skillTag}>Spring Boot</span>
              <span className={styles.skillTag}>REST APIs</span>
              <span className={styles.skillTag}>PostgreSQL</span>
            </div>
          </div>
          <div className={styles.fade} style={{ transitionDelay: "0.24s" }}>
            <p className={styles.skillGroupLabel}>Infrastructure &amp; Tools</p>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>AWS</span>
              <span className={styles.skillTag}>Docker</span>
              <span className={styles.skillTag}>Kubernetes</span>
              <span className={styles.skillTag}>CI/CD</span>
              <span className={styles.skillTag}>Git</span>
              <span className={styles.skillTag}>GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
