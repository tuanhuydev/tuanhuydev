"use client";

import { useEffect, useRef } from "react";

export interface BadgeProps {
  className?: string;
  color?: string;
  value: string;
}

export default function Badge({ className, color, value }: BadgeProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (className) {
      const classList: Array<string> = ref.current.className.split(" ");
      ref.current.className = [...classList, className].join(" ");
    }
    if (color) {
      ref.current.style.backgroundColor = color;
    }
  }, [className, color]);
  return (
    <span ref={ref} className="capitalize rounded-full px-3 py-1 text-white text-sm truncate">
      {value}
    </span>
  );
}
