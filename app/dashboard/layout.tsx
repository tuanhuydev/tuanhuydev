import Loader from "@resources/components/common/Loader";
import { Toaster } from "@resources/components/common/Toaster";
import { PropsWithChildren, Suspense, lazy } from "react";

const GlobalProvider = lazy(() => import("@resources/components/common/providers/GlobalProvider"));
const ThemeProvider = lazy(() => import("@resources/components/common/providers/ThemeProvider"));

// Force all dashboard pages to be dynamic
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<Loader />}>
      <ThemeProvider>
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </ThemeProvider>
    </Suspense>
  );
}
