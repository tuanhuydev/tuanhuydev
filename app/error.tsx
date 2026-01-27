"use client";

export default function Error({}: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  );
}
