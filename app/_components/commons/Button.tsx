import React, { Fragment, MouseEventHandler, ReactNode } from "react";

export interface ButtonProps {
  label?: string;
  ghost?: boolean;
  variant?: "primary" | "secondary" | "danger" | "warning" | "info" | "success";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
}

export default function Button({ label, variant = "primary", icon, onClick, ghost = false }: ButtonProps) {
  const variants: ObjectType = {
    primary: "bg-primary text-slate-50 fill-slate-50",
  };
  let buttonClasses = "outline-none border-none leading-none px-2 py-2 rounded-md";
  if (ghost) {
    buttonClasses = buttonClasses.concat(" bg-transparent text-primary dark:text-slate-300");
  } else {
    buttonClasses = buttonClasses.concat(variants[variant]);
  }

  if (!icon && !label) return <Fragment />;
  return (
    <button className={buttonClasses} onClick={onClick}>
      {icon ?? label}
    </button>
  );
}
