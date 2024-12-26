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
  const text = "Angular";

  return (
    <div style={{ background: "#f5f5f5", height: "200dvh" }} className="relative">
      <div className="sticky flex justify-center items-center top-0 left-0 w-full  bg-white shadow-md z-10 h-screen">
        <div
          style={{
            zIndex: 1,
          }}>
          {text.split("").map((char, index) => {
            // Calculate transition for gradient effect
            const maxScrollPerChar = 200; // Adjust for the desired fade effect
            const transitionProgress = Math.min(Math.max((scrollY - index * 20) / maxScrollPerChar, 0), 1);

            return (
              <span
                key={index}
                className="bg-gradient-to-r bg-clip-text text-transparent from-teal-600 via-blue-900 to-primary dark:from-teal-400 dark:to-blue-600"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  transition: "background-image 0.3s ease-in-out",
                  fontSize: "4rem",
                  opacity: 1 - transitionProgress,
                  willChange: "background-image",
                }}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
