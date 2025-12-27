"use client";

import { useFormStatus } from "react-dom";
import { submitMatch } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Submitting..." : "Submit Result"}
    </button>
  );
}

interface MatchFormProps {
  players: any[];
  challengeId: string | null;
}

export default function MatchForm({ players, challengeId }: MatchFormProps) {
  return (
    <form
      action={submitMatch}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
    >
      {challengeId && (
        <input type="hidden" name="challenge_id" value={challengeId} />
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Winner
        </label>
        <select
          name="winner_id"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
        >
          <option value="">Select Winner</option>
          {players?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.username}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Loser
        </label>
        <select
          name="loser_id"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
        >
          <option value="">Select Loser</option>
          {players?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.username}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Score
        </label>
        <input
          type="text"
          name="score"
          placeholder="e.g. 21-19, 18-21, 21-15"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format: Winner&apos;s score first. Comma separated sets.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
