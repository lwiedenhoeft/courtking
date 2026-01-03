import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlayerPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const getSafeAvatarUrl = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    if (!value) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch {
      return null;
    }
  };

  // Fetch player details
  const { data: playerData, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (playerError || !playerData) {
    notFound();
  }

  const player = playerData as any;

  // Fetch matches where player is winner or loser, scoped to the player's hall
  const { data: matchesData } = await supabase
    .from("matches")
    .select(`
      *,
      winner:players!winner_id(username),
      loser:players!loser_id(username)
    `)
    .eq("hall_id", player.hall_id)
    .or(`winner_id.eq.${id},loser_id.eq.${id}`)
    .order("created_at", { ascending: false });

  const matches = matchesData as any[];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
        >
          ← Back to Leaderboard
        </Link>

        {/* Player Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
            {getSafeAvatarUrl(player.avatar_url) ? (
              <img
                src={getSafeAvatarUrl(player.avatar_url)!}
                alt={player.username}
                width={80}
                height={80}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>👤</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {player.username}
          </h1>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Rating
              </p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(player.rating)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                RD
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {Math.round(player.rd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Matches
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {matches?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Match History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
            Match History
          </h2>
          <div className="space-y-3">
            {matches?.map((match: any) => {
              const isWinner = match.winner_id === id;
              const opponent = isWinner ? match.loser : match.winner;
              const resultColor = isWinner ? "text-green-600" : "text-red-600";
              const resultLabel = isWinner ? "W" : "L";

              return (
                <div
                  key={match.id}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold text-lg w-6 ${resultColor}`}
                    >
                      {resultLabel}
                    </span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        vs
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {opponent?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      {match.score}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {(!matches || matches.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                No matches played yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
