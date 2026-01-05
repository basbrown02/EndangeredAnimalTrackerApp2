import { notFound, redirect } from "next/navigation";

import { getSpeciesBySlug } from "@/data/species";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectWizard } from "@/components/project/project-wizard";
import { ProjectDashboardWrapper } from "@/components/project/project-dashboard-wrapper";
import { getProjectBySpecies } from "@/server-actions/project-submissions";
import { calculateEai } from "@/lib/calculations/eai";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ new?: string }>;
};

export default async function ProjectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { new: isNew } = await searchParams;
  const species = getSpeciesBySlug(slug);

  if (!species) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const metadata = user.user_metadata as { student_name?: string | null };

  // Check for existing project (unless explicitly starting new)
  const existingProject = isNew !== "true" ? await getProjectBySpecies(slug) : null;

  // If there's an existing project, show the dashboard
  if (existingProject) {
    const mathInputs = existingProject.math_inputs;
    const result = calculateEai(mathInputs);
    
    return (
      <ProjectDashboardWrapper
        species={species}
        result={result}
        inputs={mathInputs}
        narrative={{
          risks: existingProject.narrative_inputs?.risks || "",
          climateImpact: existingProject.narrative_inputs?.climateImpact || "",
          actions: existingProject.narrative_inputs?.actions || "",
          scratchpadNotes: existingProject.narrative_inputs?.scratchpadNotes || "",
        }}
        studentName={existingProject.student_name || metadata?.student_name || user.email}
      />
    );
  }

  // No existing project, show the wizard
  return (
    <ProjectWizard
      species={species}
      defaultStudentName={metadata?.student_name ?? user.email}
    />
  );
}

