import React, { PropsWithChildren } from "react";

export default function BaseLabel({ children }: PropsWithChildren) {
  return <label className="text-xs capitalize text-slate-400">{children}</label>;
}
