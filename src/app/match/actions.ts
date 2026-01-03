"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Glicko2 } from "glicko2.ts";

export async function submitMatch(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  // 1. Get current user (Reporter)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // For MVP, we assume the logged-in user is one of the players.
  // Ideally, we should have a link between auth.users and public.players.
  // Since we don't have that link yet (Task 2.1 was manual), let's assume
  // the user selects BOTH players for now, or we match by email if we added email to players.
  // To keep it simple and robust for this phase:
  // We will allow selecting BOTH Winner and Loser from the dropdowns.
  // Later we can restrict one of them to be the current user.

  const winnerId = formData.get("winner_id") as string;
  const loserId = formData.get("loser_id") as string;
  const score = formData.get("score") as string;
  const challengeId = (formData.get("challenge_id") as string | null) ?? null;

  if (!winnerId || !loserId || !score) {
    redirect("/match/new?error=All fields are required");
  }

  if (winnerId === loserId) {
    redirect("/match/new?error=Winner and Loser cannot be the same person");
  }

  if (challengeId) {
    const { data: challenge, error: challengeError } = await (supabase as any)
      .from("challenges")
      .select("id, challenger_id, challenged_id, status")
      .eq("id", challengeId)
      .maybeSingle();

    if (challengeError || !challenge) {
      redirect("/match/new?error=Challenge not found");
    }

    if (challenge.status !== "accepted") {
      redirect("/match/new?error=Challenge is not accepted");
    }

    const ids = [winnerId, loserId].sort();
    const participants = [challenge.challenger_id, challenge.challenged_id].sort();
    if (ids[0] !== participants[0] || ids[1] !== participants[1]) {
      redirect("/match/new?error=Match players do not match challenge participants");
    }
  }

  // 2. Fetch current ratings
  const { data: playersData, error: fetchError } = await supabase
    .from("players")
    .select("*")
    .in("id", [winnerId, loserId]);

  if (fetchError || !playersData || playersData.length !== 2) {
    redirect("/match/new?error=Could not fetch players");
  }

  const winner = (playersData as any[]).find((p) => p.id === winnerId)!;
  const loser = (playersData as any[]).find((p) => p.id === loserId)!;

  // Validate that both players are in the same hall
  if (winner.hall_id !== loser.hall_id) {
    redirect("/match/new?error=Players must be from the same hall");
  }

  const hallId = winner.hall_id;

  // 3. Calculate Glicko-2
  const glicko = new Glicko2({
    tau: 0.5,
    rating: 1500,
    rd: 350,
    vol: 0.06,
  });

  const winnerPlayer = glicko.makePlayer(
    winner.rating,
    winner.rd,
    winner.volatility
  );
  const loserPlayer = glicko.makePlayer(
    loser.rating,
    loser.rd,
    loser.volatility
  );

  // Match result: 1 = winner wins against loser
  glicko.updateRatings([[winnerPlayer, loserPlayer, 1]]);

  // 4. Update Database
  // Update Winner
  await (admin as any)
    .from("players")
    .update({
      rating: winnerPlayer.getRating(),
      rd: winnerPlayer.getRd(),
      volatility: winnerPlayer.getVol(),
    })
    .eq("id", winnerId);

  // Update Loser
  await (admin as any)
    .from("players")
    .update({
      rating: loserPlayer.getRating(),
      rd: loserPlayer.getRd(),
      volatility: loserPlayer.getVol(),
    })
    .eq("id", loserId);

  // Insert Match
  const { data: insertedMatch, error: matchInsertError } = await (admin as any)
    .from("matches")
    .insert({
    winner_id: winnerId,
    loser_id: loserId,
    score: score,
    verified: true, // Auto-verify for now
      reporter_id: user.id,
      hall_id: hallId,
    } as any)
    .select("id")
    .single();

  if (matchInsertError || !insertedMatch) {
    console.error("Match insert error:", matchInsertError);
    redirect("/match/new?error=Could not save match");
  }

  const matchId = (insertedMatch as { id: string }).id;

  if (challengeId) {
    const { error: challengeUpdateError } = await (supabase as any)
      .from("challenges")
      .update({
        status: "completed",
        resolved_match_id: matchId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", challengeId);

    if (challengeUpdateError) {
      console.error("Challenge completion error:", challengeUpdateError);
      redirect("/challenges?error=Match saved, but could not complete challenge");
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/challenges");
  redirect(challengeId ? "/challenges?message=Challenge completed" : "/");
}
