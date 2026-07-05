import styles from "./Input.module.css";
import clsx from "clsx";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return <input type={type} className={clsx(styles.input, className)} ref={ref} {...props} />;
  },
);
Input.displayName = "Input";

export { Input };
