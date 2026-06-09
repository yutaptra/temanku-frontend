import { Pencil, Trash2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OPTIONS = ["option_a", "option_b", "option_c", "option_d"];
const OPTION_LABELS = ["A", "B", "C", "D"];

export const getImageUrl = (url) =>
  !url || url === "string"
    ? null
    : url.startsWith("http")
      ? url
      : `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

export default function QuestionCard({
  dk,
  question,
  index,
  onEdit,
  onDelete,
}) {
  return (
    <div className={`${dk.card} rounded-2xl border shadow-sm p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`${dk.textSecondary} text-xs font-semibold mb-1`}>
            Soal {index + 1}
          </p>
          <h2
            className={`font-semibold ${dk.textPrimary} text-sm leading-relaxed`}
          >
            {question.question_text}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {OPTIONS.map(
              (key, idx) =>
                question[key] && (
                  <span
                    key={idx}
                    className={`${dk.cardInner} px-3 py-1 rounded-xl border text-xs ${dk.textSecondary}`}
                  >
                    {OPTION_LABELS[idx]}. {question[key]}
                  </span>
                ),
            )}
          </div>
          {question.image_url && (
            <div
              className={`${dk.cardInner} rounded-2xl overflow-hidden border mt-4`}
            >
              <img
                src={getImageUrl(question.image_url)}
                alt="Soal"
                className="w-full max-h-64 object-contain"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={onEdit}
            className={`${dk.cardInner} w-10 h-10 rounded-xl border flex items-center justify-center`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500 text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
