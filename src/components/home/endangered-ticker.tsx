"use client";

import { useEffect, useState } from "react";

type AnimalData = {
  name: string;
  population: number;
  change: number;
  percentage: number;
  icon: string;
};

const animalData: AnimalData[] = [
  {
    name: "Giant Panda",
    population: 1864,
    change: 127,
    percentage: 7.32,
    icon: "🐼",
  },
  {
    name: "Black Rhino",
    population: 5630,
    change: 89,
    percentage: 1.61,
    icon: "🦏",
  },
  {
    name: "Mountain Gorilla",
    population: 1063,
    change: 34,
    percentage: 3.31,
    icon: "🦍",
  },
  {
    name: "Amur Leopard",
    population: 109,
    change: -3,
    percentage: -2.68,
    icon: "🐆",
  },
  {
    name: "Hawksbill Turtle",
    population: 8234,
    change: -156,
    percentage: -1.86,
    icon: "🐢",
  },
  {
    name: "Blue Whale",
    population: 25000,
    change: 420,
    percentage: 1.71,
    icon: "🐋",
  },
  {
    name: "Snow Leopard",
    population: 4678,
    change: -23,
    percentage: -0.49,
    icon: "🐆",
  },
  {
    name: "Sumatran Tiger",
    population: 400,
    change: -8,
    percentage: -1.96,
    icon: "🐅",
  },
];

const AnimalCard = ({ animal }: { animal: AnimalData }) => {
  const isPositive = animal.change >= 0;

  return (
    <div className="flex min-w-[200px] flex-col gap-1 border-r border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{animal.icon}</span>
        <span className="text-sm font-medium text-slate-700">
          {animal.name}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-slate-900">
          {animal.population.toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {animal.change} ({isPositive ? "+" : ""}
          {animal.percentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};

export const EndangeredTicker = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Duplicate the data to create seamless loop
  const duplicatedData = [...animalData, ...animalData, ...animalData];

  return (
    <div className="w-full overflow-hidden bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="mb-6 text-center text-xl font-medium text-black" style={{ fontFamily: "var(--font-poppins)" }}>
          Today's Trends (Endangered Animal Index)
        </h2>
      </div>

      <div className="relative w-full overflow-hidden bg-white">
        {/* Gradient overlays for smooth edge effect */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling container */}
        <div
          className={`flex ${mounted ? "animate-scroll" : ""}`}
          style={{
            width: "fit-content",
          }}
        >
          {duplicatedData.map((animal, index) => (
            <AnimalCard key={`${animal.name}-${index}`} animal={animal} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll 37.5s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};



