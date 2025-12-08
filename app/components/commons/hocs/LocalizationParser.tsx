"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Fragment, PropsWithChildren, Suspense, lazy } from "react";

// Replace dynamic import with React lazy
const LocalizationProvider = lazy(() =>
  import("@mui/x-date-pickers/LocalizationProvider").then((mod) => ({
    default: mod.LocalizationProvider,
  })),
);

export const LocalizationParser = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<Fragment />}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
    </Suspense>
  );
};
