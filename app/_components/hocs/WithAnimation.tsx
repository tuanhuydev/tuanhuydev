"use client";

import Loader from "@components/commons/Loader";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

const AnimatePresence = dynamic(async () => (await import("framer-motion")).AnimatePresence, {
  loading: () => <Loader />,
});

export default function WithAnimation({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.div
        className="h-full p-2 overflow-hidden"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 45 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
