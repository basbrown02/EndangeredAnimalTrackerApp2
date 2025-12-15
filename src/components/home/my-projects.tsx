"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, TrendingDown, FileText } from "lucide-react";
import { ProjectSubmission } from "@/server-actions/project-submissions";
import { SPECIES_LIST } from "@/data/species";

type Props = {
  projects: ProjectSubmission[];
};

const getScoreColor = (score: number) => {
  if (score >= 751) return "bg-rose-500";
  if (score >= 501) return "bg-amber-500";
  if (score >= 251) return "bg-yellow-500";
  return "bg-emerald-500";
};

const getScoreTextColor = (score: number) => {
  if (score >= 751) return "text-rose-600";
  if (score >= 501) return "text-amber-600";
  if (score >= 251) return "text-yellow-600";
  return "text-emerald-600";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const MyProjects = ({ projects }: Props) => {
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            My Projects
          </h2>
          <p className="text-sm text-slate-500">
            {projects.length > 0 
              ? "Continue where you left off or review your completed analyses"
              : "Your saved projects will appear here"
            }
          </p>
        </div>
        {projects.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            <FileText className="h-4 w-4" />
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No projects yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Pick an endangered species below and complete the analysis to see your first project here!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              🐢 Sea Turtles
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              🦧 Orangutans
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              🐆 Snow Leopards
            </span>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
          const species = SPECIES_LIST.find(
            (s) => s.slug === project.species_slug
          );
          
          if (!species) return null;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/project/${project.species_slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                  {/* Score Badge */}
                  <div className="absolute right-4 top-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${getScoreColor(
                        project.score
                      )} text-white font-bold text-lg shadow-sm`}
                    >
                      {project.score}
                    </div>
                  </div>

                  {/* Species Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {species.emoji}
                    </div>
                    <div className="flex-1 pr-14">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {species.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {species.scientificName}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingDown className={`h-4 w-4 ${getScoreTextColor(project.score)}`} />
                    <span className={`text-sm font-medium ${getScoreTextColor(project.score)}`}>
                      {project.tipping_point_label}
                    </span>
                  </div>

                  {/* Notes Preview */}
                  {project.narrative_inputs?.scratchpadNotes && (
                    <div className="mt-3 rounded-lg bg-violet-50 p-2">
                      <p className="text-xs text-violet-600 line-clamp-2">
                        📝 {project.narrative_inputs.scratchpadNotes.slice(0, 100)}
                        {project.narrative_inputs.scratchpadNotes.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(project.created_at)}
                    </div>
                    <span className="text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                      View Analysis →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
          })}
        </div>
      )}
    </section>
  );
};

