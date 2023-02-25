import Link from "next/link";
import { useContext } from "react";
import { DEFAULT_THEME, STORAGE_KEY } from "@shared/configs/constants";
import { reflectTheme, updateLocalStorage } from "@shared/utils/dom";
import { AppContext } from "../hocs/WithProvider";
import styles from "./styles.module.scss";
import React from "react";

export default function Navbar() {
  // Hooks
  const { context, setContext } = useContext(AppContext);

  const { theme } = context;

  const switchTheme = () => {
    const newThemeValue = theme === DEFAULT_THEME ? "dark" : DEFAULT_THEME;
    setContext({ theme: newThemeValue });
    updateLocalStorage(STORAGE_KEY, newThemeValue);
    reflectTheme(newThemeValue);
  };
  return (
    <header className="flex items-center justify-between py-2 sticky top-0 bg-white dark:bg-slate-900 z-10">
      <div className="dark:text-white font-bold md:text-2xl flex items-center">
        <Link href={"/"}>
          <h1 className="ml-4 line-height-1 hover:underline cursor-pointer">#tuanhuydev</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <ul className="hidden md:flex md:justify-between">
          <li className="mr-3.5 cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-900">
            <Link href="/articles">
              <div className="block px-4 py-1 dark:text-white capitalize">
                articles
              </div>
            </Link>
          </li>
        </ul>
        <button
          className={`${styles.toggle} ${styles[theme]} rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 dark:text-white p-2 mr-2 md:mr-7`}
          title="Toggles light & dark"
          aria-live="polite"
          onClick={switchTheme}
        >
          <svg
            className={styles.icon}
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <mask className={styles.moon} id="moon-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx="24" cy="10" r="6" fill="black" />
            </mask>
            <circle
              className={styles.sun}
              cx="12"
              cy="12"
              r="6"
              mask="url(#moon-mask)"
              fill="currentColor"
            />
            <g className={styles.beams} stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </button>
        <button className="rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-white px-2 py-0.5 md:px-4 md:py-1">
          Contact
        </button>
      </div>
    </header>
  );
}
