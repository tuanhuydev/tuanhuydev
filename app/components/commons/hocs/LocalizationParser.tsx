"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Suspense, lazy } from "react";
import { PropsWithChildren } from "react";

// Replace dynamic import with React lazy
const LocalizationProvider = lazy(() =>
  import("@mui/x-date-pickers/LocalizationProvider").then((mod) => ({
    default: mod.LocalizationProvider,
  })),
);

export const LocalizationParser = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<div>Loading localization...</div>}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
    </Suspense>
  );
};
