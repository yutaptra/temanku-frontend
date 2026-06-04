export default function LoadingCard({ dk }) {
  return (
    <div className={`${dk.card} rounded-2xl border shadow-sm p-4`}>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse" />

        <div className="flex-1">
          <div className="h-4 w-28 rounded bg-slate-200 animate-pulse mb-2" />

          <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
