import Navbar from "./Navbar";
import Loader from "@lib/components/commons/Loader";
import dynamic from "next/dynamic";
import { PropsWithChildren, memo } from "react";

const Footer = dynamic(() => import("@lib/HomeModule/Footer"), { ssr: false, loading: () => <Loader /> });

function HomeLayout({ children }: PropsWithChildren) {
  return (
    <main className=" bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d" data-testid="homepage-testid">
      <div className="container mx-auto">
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>
        <div className="relative">{children}</div>
        <Footer />
      </div>
    </main>
  );
}

export default memo(HomeLayout);
