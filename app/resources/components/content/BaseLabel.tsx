import React from "react";

export default function BaseLabel({ children, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm capitalize text-muted-foreground min-w-[3rem] ${className}`} {...props}>
      {children}
    </label>
  );
}
