export default function DeleteQuestionModal({ dk, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div
        className={`${dk.card} border w-full max-w-sm rounded-3xl p-6`}
        style={{ animation: "popIn .25s ease-out both" }}
      >
        <h2 className={`font-display font-bold ${dk.textPrimary} text-xl mb-2`}>
          Hapus Soal?
        </h2>
        <p className={`${dk.textSecondary} text-sm mb-6`}>
          Soal akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`${dk.cardInner} flex-1 py-3 rounded-2xl border font-semibold text-sm ${dk.textPrimary}`}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm bg-red-500"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
