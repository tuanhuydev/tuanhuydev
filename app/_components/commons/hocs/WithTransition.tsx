import React, { PropsWithChildren } from "react";

export default function WithTransition({ children }: PropsWithChildren) {
  return <div className="motion-safe:animate-fadeIn">{children}</div>;
}
