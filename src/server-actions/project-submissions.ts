"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MathInputs } from "@/lib/calculations/eai";

type NarrativeInputs = {
  risks: string;
  climateImpact: string;
  actions: string;
};

export type ProjectSubmissionPayload = {
  speciesSlug: string;
  mathInputs: MathInputs;
  narrativeInputs: NarrativeInputs;
  score: number;
  tippingPointLabel: string;
  studentName?: string | null;
  className?: string | null;
};

export async function createProjectSubmission(
  payload: ProjectSubmissionPayload,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    throw new Error("Please sign in to save your project.");
  }

  const metadata = user.user_metadata as {
    student_name?: string;
    class_name?: string;
  };

  const { error } = await supabase.from("project_submissions").insert({
    user_id: user.id,
    student_name: payload.studentName ?? metadata?.student_name ?? null,
    class_name: payload.className ?? metadata?.class_name ?? null,
    species_slug: payload.speciesSlug,
    math_inputs: payload.mathInputs,
    narrative_inputs: payload.narrativeInputs,
    score: payload.score,
    tipping_point_label: payload.tippingPointLabel,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export type ProjectSubmission = {
  id: string;
  created_at: string;
  species_slug: string;
  score: number;
  tipping_point_label: string;
  student_name: string | null;
  narrative_inputs: {
    risks?: string;
    climateImpact?: string;
    actions?: string;
    scratchpadNotes?: string;
  };
};

export type FullProjectSubmission = ProjectSubmission & {
  math_inputs: {
    population: number;
    femalePopulation: number;
    birthsPerCycle: number;
    birthCycleYears: number;
    lifespan: number;
    ageAtFirstBirth: number;
    declineRate: number;
  };
};

export async function getProjectBySpecies(speciesSlug: string): Promise<FullProjectSubmission | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("user_id", user.id)
    .eq("species_slug", speciesSlug)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as FullProjectSubmission;
}

export async function getUserProjects(): Promise<ProjectSubmission[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_submissions")
    .select("id, created_at, species_slug, score, tipping_point_label, student_name, narrative_inputs")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data as ProjectSubmission[];
}

export async function updateProjectNotes(
  speciesSlug: string,
  notes: string,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    throw new Error("Please sign in to save your notes.");
  }

  // Get the most recent project for this species
  const { data: existingProject } = await supabase
    .from("project_submissions")
    .select("id, narrative_inputs")
    .eq("user_id", user.id)
    .eq("species_slug", speciesSlug)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!existingProject) {
    throw new Error("Project not found.");
  }

  // Update the narrative_inputs with the notes
  const updatedNarrativeInputs = {
    ...(existingProject.narrative_inputs as Record<string, unknown>),
    scratchpadNotes: notes,
  };

  const { error } = await supabase
    .from("project_submissions")
    .update({ narrative_inputs: updatedNarrativeInputs })
    .eq("id", existingProject.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

