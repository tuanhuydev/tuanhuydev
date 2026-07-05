"use client";

import styles from "../landing.module.css";
import { useEffect } from "react";

export function ScrollFadeObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const observeAll = () => {
      document.querySelectorAll(`.${styles.fade}:not(.${styles.in})`).forEach((el) => io.observe(el));
    };

    // Elements present at mount time
    observeAll();

    // Re-scan whenever the DOM changes (e.g. client-side route/query
    // transitions swap in new nodes that this effect never sees otherwise,
    // leaving them permanently at opacity: 0)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
