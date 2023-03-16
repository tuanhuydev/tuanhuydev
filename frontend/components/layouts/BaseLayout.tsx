import {
  STORAGE_PLAYSOUND_KEY,
  STORAGE_THEME_KEY,
} from "@shared/configs/constants";
import { ComponentProps } from "@shared/interfaces/base";
import {
  getThemeValue,
  updateLocalStorage,
  reflectTheme,
  getSoundValue,
  reflectSound,
} from "@shared/utils/dom";
import { useContext, useEffect, memo } from "react";
import Footer from "../Footer";
import { AppContext } from "../hocs/WithProvider";
import Navbar from "../Navbar";

const gridItems = "col-span-full md:col-start-2 md:col-span-10";

function BaseLayout(props: ComponentProps) {
  const { setContext } = useContext(AppContext);

  useEffect(() => {
    // Sync theme
    // TODO: Sync theme with prefers-color-scheme
    const theme = getThemeValue();
    setContext({ theme });
    updateLocalStorage(STORAGE_THEME_KEY, theme);
    reflectTheme(theme);

    // Sync sound
    const { hasStorage, value: playSound } = getSoundValue();
    if (!hasStorage) {
      updateLocalStorage(STORAGE_PLAYSOUND_KEY, playSound);
    }
    setContext({ playSound });
    reflectSound(playSound);

    const audioEl = document.getElementById("audio") as HTMLAudioElement;
    const buttonEls = document.querySelectorAll(
      "button, a"
    ) as NodeListOf<Element>;

    const playSoundEvent = () => audioEl.play();

    if (playSound) {
      buttonEls.forEach((node: Element) => {
        node?.addEventListener("click", playSoundEvent, false);
      });
    }

    return () => {
      buttonEls.forEach((node: Element) => {
        node?.removeEventListener("click", playSoundEvent);
      });
    };
  }, [setContext]);

  return (
    <main className="grid grid-cols-12 bg-slate-50 dark:bg-slate-900 font-sans relative min-h-screen-d">
      <div className={`${gridItems} row-start-1 sticky top-0 z-10`}>
        <Navbar />
      </div>
      <div className={`${gridItems} row-start-2 relative`}>
        {props.children}
      </div>
      <div className={`${gridItems} row-start-3 relative`}>
        <Footer />
      </div>
    </main>
  );
}

export default memo(BaseLayout, () => false);
