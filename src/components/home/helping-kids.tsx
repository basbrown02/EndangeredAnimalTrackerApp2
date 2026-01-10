"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const HelpingKidsSection = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background with wave */}
      <div className="relative w-full">
        <Image
          src="/background.png"
          alt=""
          width={1920}
          height={800}
          className="pointer-events-none w-full select-none object-cover"
          priority
        />

        {/* Content overlay */}
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4 py-16 lg:px-6 lg:py-20">
            <div className="grid w-full gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left: Text content */}
              <div
                ref={textRef}
                data-inview={isInView ? "true" : "false"}
                className="fade-in-left flex flex-col justify-center"
              >
                <h2 className="font-bubbles text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-slate-900">
                  Helping kids protect endangered animals.
                </h2>

                <p className="mt-6 font-bubbles text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-slate-800">
                  The Endangered Animal Tracker (EAT) is a fun and meaningful way
                  for students to investigate an endangered species and discover
                  whether it is at risk of Mathematical Extinction - the point
                  where a species can no longer recover.
                </p>
              </div>

              {/* Right: Kid image with video play button */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="/kid.png"
                    alt="Kid using the Endangered Animal Tracker app"
                    width={400}
                    height={300}
                    className="h-auto w-full max-w-[400px] rounded-2xl shadow-xl"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg transition-transform hover:scale-110"
                      aria-label="Play video"
                    >
                      <svg
                        className="ml-1 h-8 w-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



