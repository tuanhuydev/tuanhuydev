"use client";

import { useState, useRef, useEffect } from "react";

export type DelightProps = {
  title: string;
  value: number;
  delay?: number;
  gradient?: {
    from: string;
    to: string;
  };
};

export const Delight = ({ title, value: target, gradient }: DelightProps) => {
  const [count, setCount] = useState(0);
  const hasTextBg = !!gradient;
  const backgroundGradient = hasTextBg
    ? `bg-clip-text text-transparent bg-gradient-to-r ${gradient.from} ${gradient.to}`
    : "";

  const ref = useRef<any>();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < target) return prevCount + 1;

        clearInterval(interval);
        return prevCount;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [target]);
  return (
    <div className="text-center text-primary dark:text-slate-50 p-3 self-stretch w-[16rem]">
      <h4 className={`text-sm md:text-xl my-3 font-bold capitalize ${backgroundGradient}`}>
        &#60;{title}&nbsp;&#47;&#62;
      </h4>
      <div
        className={`text-2xl md:text-5xl font-semibold text-slate-700 dark:text-slate-300 flex gap-2 justify-center `}>
        {count}+
      </div>
    </div>
  );
};
