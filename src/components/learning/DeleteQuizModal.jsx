export default function DeleteQuizModal({
  dk,
  quiz,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  return (
    <>
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
        onClick={() => !isSubmitting && onClose()}
      >
        <div
          className={`${dk.card} border w-full max-w-sm rounded-3xl p-5`}
          style={{ animation: "popIn .25s ease-out both" }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            className={`font-display font-bold ${dk.textPrimary} text-xl mb-2`}
          >
            Hapus Paket?
          </h2>

          <p className={`${dk.textSecondary} text-sm leading-relaxed mb-5`}>
            Paket akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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
              className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm bg-red-500 active:scale-95 transition-transform disabled:opacity-60"
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
