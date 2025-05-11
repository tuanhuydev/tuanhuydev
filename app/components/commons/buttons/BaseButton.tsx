"use client";

import Loader from "../Loader";
import clsx from "clsx";
import React from "react";

const ButtonVariantsClasses = {
  primary:
    "bg-primary border-none text-slate-50 dark:bg-slate-500 dark:text-slate-200 disabled:bg-slate-200 disabled:text-slate-400",
  outline: "bg-transparent border-2 border-solid border-primary text-primary",
  text: "text-primary border-none bg-transparent hover:underline dark:text-slate-50",
};

type ButtonVariants = keyof typeof ButtonVariantsClasses;

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  loading?: boolean;
  variants?: ButtonVariants;
}

let baseClassName =
  "cursor-pointer font-sans min-w-max rounded-md flex justify-center items-center gap-1 transition-all duration-300";

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  const { className = "", variants = "primary", label, icon, loading = false, disabled, onClick, ...restProps } = props;

  let variantClassName = "";

  switch (variants) {
    case "primary":
      variantClassName = ButtonVariantsClasses.primary;
      break;
    case "outline":
      variantClassName = ButtonVariantsClasses.outline;
      break;
    case "text":
      variantClassName = ButtonVariantsClasses.text;
      break;
    default:
      variantClassName = ButtonVariantsClasses.primary;
      break;
  }

  const makeClassName = () => {
    const isIconButton = icon && !label;
    const spacing = isIconButton ? "p-1" : variants === "text" ? "p-0" : "px-3 py-2";
    return clsx(baseClassName, spacing, variantClassName, className);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      {...restProps}
      ref={ref}
      type={props.type || "button"}
      disabled={loading || disabled}
      className={makeClassName()}
      onClick={handleClick}>
      {loading ? (
        <span className="mr-2">
          <Loader variant={variants === "primary" ? "light" : "dark"} />
        </span>
      ) : (
        <>
          {icon && label && <span className="mr-1 leading-none flex items-center">{icon}</span>}
          {icon && !label && <span className="leading-none flex items-center">{icon}</span>}
          {label && <span className="shrink-0 text-sm">{label}</span>}
        </>
      )}
    </button>
  );
});

BaseButton.displayName = "BaseButton";

export default BaseButton;
