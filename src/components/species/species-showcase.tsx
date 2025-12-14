import { SPECIES_LIST } from "@/data/species";
import { SpeciesCard } from "./species-card";

export const SpeciesShowcase = () => {
  return (
    <section className="mt-12 space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Choose your mission
        </p>
        <h2 className="font-display text-3xl text-slate-900">
          Pick one of five endangered friends
        </h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPECIES_LIST.map((species) => (
          <SpeciesCard key={species.slug} species={species} />
        ))}
      </div>
    </section>
  );
};



