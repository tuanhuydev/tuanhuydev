"use client";

import { useEffect, useState } from "react";

const App = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text to display
  const text = "tuanhuy.dev";

  // Calculate mask position
  const maxScrollForEffect = 300; // Adjust to control fade effect timing
  const fadeProgress = Math.min(scrollY / maxScrollForEffect, 1); // Progress between 0 and 1

  // Dynamically calculate gradient positions
  const transparentStart = `${fadeProgress * 110}%`; // Where the fade starts
  const blackEnd = `${Math.max(0, 1 - fadeProgress)}%`;

  return (
    <div style={{ height: "200dvh" }} className="relative bg-slate-50">
      <div className="sticky flex justify-center items-center top-0 left-0 w-full bg-slate shadow-md z-10 h-screen">
        <div
          className="bg-gradient-to-l bg-clip-text font-bold text-transparent from-teal-600 via-blue-900 to-primary dark:from-teal-400 dark:to-blue-600"
          style={{
            WebkitMaskImage: `linear-gradient(to left, transparent ${transparentStart},  black ${blackEnd})`, // Apply gradient mask when scrolling
            maskImage: `linear-gradient(to left, transparent ${transparentStart},  black ${blackEnd})`, // Apply gradient mask when scrolling
            WebkitMaskClip: "text",
            maskClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            fontSize: "4rem",
            transform: `translateY(${-50}px)`, // Apply vertical translation when scrolling
            transition: "mask-image ease-in-out, -webkit-mask-image ease-in-out, transform ease-in-out",
            willChange: "mask-image, transform",
          }}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default App;
