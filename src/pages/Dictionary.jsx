import { useState, useMemo } from "react";

// ── Data kosakata SIBI (dummy — ganti dengan fetch API) ───────
const VOCABULARY = [
  {
    id: 1,
    name: "Saya",
    description: "Tempelkan ibu jari ke dada bagian tengah",
    category: "Kosakata",
    image: null, // nanti: URL gambar isyarat
  },
  {
    id: 2,
    name: "Kasih",
    description: "Silangkan kedua lengan di depan dada",
    category: "Kosakata",
    image: null,
  },
  {
    id: 3,
    name: "Kamu",
    description: "Buka telapak tangan lebar-lebar",
    category: "Kosakata",
    image: null,
  },
  {
    id: 4,
    name: "Makan",
    description: "Kuncupkan ujung jari-jari tangan",
    category: "Kosakata",
    image: null,
  },
  {
    id: 5,
    name: "Rumah",
    description: "Satukan ujung jari tangan kanan dan kiri",
    category: "Kosakata",
    image: null,
  },
  {
    id: 6,
    name: "A",
    description: "Kepalkan tangan dengan ibu jari di samping",
    category: "Alfabet",
    image: null,
  },
  {
    id: 7,
    name: "B",
    description: "Tegakkan keempat jari, ibu jari ditekuk ke dalam",
    category: "Alfabet",
    image: null,
  },
  {
    id: 8,
    name: "C",
    description: "Bentuk tangan seperti huruf C",
    category: "Alfabet",
    image: null,
  },
  {
    id: 9,
    name: "Tolong",
    description: "Tekan ibu jari ke telapak tangan satunya",
    category: "Kosakata",
    image: null,
  },
  {
    id: 10,
    name: "Terima Kasih",
    description: "Sentuh dagu lalu arahkan tangan ke depan",
    category: "Kosakata",
    image: null,
  },
  {
    id: 11,
    name: "Maaf",
    description: "Gosok kepalan tangan melingkar di dada",
    category: "Kosakata",
    image: null,
  },
  {
    id: 12,
    name: "D",
    description: "Tunjuk ke atas, jari lain melingkar menyentuh ibu jari",
    category: "Alfabet",
    image: null,
  },
];

const FILTERS = ["Semua", "Alfabet", "Kosakata"];

// ── Gradien thumbnail per id (variasi warna) ──────────────────
const THUMB_GRADIENTS = [
  "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
  "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
  "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
  "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)",
];

function getGradient(id) {
  return THUMB_GRADIENTS[id % THUMB_GRADIENTS.length];
}

// ── Komponen thumbnail ────────────────────────────────────────
function Thumbnail({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={`Isyarat ${item.name}`}
        className="w-full h-full object-cover"
      />
    );
  }
  // Placeholder saat gambar belum ada
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: getGradient(item.id) }}
    >
      {/* Ikon play — ganti <img> saat gambar isyarat tersedia */}
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white"
          fill="currentColor"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
    </div>
  );
}

// ── Ikon bintang favorit ──────────────────────────────────────
function StarIcon({ filled }) {
  return filled ? (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-yellow-400"
      fill="currentColor"
    >
      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-neutral-300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"
      />
    </svg>
  );
}

// ── Kartu kosakata ────────────────────────────────────────────
function VocabCard({ item, isFavorite, onToggleFavorite, onPress }) {
  return (
    <div
      className="
        bg-white rounded-2xl border border-neutral-100 shadow-sm
        flex items-center gap-3 p-3
        active:scale-[0.98] transition-transform duration-150 cursor-pointer
      "
      onClick={onPress}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <Thumbnail item={item} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-neutral-800 text-base leading-tight truncate">
          {item.name}
        </p>
        <p className="text-neutral-500 text-xs mt-0.5 leading-snug line-clamp-1">
          {item.description}
        </p>
        {/* Badge kategori */}
        <span
          className="
          inline-block mt-1.5 text-[10px] font-semibold
          bg-primary-50 text-primary-600
          px-2 py-0.5 rounded-full
        "
        >
          {item.category}
        </span>
      </div>

      {/* Tombol favorit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
        className="flex-shrink-0 p-1.5 rounded-full transition-colors active:bg-yellow-50"
        aria-label={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
      >
        <StarIcon filled={isFavorite} />
      </button>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-neutral-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <p className="text-neutral-500 text-sm font-medium text-center">
        {query
          ? `Tidak ada hasil untuk "${query}"`
          : "Tidak ada kosakata di kategori ini"}
      </p>
      {query && (
        <p className="text-neutral-400 text-xs text-center">
          Coba kata kunci yang berbeda
        </p>
      )}
    </div>
  );
}

// ── Halaman Kamus ─────────────────────────────────────────────
export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [favorites, setFavorites] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter + search
  const filtered = useMemo(() => {
    return VOCABULARY.filter((v) => {
      const matchFilter =
        activeFilter === "Semua" || v.category === activeFilter;
      const matchSearch =
        !searchQuery.trim() ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [searchQuery, activeFilter]);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Kamus
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      {/* ── KONTEN ──────────────────────────────────────────── */}
      <div className="flex-1 bg-neutral-50 flex flex-col">
        {/* Search + filter — sticky */}
        <div className="bg-neutral-50 px-4 pt-4 pb-3 flex flex-col gap-3 sticky top-0 z-10">
          {/* Search bar */}
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none"
              style={{ width: 18, height: 18 }}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Bahasa Isyarat"
              className="
                w-full pl-10 pr-4 py-3 rounded-2xl border-0
                bg-white shadow-sm text-sm text-neutral-800
                placeholder-neutral-400 outline-none
                focus:ring-2 focus:ring-primary-200
                transition-all duration-200
              "
            />
            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: 16, height: 16 }}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold
                  transition-all duration-200 active:scale-95
                  ${
                    activeFilter === f
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-200"
                      : "bg-white text-neutral-600 border border-neutral-200"
                  }
                `}
              >
                {f}
              </button>
            ))}

            {/* Badge jumlah hasil */}
            <span className="ml-auto flex items-center text-xs text-neutral-400 font-medium pr-1">
              {filtered.length} kata
            </span>
          </div>
        </div>

        {/* List kosakata */}
        <div className="flex-1 px-4 pb-6 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : (
            filtered.map((item) => (
              <VocabCard
                key={item.id}
                item={item}
                isFavorite={favorites.has(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={() => setSelectedItem(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── MODAL DETAIL ─────────────────────────────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="
              bg-white w-full max-w-mobile rounded-t-3xl px-5 pt-5 pb-10
              animate-slide-up
            "
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp .25s ease-out" }}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

            {/* Thumbnail besar */}
            <div className="w-full h-52 rounded-2xl overflow-hidden mb-5">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={`Isyarat ${selectedItem.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: getGradient(selectedItem.id) }}
                >
                  <div className="flex flex-col items-center gap-3 opacity-80">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    >
                      <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316z" />
                      <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <p className="text-white/70 text-sm">
                      Gambar belum tersedia
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Info detail */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-display font-bold text-neutral-800 text-2xl">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => toggleFavorite(selectedItem.id)}
                className="p-2 rounded-full bg-neutral-50 active:bg-yellow-50 transition-colors"
              >
                <StarIcon filled={favorites.has(selectedItem.id)} />
              </button>
            </div>

            <span className="inline-block text-xs font-semibold bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full mb-3">
              {selectedItem.category}
            </span>

            <p className="text-neutral-600 text-sm leading-relaxed">
              {selectedItem.description}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
