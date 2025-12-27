"use client";

import { useFormStatus } from "react-dom";
import { upsertProfile } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

interface ProfileFormProps {
  username: string;
  avatarUrl: string | null;
}

export default function ProfileForm({ username, avatarUrl }: ProfileFormProps) {
  return (
    <form
      action={upsertProfile}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Display name
        </label>
        <input
          name="username"
          type="text"
          defaultValue={username}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Avatar URL (optional)
        </label>
        <input
          name="avatar_url"
          type="url"
          defaultValue={avatarUrl ?? ""}
          placeholder="https://..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
        />
      </div>

      <SaveButton />
    </form>
  );
}
