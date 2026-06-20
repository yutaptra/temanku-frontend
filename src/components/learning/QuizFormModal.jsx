export default function QuizFormModal({
  title,
  submitText,
  form,
  setForm,
  error,
  onClose,
  onSubmit,
  isSubmitting,
  dk,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-black/45 px-3 py-4
      "
      onClick={() => !isSubmitting && onClose()}
    >
      <form
        onSubmit={onSubmit}
        className={`
          ${dk.card}
          border w-full max-w-md rounded-3xl
          px-5 py-5
          max-h-[92vh] overflow-y-auto
        `}
        style={{ animation: "popIn .25s ease-out both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className={`font-display font-bold ${dk.textPrimary} text-xl`}>
            {title}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul paket kuis"
            disabled={isSubmitting}
            className={`
              ${dk.input}
              w-full px-4 py-3 rounded-2xl border
              text-sm outline-none
              disabled:opacity-60
            `}
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi paket kuis"
            rows={3}
            disabled={isSubmitting}
            className={`
              ${dk.input}
              w-full px-4 py-3 rounded-2xl border
              text-sm outline-none resize-none
              disabled:opacity-60
            `}
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`
              ${dk.input}
              w-full px-4 py-3 rounded-2xl border
              text-sm outline-none
              disabled:opacity-60
            `}
          >
            <option value="easy">Mudah</option>
            <option value="medium">Sedang</option>
            <option value="hard">Sulit</option>
          </select>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`
                flex-1 py-3 rounded-2xl
                font-semibold text-sm border
                active:scale-95 transition-transform
                disabled:opacity-60
                ${dk.cardInner} ${dk.textPrimary}
              `}
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 py-3 rounded-2xl
                font-semibold text-white text-sm
                disabled:opacity-60
                active:scale-95 transition-transform
              "
              style={{
                background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
              }}
            >
              {isSubmitting ? "Menyimpan..." : submitText}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes popIn {
          from {
            transform: scale(0.92);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
