"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, ChevronRight, Mic, Clock, Edit3 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Species } from "@/data/species";
import { calculateEai, MathInputs, EaiResult } from "@/lib/calculations/eai";
import { createProjectSubmission } from "@/server-actions/project-submissions";

import { ProjectDashboard } from "./project-dashboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
          <div className="flex items-center justify-between border-b border-black p-6">
            <div className="flex items-center gap-3">
              <Edit3 className="h-6 w-6 text-black" />
              <h2 className="font-['Fuzzy_Bubbles',sans-serif] text-2xl font-normal text-black">My Thinkpad</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-12 w-12 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 p-8 bg-white">
            <textarea
              className="h-full w-full resize-none rounded-[30px] border border-black bg-white p-6 font-['Fuzzy_Bubbles',sans-serif] text-lg leading-relaxed outline-none focus:border-black placeholder:text-gray-400"
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
    <div className="flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 text-black border border-black">
      <Clock className="h-5 w-5 text-black" />
      <span className="font-['Fuzzy_Bubbles',sans-serif] text-base font-normal text-black">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = Math.min(100, (current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 w-96 overflow-hidden rounded-[30px] bg-[#d9d9d9]">
        <motion.div
          className="h-full bg-[#b9f0c7] rounded-[30px]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const VoiceAgent = ({ speciesName, characterImage }: { speciesName: string; characterImage?: string }) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-2 z-50">
      <div className="relative group cursor-pointer">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full overflow-hidden bg-white">
          {characterImage ? (
            <Image 
              src={characterImage} 
              alt={speciesName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span className="text-4xl" role="img" aria-label={speciesName}>
              🦁
            </span>
          )}
          <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#0e172a]">
            <Mic className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      <p className="font-['Fuzzy_Bubbles',sans-serif] text-[20px] leading-[48px] text-black text-center">
        Speak to {speciesName}
      </p>
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
  const router = useRouter();
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
      studentName: "",
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
    <div className="fixed inset-0 overflow-hidden bg-white text-black">{/* No animated background - clean white */}

      {/* Top Bar */}
      <header className="absolute left-0 right-0 top-0 z-40 flex w-full items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          {currentStep === 0 ? (
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-full bg-[#f8f8f8] hover:bg-gray-200 border border-black transition-colors px-4 py-2.5"
            >
              <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-['Fuzzy_Bubbles',sans-serif] text-[15px] text-black">
                Back to species list
              </span>
            </button>
          ) : (
            <button 
              onClick={handleBack}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f8f8] hover:bg-gray-200 border border-black transition-colors"
            >
              <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <p className="font-['Fuzzy_Bubbles',sans-serif] text-[15px] text-black text-center">
              Step {currentStep + 1} out of {STEPS.length}
            </p>
          </div>
        </div>

        <Timer />
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24 overflow-y-auto">
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
                <div className="space-y-8 text-center">
                  <div className="space-y-4">
                    <h2 className="font-['Fuzzy_Bubbles',sans-serif] text-[48px] leading-[48px] font-normal text-black">
                      Welcome, Eco Detective!
                    </h2>
                    <p className="font-['Fuzzy_Bubbles',sans-serif] text-[24px] leading-[48px] font-normal text-black">
                      You are researching the {species.name}!
                    </p>
                  </div>
                  
                  <div className="mx-auto max-w-md space-y-6 pt-4">
                    <div className="w-full rounded-[30px] bg-white border border-black px-6 py-4">
                      <Input
                        id="studentName"
                        placeholder="Enter your name"
                        className="h-12 rounded-[30px] text-[20px] border-0 bg-transparent font-['Fuzzy_Bubbles',sans-serif] text-black placeholder:text-[#a6a6a6] focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...register("studentName")}
                      />
                    </div>
                    
                    <div className="w-full rounded-[30px] bg-white border border-black px-6 py-4">
                      <Select
                        value={watch("className") || ""}
                        onValueChange={(value) => setValue("className", value, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-12 w-full rounded-[30px] text-[20px] border-0 bg-transparent font-['Fuzzy_Bubbles',sans-serif] text-black shadow-none focus:ring-0 [&>svg]:h-5 [&>svg]:w-5">
                          <SelectValue placeholder="Which Class are you in?" className="text-black placeholder:text-black" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[20px] border-black">
                          <SelectItem value="6B Ms Waters Class" className="font-['Fuzzy_Bubbles',sans-serif] text-[16px]">
                            6B Ms Waters Class
                          </SelectItem>
                          <SelectItem value="6H Mr Jacobs Class" className="font-['Fuzzy_Bubbles',sans-serif] text-[16px]">
                            6H Mr Jacobs Class
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Total Population
                  </h2>
                  <p className="mb-8 font-['Fuzzy_Bubbles',sans-serif] text-[20px] text-black">
                    How many {species.name}s are left in the wild?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-[30px] border border-black text-center text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black focus:border-black focus-visible:ring-0"
                      {...register("population", { valueAsNumber: true })}
                    />
                    {errors.population && (
                      <p className="mt-2 font-['Fuzzy_Bubbles',sans-serif] text-rose-500">{errors.population.message}</p>
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Female Population
                  </h2>
                  <p className="mb-8 font-['Fuzzy_Bubbles',sans-serif] text-[20px] text-black">
                    How many of those are females?
                  </p>
                  <div className="mx-auto max-w-xs space-y-4">
                    <Input
                      type="number"
                      className="h-20 rounded-[30px] border border-black text-center text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black focus:border-black focus-visible:ring-0"
                      {...register("femalePopulation", { valueAsNumber: true })}
                    />
                     <div className="rounded-[20px] bg-[#f8f8f8] border border-black p-3 font-['Fuzzy_Bubbles',sans-serif] text-sm text-black">
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Babies & Frequency
                  </h2>
                  
                  <div className="mx-auto mt-8 max-w-lg space-y-8 text-left">
                    <div className="space-y-2">
                       <Label className="font-['Fuzzy_Bubbles',sans-serif] text-[18px]">How many babies per birth?</Label>
                       <Input
                        type="number"
                         step="0.1"
                        className="h-14 rounded-[30px] border border-black font-['Fuzzy_Bubbles',sans-serif] text-lg focus:border-black focus-visible:ring-0"
                        {...register("birthsPerCycle", { valueAsNumber: true })}
                      />
                       {errors.birthsPerCycle && (
                        <p className="text-sm text-rose-500 font-['Fuzzy_Bubbles',sans-serif]">{errors.birthsPerCycle.message}</p>
                      )}
                    </div>

                     <div className="space-y-2">
                       <Label className="font-['Fuzzy_Bubbles',sans-serif] text-[18px]">How often do they give birth?</Label>
                       <div className="grid grid-cols-2 gap-2">
                         {BIRTH_FREQUENCY_OPTIONS.map((opt) => (
                           <button
                             key={opt.value}
                             type="button"
                             onClick={() => setValue("birthFrequency", opt.value, { shouldValidate: true, shouldDirty: true })}
                             className={`rounded-[20px] border px-4 py-3 font-['Fuzzy_Bubbles',sans-serif] text-sm transition-all ${
                               birthFrequency === opt.value
                                 ? "border-black bg-[#b9f0c7] text-black"
                                 : "border-black bg-white hover:bg-gray-50"
                             }`}
                           >
                             {opt.label}
                           </button>
                         ))}
                       </div>
                    </div>

                    {birthFrequency === "custom" && (
                        <div className="space-y-2">
                            <Label className="font-['Fuzzy_Bubbles',sans-serif]">Years between births</Label>
                             <Input
                                type="number"
                                step="0.5"
                                className="h-14 rounded-[30px] border border-black font-['Fuzzy_Bubbles',sans-serif] text-lg focus:border-black focus-visible:ring-0"
                                {...register("customBirthCycleYears", { valueAsNumber: true })}
                              />
                               {errors.customBirthCycleYears && (
                                <p className="text-sm text-rose-500 font-['Fuzzy_Bubbles',sans-serif]">{errors.customBirthCycleYears.message}</p>
                              )}
                        </div>
                    )}

                    <div className="rounded-[20px] bg-[#b9f0c7] border border-black p-4 text-center">
                        <p className="font-['Fuzzy_Bubbles',sans-serif] text-sm text-black">
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Lifespan
                  </h2>
                  <p className="mb-8 font-['Fuzzy_Bubbles',sans-serif] text-[20px] text-black">
                    How many years do they live in the wild?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-[30px] border border-black text-center text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black focus:border-black focus-visible:ring-0"
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Age at First Birth
                  </h2>
                  <p className="mb-8 font-['Fuzzy_Bubbles',sans-serif] text-[20px] text-black">
                    How old are they when they have their first baby?
                  </p>
                  <div className="mx-auto max-w-xs">
                    <Input
                      type="number"
                      className="h-20 rounded-[30px] border border-black text-center text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black focus:border-black focus-visible:ring-0"
                      {...register("ageAtFirstBirth", { valueAsNumber: true })}
                    />
                  </div>
                   <div className="mt-8 rounded-[20px] bg-[#f8f8f8] border border-black p-4">
                        <p className="font-['Fuzzy_Bubbles',sans-serif] text-black">
                            Calculated Reproductive Years: {reproductiveYears}
                        </p>
                         <p className="font-['Fuzzy_Bubbles',sans-serif] text-sm text-black">
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
                  <h2 className="mb-2 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Decline Rate
                  </h2>
                  <p className="mb-8 font-['Fuzzy_Bubbles',sans-serif] text-[20px] text-black">
                    What percentage is the population declining each year?
                  </p>
                  <div className="mx-auto flex max-w-xs items-center gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      className="h-20 rounded-[30px] border border-black text-center text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black focus:border-black focus-visible:ring-0"
                      {...register("declineRatePercent", { valueAsNumber: true })}
                    />
                    <span className="text-4xl font-['Fuzzy_Bubbles',sans-serif] text-black">%</span>
                  </div>
                </div>
              )}

              {/* Step 7: Story */}
              {currentStep === 7 && (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">Story Studio</h2>
                        <p className="font-['Fuzzy_Bubbles',sans-serif] text-[18px] text-black">Tell us the story behind the numbers</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-['Fuzzy_Bubbles',sans-serif] text-lg">What are the main risks?</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-[30px] border border-black font-['Fuzzy_Bubbles',sans-serif] text-lg focus:border-black focus-visible:ring-0" 
                                placeholder="Habitat loss, poaching..."
                                {...register("risks")}
                            />
                             {errors.risks && <p className="text-sm text-rose-500 font-['Fuzzy_Bubbles',sans-serif]">{errors.risks.message}</p>}
                        </div>
                        
                         <div className="space-y-2">
                            <Label className="font-['Fuzzy_Bubbles',sans-serif] text-lg">Climate Change Impact</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-[30px] border border-black font-['Fuzzy_Bubbles',sans-serif] text-lg focus:border-black focus-visible:ring-0" 
                                placeholder="Warming oceans, fires..."
                                {...register("climateImpact")}
                            />
                            {errors.climateImpact && <p className="text-sm text-rose-500 font-['Fuzzy_Bubbles',sans-serif]">{errors.climateImpact.message}</p>}
                        </div>

                         <div className="space-y-2">
                            <Label className="font-['Fuzzy_Bubbles',sans-serif] text-lg">Actions to help</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-[30px] border border-black font-['Fuzzy_Bubbles',sans-serif] text-lg focus:border-black focus-visible:ring-0" 
                                placeholder="Plant trees, reduce waste..."
                                {...register("actions")}
                            />
                            {errors.actions && <p className="text-sm text-rose-500 font-['Fuzzy_Bubbles',sans-serif]">{errors.actions.message}</p>}
                        </div>
                    </div>
                </div>
              )}

               {/* Step 8: Review & Submit */}
              {currentStep === 8 && (
                <div className="text-center">
                  <h2 className="mb-6 font-['Fuzzy_Bubbles',sans-serif] text-[36px] font-normal text-black">
                    Ready to see your score?
                  </h2>
                  
                  <div className="mb-8 grid gap-4 text-left">
                      <div className="rounded-[20px] bg-[#f8f8f8] border border-black p-4">
                          <p className="text-sm text-black font-['Fuzzy_Bubbles',sans-serif]">Population</p>
                          <p className="font-['Fuzzy_Bubbles',sans-serif] text-black">{population} total / {femalePopulation} female</p>
                      </div>
                       <div className="rounded-[20px] bg-[#f8f8f8] border border-black p-4">
                          <p className="text-sm text-black font-['Fuzzy_Bubbles',sans-serif]">Reproduction</p>
                          <p className="font-['Fuzzy_Bubbles',sans-serif] text-black">{babiesPerYearPerMum.toFixed(2)} babies/year</p>
                      </div>
                      <div className="rounded-[20px] bg-[#f8f8f8] border border-black p-4">
                          <p className="text-sm text-black font-['Fuzzy_Bubbles',sans-serif]">Decline</p>
                          <p className="font-['Fuzzy_Bubbles',sans-serif] text-black">{declineRatePercent}% per year</p>
                      </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-16 w-full rounded-[20px] bg-[#0e172a] font-['Fuzzy_Bubbles',sans-serif] text-xl font-normal text-white shadow-none hover:bg-[#1e293b] disabled:bg-gray-400"
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
                <div className="mt-16 flex justify-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="h-14 rounded-[20px] px-10 font-['Fuzzy_Bubbles',sans-serif] text-[18px] font-normal text-black hover:bg-gray-100 disabled:opacity-30 border border-black bg-[#f8f8f8] hover:text-black shadow-none"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="h-14 rounded-[20px] bg-[#0e172a] px-12 font-['Fuzzy_Bubbles',sans-serif] text-[18px] font-normal text-white hover:bg-[#1e293b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-none"
                    >
                        {canProceed ? (
                          <span className="flex items-center gap-2">
                            Next <ChevronRight className="h-5 w-5" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
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
      <footer className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 bg-white">
        <Button
          onClick={() => setIsThinkpadOpen(true)}
          className="h-14 rounded-[20px] bg-[#f8f8f8] px-6 font-['Fuzzy_Bubbles',sans-serif] text-[18px] font-normal text-black border border-black hover:bg-gray-100 transition-colors shadow-none"
        >
          <Edit3 className="mr-2 h-5 w-5 text-black" />
          Thinkpad
        </Button>

        <ProgressBar current={currentStep} total={STEPS.length - 1} />

        <div className="w-40" /> {/* Spacer for balance since Voice Agent is fixed absolute */}
      </footer>

      <VoiceAgent speciesName={species.name} characterImage={species.characterImage} />
      <Thinkpad isOpen={isThinkpadOpen} onClose={() => setIsThinkpadOpen(false)} />
    </div>
  );
};
