import Loader from "@resources/components/common/Loader";
import { Toaster } from "@resources/components/common/Toaster";
import { PropsWithChildren, Suspense, lazy } from "react";

const GlobalProvider = lazy(() => import("@resources/components/common/providers/GlobalProvider"));

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<Loader />}>
      <GlobalProvider>
        {children}
        <Toaster />
      </GlobalProvider>
    </Suspense>
  );
}
