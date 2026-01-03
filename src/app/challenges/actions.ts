"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function requireId(value: FormDataEntryValue | null): string {
  if (!value) {
    throw new Error("Missing id");
  }
  if (typeof value !== "string") {
    throw new Error("Invalid id");
  }
  return value;
}

export async function createChallenge(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const challengedId = requireId(formData.get("challenged_id"));

  if (challengedId === user.id) {
    redirect("/?error=You cannot challenge yourself");
  }

  // Validate that both players are in the same hall
  const { data: playersData } = await supabase
    .from("players")
    .select("hall_id")
    .in("id", [user.id, challengedId]);

  if (!playersData || playersData.length !== 2) {
    redirect("/?error=Could not verify players");
  }

  const [player1, player2] = playersData;
  if (player1.hall_id !== player2.hall_id) {
    redirect("/?error=You can only challenge players from your hall");
  }

  const { error } = await (supabase as any).from("challenges").insert({
    challenger_id: user.id,
    challenged_id: challengedId,
    status: "pending",
  });

  if (error) {
    console.error("Create challenge error:", error);
    redirect("/?error=Could not create challenge");
  }

  revalidatePath("/", "layout");
  revalidatePath("/challenges");
  redirect("/challenges?message=Challenge sent");
}

export async function acceptChallenge(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const challengeId = requireId(formData.get("challenge_id"));

  const { error } = await (supabase as any)
    .from("challenges")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", challengeId);

  if (error) {
    console.error("Accept challenge error:", error);
    redirect("/challenges?error=Could not accept challenge");
  }

  revalidatePath("/challenges");
  redirect("/challenges?message=Challenge accepted");
}

export async function declineChallenge(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const challengeId = requireId(formData.get("challenge_id"));

  const { error } = await (supabase as any)
    .from("challenges")
    .update({ status: "declined", updated_at: new Date().toISOString() })
    .eq("id", challengeId);

  if (error) {
    console.error("Decline challenge error:", error);
    redirect("/challenges?error=Could not decline challenge");
  }

  revalidatePath("/challenges");
  redirect("/challenges?message=Challenge declined");
}

export async function cancelChallenge(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const challengeId = requireId(formData.get("challenge_id"));

  const { error } = await (supabase as any)
    .from("challenges")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", challengeId);

  if (error) {
    console.error("Cancel challenge error:", error);
    redirect("/challenges?error=Could not cancel challenge");
  }

  revalidatePath("/challenges");
  redirect("/challenges?message=Challenge cancelled");
}

export async function completeChallenge(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const challengeId = requireId(formData.get("challenge_id"));

  const { error } = await (supabase as any)
    .from("challenges")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", challengeId);

  if (error) {
    console.error("Complete challenge error:", error);
    redirect("/challenges?error=Could not complete challenge");
  }

  revalidatePath("/challenges");
  redirect("/challenges?message=Challenge marked as completed");
}
