"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  /** "left" = slide in from left; "right" = slide in from right; "fade" = fade only */
  direction?: "left" | "right" | "fade";
  className?: string;
  /** How much of the element must be visible before revealing */
  threshold?: number;
};

export function Reveal({
  children,
  direction = "left",
  className = "",
  threshold = 0.25,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const baseClass =
    direction === "right" ? "fade-in-right" : direction === "fade" ? "fade-in" : "fade-in-left";

  return (
    <div ref={ref} data-inview={inView ? "true" : "false"} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}



