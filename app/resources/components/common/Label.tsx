"use client";

import styles from "./Label.module.css";
import * as LabelPrimitive from "@radix-ui/react-label";
import clsx from "clsx";
import * as React from "react";

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={clsx(styles.label, className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
