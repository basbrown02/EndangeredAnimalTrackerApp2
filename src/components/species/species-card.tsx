"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Species } from "@/data/species";

type Props = {
  species: Species;
};

export const SpeciesCard = ({ species }: Props) => {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div className="text-3xl">{species.emoji}</div>
        <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
      </div>
      <h3 className="mt-4 font-display text-xl text-slate-900">
        {species.name}
      </h3>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {species.scientificName}
      </p>
      <p className="mt-3 text-sm text-slate-600">{species.summary}</p>
      <p className="mt-auto text-xs font-semibold text-slate-500">
        {species.region}
      </p>
      <Link
        href={`/project/${species.slug}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
      >
        Research {species.name}
      </Link>
    </motion.article>
  );
};



