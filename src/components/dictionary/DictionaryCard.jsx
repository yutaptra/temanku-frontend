import Thumbnail from "./Thumbnail";

export default function DictionaryCard({ item, dk, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${dk.card} w-full rounded-2xl border shadow-sm flex items-center gap-3 p-3 text-left active:scale-[0.98] transition-transform duration-150`}
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
        <Thumbnail item={item} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`font-bold ${dk.textPrimary} text-base truncate`}>
          {item.name}
        </h3>

        <p className={`${dk.textSecondary} text-xs mt-0.5 line-clamp-1`}>
          {item.description}
        </p>

        <span
          className={`inline-block mt-1.5 text-[10px] font-semibold ${dk.badge} px-2 py-0.5 rounded-full`}
        >
          {item.category}
        </span>
      </div>
    </button>
  );
}
