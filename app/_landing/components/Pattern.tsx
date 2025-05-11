"use client";

import { motion } from "framer-motion";

export const Pattern = () => {
  return (
    <motion.svg
      width="800"
      height="400"
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <rect width="100%" height="100%" fill="transparent" />
      <g stroke="rgba(200, 200, 200, 0.2)" strokeWidth="1">
        {[...Array(19)].map((_, i) => (
          <motion.line
            key={`vertical-${i}`}
            x1={(i + 1) * 40}
            y1="0"
            x2={(i + 1) * 40}
            y2="400"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}

        {[...Array(9)].map((_, i) => (
          <motion.line
            key={`horizontal-${i}`}
            x1="0"
            y1={(i + 1) * 40}
            x2="800"
            y2={(i + 1) * 40}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 + 2 }}
          />
        ))}
      </g>
    </motion.svg>
  );
};
