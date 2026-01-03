import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MatchForm from "./MatchForm";

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ challenge_id?: string }>;
}) {
  const { challenge_id: challengeId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the user's hall_id
  const { data: userData } = await supabase
    .from("players")
    .select("hall_id")
    .eq("id", user.id)
    .maybeSingle();

  const userHallId = (userData as { hall_id: string } | null)?.hall_id;

  let allowedPlayerIds: string[] | null = null;

  if (challengeId) {
    const { data: challenge, error: challengeError } = await (supabase as any)
      .from("challenges")
      .select("id, challenger_id, challenged_id, status")
      .eq("id", challengeId)
      .maybeSingle();

    if (challengeError || !challenge) {
      redirect("/challenges?error=Challenge not found");
    }

    const isParticipant =
      challenge.challenger_id === user.id || challenge.challenged_id === user.id;

    if (!isParticipant) {
      redirect("/challenges?error=You are not part of this challenge");
    }

    if (challenge.status !== "accepted") {
      redirect("/challenges?error=Challenge is not accepted");
    }

    allowedPlayerIds = [challenge.challenger_id, challenge.challenged_id];
  }

  const playersQuery = supabase
    .from("players")
    .select("*")
    .order("username");

  if (userHallId) {
    playersQuery.eq("hall_id", userHallId);
  }

  const { data: playersData } = await playersQuery;

  const allPlayers = playersData as any[];
  const players = allowedPlayerIds
    ? allPlayers.filter((p) => allowedPlayerIds!.includes(p.id))
    : allPlayers;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Record Match Result
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Who won? Who lost? What was the score?
          </p>
        </div>

        <MatchForm players={players} challengeId={challengeId ?? null} />
      </div>
    </main>
  );
}
