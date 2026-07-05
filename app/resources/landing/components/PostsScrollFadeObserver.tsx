"use client";

import styles from "../posts.module.css";
import { useEffect } from "react";

export function PostsScrollFadeObserver() {
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

    // Re-scan whenever the DOM changes (e.g. clicking a category/series
    // filter triggers a client-side transition that swaps in new post
    // cards this effect never sees otherwise, leaving them at opacity: 0
    // forever even though they're still interactive/hoverable)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
