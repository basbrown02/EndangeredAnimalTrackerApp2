"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, TreePine, Turtle, Award } from "lucide-react";
import { ProjectSubmission } from "@/server-actions/project-submissions";
import { SPECIES_LIST } from "@/data/species";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Props = {
  userName: string;
  userEmail?: string;
  projects: ProjectSubmission[];
};

export const AchievementsContent = ({ userName, userEmail, projects }: Props) => {
  // All projects represent completed work (certificates earned)
  const completedProjects = projects; // Every project = 1 certificate
  const treesPlanted = completedProjects.length * 10; // 10 trees per project
  const carbonSaved = treesPlanted * 2; // ~2kg CO2 per tree
  const animalsHelped = completedProjects.reduce((sum, p) => sum + Math.max(p.score, 1), 0);

  // Mock leaderboard data (in production, fetch from all users)
  const leaderboard = [
    { rank: 1, name: "Lily", animals: 1032, isCurrentUser: false },
    { rank: 2, name: "Ethan", animals: 786, isCurrentUser: false },
    { rank: 3, name: "Mia", animals: 618, isCurrentUser: false },
    { rank: 5, name: userName, animals: animalsHelped, isCurrentUser: true },
  ];

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
          <path
            d="M160 40C160 40 140 50 130 70C120 90 125 110 125 110"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-green-200/50 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-emerald-700">
              🐾 EAT
            </Link>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <button className="rounded-full px-6 py-2 font-bubbles text-lg text-slate-600 hover:bg-green-50">
                  Dashboard
                </button>
              </Link>
              <button className="rounded-full bg-green-100 px-6 py-2 font-bubbles text-lg text-green-800 underline decoration-2 underline-offset-4">
                Achievements
              </button>
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bubbles text-5xl text-slate-800">
            Achievements 🌿
          </h1>
          <p className="font-bubbles text-xl text-slate-600">
            Great work, {userName}! 🍀 Here are your sustainability achievements
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Impact & Certificates */}
          <div className="lg:col-span-2">
            {/* Your Impact */}
            <div className="mb-6 rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-100 to-emerald-100 p-6">
              <h2 className="mb-4 font-bubbles text-2xl text-slate-800">
                Your Impact
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Trees Planted */}
                <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-200">
                    <TreePine className="h-8 w-8 text-green-700" />
                  </div>
                  <div>
                    <p className="font-bubbles text-lg text-slate-700">
                      Trees Planted
                    </p>
                    <p className="font-bubbles text-3xl font-bold text-green-700">
                      {treesPlanted}
                    </p>
                    <p className="font-bubbles text-sm text-slate-600">Trees 🌱</p>
                  </div>
                </div>

                {/* Carbon Saved */}
                <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-emerald-200">
                    <Turtle className="h-8 w-8 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-bubbles text-lg text-slate-700">
                      {carbonSaved}kg Carbon Saved
                    </p>
                    <p className="font-bubbles text-3xl font-bold text-emerald-700">
                      {animalsHelped}
                    </p>
                    <p className="font-bubbles text-sm text-slate-600">
                      Approx. Animals Helped
                    </p>
                  </div>
                </div>

                {/* Animals Helped */}
                <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 sm:col-span-2">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-orange-200">
                    <span className="text-3xl">🐯🐨</span>
                  </div>
                  <div>
                    <p className="font-bubbles text-lg text-slate-700">
                      Approx. Animals Helped
                    </p>
                    <p className="font-bubbles text-3xl font-bold text-orange-700">
                      {animalsHelped}
                    </p>
                    <p className="font-bubbles text-sm text-slate-600">
                      Animals Saved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Certificates */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-bubbles text-2xl text-slate-800">
                <span className="text-2xl">🍀</span>
                Your Certificates
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {completedProjects.map((project, index) => {
                  const species = SPECIES_LIST.find(
                    (s) => s.slug === project.species_slug
                  );
                  if (!species) return null;

                  const borderColors = [
                    "border-orange-300 bg-orange-50",
                    "border-cyan-300 bg-cyan-50",
                    "border-purple-300 bg-purple-50",
                    "border-pink-300 bg-pink-50",
                  ];

                  return (
                    <div
                      key={project.id}
                      className={`rounded-3xl border-4 p-6 ${
                        borderColors[index % borderColors.length]
                      }`}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        {species.characterImage ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-full">
                            <Image
                              src={species.characterImage}
                              alt={species.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl">
                            {species.emoji}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bubbles text-xl text-slate-800">
                            {species.name} Project
                          </h3>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/60 p-4 text-center">
                        <div className="mb-2 flex items-center justify-center gap-2">
                          <span className="text-2xl">🌿</span>
                          <span className="font-bubbles text-lg text-amber-700">
                            Achievement Award
                          </span>
                          <span className="text-2xl">🌿</span>
                        </div>
                        <div className="flex justify-center">
                          <Award className="h-12 w-12 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border-2 border-green-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                <h2 className="font-bubbles text-2xl text-slate-800">
                  Class Leaderboard
                </h2>
              </div>

              {/* Big Rank Display */}
              <div className="relative mb-6 rounded-3xl bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100 p-8">
                {/* Spotlight effect */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 opacity-30 blur-3xl" />
                </div>
                <div className="relative text-center">
                  <div className="mb-2 font-bubbles text-6xl font-bold text-slate-800">
                    5th
                  </div>
                  <p className="font-bubbles text-base text-slate-700">
                    Great job! You've saved the
                  </p>
                  <p className="font-bubbles text-base font-bold text-slate-800">
                    5th most animals in your class!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between rounded-2xl p-4 ${
                      entry.isCurrentUser
                        ? "bg-gradient-to-r from-green-100 to-emerald-100"
                        : entry.rank === 1
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100"
                        : entry.rank === 2
                        ? "bg-gradient-to-r from-green-100 to-emerald-100"
                        : entry.rank === 3
                        ? "bg-gradient-to-r from-rose-100 to-pink-100"
                        : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bubbles text-xl font-bold text-slate-700">
                        {entry.rank}
                      </span>
                      {entry.rank === 1 ? (
                        <span className="text-2xl">👑</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-2xl">🥈</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="text-2xl">🐻</span>
                      )}
                      <span className="font-bubbles text-lg text-slate-800">
                        {entry.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bubbles text-xl font-bold text-slate-800">
                        {entry.animals.toLocaleString()}
                      </p>
                      <p className="font-bubbles text-xs text-slate-600">
                        Animals
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <p className="font-bubbles text-2xl text-slate-700">
            🌎 Keep up the awesome work! 🌏
          </p>
        </div>
      </main>

      {/* Bottom decorative leaves */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-32 w-full opacity-20">
        <svg
          viewBox="0 0 1200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <ellipse cx="100" cy="60" rx="40" ry="30" fill="#10b981" opacity="0.5" />
          <ellipse cx="300" cy="50" rx="50" ry="35" fill="#059669" opacity="0.5" />
          <ellipse cx="500" cy="70" rx="45" ry="32" fill="#10b981" opacity="0.5" />
          <ellipse cx="700" cy="55" rx="40" ry="30" fill="#059669" opacity="0.5" />
          <ellipse cx="900" cy="65" rx="50" ry="35" fill="#10b981" opacity="0.5" />
          <ellipse cx="1100" cy="60" rx="45" ry="32" fill="#059669" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
};

