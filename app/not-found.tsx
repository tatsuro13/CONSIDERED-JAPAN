import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <p className="label text-muted">404</p>
      <p className="bilingual-en mt-4">Page not found.</p>
      <p className="bilingual-jp text-muted mt-1">ページが見つかりません</p>
      <Link
        href="/"
        className="label mt-8 inline-block underline underline-offset-2 hover:text-ink transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
