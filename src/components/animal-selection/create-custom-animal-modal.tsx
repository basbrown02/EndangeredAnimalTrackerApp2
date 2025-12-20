"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { SPECIES_LIST } from "@/data/species";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (data: { image: File; species: string }) => void;
};

export const CreateCustomAnimalModal = ({
  isOpen,
  onClose,
  onContinue,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be less than 10MB");
    }
  };

  const handleContinue = () => {
    if (selectedImage && selectedSpecies) {
      onContinue({ image: selectedImage, species: selectedSpecies });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="mb-8 font-bubbles text-3xl text-slate-800">
          Create Custom Animal
        </h2>

        {/* Upload Photo Section */}
        <div className="mb-6">
          <label className="mb-2 block font-bubbles text-lg text-slate-700">
            Upload Photo
          </label>
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
          >
            {imagePreview ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <>
                <Upload className="mb-3 h-12 w-12 text-slate-400" />
                <p className="font-bubbles text-base text-slate-600">
                  Click to upload a photo of your animal
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  PNG, JPG up to 10MB
                </p>
              </>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Select Species */}
        <div className="mb-8">
          <label className="mb-2 block font-bubbles text-lg text-slate-700">
            Select Species
          </label>
          <div className="relative">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 font-bubbles text-base text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Choose a species...</option>
              {SPECIES_LIST.map((species) => (
                <option key={species.slug} value={species.slug}>
                  {species.emoji} {species.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-slate-300 bg-white px-6 py-3 font-bubbles text-lg text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedImage || !selectedSpecies}
            className="flex-1 rounded-full bg-emerald-400 px-6 py-3 font-bubbles text-lg text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

