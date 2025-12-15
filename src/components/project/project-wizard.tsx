"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, ChevronRight, Mic, Clock, Edit3 } from "lucide-react";

import { Species } from "@/data/species";
import { calculateEai, MathInputs, EaiResult } from "@/lib/calculations/eai";
import { createProjectSubmission } from "@/server-actions/project-submissions";

import { ProjectDashboard } from "./project-dashboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// --- Types & Schema ---

const BIRTH_FREQUENCY_OPTIONS = [
  { value: "1", label: "Every year" },
  { value: "2", label: "Every 2 years" },
  { value: "3", label: "Every 3 years" },
  { value: "4", label: "Every 4 years" },
  { value: "custom", label: "Other" },
];

const formSchema = z.object({
  studentName: z.string().max(60).optional(),
  className: z.string().max(60).optional(),
  population: z.coerce.number().min(1, "Enter at least 1"),
  femalePopulation: z.coerce.number().min(1, "Enter at least 1"),
  birthsPerCycle: z.coerce.number().min(0.1, "Enter a positive number"),
  birthFrequency: z.string(),
  customBirthCycleYears: z.coerce.number().optional(),
  lifespan: z.coerce.number().min(1, "Enter at least 1 year"),
  ageAtFirstBirth: z.coerce.number().min(0, "Enter 0 or more"),
  declineRatePercent: z.coerce.number().min(0).max(100),
  risks: z.string().min(10, "Tell us at least one risk."),
  climateImpact: z.string().min(10, "Describe the climate threat."),
  actions: z.string().min(10, "Share at least one action."),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  species: Species;
  defaultStudentName?: string | null;
};

// --- Helper Components ---

const Thinkpad = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [notes, setNotes] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 flex flex-col bg-white"
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-bold text-slate-800">My Thinkpad</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 p-6">
            <textarea
              className="h-full w-full resize-none border-none text-xl leading-relaxed outline-none placeholder:text-slate-300"
              placeholder="Type your notes, ideas, and calculations here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Timer = ({ duration = 60, onComplete }: { duration?: number; onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-900/10 px-4 py-2 text-slate-900 backdrop-blur-sm">
      <Clock className="h-5 w-5" />
      <span className="font-mono text-lg font-bold">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = Math.min(100, (current / total) * 100);
  return (
    <div className="h-2 w-64 overflow-hidden rounded-full bg-slate-200">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

const VoiceAgent = ({ speciesName, emoji }: { speciesName: string; emoji: string }) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-2">
      <div className="mr-4 rounded-2xl rounded-br-none bg-white p-4 shadow-lg">
        <p className="text-sm font-medium text-slate-800">
          I'm {speciesName}! I'm here to help.
        </p>
      </div>
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-xl ring-4 ring-white">
        <span className="text-4xl" role="img" aria-label={speciesName}>
          {emoji}
        </span>
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
          <Mic className="h-4 w-4" />
        </div>
      </div>
      <p className="mr-2 text-sm font-bold text-slate-900 bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">{speciesName}</p>
    </div>
  );
};

// --- Main Wizard Component ---

const STEPS = [
  { id: "intro", title: "Welcome" },
  { id: "population", title: "Total Population" },
  { id: "femalePopulation", title: "Females" },
  { id: "births", title: "Births" },
  { id: "lifespan", title: "Lifespan" },
  { id: "firstBirth", title: "First Birth" },
  { id: "decline", title: "Decline Rate" },
  { id: "story", title: "The Story" },
  { id: "review", title: "Review" },
];

export const ProjectWizard = ({ species, defaultStudentName }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isThinkpadOpen, setIsThinkpadOpen] = useState(false);
  const [result, setResult] = useState<EaiResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    setCanProceed(false);
    const timer = setTimeout(() => {
      setCanProceed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const defaultBirthFreq = species.defaultInputs.birthCycleYears;
  const isStandardFreq = [1, 2, 3, 4].includes(defaultBirthFreq);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    mode: "onChange",
    defaultValues: {
      studentName: defaultStudentName ?? "",
      population: species.defaultInputs.population,
      femalePopulation: Math.round(
        species.defaultInputs.population * species.defaultInputs.femalePercentage
      ),
      birthsPerCycle: species.defaultInputs.birthsPerCycle,
      birthFrequency: isStandardFreq ? String(defaultBirthFreq) : "custom",
      customBirthCycleYears: isStandardFreq ? undefined : defaultBirthFreq,
      lifespan: species.defaultInputs.lifespan,
      ageAtFirstBirth: species.defaultInputs.ageAtFirstBirth,
      declineRatePercent: Math.abs(species.defaultInputs.declineRate * 100),
      risks: "",
      climateImpact: "",
      actions: "",
    },
  });

  const { register, handleSubmit: submit, formState, setValue, watch, trigger } = form;
  const { errors } = formState;

  const birthFrequency = watch("birthFrequency");
  const lifespan = watch("lifespan");
  const ageAtFirstBirth = watch("ageAtFirstBirth");
  const birthsPerCycle = watch("birthsPerCycle");
  const customBirthCycleYears = watch("customBirthCycleYears");
  const population = watch("population");
  const femalePopulation = watch("femalePopulation");
  const declineRatePercent = watch("declineRatePercent");

  // Calculations for display
  const birthCycleYears =
    birthFrequency === "custom"
      ? customBirthCycleYears || 1
      : Number(birthFrequency) || 1;
  const reproductiveYears = Math.max(lifespan - ageAtFirstBirth, 0);
  const babiesPerYearPerMum = birthsPerCycle / birthCycleYears;
  const lifetimeBabies = babiesPerYearPerMum * reproductiveYears;

  const handleNext = async () => {
    let isValid = false;
    
    // Validate current step fields
    switch (currentStep) {
      case 0: // Intro
        isValid = await trigger(["studentName", "className"]);
        break;
      case 1: // Population
        isValid = await trigger("population");
        break;
      case 2: // Female
        isValid = await trigger("femalePopulation");
        break;
      case 3: // Births
        {
            const fieldsToValidate: (keyof FormValues)[] = ["birthsPerCycle", "birthFrequency"];
            if (birthFrequency === "custom") {
                fieldsToValidate.push("customBirthCycleYears");
            }
            isValid = await trigger(fieldsToValidate);
        }
        break;
      case 4: // Lifespan
        isValid = await trigger("lifespan");
        break;
      case 5: // First Birth
        isValid = await trigger("ageAtFirstBirth");
        break;
      case 6: // Decline
        isValid = await trigger("declineRatePercent");
        break;
      case 7: // Story
        isValid = await trigger(["risks", "climateImpact", "actions"]);
        break;
      case 8: // Review
        isValid = true;
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Submit logic handled by form submit
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const actualBirthCycleYears =
      values.birthFrequency === "custom"
        ? values.customBirthCycleYears || 1
        : Number(values.birthFrequency);

    const mathInputs: MathInputs = {
      population: values.population,
      femalePopulation: values.femalePopulation,
      birthsPerCycle: values.birthsPerCycle,
      birthCycleYears: actualBirthCycleYears,
      lifespan: values.lifespan,
      ageAtFirstBirth: values.ageAtFirstBirth,
      declineRate: -values.declineRatePercent / 100,
    };

    const eaiResult = calculateEai(mathInputs);
    setStatusMessage("Saving your project...");

    // Save the project FIRST, then show the dashboard
    startTransition(async () => {
      try {
        await createProjectSubmission({
          speciesSlug: species.slug,
          mathInputs,
          narrativeInputs: {
            risks: values.risks,
            climateImpact: values.climateImpact,
            actions: values.actions,
          },
          score: eaiResult.score,
          tippingPointLabel: eaiResult.tippingPointLabel,
          studentName: values.studentName,
          className: values.className,
        });
        // Only show the dashboard AFTER the save completes successfully
        setResult(eaiResult);
        setStatusMessage("Saved!");
      } catch (error) {
        console.error("Save error:", error);
        // Show the result even if save fails, but with error message
        setResult(eaiResult);
        setStatusMessage("⚠️ Could not save project. Check your connection and try again.");
      }
    });
  };

  const currentStepData = STEPS[currentStep];

  // If we have a result, show the dashboard
  if (result) {
    const values = form.getValues();
    const actualBirthCycleYears =
      values.birthFrequency === "custom"
        ? values.customBirthCycleYears || 1
        : Number(values.birthFrequency);

    const mathInputs: MathInputs = {
      population: values.population,
      femalePopulation: values.femalePopulation,
      birthsPerCycle: values.birthsPerCycle,
      birthCycleYears: actualBirthCycleYears,
      lifespan: values.lifespan,
      ageAtFirstBirth: values.ageAtFirstBirth,
      declineRate: -values.declineRatePercent / 100,
    };

    return (
      <ProjectDashboard
        species={species}
        result={result}
        inputs={mathInputs}
        narrative={{
          risks: values.risks,
          climateImpact: values.climateImpact,
          actions: values.actions,
        }}
        studentName={values.studentName}
        onReset={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-sky-50 text-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-200 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-200 blur-3xl"
        />
      </div>

      {/* Top Bar */}
      <header className="absolute left-0 right-0 top-0 z-40 flex w-full items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm">
            {species.emoji}
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-slate-900">
              {species.name} Project
            </h1>
            <p className="text-xs font-medium text-slate-500">Step {currentStep + 1} of {STEPS.length}</p>
          </div>
        </div>

        <Timer />
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <form onSubmit={submit(handleSubmit)}>
              
              {/* Step 0: Intro */}
              {currentStep === 0 && (
                <div className="space-y-6 text-center">
                  <h2 className="font-display text-4xl font-bold text-slate-900">
                    Welcome, Eco Detective!
                  </h2>
                  <p className="text-xl text-slate-600">
                    Let's start by getting to know you.
                  </p>
                  <div className="mx-auto grid max-w-md gap-6 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="text-lg">What is your name?</Label>
                      <Input
                        id="studentName"
                        placeholder="e.g. Alex"
                        className="h-14 rounded-2xl text-lg"
                        {...register("studentName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="className" className="text-lg">Class name</Label>
                      <Input
                        id="className"
                        placeholder="e.g. 6B"
                        className="h-14 rounded-2xl text-lg"
                        {...register("className")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Population */}
              {currentStep === 1 && (
                <div className="text-center">
                  <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-yellow-800">
                    EA 1
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Total Population
                  </h2>
                  <p className="mb-8 text-lg text-slate-600">
                    How many {species.name}s are left in the wild?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-3xl border-4 border-slate-200 text-center text-4xl font-bold text-slate-900 focus:border-emerald-400"
                      {...register("population", { valueAsNumber: true })}
                    />
                    {errors.population && (
                      <p className="mt-2 text-rose-500">{errors.population.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Female Population */}
              {currentStep === 2 && (
                <div className="text-center">
                   <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-yellow-800">
                    EA 2
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Female Population
                  </h2>
                  <p className="mb-8 text-lg text-slate-600">
                    How many of those are females?
                  </p>
                  <div className="mx-auto max-w-xs space-y-4">
                    <Input
                      type="number"
                      className="h-20 rounded-3xl border-4 border-slate-200 text-center text-4xl font-bold text-slate-900 focus:border-emerald-400"
                      {...register("femalePopulation", { valueAsNumber: true })}
                    />
                     <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
                       Tip: Usually about half the population.
                     </div>
                  </div>
                </div>
              )}

               {/* Step 3: Births */}
              {currentStep === 3 && (
                <div className="text-center">
                   <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-yellow-800">
                    EA 3
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Babies & Frequency
                  </h2>
                  
                  <div className="mx-auto mt-8 max-w-lg space-y-8 text-left">
                    <div className="space-y-2">
                       <Label className="text-lg">How many babies per birth?</Label>
                       <Input
                        type="number"
                         step="0.1"
                        className="h-14 rounded-2xl text-lg"
                        {...register("birthsPerCycle", { valueAsNumber: true })}
                      />
                       {errors.birthsPerCycle && (
                        <p className="text-sm text-rose-500">{errors.birthsPerCycle.message}</p>
                      )}
                    </div>

                     <div className="space-y-2">
                       <Label className="text-lg">How often do they give birth?</Label>
                       <div className="grid grid-cols-2 gap-2">
                         {BIRTH_FREQUENCY_OPTIONS.map((opt) => (
                           <button
                             key={opt.value}
                             type="button"
                             onClick={() => setValue("birthFrequency", opt.value, { shouldValidate: true, shouldDirty: true })}
                             className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${
                               birthFrequency === opt.value
                                 ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                 : "border-slate-200 bg-white hover:border-slate-300"
                             }`}
                           >
                             {opt.label}
                           </button>
                         ))}
                       </div>
                    </div>

                    {birthFrequency === "custom" && (
                        <div className="space-y-2">
                            <Label>Years between births</Label>
                             <Input
                                type="number"
                                step="0.5"
                                className="h-14 rounded-2xl text-lg"
                                {...register("customBirthCycleYears", { valueAsNumber: true })}
                              />
                               {errors.customBirthCycleYears && (
                                <p className="text-sm text-rose-500">{errors.customBirthCycleYears.message}</p>
                              )}
                        </div>
                    )}

                    <div className="rounded-2xl bg-emerald-100 p-4 text-center">
                        <p className="text-sm font-semibold text-emerald-800">
                            Result: {babiesPerYearPerMum.toFixed(2)} babies per year (average)
                        </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Lifespan */}
              {currentStep === 4 && (
                <div className="text-center">
                   <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-yellow-800">
                    EA 4
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Lifespan
                  </h2>
                  <p className="mb-8 text-lg text-slate-600">
                    How many years do they live in the wild?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-3xl border-4 border-slate-200 text-center text-4xl font-bold text-slate-900 focus:border-emerald-400"
                      {...register("lifespan", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: First Birth */}
              {currentStep === 5 && (
                 <div className="text-center">
                   <div className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-yellow-800">
                    EA 5
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Age at First Birth
                  </h2>
                  <p className="mb-8 text-lg text-slate-600">
                    How old are they when they have their first baby?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-3xl border-4 border-slate-200 text-center text-4xl font-bold text-slate-900 focus:border-emerald-400"
                      {...register("ageAtFirstBirth", { valueAsNumber: true })}
                    />
                  </div>
                   <div className="mt-8 rounded-2xl bg-blue-50 p-4">
                        <p className="font-semibold text-blue-900">
                            Calculated Reproductive Years: {reproductiveYears}
                        </p>
                         <p className="text-sm text-blue-700">
                             Total Lifetime Babies: {lifetimeBabies.toFixed(1)}
                        </p>
                    </div>
                </div>
              )}

               {/* Step 6: Decline Rate */}
              {currentStep === 6 && (
                 <div className="text-center">
                   <div className="mb-4 inline-flex rounded-full bg-rose-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-rose-800">
                    EA 7
                  </div>
                  <h2 className="mb-2 font-display text-3xl font-bold text-slate-900">
                    Decline Rate
                  </h2>
                  <p className="mb-8 text-lg text-slate-600">
                    What percentage is the population declining each year?
                  </p>
                  <div className="mx-auto flex max-w-xs items-center gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      className="h-20 rounded-3xl border-4 border-slate-200 text-center text-4xl font-bold text-slate-900 focus:border-emerald-400"
                      {...register("declineRatePercent", { valueAsNumber: true })}
                    />
                    <span className="text-4xl font-bold text-slate-400">%</span>
                  </div>
                </div>
              )}

              {/* Step 7: Story */}
              {currentStep === 7 && (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="font-display text-3xl font-bold text-slate-900">Story Studio</h2>
                        <p className="text-slate-600">Tell us the story behind the numbers</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-lg font-semibold">What are the main risks?</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-2xl text-lg" 
                                placeholder="Habitat loss, poaching..."
                                {...register("risks")}
                            />
                             {errors.risks && <p className="text-sm text-rose-500">{errors.risks.message}</p>}
                        </div>
                        
                         <div className="space-y-2">
                            <Label className="text-lg font-semibold">Climate Change Impact</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-2xl text-lg" 
                                placeholder="Warming oceans, fires..."
                                {...register("climateImpact")}
                            />
                            {errors.climateImpact && <p className="text-sm text-rose-500">{errors.climateImpact.message}</p>}
                        </div>

                         <div className="space-y-2">
                            <Label className="text-lg font-semibold">Actions to help</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-2xl text-lg" 
                                placeholder="Plant trees, reduce waste..."
                                {...register("actions")}
                            />
                            {errors.actions && <p className="text-sm text-rose-500">{errors.actions.message}</p>}
                        </div>
                    </div>
                </div>
              )}

               {/* Step 8: Review & Submit */}
              {currentStep === 8 && (
                <div className="text-center">
                  <h2 className="mb-6 font-display text-3xl font-bold text-slate-900">
                    Ready to see your score?
                  </h2>
                  
                  <div className="mb-8 grid gap-4 text-left">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-sm text-slate-500">Population</p>
                          <p className="font-bold text-slate-900">{population} total / {femalePopulation} female</p>
                      </div>
                       <div className="rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-sm text-slate-500">Reproduction</p>
                          <p className="font-bold text-slate-900">{babiesPerYearPerMum.toFixed(2)} babies/year</p>
                      </div>
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                          <p className="text-sm text-slate-500">Decline</p>
                          <p className="font-bold text-slate-900">{declineRatePercent}% per year</p>
                      </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-16 w-full rounded-2xl bg-emerald-600 text-xl font-bold shadow-xl hover:bg-emerald-700 disabled:bg-emerald-400"
                    disabled={pending}
                  >
                    {pending ? (
                      <span className="flex items-center gap-3">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving your project...
                      </span>
                    ) : (
                      "Reveal EAI Score"
                    )}
                  </Button>
                </div>
              )}

            </form>

            {/* Navigation Buttons */}
            {currentStep < 8 && !result && (
                <div className="mt-12 flex justify-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="h-14 rounded-xl px-8 text-slate-500 hover:bg-white hover:text-slate-900"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="h-14 rounded-xl bg-slate-900 px-10 text-lg font-bold shadow-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                        {canProceed ? (
                          <>Next <ChevronRight className="ml-2" /></>
                        ) : (
                          <span className="flex items-center gap-2 text-slate-300">
                             <Clock className="h-4 w-4 animate-pulse" /> Wait...
                          </span>
                        )}
                    </Button>
                </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Results View - Removed as it is now handled by ProjectDashboard */}
      </main>

      {/* Bottom Bar Fixed */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6">
        <Button
          onClick={() => setIsThinkpadOpen(true)}
          className="h-14 rounded-2xl bg-white px-6 text-lg font-bold text-slate-900 shadow-lg hover:bg-slate-50"
        >
          <Edit3 className="mr-2 h-5 w-5" />
          Thinkpad
        </Button>

        <ProgressBar current={currentStep} total={STEPS.length - 1} />

        <div className="w-32" /> {/* Spacer for balance since Voice Agent is fixed absolute */}
      </footer>

      <VoiceAgent speciesName={species.name} emoji={species.emoji} />
      <Thinkpad isOpen={isThinkpadOpen} onClose={() => setIsThinkpadOpen(false)} />
    </div>
  );
};
