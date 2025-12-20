import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AchievementsContent } from "@/components/achievements/achievements-content";
import { getUserProjects } from "@/server-actions/project-submissions";

export default async function AchievementsPage() {
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

  const friendlyName =
    (user?.user_metadata as { student_name?: string; full_name?: string })
      ?.student_name ??
    (user?.user_metadata as { full_name?: string })?.full_name ??
    user?.email?.split("@")[0] ??
    "Explorer";

  // Fetch user's projects
  const projects = await getUserProjects();

  return (
    <AchievementsContent
      userName={friendlyName}
      userEmail={user.email}
      projects={projects}
    />
  );
}

