import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { logout } from "./auth/actions";
import { createChallenge } from "./challenges/actions";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: playersData } = await supabase
    .from("players")
    .select("*")
    .order("rating", { ascending: false });

  const players = playersData as any[];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              CourtKing 👑
            </h1>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/match/new"
                  className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  + Match
                </Link>
                <Link
                  href="/profile"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Profile
                </Link>
                <Link
                  href="/challenges"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Challenges
                </Link>
                <form action={logout}>
                  <button className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leaderboard
            </h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {players?.map((player, index) => (
              <li
                key={player.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Link
                  href={`/player/${player.id}`}
                  className="flex items-center px-6 py-4"
                >
                  <span
                    className={`flex-shrink-0 w-8 text-lg font-bold ${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-gray-400"
                        : index === 2
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {player.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      RD: {Math.round(player.rd)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(player.rating)}
                    </p>

                    {user && player.id !== user.id && (
                      <form action={createChallenge}>
                        <input
                          type="hidden"
                          name="challenged_id"
                          value={player.id}
                        />
                        <button
                          type="submit"
                          className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Challenge
                        </button>
                      </form>
                    )}
                  </div>
                </Link>
              </li>
            ))}
            {(!players || players.length === 0) && (
              <li className="px-6 py-8 text-center text-gray-500">
                No players found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
