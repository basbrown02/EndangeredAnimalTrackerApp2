"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, AlertTriangle, Heart } from "lucide-react";
import { Species } from "@/data/species";

type Props = {
  species: Species;
};

export const CustomAnimalInfoPage = ({ species }: Props) => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Get custom data from localStorage
    const savedNickname = localStorage.getItem("customAnimalNickname");
    const savedImage = localStorage.getItem("customAnimalImage");

    if (savedNickname) setNickname(savedNickname);
    if (savedImage) {
      setImagePreview(savedImage);
    } else if (species?.characterImage) {
      // Use default character image if no custom image
      setImagePreview(species.characterImage);
    }
  }, [species]);

  const handleBeginResearch = () => {
    // Navigate to the project page with the custom data
    router.push(`/project/${species.slug}?custom=true`);
  };

  const mainThreats = [
    "Habitat destruction",
    "Poaching",
    "Human conflict",
  ];

  const howToHelp = [
    "Support wildlife conservation organizations",
    "Reduce your environmental impact",
    `Share ${nickname || species.name}'s story with friends and family`,
    "Learn more about endangered species protection",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Decorative leaves */}
      <div className="pointer-events-none fixed right-0 top-0 z-0 h-64 w-64 opacity-20">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 100C180 100 150 80 120 100C90 120 80 150 80 150C80 150 90 120 70 100C50 80 20 100 20 100"
            stroke="#059669"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M160 40C160 40 140 50 130 70C120 90 125 110 125 110"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-bubbles text-base text-emerald-800 transition-colors hover:bg-emerald-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to selection
        </button>

        {/* Hero Section with Image */}
        <div className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
          <div className="relative h-80 bg-gradient-to-br from-slate-300 to-slate-400">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={nickname || species.name}
                fill
                className={imagePreview.startsWith("/animalcharacters") ? "object-contain p-8 opacity-80" : "object-cover opacity-70"}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-9xl opacity-50">
                {species.emoji}
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

            {/* Animal name overlay */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="text-5xl">{species.emoji}</div>
              <div>
                <h1 className="font-bubbles text-4xl text-white drop-shadow-lg">
                  {nickname || species.name}
                </h1>
                <p className="font-bubbles text-xl text-white/90">
                  {species.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {/* Habitat Card */}
          <div className="rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-emerald-600">
              <MapPin className="h-5 w-5" />
              <h3 className="font-bubbles text-lg">Habitat</h3>
            </div>
            <p className="font-bubbles text-base text-slate-700">
              {species.region}
            </p>
          </div>

          {/* Population Card */}
          <div className="rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-emerald-600">
              <Users className="h-5 w-5" />
              <h3 className="font-bubbles text-lg">Population</h3>
            </div>
            <p className="font-bubbles text-base text-slate-700">
              {species.defaultInputs.population.toLocaleString()} remaining in
              the wild
            </p>
          </div>
        </div>

        {/* Main Threats */}
        <div className="mb-8 rounded-3xl border-2 border-rose-200 bg-rose-50 p-6">
          <div className="mb-4 flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="font-bubbles text-2xl">Main Threats</h2>
          </div>
          <ul className="space-y-2">
            {mainThreats.map((threat, index) => (
              <li
                key={index}
                className="flex items-start gap-2 font-bubbles text-base text-rose-900"
              >
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-rose-500" />
                {threat}
              </li>
            ))}
          </ul>
        </div>

        {/* How You Can Help */}
        <div className="mb-8 rounded-3xl border-2 border-cyan-200 bg-cyan-50 p-6">
          <div className="mb-4 flex items-center gap-2 text-cyan-700">
            <Heart className="h-6 w-6" />
            <h2 className="font-bubbles text-2xl">How You Can Help</h2>
          </div>
          <p className="mb-4 font-bubbles text-base text-cyan-900">
            By learning about {nickname || species.name} and sharing their
            story, you're helping raise awareness about {species.name}{" "}
            conservation.
          </p>
          <ul className="space-y-2">
            {howToHelp.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 font-bubbles text-sm text-cyan-800"
              >
                <span className="text-cyan-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Begin Research Button */}
        <button
          onClick={handleBeginResearch}
          className="w-full rounded-full bg-emerald-500 px-8 py-4 font-bubbles text-xl text-white shadow-lg transition-colors hover:bg-emerald-600"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            Begin research project!
          </div>
        </button>

        {/* Footer Message */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-100 to-cyan-100 p-6 text-center">
          <p className="font-bubbles text-lg text-slate-800">
            Together we can make a difference for endangered species.
          </p>
        </div>
      </main>

      {/* Bottom decorative leaves */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-48 w-full opacity-30">
        <svg
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <path
            d="M0 100C50 80 100 60 150 80C200 100 250 120 300 100C350 80 400 60 450 80"
            stroke="#10b981"
            strokeWidth="4"
            fill="none"
          />
          <ellipse cx="100" cy="150" rx="40" ry="30" fill="#10b981" opacity="0.3" />
          <ellipse cx="300" cy="140" rx="50" ry="35" fill="#059669" opacity="0.3" />
          <ellipse cx="500" cy="160" rx="45" ry="32" fill="#10b981" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

