"use client";

import styles from "../post.module.css";
import { useEffect, useRef } from "react";

export function PostObservers() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reading progress bar
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Scroll fade-in
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(`.${styles.fade}`).forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return <div ref={barRef} className={styles.progress} aria-hidden="true" />;
}
