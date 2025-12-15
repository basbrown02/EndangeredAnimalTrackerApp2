"use client";

import { useRouter } from "next/navigation";
import { ProjectDashboard } from "./project-dashboard";
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
};

export const ProjectDashboardWrapper = (props: Props) => {
  const router = useRouter();

  const handleReset = () => {
    // Navigate to the same species but with ?new=true to start fresh
    router.push(`/project/${props.species.slug}?new=true`);
  };

  return <ProjectDashboard {...props} onReset={handleReset} />;
};

