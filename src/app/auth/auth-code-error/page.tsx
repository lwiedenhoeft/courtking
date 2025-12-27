import Link from "next/link";

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}) {
  const { error, error_description } = await searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Authentication Error
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          There was a problem signing you in.
        </p>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            <p className="font-bold">{error}</p>
            <p>{error_description}</p>
          </div>
        )}
        <div className="mt-4">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
