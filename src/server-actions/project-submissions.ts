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

