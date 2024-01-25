"use client";

import React, { PropsWithChildren } from "react";

export default function BaseLabel({ children }: PropsWithChildren) {
  return <label className="text-sm text-slate-400">{children}</label>;
}
