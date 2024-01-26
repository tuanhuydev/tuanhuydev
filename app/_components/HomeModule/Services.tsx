"use client";

import IntegrationInstructionsOutlined from "@mui/icons-material/IntegrationInstructionsOutlined";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type DelightProps = {
  title: string;
  value: number;
  delay?: number;
  gradient?: {
    from: string;
    to: string;
  };
};

const Delight = ({ title, value: target, gradient }: DelightProps) => {
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
      <h6 className={`text-sm md:text-xl my-3 font-bold capitalize ${backgroundGradient}`}>
        &#60;{title}&nbsp;&#47;&#62;
      </h6>
      <div
        className={`text-2xl md:text-5xl font-semibold text-slate-700 dark:text-slate-300 flex gap-2 justify-center `}>
        <motion.div ref={ref}>{count}</motion.div>+
      </div>
    </div>
  );
};

const delights = [
  {
    title: "projects",
    value: 10,
    gradient: {
      from: "from-cyan-500",
      to: "to-cyan-900",
    },
  },
  {
    title: "companies",
    value: 3,
    gradient: {
      from: "from-rose-500",
      to: "to-rose-900",
    },
  },
  {
    title: "experiences",
    value: 4,
    gradient: {
      from: "from-indigo-500",
      to: "to-indigo-900",
    },
  },
];

export default function Services() {
  return (
    <section id="service" className="py-8 md:py-10 lg:py-24">
      <h3 className="text-center text-primary dark:text-slate-50 font-bold text-base md:text-3xl lg:text-4xl mb-3">
        &ldquo;Elevating Excellence in Every Project &rdquo;
      </h3>
      <h4 className="text-slate-700 dark:text-slate-400 text-center mb-5">
        <span className="break-keep text-xs md:text-sm lg:text-base inline-block">
          I consistently deliver quality and innovation,&nbsp;
        </span>
        <span className="break-keep text-xs md:text-sm lg:text-base inline-block">
          setting new standards for success.
        </span>
      </h4>

      <div className="flex flex-col items-center">
        <div className="py-5">
          <Link href={"#contact"} legacyBehavior prefetch={false}>
            <div className="w-56 h-56 md:w-84 md:h-84 flex flex-col justify-center items-center rounded-md transition-all bg-slate-50 text-primary dark:bg-slate-800 dark:text-slate-50 drop-shadow duration-150 hover:drop-shadow-xl hover:scale-105 ease-in-out cursor-pointer">
              <IntegrationInstructionsOutlined className="!text-[5rem] mb-4" />
              <h3 className="text-xl md:text-xl font-semibold">Web Development</h3>
            </div>
          </Link>
        </div>
        <div className="flex justify-center flex-wrap lg:mt-5">
          {delights.map((delight: DelightProps) => (
            <Delight key={delight.title} {...delight} />
          ))}
        </div>
      </div>
    </section>
  );
}
