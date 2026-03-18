"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400">{error.message || "An unexpected error occurred"}</p>
        {error.digest && <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">Error ID: {error.digest}</p>}
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Try again
        </button>
      </div>
    </div>
  );
}
