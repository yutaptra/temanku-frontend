import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const OPTION_KEYS = ["A", "B", "C", "D"];

function getImageUrl(url) {
  if (!url || url === "string") return null;
  if (String(url).startsWith("http")) return url;
  return `${API_BASE_URL.replace(/\/$/, "")}/${String(url).replace(/^\//, "")}`;
}

function getOptions(question) {
  const opts = Array.isArray(question?.options)
    ? question.options
    : [
        question?.option_a,
        question?.option_b,
        question?.option_c,
        question?.option_d,
      ];
  return opts.filter((o) => o && String(o).trim() !== "");
}

export default function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dk = useDarkMode();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("Kuis");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex] || "";
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const fetchQuestions = useCallback(async () => {
    if (!id) {
      setError("ID paket kuis tidak ditemukan.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const { data } = await api.get(`/quiz/public/${id}`);

      const list = Array.isArray(data?.data?.questions)
        ? data.data.questions
        : [];
      if (!data?.success || list.length === 0)
        throw new Error("Belum ada soal untuk paket kuis ini.");

      setQuestions(list);
      setQuizTitle(data.data?.title || "Kuis");
      setCurrentIndex(0);
      setSelectedAnswers({});
      setResult(null);
    } catch (err) {
      setError(err?.message || "Gagal memuat soal.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function handleSelectAnswer(option) {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  }

  async function handleNext() {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      const finalAnswers = {
        ...selectedAnswers,
        [currentIndex]: selectedAnswer,
      };
      setSelectedAnswers(finalAnswers);

      try {
        setIsSubmitting(true);
        const payload = {
          package_id: Number(id),
          answers: questions.map((q, i) => {
            const userAnswer = finalAnswers[i] || "";
            const opts = getOptions(q);
            const answerIndex = opts.indexOf(userAnswer);
            return {
              question_id: q.id,
              answer: answerIndex >= 0 ? OPTION_KEYS[answerIndex] : userAnswer,
            };
          }),
        };

        const { data } = await api.post("/quiz/submit", payload);
        if (!data?.success) throw new Error("Gagal menyimpan hasil.");

        setResult({
          score: data.data?.score ?? 0,
          total: data.data?.total_questions ?? questions.length,
        });
      } catch (err) {
        setError(err?.message || "Gagal mengirim jawaban.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }

  // --- RESULT SCREEN ---
  if (result) {
    const finalScore = Math.round((result.score / result.total) * 100);
    return (
      <div className={`min-h-screen ${dk.page} transition-colors duration-300`}>
        <div
          className="px-4 pt-12 pb-5"
          style={{
            background:
              "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
          }}
        >
          <h1 className="font-display font-extrabold text-white text-2xl">
            Hasil {quizTitle}
          </h1>
          <p className="text-blue-100 text-sm mt-0.5">
            Sistem Isyarat Bahasa Indonesia
          </p>
        </div>
        <div className="px-4 pt-4 pb-8">
          <div
            className={`${dk.card} rounded-3xl border shadow-sm p-6 text-center`}
          >
            <p className={`${dk.textSecondary} text-sm font-semibold mb-2`}>
              Skor Akhir
            </p>
            <h2
              className={`font-display font-extrabold ${dk.textPrimary} text-5xl`}
            >
              {finalScore}
            </h2>
            <p className={`${dk.textSecondary} text-sm mt-3`}>
              Kamu menjawab benar <b>{result.score}</b> dari{" "}
              <b>{result.total}</b> soal.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={fetchQuestions}
                className={`flex-1 py-3 rounded-2xl border font-semibold text-sm active:scale-95 transition-transform ${dk.cardInner} ${dk.textPrimary}`}
              >
                Ulangi
              </button>
              <button
                type="button"
                onClick={() => navigate("/learning")}
                className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform"
                style={{
                  background:
                    "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
                }}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN ---
  const imageUrl = getImageUrl(currentQuestion?.image_url);
  const options = getOptions(currentQuestion);

  return (
    <div className={`min-h-screen ${dk.page} transition-colors duration-300`}>
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-display font-extrabold text-white text-2xl">
          {quizTitle}
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className="px-4 pt-4 pb-8">
        {isLoading ? (
          <div className={`${dk.card} rounded-2xl border shadow-sm p-5`}>
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div
            className={`${dk.card} rounded-2xl border border-red-200 shadow-sm p-5`}
          >
            <p className="font-bold text-red-600">Gagal memuat soal</p>
            <p className={`${dk.textSecondary} text-sm mt-1`}>{error}</p>
            <button
              type="button"
              onClick={fetchQuestions}
              className="mt-4 px-5 py-2 rounded-xl font-semibold text-white text-sm active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              }}
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className={`${dk.card} rounded-2xl border shadow-sm p-5`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className={`${dk.textSecondary} text-xs font-semibold`}>
                Soal {currentIndex + 1} dari {questions.length}
              </p>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${dk.badge}`}
              >
                Pilihan Ganda
              </span>
            </div>

            <h2
              className={`font-display font-bold ${dk.textPrimary} text-xl leading-snug`}
            >
              {currentQuestion?.question_text || "Pertanyaan tidak tersedia."}
            </h2>

            {imageUrl && (
              <div
                className={`${dk.cardInner} rounded-2xl overflow-hidden mt-5 border`}
              >
                <img
                  src={imageUrl}
                  alt="Gambar soal"
                  className="w-full max-h-72 object-contain"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {options.length > 0 ? (
                options.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 font-semibold text-sm transition-all active:scale-[0.98] ${
                      selectedAnswer === option
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : `${dk.cardInner} ${dk.textPrimary}`
                    }`}
                  >
                    <span className="mr-2">{OPTION_KEYS[index]}.</span>
                    {option}
                  </button>
                ))
              ) : (
                <div className={`${dk.cardInner} rounded-2xl border p-4`}>
                  <p className={`${dk.textSecondary} text-sm`}>
                    Pilihan jawaban belum tersedia.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  !isFirstQuestion && setCurrentIndex((p) => p - 1)
                }
                disabled={isFirstQuestion}
                className={`flex-1 py-3 rounded-2xl border font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform ${dk.cardInner} ${dk.textPrimary}`}
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedAnswer || isSubmitting}
                className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
                style={{
                  background:
                    "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
                }}
              >
                {isSubmitting
                  ? "Mengirim..."
                  : isLastQuestion
                    ? "Selesai"
                    : "Selanjutnya"}
                {!isLastQuestion && !isSubmitting && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
