"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <p className="label text-muted">ERROR</p>
      <p className="bilingual-en mt-4">Something went wrong.</p>
      <p className="bilingual-jp text-muted mt-1">エラーが発生しました</p>
      <button
        onClick={reset}
        className="label mt-8 underline underline-offset-2 hover:text-ink transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
