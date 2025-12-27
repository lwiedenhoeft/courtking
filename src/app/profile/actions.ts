"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const username = (formData.get("username") as string | null)?.trim();
  const avatarUrl = (formData.get("avatar_url") as string | null)?.trim();

  if (!username) {
    redirect("/profile?error=Username is required");
  }

  const { error } = await (supabase as any)
    .from("players")
    .upsert(
      {
        id: user.id,
        username,
        avatar_url: avatarUrl || null,
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("Profile upsert error:", error);
    redirect("/profile?error=Could not save profile");
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  redirect("/profile?message=Saved");
}
