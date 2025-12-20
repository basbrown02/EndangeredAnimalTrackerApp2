"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { ProjectSubmission } from "@/server-actions/project-submissions";
import { SPECIES_LIST } from "@/data/species";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Props = {
  userName: string;
  projects: ProjectSubmission[];
  userEmail?: string;
};

const getStatusColor = (score: number) => {
  if (score >= 751) return "bg-orange-400/90 text-white";
  if (score >= 501) return "bg-yellow-400/90 text-slate-800";
  if (score >= 251) return "bg-green-400/90 text-white";
  return "bg-green-500/90 text-white";
};

const getStatusLabel = (score: number) => {
  if (score >= 751) return "Completed";
  if (score >= 501) return "In Progress";
  return "Saved";
};

const getProjectCardBorder = (score: number) => {
  if (score >= 751) return "border-orange-300";
  if (score >= 501) return "border-blue-300";
  return "border-green-300";
};

export const DashboardContent = ({ userName, projects, userEmail }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const species = SPECIES_LIST.find((s) => s.slug === project.species_slug);
    return (
      species?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.species_slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative leaf in top right */}
      <div className="pointer-events-none fixed right-0 top-0 z-0 h-64 w-64 opacity-20">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M180 100C180 100 150 80 120 100C90 120 80 150 80 150C80 150 90 120 70 100C50 80 20 100 20 100"
            stroke="#059669"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-green-200/50 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-emerald-700">
              🐾 EAT
            </Link>
            <div className="flex gap-2">
              <button className="rounded-full bg-green-100 px-6 py-2 font-bubbles text-lg text-green-800 underline decoration-2 underline-offset-4">
                Dashboard
              </button>
              <Link href="/achievements">
                <button className="rounded-full px-6 py-2 font-bubbles text-lg text-slate-600 hover:bg-green-50">
                  Achievements
                </button>
              </Link>
              <button className="rounded-full px-6 py-2 font-bubbles text-lg text-slate-600 hover:bg-green-50">
                Settings
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-slate-600">{userEmail}</span>
            )}
            <SignOutButton label="Sign Out" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 font-bubbles text-5xl text-slate-800">
            Welcome back, {userName}! 👋
          </h1>
          <p className="font-bubbles text-xl text-slate-600">
            Let's look at your projects
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-slate-200 bg-white px-12 py-3 font-bubbles text-lg text-slate-700 placeholder:text-slate-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-6 flex items-center gap-2 font-bubbles text-3xl text-slate-800">
            <span className="text-yellow-400">⭐</span>
            Your Projects
          </h2>

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const species = SPECIES_LIST.find(
                (s) => s.slug === project.species_slug
              );

              if (!species) return null;

              const projectName =
                project.narrative_inputs?.animalNickname ||
                `${species.name} Project`;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={`/project/${project.species_slug}`}>
                    <div
                      className={`group relative overflow-hidden rounded-3xl border-4 ${getProjectCardBorder(
                        project.score
                      )} bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                    >
                      {/* Animal Avatar */}
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 via-yellow-200 to-green-200 text-5xl">
                          {species.emoji}
                        </div>
                      </div>

                      {/* Project Name */}
                      <h3 className="mb-3 text-center font-bubbles text-2xl text-slate-800">
                        {projectName}
                      </h3>

                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <span
                          className={`rounded-full px-6 py-2 font-bubbles text-base ${getStatusColor(
                            project.score
                          )}`}
                        >
                          {getStatusLabel(project.score)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Start New Project Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + filteredProjects.length * 0.1 }}
            >
              <Link href="/select-animal">
                <div className="group flex h-full min-h-[280px] items-center justify-center rounded-3xl border-4 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all hover:scale-105 hover:border-green-400 hover:shadow-xl">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-200 transition-colors group-hover:bg-green-300">
                        <Plus className="h-12 w-12 text-green-700" />
                      </div>
                    </div>
                    <h3 className="font-bubbles text-2xl text-green-800">
                      Start a New Project
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center">
              <p className="font-bubbles text-xl text-slate-600">
                No projects found matching "{searchQuery}"
              </p>
            </div>
          )}

          {projects.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center">
              <p className="mb-4 font-bubbles text-2xl text-slate-700">
                You haven't started any projects yet! 🌟
              </p>
              <p className="font-bubbles text-lg text-slate-600">
                Click "Start a New Project" to begin your first animal research mission.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

