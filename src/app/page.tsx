export default function Home() {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Hello CourtKing</h1>
    </main>
  );
}
