"use client";

import landingStyles from "../landing.module.css";
import styles from "./ProductsMenu.module.css";
import { S2_URL } from "lib/commons/constants/base";
import Link from "next/link";
import { type FocusEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

interface Product {
  name: string;
  description: string;
  href: string;
}

// S2 is its own site on a subdomain, so its link is absolute (see NEXT_PUBLIC_S2_URL).
const products: Product[] = [{ name: "S2", description: "Study system. Learn by doing.", href: S2_URL }];

/** "Products" dropdown for the landing nav. Opens on hover, click or keyboard; closes on Escape or outside focus. */
export default function ProductsMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // True while the menu was opened by hovering, so the click that follows does not toggle it shut again.
  const openedByHover = useRef(false);

  const close = useCallback(() => {
    openedByHover.current = false;
    setOpen(false);
  }, []);

  const handleMouseEnter = () => {
    if (!open) openedByHover.current = true;
    setOpen(true);
  };

  const handleTriggerClick = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setOpen((value) => !value);
  };

  // Touch screens have no hover or blur on tap, so close on any press outside the menu.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, close]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      close();
      triggerRef.current?.focus();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !wrapperRef.current?.contains(next)) close();
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={close}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={`${landingStyles.navLink} ${styles.trigger}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="products-menu"
        onClick={handleTriggerClick}>
        Products
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          viewBox="0 0 12 12"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          <path d="M2 4.5l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className={styles.panel} id="products-menu" role="menu" aria-label="Products">
          {products.map((product) => {
            const content = (
              <>
                <span className={styles.itemName}>{product.name}</span>
                <span className={styles.itemDescription}>{product.description}</span>
              </>
            );
            // A link to another site (a different app) is a plain anchor, not a client-side route.
            return product.href.startsWith("http") ? (
              <a key={product.href} className={styles.item} href={product.href} role="menuitem" onClick={close}>
                {content}
              </a>
            ) : (
              <Link key={product.href} className={styles.item} href={product.href} role="menuitem" onClick={close}>
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
