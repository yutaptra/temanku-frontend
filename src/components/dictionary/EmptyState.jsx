export default function EmptyState({ query, dk }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className={`${dk.textSecondary} text-sm font-medium text-center`}>
        {query
          ? `Tidak ada hasil untuk "${query}"`
          : "Tidak ada kosakata di kategori ini"}
      </p>
    </div>
  );
}
