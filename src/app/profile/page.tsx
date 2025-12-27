import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage({
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

  const { data: player } = await (supabase as any)
    .from("players")
    .select("id, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const defaultUsername = user.email?.split("@")[0] ?? "Player";

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
            Your Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Set your display name for the leaderboard.
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

        <ProfileForm
          username={player?.username ?? defaultUsername}
          avatarUrl={player?.avatar_url ?? null}
        />
      </div>
    </main>
  );
}
