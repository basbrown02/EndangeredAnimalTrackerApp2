"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Maximize2
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
  };
  studentName?: string;
  onReset: () => void;
};

type PanelId = "score" | "population" | "gender" | "risks" | "projection" | "threats" | "climate" | "actions" | null;

// Panel Tile Component
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
    cyan: "from-cyan-500/20 to-cyan-500/5 hover:from-cyan-500/30 hover:to-cyan-500/10 border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-cyan-500/20",
    rose: "from-rose-500/20 to-rose-500/5 hover:from-rose-500/30 hover:to-rose-500/10 border-rose-500/30 hover:border-rose-400/50 hover:shadow-rose-500/20",
    amber: "from-amber-500/20 to-amber-500/5 hover:from-amber-500/30 hover:to-amber-500/10 border-amber-500/30 hover:border-amber-400/50 hover:shadow-amber-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 hover:from-emerald-500/30 hover:to-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-emerald-500/20",
    violet: "from-violet-500/20 to-violet-500/5 hover:from-violet-500/30 hover:to-violet-500/10 border-violet-500/30 hover:border-violet-400/50 hover:shadow-violet-500/20",
    blue: "from-blue-500/20 to-blue-500/5 hover:from-blue-500/30 hover:to-blue-500/10 border-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/20",
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left transition-all duration-300 hover:shadow-lg ${colorMap[color]} ${className}`}
    >
      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
      </div>
      
      {/* Expand icon */}
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-60">
        <Maximize2 className="h-4 w-4 text-white" />
      </div>
      
      {children}
    </motion.button>
  );
};

// Modal Component
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
  const colorMap = {
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/30",
    rose: "from-rose-500 to-rose-600 shadow-rose-500/30",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/30",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
    violet: "from-violet-500 to-violet-600 shadow-violet-500/30",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 overflow-auto rounded-3xl border border-slate-700/50 bg-slate-900 shadow-2xl md:inset-8 lg:inset-16"
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r ${colorMap[color]} p-6 shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl bg-white/20 p-2 transition-colors hover:bg-white/30"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 text-slate-100">
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

  // Score color based on severity
  const getScoreColor = () => {
    if (result.score >= 751) return "text-rose-400";
    if (result.score >= 501) return "text-amber-400";
    if (result.score >= 251) return "text-yellow-400";
    return "text-emerald-400";
  };

  const getScoreGlow = () => {
    if (result.score >= 751) return "drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]";
    if (result.score >= 501) return "drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]";
    if (result.score >= 251) return "drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]";
    return "drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-950 font-sans text-white">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/20">
              {species.emoji}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{species.name} Analysis</h1>
              <p className="text-sm text-slate-400">By {studentName || "Eco Detective"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.print()}
              variant="secondary" 
              className="gap-2 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={onReset}
              variant="secondary"
              className="gap-2 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
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
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400">EAI Score</p>
              <div className={`my-4 font-mono text-7xl font-black ${getScoreColor()} ${getScoreGlow()}`}>
                {result.score}
              </div>
              <p className="text-center text-sm text-slate-300">{result.tippingPointLabel}</p>
              {result.score > 500 && (
                <div className="mt-4 flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-400">
                  <AlertTriangle className="h-3 w-3" />
                  Critical Alert
                </div>
              )}
            </div>
          </PanelTile>

          {/* Population Stats */}
          <PanelTile onClick={() => setActivePanel("population")} color="cyan" delay={0.05}>
            <Users className="mb-2 h-5 w-5 text-cyan-400" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Population</p>
            <p className="mt-1 font-mono text-3xl font-bold text-white">{inputs.population.toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-500">{inputs.femalePopulation.toLocaleString()} breeding females</p>
          </PanelTile>

          {/* Gender Distribution */}
          <PanelTile onClick={() => setActivePanel("gender")} color="violet" delay={0.1}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Gender Ratio</p>
                <p className="mt-1 font-mono text-2xl font-bold text-white">
                  {Math.round((inputs.femalePopulation / inputs.population) * 100)}% <span className="text-rose-400">♀</span>
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
            <TrendingDown className="mb-2 h-5 w-5 text-amber-400" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Risk Analysis</p>
            <div className="mt-2 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} barGap={2}>
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={12}>
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
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Population Projection</p>
                {!result.canRecover && yearsToExtinction ? (
                  <p className="mt-1 font-mono text-2xl font-bold text-rose-400">
                    Tipping Point: ~{extinctionYear}
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                    Growing ↑
                  </p>
                )}
              </div>
              {yearsToExtinction && !result.canRecover && (
                <div className="rounded-lg bg-rose-500/20 px-3 py-1 text-sm font-bold text-rose-400">
                  {yearsToExtinction} years
                </div>
              )}
            </div>
            <div className="relative mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData.slice(0, 50)}>
                  <defs>
                    <pattern id="tileStripePattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#991b1b" strokeWidth="3" />
                    </pattern>
                  </defs>
                  {extinctionYear && !result.canRecover && (
                    <ReferenceArea 
                      x1={extinctionYear} 
                      x2={projectionData.slice(0, 50)[projectionData.slice(0, 50).length - 1]?.year}
                      fill="url(#tileStripePattern)"
                      fillOpacity={0.5}
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="population" 
                    stroke={result.canRecover ? "#10b981" : "#f43f5e"}
                    strokeWidth={2}
                    fill={result.canRecover ? "#10b98120" : "#f43f5e20"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PanelTile>

          {/* Threats */}
          <PanelTile onClick={() => setActivePanel("threats")} color="rose" delay={0.25}>
            <AlertTriangle className="mb-2 h-5 w-5 text-rose-400" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Threats</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-300">{narrative.risks.slice(0, 80)}...</p>
          </PanelTile>

          {/* Climate Impact */}
          <PanelTile onClick={() => setActivePanel("climate")} color="blue" delay={0.3}>
            <Thermometer className="mb-2 h-5 w-5 text-blue-400" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Climate Impact</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-300">{narrative.climateImpact.slice(0, 80)}...</p>
          </PanelTile>

          {/* Conservation Actions */}
          <PanelTile onClick={() => setActivePanel("actions")} color="emerald" delay={0.35}>
            <Shield className="mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Conservation</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-300">{narrative.actions.slice(0, 80)}...</p>
          </PanelTile>
        </div>
      </main>

      {/* EAI Scale Legend - Bottom Bar */}
      <footer className="flex-shrink-0 border-t border-slate-800 bg-slate-900/80 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center justify-center gap-6">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">EAI Scale:</span>
          <div className="flex gap-1 text-center text-xs font-bold">
            <div className="rounded-l-md bg-emerald-500/20 px-3 py-1 text-emerald-400">
              &lt;250 Safe
            </div>
            <div className="bg-yellow-500/20 px-3 py-1 text-yellow-400">
              250-500 Unstable
            </div>
            <div className="bg-amber-500/20 px-3 py-1 text-amber-400">
              500-750 Endangered
            </div>
            <div className="rounded-r-md bg-rose-500/20 px-3 py-1 text-rose-400">
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
            <div className={`mx-auto mb-4 font-mono text-9xl font-black ${getScoreColor()} ${getScoreGlow()}`}>
              {result.score}
            </div>
            <p className="text-2xl font-bold">{result.tippingPointLabel}</p>
            <p className="mt-2 text-slate-400">{result.verdict}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold">Understanding Your Score</h3>
            <p className="text-slate-300 leading-relaxed">
              The EAI score ranges from 0 to 1000 and measures how endangered a species is based on whether 
              reproduction can outpace the current decline rate. A score above 500 indicates that the population 
              is declining faster than it can reproduce, putting the species at serious risk.
                </p>
              </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={`rounded-xl p-4 ${result.score < 250 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <p className="text-2xl font-bold">&lt;250</p>
              <p className="text-sm">Safe</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 250 && result.score < 500 ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <p className="text-2xl font-bold">250-500</p>
              <p className="text-sm">Unstable</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 500 && result.score < 750 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <p className="text-2xl font-bold">500-750</p>
              <p className="text-sm">Endangered</p>
            </div>
            <div className={`rounded-xl p-4 ${result.score >= 750 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
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
            <div className="rounded-2xl bg-slate-800/50 p-6 text-center">
              <p className="text-sm text-slate-400">Total Population</p>
              <p className="mt-2 font-mono text-4xl font-bold text-cyan-400">{inputs.population.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 p-6 text-center">
              <p className="text-sm text-slate-400">Breeding Females</p>
              <p className="mt-2 font-mono text-4xl font-bold text-rose-400">{inputs.femalePopulation.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 p-6 text-center">
              <p className="text-sm text-slate-400">Offspring/Female (Lifetime)</p>
              <p className="mt-2 font-mono text-4xl font-bold text-violet-400">{result.lifetimeBabiesPerFemale}</p>
            </div>
              </div>
              
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-800/50 p-6">
              <p className="text-sm text-slate-400">Annual Birth Rate</p>
              <p className="mt-2 font-mono text-3xl font-bold text-emerald-400">{result.annualBirthRate}%</p>
              <p className="mt-1 text-sm text-slate-500">of total population per year</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 p-6">
              <p className="text-sm text-slate-400">Annual Decline Rate</p>
              <p className="mt-2 font-mono text-3xl font-bold text-rose-400">{result.annualDeclineRate}%</p>
              <p className="mt-1 text-sm text-slate-500">of total population per year</p>
            </div>
              </div>

          <div className="rounded-2xl bg-slate-800/50 p-6">
            <p className="text-slate-300">
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
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-4 md:mt-0">
              <div className="flex items-center gap-4">
                <div className="h-4 w-4 rounded-full bg-rose-500" />
                <div>
                  <p className="text-lg font-bold text-rose-400">{inputs.femalePopulation.toLocaleString()} Females</p>
                  <p className="text-sm text-slate-400">{Math.round((inputs.femalePopulation / inputs.population) * 100)}% of population</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-4 rounded-full bg-blue-500" />
                <div>
                  <p className="text-lg font-bold text-blue-400">{(inputs.population - inputs.femalePopulation).toLocaleString()} Males</p>
                  <p className="text-sm text-slate-400">{Math.round(((inputs.population - inputs.femalePopulation) / inputs.population) * 100)}% of population</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/50 p-6">
            <p className="text-slate-300">
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8' }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4">
              <p className="font-bold text-cyan-400">Population Risk</p>
              <p className="mt-1 text-sm text-slate-300">Lower populations face higher extinction risk due to reduced genetic diversity.</p>
            </div>
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
              <p className="font-bold text-violet-400">Breeding Pressure</p>
              <p className="mt-1 text-sm text-slate-300">Low birth rates compound decline issues and reduce recovery potential.</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
              <p className="font-bold text-rose-400">Decline Rate</p>
              <p className="mt-1 text-sm text-slate-300">Current annual decline of {result.annualDeclineRate}% is {result.annualDeclineRate > 5 ? 'severe' : 'concerning'}.</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="font-bold text-amber-400">External Threats</p>
              <p className="mt-1 text-sm text-slate-300">Habitat loss, poaching, and human encroachment add additional pressure.</p>
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
            <div className="rounded-2xl bg-rose-500/20 border border-rose-500/30 p-6 text-center">
              <p className="text-sm text-rose-300">Estimated Functional Extinction</p>
              <p className="mt-2 font-mono text-5xl font-black text-rose-400">{extinctionYear}</p>
              <p className="mt-2 text-rose-300">Approximately {yearsToExtinction} years from now</p>
            </div>
          )}
          
          {result.canRecover && (
            <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-6 text-center">
              <p className="text-sm text-emerald-300">Population Trend</p>
              <p className="mt-2 font-mono text-5xl font-black text-emerald-400">Growing ↑</p>
              <p className="mt-2 text-emerald-300">Birth rate exceeds decline rate</p>
            </div>
          )}

          <div className="relative h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="projGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={result.canRecover ? "#10b981" : "#f43f5e"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={result.canRecover ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                  </linearGradient>
                  <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#991b1b" strokeWidth="4" />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                />
                <Tooltip 
                  cursor={{ stroke: '#94a3b8', strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Population']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                {extinctionYear && !result.canRecover && (
                  <ReferenceArea 
                    x1={extinctionYear} 
                    x2={projectionData[projectionData.length - 1]?.year}
                    fill="url(#stripePattern)"
                    fillOpacity={0.6}
                  />
                )}
                {extinctionYear && (
                  <ReferenceLine 
                    x={extinctionYear} 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  >
                    <Label value="TIPPING POINT" position="top" fill="#fca5a5" fontSize={11} fontWeight="bold" />
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
              <div className="pointer-events-none absolute bottom-8 right-0 top-0 flex items-center justify-center select-none" style={{ width: '22%' }}>
                <span 
                  className="whitespace-nowrap font-black uppercase text-red-500/60"
                  style={{ 
                    transform: 'rotate(-65deg)',
                    fontSize: 'clamp(1rem, 4vw, 2rem)',
                    letterSpacing: '0.4em'
                  }}
                >
                  EXTINCT
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-800/50 p-6">
            <p className="text-slate-300 leading-relaxed">
              {result.canRecover 
                ? `Based on the current birth rate of ${result.annualBirthRate}% and decline rate of ${result.annualDeclineRate}%, the ${species.name} population is projected to grow over time. Continued conservation efforts can help maintain this positive trajectory.`
                : `At the current trajectory with ${result.annualDeclineRate}% annual decline and only ${result.annualBirthRate}% birth rate, the ${species.name} population will fall below sustainable levels (~100 individuals) by approximately ${extinctionYear}. Urgent intervention is needed.`
              }
            </p>
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
          <div className="flex items-center gap-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 p-6">
            <AlertTriangle className="h-12 w-12 text-rose-400 flex-shrink-0" />
            <p className="text-lg text-rose-100">{narrative.risks}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold">Common Threat Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-300">Habitat destruction and fragmentation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-300">Poaching and illegal wildlife trade</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-300">Human-wildlife conflict</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-300">Disease and invasive species</span>
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
          <div className="flex items-center gap-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 p-6">
            <Thermometer className="h-12 w-12 text-blue-400 flex-shrink-0" />
            <p className="text-lg text-blue-100">{narrative.climateImpact}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold">How Climate Change Affects Wildlife</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-blue-500/10 p-4">
                <p className="font-bold text-blue-400">Habitat Shifts</p>
                <p className="mt-1 text-sm text-slate-300">Changing temperatures force species to migrate to new areas.</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-4">
                <p className="font-bold text-blue-400">Food Scarcity</p>
                <p className="mt-1 text-sm text-slate-300">Altered ecosystems disrupt food chains and availability.</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-4">
                <p className="font-bold text-blue-400">Breeding Disruption</p>
                <p className="mt-1 text-sm text-slate-300">Changed seasons affect mating and nesting patterns.</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-4">
                <p className="font-bold text-blue-400">Extreme Events</p>
                <p className="mt-1 text-sm text-slate-300">More frequent storms and droughts threaten survival.</p>
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
          <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-6">
            <Heart className="h-12 w-12 text-emerald-400 flex-shrink-0" />
            <p className="text-lg text-emerald-100">{narrative.actions}</p>
          </div>
          
          <div className="rounded-2xl bg-slate-800/50 p-6">
            <h3 className="mb-4 text-lg font-bold">Conservation Strategies</h3>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl bg-emerald-500/10 p-4">
                <Shield className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-400">Protected Areas</p>
                  <p className="text-sm text-slate-300">Establishing and expanding protected habitats and wildlife corridors.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-emerald-500/10 p-4">
                <Users className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-400">Community Engagement</p>
                  <p className="text-sm text-slate-300">Working with local communities to balance human needs with conservation.</p>
                </div>
             </div>
              <div className="flex gap-4 rounded-xl bg-emerald-500/10 p-4">
                <Activity className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-400">Population Monitoring</p>
                  <p className="text-sm text-slate-300">Tracking populations to guide conservation efforts and measure success.</p>
             </div>
             </div>
             </div>
          </div>
        </div>
      </PanelModal>
    </div>
  );
};
