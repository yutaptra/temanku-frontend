import { X } from "lucide-react";

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

  function handleFile(e) {
    setForm((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display font-bold ${dk.textPrimary} text-xl`}>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`
              ${dk.cardInner}
              w-10 h-10 border rounded-full
              flex items-center justify-center
              disabled:opacity-60
            `}
          >
            <X className={`w-5 h-5 ${dk.textPrimary}`} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            placeholder="Teks pertanyaan"
            rows={3}
            disabled={isSubmitting}
            className={`
              ${dk.input}
              w-full px-4 py-3 rounded-2xl border
              text-sm outline-none resize-none
              disabled:opacity-60
            `}
          />

          <input
            name="answer"
            value={form.answer}
            onChange={handleChange}
            placeholder="Jawaban benar"
            disabled={isSubmitting}
            className={`
              ${dk.input}
              w-full px-4 py-3 rounded-2xl border
              text-sm outline-none
              disabled:opacity-60
            `}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="option_a"
              value={form.option_a}
              onChange={handleChange}
              placeholder="Pilihan A"
              disabled={isSubmitting}
              className={`
                ${dk.input}
                w-full px-4 py-3 rounded-2xl border
                text-sm outline-none
                disabled:opacity-60
              `}
            />

            <input
              name="option_b"
              value={form.option_b}
              onChange={handleChange}
              placeholder="Pilihan B"
              disabled={isSubmitting}
              className={`
                ${dk.input}
                w-full px-4 py-3 rounded-2xl border
                text-sm outline-none
                disabled:opacity-60
              `}
            />

            <input
              name="option_c"
              value={form.option_c}
              onChange={handleChange}
              placeholder="Pilihan C"
              disabled={isSubmitting}
              className={`
                ${dk.input}
                w-full px-4 py-3 rounded-2xl border
                text-sm outline-none
                disabled:opacity-60
              `}
            />

            <input
              name="option_d"
              value={form.option_d}
              onChange={handleChange}
              placeholder="Pilihan D"
              disabled={isSubmitting}
              className={`
                ${dk.input}
                w-full px-4 py-3 rounded-2xl border
                text-sm outline-none
                disabled:opacity-60
              `}
            />
          </div>

          <label
            className={`
              ${dk.cardInner}
              border rounded-2xl px-4 py-3
              flex items-center justify-between gap-3
              cursor-pointer active:scale-[0.99]
              transition-transform
              ${isSubmitting ? "opacity-60 pointer-events-none" : ""}
            `}
          >
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${dk.textPrimary}`}>
                Upload Gambar Soal
              </p>

              <p className={`text-xs mt-0.5 ${dk.textSecondary} truncate`}>
                {form.file ? form.file.name : "Pilih gambar isyarat untuk soal"}
              </p>
            </div>

            <div
              className="
                px-3 py-1.5 rounded-xl
                text-xs font-semibold text-white whitespace-nowrap
              "
              style={{
                background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
              }}
            >
              Pilih File
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={isSubmitting}
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full py-3.5 rounded-2xl
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
      </form>
    </div>
  );
}
