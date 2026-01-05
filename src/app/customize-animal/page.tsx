import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CustomizeAnimalPage } from "@/components/animal-selection/customize-animal-page";

export default async function CustomizeAnimalRoute() {
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

  return <CustomizeAnimalPage />;
}



