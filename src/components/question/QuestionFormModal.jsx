import { Image as ImageIcon } from "lucide-react";

const OPTIONS = ["option_a", "option_b", "option_c", "option_d"];
const OPTION_LABELS = ["A", "B", "C", "D"];
const BTN_GRADIENT = { background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)" };

export default function QuestionFormModal({
  dk,
  editTarget,
  form,
  isSubmitting,
  onChange,
  onFile,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-4">
      <form
        onSubmit={onSubmit}
        style={{ animation: "popIn .3s ease-out both" }}
        className={`${dk.card} border w-full max-w-lg rounded-3xl p-5 max-h-[92vh] overflow-y-auto`}
      >
        <h2 className={`font-display font-bold ${dk.textPrimary} text-xl mb-4`}>
          {editTarget ? "Edit Soal" : "Tambah Soal"}
        </h2>
        <div className="flex flex-col gap-3">
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={onChange}
            placeholder="Pertanyaan"
            rows={3}
            className={`${dk.input} px-4 py-3 rounded-2xl border`}
          />

          {OPTIONS.map((key, i) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={onChange}
              placeholder={`Pilihan ${OPTION_LABELS[i]}`}
              className={`${dk.input} px-4 py-3 rounded-2xl border`}
            />
          ))}

          <input
            name="answer"
            value={form.answer}
            onChange={onChange}
            placeholder="Jawaban benar (a/b/c/d)"
            className={`${dk.input} px-4 py-3 rounded-2xl border`}
          />

          <label
            className={`${dk.cardInner} rounded-2xl border px-4 py-3 flex items-center gap-3 cursor-pointer`}
          >
            <ImageIcon className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${dk.textPrimary}`}>
                Upload Gambar
              </p>
              <p className={`${dk.textSecondary} text-xs truncate`}>
                {form.file ? form.file.name : "Pilih gambar soal"}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`${dk.cardInner} flex-1 py-3 rounded-2xl border font-semibold text-sm ${dk.textPrimary}`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={BTN_GRADIENT}
              className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : editTarget ? "Simpan" : "Tambah"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
