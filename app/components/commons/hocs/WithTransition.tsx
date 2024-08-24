import React, { PropsWithChildren } from "react";

export interface WithTransitionProps extends PropsWithChildren {
  className?: string;
}

export default function WithTransition({ className = "", children }: WithTransitionProps) {
  return (
    <div className={`motion-safe:animate-fadeIn p-3 h-full flex flex-col overflow-auto ${className}`}>{children}</div>
  );
}
