export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="label text-muted">← SEASON</div>
      <div className="cinema bg-border my-8 animate-pulse" />
      <div className="border-b border-border pb-6 mb-8 space-y-3">
        <div className="h-3 w-24 bg-border rounded animate-pulse" />
        <div className="h-5 w-64 bg-border rounded animate-pulse" />
        <div className="h-3 w-48 bg-border rounded animate-pulse" />
      </div>
    </div>
  );
}
