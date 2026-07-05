import styles from "./Badge.module.css";
import clsx from "clsx";
import * as React from "react";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const variantClass: Record<BadgeVariant, string> = {
  default: styles.default,
  secondary: styles.secondary,
  destructive: styles.destructive,
  outline: styles.outline,
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={clsx(styles.badge, variantClass[variant], className)} {...props} />;
}

export { Badge };
export default Badge;
