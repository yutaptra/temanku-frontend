export default function DeleteQuizModal({
  dk,
  quiz,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className={`${dk.card} border w-full max-w-sm rounded-3xl p-5`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`font-display font-bold ${dk.textPrimary} text-xl mb-2`}>
          Hapus Soal?
        </h2>

        <p className={`${dk.textSecondary} text-sm leading-relaxed mb-5`}>
          Soal <b>{quiz?.title}</b> akan dihapus permanen. Tindakan ini tidak
          bisa dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`
              ${dk.cardInner}
              flex-1 py-3 rounded-2xl border
              font-semibold text-sm ${dk.textPrimary}
              disabled:opacity-60
            `}
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
