import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure we have a players row for this authenticated user.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const defaultUsername = user.email?.split("@")[0] ?? "Player";
        const { error: upsertError } = await (supabase as any)
          .from("players")
          .upsert(
            {
              id: user.id,
              username: defaultUsername,
              avatar_url: null,
            },
            { onConflict: "id" }
          );

        if (upsertError) {
          console.error("Player provision error:", upsertError);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Exchange Code Error:", error);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
