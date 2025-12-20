"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { SPECIES_LIST } from "@/data/species";
import { CreateCustomAnimalModal } from "./create-custom-animal-modal";

const getStatusColor = (status?: string) => {
  if (status === "Critically Endangered") return "text-red-600";
  if (status === "Endangered") return "text-orange-600";
  return "text-yellow-600";
};

const getCardBackground = (index: number) => {
  const colors = [
    "from-slate-200 to-slate-300", // Leo - Snow Leopard
    "from-amber-200 to-orange-200", // Nemo - Turtle
    "from-sky-200 to-blue-300", // Kong - Gorilla
    "from-rose-200 to-red-200", // Indi - Tiger
    "from-emerald-200 to-green-300", // Lucy - Koala
  ];
  return colors[index % colors.length];
};

export const AnimalSelection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  const filteredSpecies = SPECIES_LIST.filter((species) =>
    species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    species.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnimalSelect = (slug: string) => {
    // Clear any previous custom animal data
    localStorage.removeItem("customAnimalImage");
    localStorage.removeItem("customAnimalNickname");
    // Navigate to customize page with the species
    router.push(`/customize-animal?species=${slug}`);
  };

  const handleCustomAnimal = () => {
    setShowCustomModal(true);
  };

  const handleCustomModalContinue = (data: { image: File; species: string }) => {
    // Store the image in localStorage as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("customAnimalImage", reader.result as string);
      setShowCustomModal(false);
      // Navigate to customize page
      router.push(`/customize-animal?species=${data.species}`);
    };
    reader.readAsDataURL(data.image);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 font-bubbles text-5xl text-slate-800">
            Select Your Animal
          </h1>
          <p className="font-bubbles text-xl text-slate-600">
            Choose an endangered species to learn about and protect
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-12 max-w-2xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-slate-200 bg-white px-12 py-3 font-bubbles text-lg text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </motion.div>

        {/* Animals Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpecies.map((species, index) => (
            <motion.div
              key={species.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <button
                onClick={() => handleAnimalSelect(species.slug)}
                className="group relative w-full overflow-hidden rounded-3xl border-4 border-white bg-white p-6 shadow-lg transition-all hover:scale-105 hover:border-emerald-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                {/* Character Image with Gradient Background */}
                <div className="mb-4 flex justify-center">
                  <div
                    className={`relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br ${getCardBackground(
                      index
                    )} shadow-md`}
                  >
                    {species.characterImage ? (
                      <Image
                        src={species.characterImage}
                        alt={species.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl">
                        {species.emoji}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nickname */}
                <h3 className="mb-1 font-bubbles text-3xl text-slate-800">
                  {species.nickname || species.name}
                </h3>

                {/* Species Name */}
                <p className="mb-1 font-bubbles text-base text-slate-600">
                  {species.name}
                </p>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span
                    className={`rounded-full px-4 py-1 font-bubbles text-sm ${getStatusColor(
                      species.status
                    )}`}
                  >
                    {species.status || "Endangered"}
                  </span>
                </div>
              </button>
            </motion.div>
          ))}

          {/* Custom Animal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + filteredSpecies.length * 0.1 }}
          >
            <button
              onClick={handleCustomAnimal}
              className="group flex h-full min-h-[300px] w-full items-center justify-center rounded-3xl border-4 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 p-6 transition-all hover:scale-105 hover:border-emerald-400 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-200 transition-colors group-hover:bg-emerald-300">
                    <Plus className="h-16 w-16 text-emerald-700" />
                  </div>
                </div>
                <h3 className="mb-1 font-bubbles text-3xl text-emerald-800">
                  Custom
                </h3>
                <p className="font-bubbles text-base text-emerald-700">
                  Upload your own
                </p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Empty State */}
        {filteredSpecies.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center">
            <p className="font-bubbles text-xl text-slate-600">
              No animals found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="font-bubbles text-lg text-slate-600 underline hover:text-slate-800"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </main>

      {/* Custom Animal Modal */}
      <CreateCustomAnimalModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onContinue={handleCustomModalContinue}
      />
    </div>
  );
};

