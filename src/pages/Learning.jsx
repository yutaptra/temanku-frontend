import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Data dummy — ganti dengan fetch API ───────────────────────
const METRICS = [
  {
    id: "exp",
    label: "Poin EXP",
    value: "100",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <path
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0
          .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0
          0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0
          0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
          0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563
          0 0 0 .475-.345L11.48 3.5z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.5"
        />
      </svg>
    ),
  },
  {
    id: "achievement",
    label: "Pencapaian",
    value: "12",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <path
          d="M8 21l3-3-3-3"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10V3l3 3-3 3"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 7H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h16a1 1 0 0 0
          1-1V8a1 1 0 0 0-1-1h-2"
          stroke="#D97706"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "completion",
    label: "Penyelesaian",
    value: "90%",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="#10B981" strokeWidth="2" />
        <circle cx="12" cy="12" r="1.5" fill="#10B981" />
      </svg>
    ),
  },
];

const QUIZZES = [
  {
    id: 1,
    title: "Kuis 1",
    description: "Tebak gambar bahasa isyarat alfabet",
    difficulty: "Mudah",
    duration: "10 mnt",
    count: "8 isyarat",
    status: "selesai",
  },
  {
    id: 2,
    title: "Kuis 2",
    description: "Tebak gambar bahasa isyarat kosakata",
    difficulty: "Mudah",
    duration: "10 mnt",
    count: "8 isyarat",
    status: "selesai",
  },
  {
    id: 3,
    title: "Kuis 3",
    description: "Tebak gambar bahasa isyarat alfabet dan kosakata",
    difficulty: "Sedang",
    duration: "20 mnt",
    count: "15 isyarat",
    status: "belum",
  },
];

// ── Config difficulty ─────────────────────────────────────────
const DIFFICULTY_CONFIG = {
  Mudah: { bg: "bg-green-100", text: "text-green-700" },
  Sedang: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Sulit: { bg: "bg-red-100", text: "text-red-600" },
};

// ── Ikon status kuis ──────────────────────────────────────────
function QuizStatusIcon({ status }) {
  if (status === "selesai") {
    return (
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4 12 14.01l-3-3" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0">
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    </div>
  );
}

// ── Kartu kuis ────────────────────────────────────────────────
function QuizCard({ quiz, onPress }) {
  const diff = DIFFICULTY_CONFIG[quiz.difficulty] ?? DIFFICULTY_CONFIG["Mudah"];
  const isDone = quiz.status === "selesai";

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
      {/* Baris atas: ikon + judul + badge status */}
      <div className="flex items-start gap-3 mb-3">
        <QuizStatusIcon status={quiz.status} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-neutral-800 text-base leading-tight">
              {quiz.title}
            </h3>
            {/* Badge status */}
            <span
              className={`
              flex-shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full
              ${
                isDone
                  ? "bg-green-100 text-green-700"
                  : "bg-primary-100 text-primary-700"
              }
            `}
            >
              {isDone ? "Selesai" : "Belum"}
            </span>
          </div>
          <p className="text-neutral-500 text-xs leading-snug">
            {quiz.description}
          </p>
        </div>
      </div>

      {/* Meta info: difficulty + durasi + jumlah */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}
        >
          {quiz.difficulty}
        </span>
        <span className="text-neutral-300 text-xs">•</span>
        <span className="text-neutral-500 text-xs">{quiz.duration}</span>
        <span className="text-neutral-300 text-xs">•</span>
        <span className="text-neutral-500 text-xs">{quiz.count}</span>
      </div>

      {/* Tombol aksi */}
      <button
        onClick={() => onPress(quiz)}
        className={`
          flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm
          transition-all duration-200 active:scale-95
          ${
            isDone
              ? "bg-primary-600 text-white shadow-sm shadow-primary-200"
              : "bg-primary-600 text-white shadow-sm shadow-primary-200"
          }
        `}
        style={{ boxShadow: "0 3px 10px rgba(59,125,255,0.3)" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
        {isDone ? "Tinjau" : "Mulai"}
      </button>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────
function MetricCard({ label, value, icon }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 flex flex-col items-center gap-1.5">
      {icon}
      <p className="text-neutral-500 text-[11px] font-medium text-center leading-tight">
        {label}
      </p>
      <p className="font-display font-extrabold text-neutral-800 text-xl leading-none">
        {value}
      </p>
    </div>
  );
}

// ── Modal konfirmasi mulai kuis ───────────────────────────────
function QuizModal({ quiz, onClose, onConfirm }) {
  if (!quiz) return null;
  const isDone = quiz.status === "selesai";
  const diff = DIFFICULTY_CONFIG[quiz.difficulty] ?? DIFFICULTY_CONFIG["Mudah"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-mobile rounded-t-3xl px-5 pt-4 pb-10"
        style={{ animation: "slideUp .25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

        {/* Header modal */}
        <div className="flex items-center gap-3 mb-4">
          <QuizStatusIcon status={quiz.status} />
          <div>
            <h2 className="font-display font-bold text-neutral-800 text-xl">
              {quiz.title}
            </h2>
            <p className="text-neutral-500 text-sm">{quiz.description}</p>
          </div>
        </div>

        {/* Detail */}
        <div className="bg-neutral-50 rounded-2xl p-4 mb-5 flex flex-col gap-2">
          {[
            {
              label: "Tingkat Kesulitan",
              value: quiz.difficulty,
              colored: true,
            },
            { label: "Durasi Estimasi", value: quiz.duration },
            { label: "Jumlah Isyarat", value: quiz.count },
            { label: "Status", value: isDone ? "Selesai" : "Belum dikerjakan" },
          ].map(({ label, value, colored }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-neutral-500 text-sm">{label}</span>
              {colored ? (
                <span
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}
                >
                  {value}
                </span>
              ) : (
                <span className="text-neutral-800 text-sm font-semibold">
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Tombol */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
            flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
            boxShadow: "0 4px 14px rgba(59,125,255,0.4)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
          {isDone ? "Tinjau Kuis" : "Mulai Kuis"}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2.5 mt-2 rounded-2xl font-semibold text-neutral-500
            text-sm active:scale-95 transition-transform hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

// ── Halaman Belajar ───────────────────────────────────────────
export default function Learning() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  function handleQuizPress(quiz) {
    setSelectedQuiz(quiz);
  }

  function handleStartQuiz() {
    // TODO: navigasi ke halaman kuis
    // navigate(`/quiz/${selectedQuiz.id}`);
    setSelectedQuiz(null);
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── HEADER ──────────────────────────────────────────── */}
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

      {/* ── KONTEN ──────────────────────────────────────────── */}
      <div className="flex-1 bg-neutral-50 px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Metric cards */}
        <div className="flex gap-3">
          {METRICS.map((m) => (
            <MetricCard
              key={m.id}
              label={m.label}
              value={m.value}
              icon={m.icon}
            />
          ))}
        </div>

        {/* Daftar kuis */}
        <div className="flex flex-col gap-3">
          {QUIZZES.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onPress={handleQuizPress} />
          ))}
        </div>
      </div>

      {/* ── MODAL ───────────────────────────────────────────── */}
      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onConfirm={handleStartQuiz}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
