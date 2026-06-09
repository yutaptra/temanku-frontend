import { ClipboardList } from "lucide-react";

const DIFFICULTY_STYLE = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-600",
  mudah: "bg-green-100 text-green-700",
  sedang: "bg-yellow-100 text-yellow-700",
  sulit: "bg-red-100 text-red-600",
};

function getDifficultyStyle(category) {
  const key = String(category || "easy").toLowerCase();

  return DIFFICULTY_STYLE[key] || DIFFICULTY_STYLE.easy;
}

export default function QuizModal({ quiz, onClose, onConfirm, dk }) {
  if (!quiz) return null;

  const isDone = quiz.status === "selesai";

  const details = [
    ["Tingkat Kesulitan", quiz.difficulty, true],
    ["Durasi Estimasi", quiz.duration],
    ["Jumlah Soal", quiz.count],
    ["Tipe Soal", quiz.questionType],
  ];

  return (
    <div
      className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/45 px-3 py-4"
      onClick={onClose}
    >
      <div
        className={`
          ${dk.card}
          border w-full max-w-md sm:max-w-lg
          rounded-3xl px-5 pt-5 pb-5 relative
          max-h-[calc(100vh-8rem)] overflow-y-auto
          `}
        style={{ animation: "popIn .2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-5">
          <div className="flex items-start gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isDone ? "bg-green-100 text-green-500" : "text-white"
              }`}
              style={
                isDone
                  ? undefined
                  : {
                      background:
                        "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
                    }
              }
            >
              <ClipboardList className="w-7 h-7" strokeWidth={2.3} />
            </div>

            <div>
              <h2
                className={`font-display font-bold ${dk.textPrimary} text-xl`}
              >
                {quiz.title}
              </h2>

              <p className={`${dk.textSecondary} text-sm`}>
                {quiz.description}
              </p>
            </div>
          </div>
        </div>

        <div className={`${dk.cardInner} rounded-2xl p-4 mb-5 space-y-2`}>
          {details.map(([label, value, colored]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <span className={`${dk.textSecondary} text-sm`}>{label}</span>

              <span
                className={
                  colored
                    ? `text-sm font-semibold px-2.5 py-0.5 rounded-full ${getDifficultyStyle(
                        quiz.rawCategory,
                      )}`
                    : `${dk.textPrimary} text-sm font-semibold text-right`
                }
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="
            w-full py-3.5 rounded-2xl
            font-semibold text-white text-sm
            flex items-center justify-center gap-2
            active:scale-95 transition-transform
          "
          style={{
            background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
            boxShadow: "0 4px 14px rgba(63,136,255,0.4)",
          }}
        >
          Mulai {quiz.title}
        </button>

        <button
          type="button"
          onClick={onClose}
          className={`
            w-full py-2.5 mt-2 rounded-2xl
            font-semibold ${dk.textSecondary} text-sm
            active:scale-95 transition-transform
          `}
        >
          Batal
        </button>

        <style>{`
          @keyframes popIn {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(8px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
           }
         }
       `}</style>
      </div>
    </div>
  );
}
