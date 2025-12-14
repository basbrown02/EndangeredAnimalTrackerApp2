"use client";

import { motion } from "framer-motion";
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
  Tooltip
} from "recharts";
import { Download, RotateCcw, AlertTriangle, Heart } from "lucide-react";

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

export const ProjectDashboard = ({
  species,
  result,
  inputs,
  narrative,
  studentName,
  onReset,
}: Props) => {
  // Data for Pie Chart
  const genderData = [
    { name: "Female", value: inputs.femalePopulation },
    { name: "Male", value: inputs.population - inputs.femalePopulation },
  ];
  const GENDER_COLORS = ["#e11d48", "#3b82f6"]; // Rose for female, Blue for male

  // Data for Bar Chart - Simulated breakdown for visualization
  // In a real app, these would come from the calculation breakdown
  const breakdownData = [
    { name: "Population", value: Math.max(20, 300 - (inputs.population / 100)) }, // Less pop = higher risk
    { name: "Breeding", value: Math.max(20, 300 - (result.annualBirthRate * 20)) }, // Low birth rate = high risk
    { name: "Decline", value: result.annualDeclineRate * 50 }, // High decline = high risk
    { name: "Threats", value: 150 }, // Fixed baseline for risks
    { name: "Climate", value: 100 }, // Fixed baseline for climate
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold">Your Project Results</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.print()}
              variant="secondary" 
              className="gap-2 bg-white/20 text-white hover:bg-white/30 border-none"
            >
              <Download className="h-4 w-4" /> Print/Save PDF
            </Button>
            <Button 
              onClick={onReset}
              variant="secondary"
              className="gap-2 bg-white text-purple-600 hover:bg-purple-50"
            >
              <RotateCcw className="h-4 w-4" /> New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-8">
        {/* Project Title */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {species.name} Conservation Project
          </h2>
          <p className="text-slate-500">By {studentName || "Eco Detective"}</p>
        </div>

        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-1 shadow-xl"
        >
          <div className="rounded-[22px] bg-gradient-to-br from-orange-400 to-rose-500 p-8 text-center text-white">
            <div className="mb-6 flex justify-center gap-4">
              <span className="text-6xl drop-shadow-md">{species.emoji}</span>
              {result.score > 500 && (
                <div className="flex items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-sm">
                  <AlertTriangle className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            <p className="mb-2 text-lg font-medium opacity-90">Extinction Alert Index (EAI) Score</p>
            <div className="font-display text-9xl font-black tracking-tight drop-shadow-xl">
              {result.score}
            </div>
            <p className="mt-2 text-3xl font-bold opacity-90">{result.tippingPointLabel}</p>

            {result.score > 500 && (
              <div className="mt-8 rounded-xl bg-black/20 p-4 text-center backdrop-blur-md">
                <p className="flex items-center justify-center gap-2 font-semibold text-white">
                  <AlertTriangle className="h-5 w-5" />
                  This species is approaching a tipping point and needs urgent help!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Data Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Population Data */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-700">
              <div className="h-1 w-4 rounded-full bg-purple-500" />
              Population Data
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Population</p>
                <p className="text-3xl font-bold text-slate-800">{inputs.population.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500">Breeding Females</p>
                <p className="text-3xl font-bold text-slate-800">{inputs.femalePopulation.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Offspring per Female (Lifetime)</p>
                <p className="text-3xl font-bold text-slate-800">{result.lifetimeBabiesPerFemale}</p>
              </div>
            </div>
          </motion.div>

          {/* Gender Distribution */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h3 className="mb-2 text-lg font-bold text-slate-700">Gender Distribution</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-600" />
                <span className="text-sm font-medium text-slate-600">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-slate-600">Male</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Score Breakdown Chart */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h3 className="mb-6 text-lg font-bold text-slate-700">Score Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Narrative Sections */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border-l-4 border-orange-400 bg-orange-50 p-6"
          >
            <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Threats to {species.name}
            </h3>
            <p className="text-orange-800">{narrative.risks}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border-l-4 border-blue-400 bg-blue-50 p-6"
          >
            <h3 className="mb-2 text-lg font-bold text-blue-900">Climate Change Impact</h3>
            <p className="text-blue-800">{narrative.climateImpact}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border-l-4 border-emerald-400 bg-emerald-50 p-6"
          >
            <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-emerald-900">
              <Heart className="h-5 w-5" />
              How We Can Help
            </h3>
            <p className="text-emerald-800">{narrative.actions}</p>
          </motion.div>
        </div>

        {/* Understanding EAI */}
        <div className="rounded-3xl bg-slate-900 p-8 text-white">
          <h3 className="mb-4 text-2xl font-bold">Understanding the EAI Score</h3>
          <p className="text-slate-300 leading-relaxed">
            The <strong>Extinction Alert Index (EAI)</strong> is a score from 1 to 1000 that helps us understand how at risk a species is. 
            Your {species.name} scored <strong>{result.score}</strong>, which means they are <strong>{result.tippingPointLabel}</strong>.
            Scores above 500 indicate that the population is declining faster than it can reproduce.
          </p>
          
          <div className="mt-8 grid grid-cols-4 gap-2 text-center text-xs font-bold sm:text-sm">
             <div className="rounded-l-xl bg-emerald-500 p-2 text-emerald-900">
               &lt;250<br/>Safe
             </div>
             <div className="bg-yellow-400 p-2 text-yellow-900">
               250-500<br/>Unstable
             </div>
             <div className="bg-orange-500 p-2 text-orange-900">
               500-750<br/>Endangered
             </div>
             <div className="rounded-r-xl bg-rose-600 p-2 text-white">
               750+<br/>Critical
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};



