import styles from "./Loader.module.css";
import clsx from "clsx";
import { memo } from "react";

export interface LoaderProps {
  variant?: "dark" | "light";
}

export default memo(function Loader({ variant = "dark" }: LoaderProps) {
  return (
    <div className={styles.spinWrap}>
      <div className={clsx(styles.circle, styles[variant])} />
    </div>
  );
});
