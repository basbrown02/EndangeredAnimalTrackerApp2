"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { updateProjectNotes, saveProjectFromDashboard } from "@/server-actions/project-submissions";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  ReferenceLine,
  ReferenceArea,
  Label
} from "recharts";
import { 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  Heart, 
  X, 
  Users, 
  TrendingDown, 
  Activity,
  Thermometer,
  Shield,
  Maximize2,
  PenLine,
  Home,
  Save,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Species } from "@/data/species";
import { EaiResult, MathInputs } from "@/lib/calculations/eai";

type Props = {
  species: Species;
  result: EaiResult;
  inputs: MathInputs;
  narrative: {
    risks: string;
    climateImpact: string;
    actions: string;
    scratchpadNotes?: string;
  };
  studentName?: string;
  onReset: () => void;
};

type PanelId = "score" | "population" | "gender" | "risks" | "projection" | "threats" | "climate" | "actions" | "scratchpad" | null;

// Panel Tile Component - Light Nature Theme
const PanelTile = ({ 
  children, 
  onClick, 
  color = "cyan",
  className = "",
  delay = 0
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  color?: "cyan" | "rose" | "amber" | "emerald" | "violet" | "blue";
  className?: string;
  delay?: number;
}) => {
  const colorMap = {
    cyan: "bg-white border-sky-200 hover:border-sky-300 hover:shadow-sky-100",
    rose: "bg-white border-rose-200 hover:border-rose-300 hover:shadow-rose-100",
    amber: "bg-white border-amber-200 hover:border-amber-300 hover:shadow-amber-100",
    emerald: "bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100",
    violet: "bg-white border-violet-200 hover:border-violet-300 hover:shadow-violet-100",
    blue: "bg-white border-blue-200 hover:border-blue-300 hover:shadow-blue-100",
  };

  const iconColorMap = {
    cyan: "text-sky-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    emerald: "text-emerald-500",
    violet: "text-violet-400",
    blue: "text-blue-400",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left shadow-sm transition-all duration-300 hover:shadow-lg ${colorMap[color]} ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 to-slate-50/50" />
      
      {/* Expand icon */}
      <div className={`absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-70 ${iconColorMap[color]}`}>
        <Maximize2 className="h-4 w-4" />
      </div>
      
      {children}
    </motion.button>
  );
};

// Modal Component - Light Nature Theme
const PanelModal = ({ 
  isOpen, 
  onClose, 
  title,
  icon: Icon,
  color = "cyan",
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  icon: React.ElementType;
  color?: "cyan" | "rose" | "amber" | "emerald" | "violet" | "blue";
  children: React.ReactNode;
}) => {
  const headerColorMap = {
    cyan: "bg-gradient-to-r from-sky-400 to-cyan-500",
    rose: "bg-gradient-to-r from-rose-400 to-pink-500",
    amber: "bg-gradient-to-r from-amber-400 to-orange-500",
    emerald: "bg-gradient-to-r from-emerald-400 to-teal-500",
    violet: "bg-gradient-to-r from-violet-400 to-purple-500",
    blue: "bg-gradient-to-r from-blue-400 to-indigo-500",
  };

  const iconBgMap = {
    cyan: "bg-sky-100 text-sky-600",
    rose: "bg-rose-100 text-rose-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-2xl md:inset-8 lg:inset-16"
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between ${headerColorMap[color]} p-6 shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/90 p-2 shadow-sm">
                  <Icon className="h-6 w-6 text-slate-700" />
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl bg-white/20 p-2 transition-colors hover:bg-white/40"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 text-slate-700">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const ProjectDashboard = ({
  species,
  result,
  inputs,
  narrative,
  studentName,
  onReset,
}: Props) => {
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const [scratchpadNotes, setScratchpadNotes] = useState(
    narrative.scratchpadNotes || ""
  );
  const [isSaving, startSaveTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [projectSaveStatus, setProjectSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isProjectSaving, startProjectSaveTransition] = useTransition();

  // Save entire project to database
  const saveProject = useCallback(() => {
    setProjectSaveStatus("saving");
    startProjectSaveTransition(async () => {
      try {
        await saveProjectFromDashboard({
          speciesSlug: species.slug,
          mathInputs: inputs,
          narrativeInputs: {
            risks: narrative.risks,
            climateImpact: narrative.climateImpact,
            actions: narrative.actions,
            scratchpadNotes: scratchpadNotes,
          },
          score: result.score,
          tippingPointLabel: result.tippingPointLabel,
          studentName: studentName,
        });
        setProjectSaveStatus("saved");
        setTimeout(() => setProjectSaveStatus("idle"), 3000);
      } catch (error) {
        console.error("Save project error:", error);
        setProjectSaveStatus("error");
        setTimeout(() => setProjectSaveStatus("idle"), 4000);
      }
    });
  }, [species.slug, inputs, narrative, scratchpadNotes, result, studentName]);

  // Auto-save notes when they change (debounced)
  const saveNotes = useCallback(() => {
    if (!scratchpadNotes) return;
    
    setSaveStatus("saving");
    startSaveTransition(async () => {
      try {
        await updateProjectNotes(species.slug, scratchpadNotes);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  }, [scratchpadNotes, species.slug]);

  // Auto-save when notes change (with debounce)
  useEffect(() => {
    if (!scratchpadNotes) return;
    
    const timeoutId = setTimeout(() => {
      saveNotes();
    }, 2000); // Save 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [scratchpadNotes, saveNotes]);

  // Data for Pie Chart
  const genderData = [
    { name: "Female", value: inputs.femalePopulation },
    { name: "Male", value: inputs.population - inputs.femalePopulation },
  ];
  const GENDER_COLORS = ["#f43f5e", "#3b82f6"];

  // Data for Bar Chart
  const breakdownData = [
    { name: "Population", value: Math.max(20, 300 - (inputs.population / 100)), fill: "#06b6d4" },
    { name: "Breeding", value: Math.max(20, 300 - (result.annualBirthRate * 20)), fill: "#8b5cf6" },
    { name: "Decline", value: result.annualDeclineRate * 50, fill: "#f43f5e" },
    { name: "Threats", value: 150, fill: "#f59e0b" },
    { name: "Climate", value: 100, fill: "#10b981" },
  ];

  // Population Projection Data
  const currentYear = new Date().getFullYear();
  const netChangeRate = (result.annualBirthRate - result.annualDeclineRate) / 100;
  const projectionData: { year: number; population: number }[] = [];

  let projectedPop = inputs.population;
  let extinctionYear: number | null = null;
  const maxYears = 100;

  for (let i = 0; i <= maxYears; i++) {
    projectionData.push({
      year: currentYear + i,
      population: Math.round(Math.max(0, projectedPop)),
    });
    
    if (projectedPop <= 100 && !extinctionYear) {
      extinctionYear = currentYear + i;
    }
    
    if (projectedPop <= 0) break;
    
    projectedPop = projectedPop * (1 + netChangeRate);
  }

  const yearsToExtinction = extinctionYear ? extinctionYear - currentYear : null;

  // Score color based on severity - Light Theme
  const getScoreColor = () => {
    if (result.score >= 751) return "text-rose-500";
    if (result.score >= 501) return "text-amber-500";
    if (result.score >= 251) return "text-yellow-500";
    return "text-emerald-500";
  };

  const getScoreBg = () => {
    if (result.score >= 751) return "bg-rose-50 border-rose-200";
    if (result.score >= 501) return "bg-amber-50 border-amber-200";
    if (result.score >= 251) return "bg-yellow-50 border-yellow-200";
    return "bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white font-sans text-slate-800">
      {/* Animated nature background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-transparent" />
        
        {/* Soft cloud shapes */}
        <div className="absolute -left-20 top-10 h-32 w-64 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute -right-10 top-20 h-40 w-80 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute left-1/3 top-5 h-24 w-48 rounded-full bg-white/40 blur-2xl" />
        
        {/* Subtle wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-50/30 to-transparent" />
      </div>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl shadow-lg shadow-emerald-200">
              {species.emoji}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{species.name} Analysis</h1>
              <p className="text-sm text-slate-500">By {studentName || "Eco Detective"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={saveProject}
              disabled={isProjectSaving}
              variant="secondary"
              className={`gap-2 transition-all ${
                projectSaveStatus === "saved" 
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700" 
                  : projectSaveStatus === "error"
                    ? "border-rose-300 bg-rose-100 text-rose-700"
                    : "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 hover:border-violet-300"
              }`}
            >
              {projectSaveStatus === "saving" ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : projectSaveStatus === "saved" ? (
                <>
                  <Check className="h-4 w-4" /> Saved!
                </>
              ) : projectSaveStatus === "error" ? (
                <>
                  <AlertTriangle className="h-4 w-4" /> Error
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Project
                </>
              )}
            </Button>
            <Link href="/">
              <Button 
                variant="secondary" 
                className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"
              >
                <Home className="h-4 w-4" /> Home
              </Button>
            </Link>
            <Button 
              onClick={() => window.print()}
              variant="secondary" 
              className="gap-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={onReset}
              variant="secondary"
              className="gap-2 border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:border-sky-300"
            >
              <RotateCcw className="h-4 w-4" /> New Analysis
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden p-3">
        {/* Control Panel Grid */}
        <div className="grid flex-1 auto-rows-fr gap-3 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Main EAI Score - Large Tile */}
          <PanelTile 
            onClick={() => setActivePanel("score")} 
            color={result.score >= 501 ? "rose" : "emerald"}
            className="md:col-span-1 lg:row-span-2"
            delay={0}
          >
            <div className="flex h-full flex-col items-center justify-center py-4">
              <Activity className="mb-2 h-6 w-6 text-slate-400" />
              <p className="text-sm font-medium uppercase tracking-wider text-slate-500">EAI Score</p>
              <div className={`my-4 rounded-2xl border-2 px-6 py-3 font-mono text-6xl font-black ${getScoreColor()} ${getScoreBg()}`}>
                {result.score}
              </div>
              <p className="text-center text-sm font-medium text-slate-600">{result.tippingPointLabel}</p>
              {result.score > 500 && (
                <div className="mt-4 flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600">
                  <AlertTriangle className="h-3 w-3" />
                  Critical Alert
                </div>
              )}
            </div>
          </PanelTile>

          {/* Population Stats */}
          <PanelTile onClick={() => setActivePanel("population")} color="cyan" delay={0.05}>
            <Users className="mb-2 h-5 w-5 text-sky-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Population</p>
            <p className="mt-1 font-mono text-3xl font-bold text-slate-800">{inputs.population.toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-500">{inputs.femalePopulation.toLocaleString()} breeding females</p>
          </PanelTile>

          {/* Gender Distribution */}
          <PanelTile onClick={() => setActivePanel("gender")} color="violet" delay={0.1}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Gender Ratio</p>
                <p className="mt-1 font-mono text-2xl font-bold text-slate-800">
                  {Math.round((inputs.femalePopulation / inputs.population) * 100)}% <span className="text-rose-500">♀</span>
                </p>
              </div>
              <div className="h-16 w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={18}
                      outerRadius={28}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {genderData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PanelTile>

          {/* Risk Breakdown */}
          <PanelTile onClick={() => setActivePanel("risks")} color="amber" delay={0.15}>
            <TrendingDown className="mb-2 h-5 w-5 text-amber-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Risk Analysis</p>
            <div className="mt-2 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} barGap={2}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={12}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PanelTile>

          {/* Population Projection */}
          <PanelTile 
            onClick={() => setActivePanel("projection")} 
            color={result.canRecover ? "emerald" : "rose"}
            className="lg:col-span-2"
            delay={0.2}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Population Projection</p>
                {!result.canRecover && yearsToExtinction ? (
                  <p className="mt-1 font-mono text-2xl font-bold text-rose-500">
                    Tipping Point: ~{extinctionYear}
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-500">
                    Growing ↑
                  </p>
                )}
              </div>
              {yearsToExtinction && !result.canRecover && (
                <div className="rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
                  {yearsToExtinction} years
                </div>
              )}
            </div>
            <div className="relative mt-3 h-16">
              {(() => {
                const previewData = projectionData.slice(0, 50);
                const previewEndYear = previewData[previewData.length - 1]?.year;
                const showExtinctionZone = extinctionYear && !result.canRecover && extinctionYear <= previewEndYear;
                
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={previewData}>
                      <defs>
                        <pattern id="tileStripePattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                          <line x1="0" y1="0" x2="0" y2="6" stroke="#fecaca" strokeWidth="3" />
                        </pattern>
                      </defs>
                      {showExtinctionZone && extinctionYear && (
                        <ReferenceArea 
                          x1={extinctionYear} 
                          x2={previewEndYear}
                          fill="url(#tileStripePattern)"
                          fillOpacity={0.8}
                        />
                      )}
                      <Area 
                        type="monotone" 
                        dataKey="population" 
                        stroke={result.canRecover ? "#10b981" : "#f43f5e"}
                        strokeWidth={2}
                        fill={result.canRecover ? "#d1fae5" : "#ffe4e6"}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </PanelTile>

          {/* Threats */}
          <PanelTile onClick={() => setActivePanel("threats")} color="rose" delay={0.25}>
            <AlertTriangle className="mb-2 h-5 w-5 text-rose-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Threats</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{narrative.risks.slice(0, 80)}...</p>
          </PanelTile>

          {/* Climate Impact */}
          <PanelTile onClick={() => setActivePanel("climate")} color="blue" delay={0.3}>
            <Thermometer className="mb-2 h-5 w-5 text-blue-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Climate Impact</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{narrative.climateImpact.slice(0, 80)}...</p>
          </PanelTile>

          {/* Conservation Actions */}
          <PanelTile onClick={() => setActivePanel("actions")} color="emerald" delay={0.35}>
            <Shield className="mb-2 h-5 w-5 text-emerald-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Conservation</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{narrative.actions.slice(0, 80)}...</p>
          </PanelTile>

          {/* Scratch Pad */}
          <PanelTile onClick={() => setActivePanel("scratchpad")} color="violet" delay={0.4}>
            <PenLine className="mb-2 h-5 w-5 text-violet-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Scratch Pad</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {scratchpadNotes ? scratchpadNotes.slice(0, 60) + "..." : "Click to write notes & ideas..."}
            </p>
          </PanelTile>
        </div>
      </main>

      {/* EAI Scale Legend - Bottom Bar */}
      <footer className="flex-shrink-0 border-t border-slate-200 bg-white/80 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center justify-center gap-6">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">EAI Scale:</span>
          <div className="flex gap-1 text-center text-xs font-bold">
            <div className="rounded-l-md bg-emerald-100 px-3 py-1.5 text-emerald-600">
              &lt;250 Safe
            </div>
            <div className="bg-yellow-100 px-3 py-1.5 text-yellow-600">
              250-500 Unstable
            </div>
            <div className="bg-amber-100 px-3 py-1.5 text-amber-600">
              500-750 Endangered
            </div>
            <div className="rounded-r-md bg-rose-100 px-3 py-1.5 text-rose-600">
              750+ Critical
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      
      {/* EAI Score Modal */}
      <PanelModal 
        isOpen={activePanel === "score"} 
        onClose={() => setActivePanel(null)}
        title="Extinction Alert Index (EAI)"
        icon={Activity}
        color={result.score >= 501 ? "rose" : "emerald"}
      >
        <div className="space-y-8">
          <div className="text-center">
            <div className={`mx-auto mb-4 inline-block rounded-3xl border-4 px-8 py-4 font-mono text-8xl font-black ${getScoreColor()} ${getScoreBg()}`}>
              {result.score}
            </div>
            <p className="text-2xl font-bold text-slate-800">{result.tippingPointLabel}</p>
            <p className="mt-2 text-slate-500">{result.verdict}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Understanding Your Score</h3>
            <p className="text-slate-600 leading-relaxed">
              The EAI score ranges from 0 to 1000 and measures how endangered a species is based on whether 
              reproduction can outpace the current decline rate. A score above 500 indicates that the population 
              is declining faster than it can reproduce, putting the species at serious risk.
            </p>
          </div>

          {/* Kid-Friendly Explanation */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-700">
              🎯 What Does This Score Mean?
            </h3>
            
            <div className="space-y-4 text-slate-700">
              <p className="text-sm leading-relaxed">
                Think of the EAI score like a <strong>danger meter</strong> for animals! 
                It goes from 0 (totally safe) to 1000 (extreme danger).
              </p>

              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-3 font-bold text-amber-600">🤔 How do we figure it out?</p>
                <p className="text-sm leading-relaxed">
                  We ask one simple question: <em>&quot;Are more babies being born than animals dying?&quot;</em>
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500">✅</span>
                    <span><strong>More babies than deaths</strong> = Population grows = Lower score (good!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">❌</span>
                    <span><strong>More deaths than babies</strong> = Population shrinks = Higher score (bad!)</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-2 font-bold text-amber-600">📊 Your {species.name}&apos;s numbers:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-emerald-100 p-3 text-center">
                    <p className="text-emerald-600">Babies born</p>
                    <p className="font-bold text-emerald-700">+{result.annualBirthRate}% per year</p>
                  </div>
                  <div className="rounded-lg bg-rose-100 p-3 text-center">
                    <p className="text-rose-600">Animals lost</p>
                    <p className="font-bold text-rose-700">-{result.annualDeclineRate}% per year</p>
                  </div>
                </div>
                <p className="mt-3 text-center text-sm">
                  {result.canRecover ? (
                    <span className="font-medium text-emerald-600">🎉 Good news! More babies = species can recover!</span>
                  ) : (
                    <span className="font-medium text-rose-600">😟 More losses than babies = species needs our help!</span>
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-amber-100 p-3 text-center">
                <p className="text-sm text-amber-800">
                  💡 <strong>Score of {result.score}?</strong> {result.score < 250 
                    ? "That's great! This species is doing well." 
                    : result.score < 500 
                      ? "This species needs watching - it's not quite balanced yet."
                      : result.score < 750
                        ? "This species is in trouble and needs help soon!"
                        : "Emergency! This species needs urgent protection right now!"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={`rounded-xl p-4 ${result.score < 250 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <p className="text-2xl font-bold">&lt;250</p>
              <p className="text-sm">Safe</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 250 && result.score < 500 ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <p className="text-2xl font-bold">250-500</p>
              <p className="text-sm">Unstable</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 500 && result.score < 750 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <p className="text-2xl font-bold">500-750</p>
              <p className="text-sm">Endangered</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 750 ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <p className="text-2xl font-bold">750+</p>
              <p className="text-sm">Critical</p>
            </div>
          </div>
        </div>
      </PanelModal>

      {/* Population Modal */}
      <PanelModal 
        isOpen={activePanel === "population"} 
        onClose={() => setActivePanel(null)}
        title="Population Data"
        icon={Users}
        color="cyan"
      >
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-6 text-center">
              <p className="text-sm text-slate-500">Total Population</p>
              <p className="mt-2 font-mono text-4xl font-bold text-sky-600">{inputs.population.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-6 text-center">
              <p className="text-sm text-slate-500">Breeding Females</p>
              <p className="mt-2 font-mono text-4xl font-bold text-rose-600">{inputs.femalePopulation.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 border-2 border-violet-200 p-6 text-center">
              <p className="text-sm text-slate-500">Offspring/Female (Lifetime)</p>
              <p className="mt-2 font-mono text-4xl font-bold text-violet-600">{result.lifetimeBabiesPerFemale}</p>
            </div>
          </div>
              
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-6">
              <p className="text-sm text-slate-500">Annual Birth Rate</p>
              <p className="mt-2 font-mono text-3xl font-bold text-emerald-600">{result.annualBirthRate}%</p>
              <p className="mt-1 text-sm text-slate-500">of total population per year</p>
            </div>
            <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-6">
              <p className="text-sm text-slate-500">Annual Decline Rate</p>
              <p className="mt-2 font-mono text-3xl font-bold text-rose-600">{result.annualDeclineRate}%</p>
              <p className="mt-1 text-sm text-slate-500">of total population per year</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-6">
            <p className="text-slate-600">
              {result.canRecover 
                ? `Good news! With a birth rate of ${result.annualBirthRate}% exceeding the decline rate of ${result.annualDeclineRate}%, this population has the potential to recover over time.`
                : `Warning: The decline rate of ${result.annualDeclineRate}% exceeds the birth rate of ${result.annualBirthRate}%. Without intervention, this population will continue to shrink.`
              }
            </p>
          </div>
        </div>
      </PanelModal>

      {/* Gender Distribution Modal */}
      <PanelModal 
        isOpen={activePanel === "gender"} 
        onClose={() => setActivePanel(null)}
        title="Gender Distribution"
        icon={Users}
        color="violet"
      >
        <div className="space-y-8">
          <div className="flex flex-col items-center md:flex-row md:justify-around">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      color: '#334155',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-4 md:mt-0">
              <div className="flex items-center gap-4 rounded-xl bg-rose-50 border-2 border-rose-200 p-4">
                <div className="h-4 w-4 rounded-full bg-rose-500" />
                <div>
                  <p className="text-lg font-bold text-rose-600">{inputs.femalePopulation.toLocaleString()} Females</p>
                  <p className="text-sm text-slate-500">{Math.round((inputs.femalePopulation / inputs.population) * 100)}% of population</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-blue-50 border-2 border-blue-200 p-4">
                <div className="h-4 w-4 rounded-full bg-blue-500" />
                <div>
                  <p className="text-lg font-bold text-blue-600">{(inputs.population - inputs.femalePopulation).toLocaleString()} Males</p>
                  <p className="text-sm text-slate-500">{Math.round(((inputs.population - inputs.femalePopulation) / inputs.population) * 100)}% of population</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-6">
            <p className="text-slate-600">
              Gender ratio is critical for species survival. A healthy breeding population typically requires 
              a balanced ratio, though this varies by species. For {species.name}, having {inputs.femalePopulation.toLocaleString()} breeding 
              females means the reproductive capacity is directly tied to their health and habitat quality.
            </p>
          </div>
        </div>
      </PanelModal>

      {/* Risk Analysis Modal */}
      <PanelModal 
        isOpen={activePanel === "risks"} 
        onClose={() => setActivePanel(null)}
        title="Risk Analysis Breakdown"
        icon={TrendingDown}
        color="amber"
      >
        <div className="space-y-8">
          <div className="h-80 rounded-2xl bg-slate-50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b' }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    color: '#334155',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30}>
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-sky-50 border-2 border-sky-200 p-4">
              <p className="font-bold text-sky-600">Population Risk</p>
              <p className="mt-1 text-sm text-slate-600">Lower populations face higher extinction risk due to reduced genetic diversity.</p>
            </div>
            <div className="rounded-xl bg-violet-50 border-2 border-violet-200 p-4">
              <p className="font-bold text-violet-600">Breeding Pressure</p>
              <p className="mt-1 text-sm text-slate-600">Low birth rates compound decline issues and reduce recovery potential.</p>
            </div>
            <div className="rounded-xl bg-rose-50 border-2 border-rose-200 p-4">
              <p className="font-bold text-rose-600">Decline Rate</p>
              <p className="mt-1 text-sm text-slate-600">Current annual decline of {result.annualDeclineRate}% is {result.annualDeclineRate > 5 ? 'severe' : 'concerning'}.</p>
            </div>
            <div className="rounded-xl bg-amber-50 border-2 border-amber-200 p-4">
              <p className="font-bold text-amber-600">External Threats</p>
              <p className="mt-1 text-sm text-slate-600">Habitat loss, poaching, and human encroachment add additional pressure.</p>
            </div>
          </div>
        </div>
      </PanelModal>

      {/* Population Projection Modal */}
      <PanelModal 
        isOpen={activePanel === "projection"} 
        onClose={() => setActivePanel(null)}
        title="Tipping Point Projection"
        icon={TrendingDown}
        color={result.canRecover ? "emerald" : "rose"}
      >
        <div className="space-y-8">
          {!result.canRecover && extinctionYear && (
            <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-6 text-center">
              <p className="text-sm text-rose-600">Estimated Functional Extinction</p>
              <p className="mt-2 font-mono text-5xl font-black text-rose-500">{extinctionYear}</p>
              <p className="mt-2 text-rose-600">Approximately {yearsToExtinction} years from now</p>
            </div>
          )}
          
          {result.canRecover && (
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-6 text-center">
              <p className="text-sm text-emerald-600">Population Trend</p>
              <p className="mt-2 font-mono text-5xl font-black text-emerald-500">Growing ↑</p>
              <p className="mt-2 text-emerald-600">Birth rate exceeds decline rate</p>
            </div>
          )}

          <div className="relative h-80 rounded-2xl bg-slate-50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="projGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={result.canRecover ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={result.canRecover ? "#10b981" : "#f43f5e"} stopOpacity={0.05}/>
                  </linearGradient>
                  <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#fecaca" strokeWidth="4" />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                />
                <Tooltip 
                  cursor={{ stroke: '#94a3b8', strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    color: '#334155',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Population']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                {extinctionYear && !result.canRecover && (
                  <ReferenceArea 
                    x1={extinctionYear} 
                    x2={projectionData[projectionData.length - 1]?.year}
                    fill="url(#stripePattern)"
                    fillOpacity={0.8}
                  />
                )}
                {extinctionYear && (
                  <ReferenceLine 
                    x={extinctionYear} 
                    stroke="#e11d48" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  >
                    <Label value="TIPPING POINT" position="top" fill="#e11d48" fontSize={11} fontWeight="bold" />
                  </ReferenceLine>
                )}
                <Area 
                  type="monotone"
                  dataKey="population" 
                  stroke={result.canRecover ? "#10b981" : "#f43f5e"}
                  strokeWidth={3}
                  fill="url(#projGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Single Extinct Watermark - Diagonal across extinction zone */}
            {extinctionYear && !result.canRecover && (
              <div className="pointer-events-none absolute bottom-8 right-[-20px] top-0 flex items-center justify-center select-none" style={{ width: '22%' }}>
                <span 
                  className="whitespace-nowrap font-black uppercase text-rose-400/70"
                  style={{ 
                    transform: 'rotate(-42.5deg)',
                    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                    letterSpacing: '0.4em',
                  }}
                >
                  NO RETURN
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-100 p-6">
            <p className="text-slate-600 leading-relaxed">
              {result.canRecover 
                ? `Based on the current birth rate of ${result.annualBirthRate}% and decline rate of ${result.annualDeclineRate}%, the ${species.name} population is projected to grow over time. Continued conservation efforts can help maintain this positive trajectory.`
                : `At the current trajectory with ${result.annualDeclineRate}% annual decline and only ${result.annualBirthRate}% birth rate, the ${species.name} population will fall below sustainable levels (~100 individuals) by approximately ${extinctionYear}. Urgent intervention is needed.`
              }
            </p>
          </div>

          {/* Kid-Friendly Explanation */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-700">
              🧮 How We Calculated This
            </h3>
            
            <div className="space-y-4 text-slate-700">
              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-2 font-bold text-sky-600">Step 1: Count the babies 👶</p>
                <p className="text-sm leading-relaxed">
                  Every year, about <span className="font-bold text-sky-700">{result.annualBirthRate}%</span> of the population has babies that survive. 
                  Think of it like this: if there are 100 {species.name}s, about {Math.round(result.annualBirthRate)} new babies join the family each year!
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-2 font-bold text-rose-600">Step 2: Count the losses 📉</p>
                <p className="text-sm leading-relaxed">
                  Sadly, each year about <span className="font-bold text-rose-700">{result.annualDeclineRate}%</span> of the population is lost 
                  (from hunting, habitat loss, or other dangers). That&apos;s about {Math.round(result.annualDeclineRate)} animals lost for every 100.
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-2 font-bold text-amber-600">Step 3: Do the math ➕➖</p>
                <p className="text-sm leading-relaxed">
                  We subtract losses from births: <span className="font-mono font-bold">{result.annualBirthRate}% - {result.annualDeclineRate}% = {(result.annualBirthRate - result.annualDeclineRate).toFixed(2)}%</span>
                </p>
                <p className="mt-2 text-sm">
                  {result.canRecover ? (
                    <span className="font-medium text-emerald-600">✅ Good news! More babies than losses = population grows!</span>
                  ) : (
                    <span className="font-medium text-rose-600">❌ Uh oh! More losses than babies = population shrinks each year.</span>
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-4 shadow-sm">
                <p className="mb-2 font-bold text-purple-600">Step 4: Look into the future 🔮</p>
                <p className="text-sm leading-relaxed">
                  We start with today&apos;s population ({inputs.population.toLocaleString()} {species.name}s) and apply this change year after year. 
                  {!result.canRecover && extinctionYear && (
                    <span> By <span className="font-bold text-rose-600">{extinctionYear}</span>, fewer than 100 would be left — that&apos;s the &quot;tipping point&quot; where the species can&apos;t recover.</span>
                  )}
                  {result.canRecover && (
                    <span> The population keeps growing, which means this species has a bright future! 🌟</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-indigo-100 p-3 text-center">
              <p className="text-sm text-indigo-700">
                💡 <strong>Remember:</strong> This is a prediction based on current trends. 
                If we protect these animals, we can change the future!
              </p>
            </div>
          </div>
        </div>
      </PanelModal>

      {/* Threats Modal */}
      <PanelModal 
        isOpen={activePanel === "threats"} 
        onClose={() => setActivePanel(null)}
        title={`Threats to ${species.name}`}
        icon={AlertTriangle}
        color="rose"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-rose-50 border-2 border-rose-200 p-6">
            <AlertTriangle className="h-12 w-12 text-rose-500 flex-shrink-0" />
            <p className="text-lg text-rose-800">{narrative.risks}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Common Threat Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-700">Habitat destruction and fragmentation</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-700">Poaching and illegal wildlife trade</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-700">Human-wildlife conflict</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-700">Disease and invasive species</span>
              </div>
            </div>
          </div>
        </div>
      </PanelModal>

      {/* Climate Impact Modal */}
      <PanelModal 
        isOpen={activePanel === "climate"} 
        onClose={() => setActivePanel(null)}
        title="Climate Change Impact"
        icon={Thermometer}
        color="blue"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-blue-50 border-2 border-blue-200 p-6">
            <Thermometer className="h-12 w-12 text-blue-500 flex-shrink-0" />
            <p className="text-lg text-blue-800">{narrative.climateImpact}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">How Climate Change Affects Wildlife</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-blue-50 border-2 border-blue-100 p-4">
                <p className="font-bold text-blue-600">Habitat Shifts</p>
                <p className="mt-1 text-sm text-slate-600">Changing temperatures force species to migrate to new areas.</p>
              </div>
              <div className="rounded-xl bg-blue-50 border-2 border-blue-100 p-4">
                <p className="font-bold text-blue-600">Food Scarcity</p>
                <p className="mt-1 text-sm text-slate-600">Altered ecosystems disrupt food chains and availability.</p>
              </div>
              <div className="rounded-xl bg-blue-50 border-2 border-blue-100 p-4">
                <p className="font-bold text-blue-600">Breeding Disruption</p>
                <p className="mt-1 text-sm text-slate-600">Changed seasons affect mating and nesting patterns.</p>
              </div>
              <div className="rounded-xl bg-blue-50 border-2 border-blue-100 p-4">
                <p className="font-bold text-blue-600">Extreme Events</p>
                <p className="mt-1 text-sm text-slate-600">More frequent storms and droughts threaten survival.</p>
              </div>
            </div>
          </div>
        </div>
      </PanelModal>

      {/* Conservation Actions Modal */}
      <PanelModal 
        isOpen={activePanel === "actions"} 
        onClose={() => setActivePanel(null)}
        title="How We Can Help"
        icon={Heart}
        color="emerald"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-6">
            <Heart className="h-12 w-12 text-emerald-500 flex-shrink-0" />
            <p className="text-lg text-emerald-800">{narrative.actions}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Conservation Strategies</h3>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl bg-emerald-50 border-2 border-emerald-100 p-4">
                <Shield className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-600">Protected Areas</p>
                  <p className="text-sm text-slate-600">Establishing and expanding protected habitats and wildlife corridors.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-emerald-50 border-2 border-emerald-100 p-4">
                <Users className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-600">Community Engagement</p>
                  <p className="text-sm text-slate-600">Working with local communities to balance human needs with conservation.</p>
                </div>
             </div>
              <div className="flex gap-4 rounded-xl bg-emerald-50 border-2 border-emerald-100 p-4">
                <Activity className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-600">Population Monitoring</p>
                  <p className="text-sm text-slate-600">Tracking populations to guide conservation efforts and measure success.</p>
             </div>
             </div>
             </div>
          </div>
        </div>
      </PanelModal>

      {/* Scratch Pad Modal */}
      <PanelModal 
        isOpen={activePanel === "scratchpad"} 
        onClose={() => setActivePanel(null)}
        title="Scratch Pad"
        icon={PenLine}
        color="violet"
      >
        <div className="space-y-6">
          <div className="rounded-2xl bg-violet-50 border-2 border-violet-200 p-4">
            <p className="text-sm text-violet-700">
              ✏️ Use this space to write down your thoughts, ideas, and observations about {species.name}!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Your Notes & Ideas</label>
              <div className="flex items-center gap-2 text-xs">
                {saveStatus === "saving" && (
                  <span className="text-amber-600">💾 Saving...</span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-emerald-600">✓ Saved!</span>
                )}
                {saveStatus === "error" && (
                  <span className="text-rose-600">✗ Error saving</span>
                )}
                {saveStatus === "idle" && scratchpadNotes && (
                  <span className="text-slate-500">Auto-saves as you type</span>
                )}
              </div>
            </div>
            <textarea
              value={scratchpadNotes}
              onChange={(e) => setScratchpadNotes(e.target.value)}
              placeholder={`Write your thoughts about ${species.name} here...\n\n• What surprised you about the data?\n• What questions do you have?\n• Ideas for helping this species?`}
              className="h-64 w-full resize-none rounded-xl border-2 border-slate-200 bg-white p-4 text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
            <p className="text-xs text-slate-500">
              {scratchpadNotes.length} characters written
            </p>
        </div>

          <div className="rounded-2xl bg-violet-50 border-2 border-violet-100 p-4">
            <h4 className="mb-3 font-bold text-violet-700">💡 Ideas to think about:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                What is the biggest threat to {species.name}?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                How does the EAI score make you feel about their future?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                What could you do to help protect this species?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                What did you learn that you didn&apos;t know before?
              </li>
            </ul>
          </div>
        </div>
      </PanelModal>
    </div>
  );
};
