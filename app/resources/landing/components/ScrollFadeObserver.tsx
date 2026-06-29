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
    document.querySelectorAll(`.${styles.fade}`).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
