import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AnimalSelection } from "@/components/animal-selection/animal-selection";

export default async function SelectAnimalPage() {
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

  return <AnimalSelection />;
}



