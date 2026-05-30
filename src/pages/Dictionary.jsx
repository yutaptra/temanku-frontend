import { useEffect, useMemo, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../services/api";

const FILTERS = ["Semua", "Alfabet", "Kosakata"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}/${imageUrl}`;
}

function Thumbnail({ item, variant = "card" }) {
  const isPreview = variant === "preview";

  if (!item.image) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-500">
        <span className="text-white text-2xl font-bold">
          {item.name?.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={`Isyarat ${item.name}`}
      className={`w-full h-full object-center ${
        isPreview ? "object-contain" : "object-cover"
      }`}
    />
  );
}

function EmptyState({ query, dk }) {
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

function DictionaryCard({ item, dk, onClick }) {
  return (
    <button
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

export default function Dictionary() {
  const dk = useDarkMode();

  const [dictionary, setDictionary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDictionary();
  }, []);

  async function fetchDictionary() {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.get("/dictionary/");
      const list = res.data?.data || [];

      const mappedData = list.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        image: getImageUrl(item.image_url),
      }));

      setDictionary(mappedData);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data kamus.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredDictionary = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();

    return dictionary.filter((item) => {
      const matchFilter =
        activeFilter === "Semua" || item.category === activeFilter;

      const matchSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [dictionary, searchQuery, activeFilter]);

  return (
    <div
      className={`flex flex-col min-h-full ${dk.page} transition-colors duration-300`}
    >
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <h1 className="font-display font-extrabold text-white text-2xl">
          Kamus
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className={`${dk.page} px-4 pt-4 pb-3 sticky top-0 z-10`}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari bahasa isyarat"
          className={`w-full px-4 py-3 rounded-2xl border shadow-sm text-sm outline-none focus:ring-2 focus:ring-primary-200 ${dk.input}`}
        />

        <div className="flex gap-2 mt-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold border
                transition-all duration-200 active:scale-95
                ${
                  activeFilter === filter
                    ? dk.isDark
                      ? "bg-primary-500 text-white border-primary-400"
                      : "bg-white text-primary-600 border-primary-200 shadow-sm"
                    : dk.chipIdle
                }
              `}
            >
              {filter}
            </button>
          ))}

          <span
            className={`ml-auto flex items-center text-xs ${dk.textMuted} font-medium`}
          >
            {filteredDictionary.length} kata
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 pb-24 flex flex-col gap-3">
        {isLoading ? (
          <p className={`${dk.textSecondary} text-sm text-center py-10`}>
            Memuat data kamus...
          </p>
        ) : error ? (
          <p className="text-red-500 text-sm text-center py-10">{error}</p>
        ) : filteredDictionary.length === 0 ? (
          <EmptyState query={searchQuery} dk={dk} />
        ) : (
          filteredDictionary.map((item) => (
            <DictionaryCard
              key={item.id}
              item={item}
              dk={dk}
              onClick={() => setSelectedItem(item)}
            />
          ))
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 px-0 sm:px-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`${dk.card} border w-full sm:max-w-md md:max-w-lg rounded-t-3xl sm:rounded-3xl px-5 pt-5 pb-32 sm:pb-8 max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-10 h-1 ${dk.divider} rounded-full mx-auto mb-5`}
            />

            <div className="w-full h-[360px] max-h-[50vh] rounded-2xl overflow-hidden bg-slate-100 mb-5 flex items-center justify-center">
              <Thumbnail item={selectedItem} variant="preview" />
            </div>

            <h2
              className={`font-display font-bold ${dk.textPrimary} text-2xl mb-2`}
            >
              {selectedItem.name}
            </h2>

            <span
              className={`inline-block text-xs font-semibold ${dk.badge} px-2.5 py-1 rounded-full mb-3`}
            >
              {selectedItem.category}
            </span>

            <p className={`${dk.textSecondary} text-sm leading-relaxed mb-8`}>
              {selectedItem.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
