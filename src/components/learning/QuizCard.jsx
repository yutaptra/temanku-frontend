import { CheckCircle2, ClipboardList, ListChecks, Play } from "lucide-react";

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

function IconCard({ done = false }) {
  return (
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
        done ? "bg-green-100 text-green-500" : "text-white"
      }`}
      style={
        done
          ? undefined
          : {
              background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
            }
      }
    >
      {done ? (
        <CheckCircle2 className="w-8 h-8" strokeWidth={2.3} />
      ) : (
        <ClipboardList className="w-7 h-7" strokeWidth={2.3} />
      )}
    </div>
  );
}

export default function QuizCard({
  quiz,
  onPress,
  onManageQuestions,
  isAdmin,
  dk,
}) {
  const isDone = quiz.status === "selesai";

  return (
    <div className={`${dk.card} rounded-2xl border shadow-sm p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <IconCard done={isDone} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`font-bold ${dk.textPrimary} text-base`}>
              {quiz.title}
            </h3>

            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                isDone
                  ? "bg-green-100 text-green-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {isDone ? "Selesai" : "Belum"}
            </span>
          </div>

          <p className={`${dk.textSecondary} text-xs leading-snug`}>
            {quiz.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getDifficultyStyle(
            quiz.rawCategory,
          )}`}
        >
          {quiz.difficulty}
        </span>

        <span className={`${dk.textMuted} text-xs`}>•</span>

        <span className={`${dk.textSecondary} text-xs`}>{quiz.duration}</span>

        <span className={`${dk.textMuted} text-xs`}>•</span>

        <span className={`${dk.textSecondary} text-xs`}>{quiz.count}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onPress(quiz)}
          className="
            flex items-center gap-2 px-5 py-2 rounded-xl
            font-semibold text-sm text-white
            active:scale-95 transition-all
          "
          style={{
            background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
            boxShadow: "0 3px 10px rgba(59,125,255,0.3)",
          }}
        >
          <Play className="w-4 h-4 fill-white" />
          {isDone ? "Tinjau" : "Mulai"}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onManageQuestions(quiz)}
            className={`
              ${dk.cardInner}
              flex items-center gap-2 px-4 py-2 rounded-xl border
              font-semibold text-sm ${dk.textPrimary}
              active:scale-95 transition-transform
            `}
          >
            <ListChecks className="w-4 h-4" />
            Kelola Soal
          </button>
        )}
      </div>
    </div>
  );
}
