"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { SPECIES_LIST, Species } from "@/data/species";

export const CustomizeAnimalPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const speciesSlug = searchParams.get("species");

  const [nickname, setNickname] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);

  useEffect(() => {
    if (speciesSlug) {
      const foundSpecies = SPECIES_LIST.find((s) => s.slug === speciesSlug);
      if (foundSpecies) {
        setSpecies(foundSpecies);
        setNickname(foundSpecies.nickname || foundSpecies.name);
      }
    }

    // Get custom image from localStorage, or use default character image
    const savedImage = localStorage.getItem("customAnimalImage");
    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, [speciesSlug]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        localStorage.setItem("customAnimalImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (species && nickname) {
      // Store the custom data
      localStorage.setItem("customAnimalNickname", nickname);
      
      // If no custom image was uploaded, store the default character image
      if (!imagePreview && species.characterImage) {
        localStorage.setItem("customAnimalImage", species.characterImage);
      }
      
      router.push(`/custom-animal/${species.slug}`);
    }
  };

  if (!species) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-bubbles text-xl text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Decorative leaf in top right */}
      <div className="pointer-events-none fixed right-0 top-0 z-0 h-48 w-48 opacity-30">
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

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-bubbles text-base text-emerald-800 transition-colors hover:bg-emerald-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to selection
        </button>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bubbles text-4xl text-slate-800">
            Customise Your {species.name}
          </h1>
          <p className="font-bubbles text-lg text-slate-600">
            Give your animal a special name and choose their photo
          </p>
        </div>

        {/* Photo Upload */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Camera className="h-5 w-5 text-slate-600" />
            <label className="font-bubbles text-lg text-slate-700">
              Choose a Photo
            </label>
          </div>
          <label
            htmlFor="photo-upload"
            className="group relative block cursor-pointer overflow-hidden rounded-3xl border-4 border-emerald-300 bg-emerald-100 transition-all hover:border-emerald-400"
            style={{ aspectRatio: "1" }}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Animal photo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/0 transition-colors group-hover:bg-emerald-600/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Check className="h-8 w-8" />
                  </div>
                </div>
              </>
            ) : species?.characterImage ? (
              <>
                <Image
                  src={species.characterImage}
                  alt={species.name}
                  fill
                  className="object-contain p-12"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/0 transition-colors group-hover:bg-emerald-600/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-8 w-8" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-2 font-bubbles text-sm text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                  Click to change photo
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Camera className="mx-auto mb-2 h-12 w-12 text-emerald-600" />
                  <p className="font-bubbles text-lg text-emerald-700">
                    Click to choose photo
                  </p>
                </div>
              </div>
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview */}
        <div className="mb-8">
          <label className="mb-2 block font-bubbles text-lg text-slate-700">
            Preview
          </label>
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={nickname}
                    fill
                    className="object-cover"
                  />
                ) : species?.characterImage ? (
                  <Image
                    src={species.characterImage}
                    alt={species.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-4xl">
                    {species?.emoji}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bubbles text-2xl text-slate-800">
                  {nickname || "Your animal"}
                </h3>
                <p className="font-bubbles text-base text-slate-600">
                  {species?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nickname Input */}
        <div className="mb-8">
          <label className="mb-2 block font-bubbles text-lg text-slate-700">
            Choose a Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            className="w-full rounded-2xl border-2 border-emerald-300 bg-white px-4 py-3 font-bubbles text-lg text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Enter a name..."
          />
          <p className="mt-1 text-right text-sm text-slate-500">
            {nickname.length}/20 characters
          </p>
        </div>

        {/* Species Info Box */}
        <div className="mb-8 rounded-3xl border-2 border-orange-200 bg-orange-50 p-6">
          <div className="mb-3 font-bubbles text-base text-orange-900">
            <span className="font-bold">Conservation Status:</span>{" "}
            <span className="text-orange-600">{species.status || "Endangered"}</span>
          </div>
          <div className="mb-3 font-bubbles text-base text-orange-900">
            <span className="font-bold">Habitat:</span> {species.region}
          </div>
          <div className="font-bubbles text-base text-orange-900">
            <span className="font-bold">Estimated Population:</span>{" "}
            {species.defaultInputs.population.toLocaleString()}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!nickname}
          className="w-full rounded-full bg-emerald-500 px-8 py-4 font-bubbles text-xl text-white shadow-lg transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue with {nickname || species?.name}
        </button>
      </main>
    </div>
  );
};

