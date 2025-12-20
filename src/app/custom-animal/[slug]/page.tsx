import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CustomAnimalInfoPage } from "@/components/animal-selection/custom-animal-info-page";
import { getSpeciesBySlug } from "@/data/species";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CustomAnimalInfoRoute({ params }: Props) {
  const { slug } = await params;

  let user: any = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    console.error("Auth error:", error);
  }

  // Redirect to home if not authenticated
  if (!user) {
    redirect("/");
  }

  const species = getSpeciesBySlug(slug);

  if (!species) {
    redirect("/select-animal");
  }

  return <CustomAnimalInfoPage species={species} />;
}

