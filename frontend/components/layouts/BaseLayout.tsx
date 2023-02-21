import { STORAGE_KEY } from "@shared/configs/constants";
import { ComponentProps } from "@shared/interfaces/base";
import {
  getThemeValue,
  updateLocalStorage,
  reflectTheme,
} from "@shared/utils/dom";
import { useContext, useEffect } from "react";
import Footer from "../Footer";
import { AppContext } from "../hocs/WithProvider";
import Navbar from "../Navbar";

export default function BaseLayout(props: ComponentProps) {
  const { setContext } = useContext(AppContext);
  useEffect(() => {
    const theme = getThemeValue();
    setContext({ theme });
    updateLocalStorage(STORAGE_KEY, theme);
    reflectTheme(theme);
    // TODO: Sync theme with prefers-color-scheme
  }, [setContext]);
  return (
    <main className="grid grid-cols-12 grid-rows-1 md:gap-4 bg-white dark:bg-slate-900 font-sans">
      <div className="col-start-2 md:col-start-2 xl:col-start-3 col-span-10 md:col-span-10 xl:col-span-8 relative flex flex-col">
        <Navbar />
        {props.children}
        <Footer />
      </div>
    </main>
  );
};
