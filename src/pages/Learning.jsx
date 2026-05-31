import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  CheckCircle2,
  ClipboardList,
  Play,
  Sparkles,
  Target,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DIFFICULTY_STYLE = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-600",
  mudah: "bg-green-100 text-green-700",
  sedang: "bg-yellow-100 text-yellow-700",
  sulit: "bg-red-100 text-red-600",
};

const DIFFICULTY_LABEL = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

function getDifficultyLabel(category) {
  const key = String(category || "easy").toLowerCase();
  return DIFFICULTY_LABEL[key] || category || "Mudah";
}

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

function MetricCard({ label, value, icon, dk }) {
  return (
    <div
      className={`${dk.card} flex-1 rounded-2xl border shadow-sm p-3 flex flex-col items-center gap-1.5`}
    >
      {icon}

      <p
        className={`${dk.textSecondary} text-[11px] font-medium text-center leading-tight`}
      >
        {label}
      </p>
      <p
        className={`font-display font-extrabold ${dk.textPrimary} text-xl leading-none`}
      >
        {value}
      </p>
    </div>
  );
}

function QuizCard({ quiz, onPress, dk }) {
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

      <button
        onClick={() => onPress(quiz)}
        className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm text-white active:scale-95 transition-all"
        style={{
          background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
          boxShadow: "0 3px 10px rgba(59,125,255,0.3)",
        }}
      >
        <Play className="w-4 h-4 fill-white" />
        {isDone ? "Tinjau" : "Mulai"}
      </button>
    </div>
  );
}

function LoadingCard({ dk }) {
  return (
    <div className={`${dk.card} rounded-2xl border shadow-sm p-4`}>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-28 rounded bg-slate-200 animate-pulse mb-2" />
          <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function InfoState({
  title,
  message,
  buttonText,
  onClick,
  dk,
  danger = false,
}) {
  return (
    <div
      className={`${dk.card} rounded-2xl border shadow-sm p-5 text-center ${
        danger ? "border-red-200" : ""
      }`}
    >
      <p className={`font-bold ${danger ? "text-red-600" : dk.textPrimary}`}>
        {title}
      </p>
      <p className={`${dk.textSecondary} text-sm mt-1`}>{message}</p>

      <button
        onClick={onClick}
        className="mt-4 px-5 py-2 rounded-xl font-semibold text-white text-sm active:scale-95 transition-transform"
        style={{
          background: danger
            ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            : "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

function QuizModal({ quiz, onClose, onConfirm, dk }) {
  if (!quiz) return null;

  const isDone = quiz.status === "selesai";

  const details = [
    ["Tingkat Kesulitan", quiz.difficulty, true],
    ["Durasi Estimasi", quiz.duration],
    ["Jumlah Pilihan", quiz.count],
    ["Tipe Soal", quiz.questionType],
    ["Status", isDone ? "Selesai" : "Belum dikerjakan"],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className={`${dk.card} border w-full max-w-mobile rounded-t-3xl px-5 pt-4 pb-10`}
        style={{ animation: "slideUp .25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-10 h-1 ${dk.divider} rounded-full mx-auto mb-5`} />

        <div className="flex items-center gap-3 mb-4">
          <IconCard done={isDone} />
          <div>
            <h2 className={`font-display font-bold ${dk.textPrimary} text-xl`}>
              {quiz.title}
            </h2>
            <p className={`${dk.textSecondary} text-sm`}>{quiz.description}</p>
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
          onClick={onConfirm}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
            boxShadow: "0 4px 14px rgba(63,136,255,0.4)",
          }}
        >
          <Play className="w-5 h-5 fill-white" />
          {isDone ? "Tinjau Kuis" : "Mulai Kuis"}
        </button>

        <button
          onClick={onClose}
          className={`w-full py-2.5 mt-2 rounded-2xl font-semibold ${dk.textSecondary} text-sm active:scale-95 transition-transform`}
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default function Learning() {
  const navigate = useNavigate();
  const dk = useDarkMode();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const metrics = useMemo(
    () => [
      {
        id: "exp",
        label: "Poin EXP",
        value: quizzes.length * 10,
        icon: <Sparkles className="w-7 h-7 text-amber-500" />,
      },
      {
        id: "questions",
        label: "Jumlah Soal",
        value: quizzes.length,
        icon: <ClipboardList className="w-7 h-7 text-orange-500" />,
      },
      {
        id: "completion",
        label: "Penyelesaian",
        value: "0%",
        icon: <Target className="w-7 h-7 text-green-500" />,
      },
    ],
    [quizzes.length],
  );

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/quiz/questions/public`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Server mengembalikan status ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success || !Array.isArray(result?.data)) {
        throw new Error("Format data dari server tidak sesuai.");
      }

      const mappedQuizzes = result.data.map((item, index) => {
        const optionCount = Array.isArray(item.options)
          ? item.options.length
          : 0;

        return {
          id: item.id,
          title: `Soal ${index + 1}`,
          description: item.question_text || "Pertanyaan kuis tidak tersedia.",
          difficulty: getDifficultyLabel(item.category),
          rawCategory: item.category,
          duration: "± 1 mnt",
          count: `${optionCount} pilihan`,
          status: "belum",
          questionType: item.question_type || "-",
          imageUrl: item.image_url || "",
          options: item.options || [],
        };
      });

      setQuizzes(mappedQuizzes);
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan saat memuat data kuis.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  function handleStartQuiz() {
    if (!selectedQuiz?.id) return;

    navigate(`/quiz/${selectedQuiz.id}`);
    setSelectedQuiz(null);
  }

  return (
    <div
      className={`flex flex-col min-h-full ${dk.page} transition-colors duration-300`}
    >
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Belajar
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className={`flex-1 ${dk.page} px-4 pt-4 pb-8 flex flex-col gap-4`}>
        <div className="flex gap-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} {...metric} dk={dk} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <LoadingCard dk={dk} />
              <LoadingCard dk={dk} />
              <LoadingCard dk={dk} />
            </>
          ) : error ? (
            <InfoState
              title="Gagal memuat kuis"
              message={error}
              buttonText="Coba Lagi"
              onClick={fetchQuizzes}
              dk={dk}
              danger
            />
          ) : quizzes.length === 0 ? (
            <InfoState
              title="Belum ada soal kuis"
              message="Data soal kuis belum tersedia dari backend."
              buttonText="Refresh"
              onClick={fetchQuizzes}
              dk={dk}
            />
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPress={setSelectedQuiz}
                dk={dk}
              />
            ))
          )}
        </div>
      </div>

      <QuizModal
        quiz={selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
        onConfirm={handleStartQuiz}
        dk={dk}
      />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
