import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
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

export default function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dk = useDarkMode();

  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestion = useCallback(async () => {
    if (!id) {
      setError("ID soal tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(`/quiz/questions/public/${id}`);
      const result = response.data;

      if (!result?.success || !result?.data) {
        throw new Error("Format data soal tidak sesuai.");
      }

      const questionData = Array.isArray(result.data)
        ? result.data[0]
        : result.data;

      if (!questionData) {
        throw new Error("Soal tidak ditemukan.");
      }

      setQuestion(questionData);

      setQuestion(result.data);
      setSelectedAnswer("");
      setIsChecked(false);
    } catch (err) {
      setError(err?.message || "Gagal memuat detail kuis.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const options = useMemo(() => {
    if (!Array.isArray(question?.options)) return [];
    return question.options.filter(
      (option) => option && String(option).trim() !== "",
    );
  }, [question]);

  const correctAnswer =
    question?.answer ||
    question?.correct_answer ||
    question?.correctAnswer ||
    "";

  const hasCorrectAnswer = correctAnswer && String(correctAnswer).trim() !== "";

  const isCorrect =
    hasCorrectAnswer &&
    selectedAnswer.trim().toLowerCase() ===
      String(correctAnswer).trim().toLowerCase();

  const imageUrl = getImageUrl(question?.image_url);

  function handleSelectAnswer(option) {
    setSelectedAnswer(option);
    setIsChecked(false);
  }

  function handleCheckAnswer() {
    if (!selectedAnswer) return;
    setIsChecked(true);
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
              onClick={fetchQuestion}
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
            <p className={`${dk.textSecondary} text-xs font-semibold mb-2`}>
              Pertanyaan
            </p>

            <h2
              className={`font-display font-bold ${dk.textPrimary} text-xl leading-snug`}
            >
              {question?.question_text || "Pertanyaan tidak tersedia."}
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

            {isChecked && (
              <div
                className={`mt-5 rounded-2xl p-4 ${
                  isCorrect
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <p className="font-bold">
                  {isCorrect ? "Jawaban benar!" : "Jawaban belum tepat"}
                </p>

                {!hasCorrectAnswer && (
                  <p className="text-sm mt-1">
                    Jawaban benar belum tersedia dari backend.
                  </p>
                )}

                {!isCorrect && hasCorrectAnswer && (
                  <p className="text-sm mt-1">
                    Jawaban yang benar: <b>{correctAnswer}</b>
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer || options.length === 0}
              className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-white text-sm disabled:opacity-50 active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
                boxShadow: "0 4px 14px rgba(59,125,255,0.4)",
              }}
            >
              Periksa Jawaban
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
