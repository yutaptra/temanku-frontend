import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getImageUrl(imageUrl) {
  if (!imageUrl || imageUrl === "string") return null;
  if (String(imageUrl).startsWith("http")) return imageUrl;

  return `${API_BASE_URL.replace(/\/$/, "")}/${String(imageUrl).replace(
    /^\//,
    "",
  )}`;
}

function getCorrectAnswer(question) {
  const answer = String(
    question?.answer || question?.correct_answer || "",
  ).trim();

  if (!answer) return "";

  const key = answer.toLowerCase();

  const options = Array.isArray(question?.options)
    ? question.options
    : [
        question?.option_a,
        question?.option_b,
        question?.option_c,
        question?.option_d,
      ];

  const optionMap = {
    a: options[0],
    b: options[1],
    c: options[2],
    d: options[3],
    option_a: options[0],
    option_b: options[1],
    option_c: options[2],
    option_d: options[3],
  };

  return optionMap[key] || answer;
}

export default function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dk = useDarkMode();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  const fetchQuestions = useCallback(async () => {
    if (!id) {
      setError("ID paket kuis tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(`/quiz/packages/${id}/questions`);
      const result = response.data;

      const questionList = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      if (!result?.success || questionList.length === 0) {
        throw new Error("Format data soal tidak sesuai.");
      }

      setQuestions(questionList);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowResult(false);
      setResultScore(null);
    } catch (err) {
      setError(err?.message || "Gagal memuat soal kuis.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];

    if (Array.isArray(currentQuestion.options)) {
      return currentQuestion.options.filter(
        (option) => option && String(option).trim() !== "",
      );
    }

    return [
      currentQuestion.option_a,
      currentQuestion.option_b,
      currentQuestion.option_c,
      currentQuestion.option_d,
    ].filter((option) => option && String(option).trim() !== "");
  }, [currentQuestion]);

  const selectedAnswer = selectedAnswers[currentIndex] || "";
  const isAnswered = Boolean(selectedAnswer);

  const imageUrl = getImageUrl(currentQuestion?.image_url);

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = getCorrectAnswer(question);

      if (
        userAnswer &&
        correctAnswer &&
        String(userAnswer).trim().toLowerCase() ===
          String(correctAnswer).trim().toLowerCase()
      ) {
        return total + 1;
      }

      return total;
    }, 0);
  }, [questions, selectedAnswers]);

  const displayScore = resultScore ?? 0;

  const finalScore = questions.length
    ? Math.round((displayScore / questions.length) * 100)
    : 0;

  function handleSelectAnswer(option) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  }

  function handlePrevious() {
    if (isFirstQuestion) return;
    setCurrentIndex((prev) => prev - 1);
  }

  function handleNext() {
    if (!isAnswered) return;

    if (isLastQuestion) {
      // Pastikan jawaban soal terakhir masuk ke finalAnswers
      const finalAnswers = {
        ...selectedAnswers,
        [currentIndex]: selectedAnswer,
      };

      const correctCount = questions.reduce((total, question, index) => {
        const userAnswer = finalAnswers[index];
        const correctAnswer = getCorrectAnswer(question);

        if (
          userAnswer &&
          correctAnswer &&
          String(userAnswer).trim().toLowerCase() ===
            String(correctAnswer).trim().toLowerCase()
        ) {
          return total + 1;
        }

        return total;
      }, 0);

      // Update selectedAnswers dulu, lalu set result
      setSelectedAnswers(finalAnswers);
      setResultScore(correctCount);
      setShowResult(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }

  if (showResult) {
    return (
      <div className={`min-h-screen ${dk.page} transition-colors duration-300`}>
        <div
          className="px-4 pt-12 pb-5"
          style={{
            background:
              "linear-gradient(160deg, #4A9BFF 0%, #2563EB 55%, #1848C8 100%)",
          }}
        >
          <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
            Hasil Kuis
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
              Kamu menjawab benar <b>{displayScore}</b> dari{" "}
              <b>{questions.length}</b> soal.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={fetchQuestions}
                className={`
                  flex-1 py-3 rounded-2xl border
                  font-semibold text-sm
                  active:scale-95 transition-transform
                  ${dk.cardInner} ${dk.textPrimary}
                `}
              >
                Ulangi
              </button>

              <button
                type="button"
                onClick={() => navigate("/learning")}
                className="
                  flex-1 py-3 rounded-2xl
                  font-semibold text-white text-sm
                  active:scale-95 transition-transform
                "
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
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Kuis
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
                  alt="Gambar soal kuis"
                  className="w-full max-h-72 object-contain"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {options.length > 0 ? (
                options.map((option, index) => {
                  const active = selectedAnswer === option;

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full text-left rounded-2xl border px-4 py-3 font-semibold text-sm transition-all active:scale-[0.98] ${
                        active
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : `${dk.cardInner} ${dk.textPrimary}`
                      }`}
                    >
                      {option}
                    </button>
                  );
                })
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
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`
                  flex-1 py-3 rounded-2xl border
                  font-semibold text-sm
                  flex items-center justify-center gap-2
                  disabled:opacity-50 active:scale-95 transition-transform
                  ${dk.cardInner} ${dk.textPrimary}
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered}
                className="
                  flex-1 py-3 rounded-2xl
                  font-semibold text-white text-sm
                  flex items-center justify-center gap-2
                  disabled:opacity-50 active:scale-95 transition-transform
                "
                style={{
                  background:
                    "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
                }}
              >
                {isLastQuestion ? "Selesai" : "Selanjutnya"}
                {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
