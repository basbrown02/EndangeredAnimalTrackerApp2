 "use client";

import { motion } from "framer-motion";

type Props = {
  isAuthed: boolean;
};

const funFacts = [
  "1 band plants 10 trees",
  "Kids have saved 2,134 turtles",
  "We track 5 species today",
];

export const HeroSection = ({ isAuthed }: Props) => {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-rose-50 p-8 text-slate-900 shadow-xl shadow-sky-100/70">
      <div className="flex flex-col gap-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
          <span role="img" aria-hidden>
            🌱
          </span>
          Bands of Courage
        </p>

        <div className="space-y-3">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Build an endangered animal report that{" "}
            <span className="text-sky-700">WOWs</span> your teacher.
          </h1>
          <p className="text-lg text-slate-600">
            Enter the real numbers, explain the risks, and see if your species
            is drifting toward mathematical extinction. Perfect for curious
            12-year-old scientists.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isAuthed && (
            <a
              href="#start"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30"
            >
              Sign in to start
            </a>
          )}
          <a
            href="#how"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700"
          >
            See how it works
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {funFacts.map((fact) => (
          <motion.div
            key={fact}
            whileHover={{ y: -2 }}
            className="rounded-3xl border border-slate-100 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-600 shadow"
          >
            {fact}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

