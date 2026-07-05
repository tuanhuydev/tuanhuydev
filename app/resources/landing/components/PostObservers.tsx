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

    const observeAll = () => {
      document.querySelectorAll(`.${styles.fade}:not(.${styles.in})`).forEach((el) => io.observe(el));
    };

    // Elements present at mount time
    observeAll();

    // Re-scan whenever the DOM changes (e.g. navigating between posts via
    // the "Keep reading" links triggers a client-side transition that swaps
    // in new content this effect never sees otherwise, leaving it invisible)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <div ref={barRef} className={styles.progress} aria-hidden="true" />;
}
