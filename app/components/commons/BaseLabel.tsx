import React from "react";

interface BaseLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function BaseLabel({ children, className = "", ...props }: BaseLabelProps) {
  return (
    <label className={`text-sm capitalize text-slate-400 min-w-[3rem] ${className}`} {...props}>
      {children}
    </label>
  );
}
