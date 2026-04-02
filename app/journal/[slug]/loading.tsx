export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="label text-muted">← JOURNAL</div>
      <div className="border-b border-border pb-8 mt-8 mb-10 space-y-3">
        <div className="h-3 w-24 bg-border rounded animate-pulse" />
        <div className="h-6 w-80 bg-border rounded animate-pulse" />
        <div className="h-3 w-48 bg-border rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-border rounded animate-pulse" style={{ width: `${85 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}
