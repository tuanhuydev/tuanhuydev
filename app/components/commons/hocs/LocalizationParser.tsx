"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const LocalizationProvider = dynamic(
  () => import("@mui/x-date-pickers/LocalizationProvider").then((mod) => mod.LocalizationProvider),
  { ssr: false },
);

export const LocalizationParser = ({ children }: PropsWithChildren) => {
  return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
};
