import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  acceptChallenge,
  cancelChallenge,
  declineChallenge,
} from "./actions";

export const revalidate = 0;

function StatusPill({ status }: { status: string }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border";

  const cls =
    status === "pending"
      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
      : status === "accepted"
      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
      : status === "completed"
      ? "bg-green-50 text-green-800 border-green-200"
      : status === "declined"
      ? "bg-gray-50 text-gray-800 border-gray-200"
      : status === "cancelled"
      ? "bg-gray-50 text-gray-800 border-gray-200"
      : "bg-gray-50 text-gray-800 border-gray-200";

  return <span className={`${base} ${cls}`}>{status}</span>;
}

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { message, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: challenges, error: challengesError } = await (supabase as any)
    .from("challenges")
    .select(
      `
      id,
      status,
      created_at,
      updated_at,
      challenger:challenger_id ( id, username ),
      challenged:challenged_id ( id, username )
    `
    )
    .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (challengesError) {
    console.error("Challenges fetch error:", challengesError);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
        >
          ← Back
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Challenges
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Accept or manage your ladder challenges.
          </p>
        </div>

        {message && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Challenges
            </h2>
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {(challenges ?? []).map((c: any) => {
              const isIncoming = c.challenged?.id === user.id;
              const isOutgoing = c.challenger?.id === user.id;

              const otherName = isIncoming
                ? c.challenger?.username
                : c.challenged?.username;

              return (
                <li key={c.id} className="px-6 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {isIncoming ? "Incoming" : "Outgoing"} vs {otherName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                    <StatusPill status={c.status} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {c.status === "pending" && isIncoming && (
                      <>
                        <form action={acceptChallenge}>
                          <input type="hidden" name="challenge_id" value={c.id} />
                          <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors">
                            Accept
                          </button>
                        </form>
                        <form action={declineChallenge}>
                          <input type="hidden" name="challenge_id" value={c.id} />
                          <button className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Decline
                          </button>
                        </form>
                      </>
                    )}

                    {c.status === "pending" && isOutgoing && (
                      <form action={cancelChallenge}>
                        <input type="hidden" name="challenge_id" value={c.id} />
                        <button className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Cancel
                        </button>
                      </form>
                    )}

                    {c.status === "accepted" && (isIncoming || isOutgoing) && (
                      <Link
                        href={`/match/new?challenge_id=${c.id}`}
                        className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Report match
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}

            {(!challenges || challenges.length === 0) && (
              <li className="px-6 py-8 text-center text-gray-500">
                No challenges yet. Go to the leaderboard and challenge someone.
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
