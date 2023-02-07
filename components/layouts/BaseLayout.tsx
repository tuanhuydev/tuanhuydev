import { ComponentProps } from "../../interfaces/base";
import Footer from "../Footer";
import Navbar from "./Navbar";

export default function BaseLayout(props: ComponentProps) {
  return (
    <main className="grid grid-cols-12 grid-rows-1 md:gap-4 bg-white dark:bg-slate-800">
      <div className="col-start-2 md:col-start-2 col-span-10 md:col-span-9">
        <Navbar />
        {props.children}
        <Footer />
      </div>
    </main>
  );
}
