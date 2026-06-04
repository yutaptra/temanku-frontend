import { Plus, Search, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import DictionaryCard from "../components/dictionary/DictionaryCard";
import DictionaryFormModal from "../components/dictionary/DictionaryFormModal";
import EmptyState from "../components/dictionary/EmptyState";
import Thumbnail from "../components/dictionary/Thumbnail";
import { useDarkMode } from "../hooks/useDarkMode";
import { useDictionary } from "../hooks/useDictionary";

const FILTERS = ["Semua", "Alfabet", "Kosakata"];

export default function Dictionary() {
  const dk = useDarkMode();
  const { state } = useApp();

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");

  const userRole =
    state.user?.role ||
    state.user?.data?.role ||
    savedUser?.role ||
    savedUser?.data?.role ||
    "";

  const isAdmin = String(userRole).toLowerCase() === "admin";

  const {
    filteredDictionary,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,

    selectedItem,
    setSelectedItem,
    closeDetail,

    deleteTarget,
    setDeleteTarget,
    closeDeleteModal,

    showAddModal,
    openAddModal,
    closeAddModal,
    addForm,
    addError,
    handleAddChange,
    handleAddFile,
    handleAddDictionary,

    editTarget,
    openEditModal,
    closeEditModal,
    editForm,
    editError,
    handleEditChange,
    handleEditFile,
    handleEditDictionary,

    isLoading,
    isSubmitting,
    error,
    success,

    handleDeleteDictionary,
  } = useDictionary();

  return (
    <div
      className={`flex flex-col min-h-full ${dk.page} transition-colors duration-300`}
    >
      <DictionaryHeader />

      <div className={`${dk.page} px-4 pt-4 pb-3 sticky top-0 z-10`}>
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${dk.textMuted}`}
            strokeWidth={2.2}
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bahasa isyarat"
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border shadow-sm text-sm outline-none focus:ring-2 focus:ring-primary-200 ${dk.input}`}
          />
        </div>

        <div className="flex gap-2 mt-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
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
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="
              w-full mt-3 flex items-center justify-center gap-2
              py-3 rounded-2xl font-semibold text-white text-sm
              active:scale-95 transition-transform
            "
            style={{
              background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
              boxShadow: "0 4px 14px rgba(59,125,255,0.35)",
            }}
          >
            <Plus className="w-4 h-4" />
            Tambah Kamus
          </button>
        )}
      </div>

      <div className="flex-1 px-4 pb-24 flex flex-col gap-3">
        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-green-600 text-sm font-semibold">{success}</p>
          </div>
        )}

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

      {showAddModal && (
        <DictionaryFormModal
          dk={dk}
          title="Tambah Kamus"
          form={addForm}
          error={addError}
          isSubmitting={isSubmitting}
          submitLabel="Simpan Kamus"
          loadingLabel="Menyimpan..."
          fileTitle="Upload Gambar"
          fileHint="Pilih gambar bahasa isyarat"
          onClose={closeAddModal}
          onSubmit={handleAddDictionary}
          onChange={handleAddChange}
          onFileChange={handleAddFile}
        />
      )}

      {selectedItem && (
        <DictionaryDetailModal
          dk={dk}
          item={selectedItem}
          isAdmin={isAdmin}
          isSubmitting={isSubmitting}
          onClose={closeDetail}
          onEdit={() => openEditModal(selectedItem)}
          onDelete={() => setDeleteTarget(selectedItem)}
        />
      )}

      {deleteTarget && (
        <DeleteDictionaryModal
          dk={dk}
          item={deleteTarget}
          isSubmitting={isSubmitting}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteDictionary(deleteTarget)}
        />
      )}

      {editTarget && (
        <DictionaryFormModal
          dk={dk}
          title="Edit Kamus"
          form={editForm}
          error={editError}
          isSubmitting={isSubmitting}
          submitLabel="Simpan Perubahan"
          loadingLabel="Menyimpan..."
          fileTitle="Ganti Gambar"
          fileHint="Kosongkan jika tidak ingin mengganti gambar"
          onClose={closeEditModal}
          onSubmit={handleEditDictionary}
          onChange={handleEditChange}
          onFileChange={handleEditFile}
        />
      )}
    </div>
  );
}

function DictionaryHeader() {
  return (
    <div
      className="px-4 pt-12 pb-5"
      style={{
        background:
          "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
      }}
    >
      <h1 className="font-display font-extrabold text-white text-2xl">Kamus</h1>

      <p className="text-blue-100 text-sm mt-0.5">
        Sistem Isyarat Bahasa Indonesia
      </p>
    </div>
  );
}

function DictionaryDetailModal({
  dk,
  item,
  isAdmin,
  isSubmitting,
  onClose,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="
        fixed inset-0 z-50 flex items-end sm:items-center justify-center
        bg-black/45 px-3 pt-4 pb-18 sm:pb-8
      "
      onClick={onClose}
    >
      <div
        className={`
          ${dk.card} relative border w-full max-w-md sm:max-w-lg rounded-3xl
          px-5 pt-5 pb-5
          overflow-hidden shadow-2xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={`
            absolute top-4 right-4 z-10
            ${dk.cardInner} w-9 h-9 border rounded-full
            flex items-center justify-center
            active:scale-95 transition-transform
            shadow-sm
          `}
          aria-label="Tutup detail kamus"
        >
          <X className={`w-5 h-5 ${dk.textPrimary}`} strokeWidth={2.2} />
        </button>

        <div className="w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden bg-slate-100 mb-5 flex items-center justify-center">
          <Thumbnail item={item} variant="preview" />
        </div>

        <div className="pr-10">
          <h2
            className={`font-display font-bold ${dk.textPrimary} text-2xl mb-2`}
          >
            {item.name}
          </h2>

          <span
            className={`inline-block text-xs font-semibold ${dk.badge} px-2.5 py-1 rounded-full mb-3`}
          >
            {item.category}
          </span>

          <p className={`${dk.textSecondary} text-sm leading-relaxed`}>
            {item.description}
          </p>
        </div>

        {isAdmin && (
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={onEdit}
              disabled={isSubmitting}
              className="
                w-full py-2.5 sm:py-3 rounded-2xl
                font-semibold text-white text-sm
                active:scale-95 transition-transform
                disabled:opacity-60
              "
              style={{
                background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
              }}
            >
              Edit Kamus
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={isSubmitting}
              className="
                w-full py-2.5 sm:py-3 rounded-2xl
                font-semibold text-white text-sm
                bg-red-500 active:scale-95 transition-transform
                disabled:opacity-60
              "
            >
              Hapus Kamus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteDictionaryModal({ dk, item, isSubmitting, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className={`${dk.card} border w-full max-w-sm rounded-3xl p-5`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`font-display font-bold ${dk.textPrimary} text-xl mb-2`}>
          Hapus Kamus?
        </h2>

        <p className={`${dk.textSecondary} text-sm leading-relaxed mb-5`}>
          Data kamus <b>{item.name}</b> akan dihapus permanen. Tindakan ini
          tidak bisa dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`${dk.cardInner} flex-1 py-3 rounded-2xl border font-semibold text-sm ${dk.textPrimary} disabled:opacity-60`}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="
              flex-1 py-3 rounded-2xl
              font-semibold text-white text-sm
              bg-red-500 active:scale-95 transition-transform
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
