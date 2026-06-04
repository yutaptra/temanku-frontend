import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
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

const INITIAL_FORM = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  answer: "",
  file: null,
};

export default function QuizQuestionManager() {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const dk = useDarkMode();

  const [questions, setQuestions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editTarget, setEditTarget] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(`/quiz/packages/${packageId}/questions`);

      const result = response.data;

      const questionList = Array.isArray(result?.data) ? result.data : [];

      setQuestions(questionList);
    } catch (err) {
      setError(err?.message || "Gagal memuat soal.");
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function openAddModal() {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  }

  function openEditModal(question) {
    setEditTarget(question);

    setForm({
      question_text: question.question_text || "",
      option_a: question.option_a || "",
      option_b: question.option_b || "",
      option_c: question.option_c || "",
      option_d: question.option_d || "",
      answer: question.answer || "",
      file: null,
    });

    setShowModal(true);
  }

  function closeModal() {
    if (isSubmitting) return;

    setShowModal(false);
    setEditTarget(null);
    setForm(INITIAL_FORM);
  }

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const payload = new FormData();

      payload.append("question_text", form.question_text);
      payload.append("option_a", form.option_a);
      payload.append("option_b", form.option_b);
      payload.append("option_c", form.option_c);
      payload.append("option_d", form.option_d);
      payload.append("answer", form.answer);

      if (form.file) {
        payload.append("file", form.file);
      }

      if (editTarget) {
        await api.put(`/quiz/questions/${editTarget.id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Soal berhasil diperbarui.");
      } else {
        await api.post(`/quiz/packages/${packageId}/questions`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Soal berhasil ditambahkan.");
      }

      closeModal();
      fetchQuestions();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan soal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(question) {
    const confirmed = window.confirm(
      `Hapus soal "${question.question_text}" ?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/quiz/questions/${question.id}`);

      setSuccess("Soal berhasil dihapus.");

      fetchQuestions();
    } catch (err) {
      setError(err?.message || "Gagal menghapus soal.");
    }
  }

  return (
    <div className={`min-h-screen ${dk.page}`}>
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
          className="
            w-10 h-10 rounded-2xl
            bg-white/20 text-white
            flex items-center justify-center
            mb-4 active:scale-95 transition-transform
          "
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-display font-extrabold text-white text-2xl">
          Kelola Soal
        </h1>

        <p className="text-blue-100 text-sm mt-0.5">Paket Kuis #{packageId}</p>
      </div>

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={openAddModal}
          className="
            w-full py-3 rounded-2xl
            font-semibold text-white text-sm
            flex items-center justify-center gap-2
            active:scale-95 transition-transform
          "
          style={{
            background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
          }}
        >
          <Plus className="w-4 h-4" />
          Tambah Soal
        </button>

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-green-600 text-sm font-semibold">{success}</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className={`${dk.card} rounded-2xl border p-5`}>
            <p className={`${dk.textSecondary} text-sm`}>Memuat soal...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className={`${dk.card} rounded-2xl border p-5`}>
            <p className={`${dk.textPrimary} font-semibold`}>Belum ada soal</p>

            <p className={`${dk.textSecondary} text-sm mt-1`}>
              Tambahkan soal pertama untuk paket kuis ini.
            </p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className={`${dk.card} rounded-2xl border shadow-sm p-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p
                    className={`${dk.textSecondary} text-xs font-semibold mb-1`}
                  >
                    Soal {index + 1}
                  </p>

                  <h2
                    className={`font-semibold ${dk.textPrimary} text-sm leading-relaxed`}
                  >
                    {question.question_text}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      question.option_a,
                      question.option_b,
                      question.option_c,
                      question.option_d,
                    ]
                      .filter(Boolean)
                      .map((option, idx) => (
                        <span
                          key={idx}
                          className={`
                            ${dk.cardInner}
                            px-3 py-1 rounded-xl border
                            text-xs ${dk.textSecondary}
                          `}
                        >
                          {option}
                        </span>
                      ))}
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
                    type="button"
                    onClick={() => openEditModal(question)}
                    className={`
                      ${dk.cardInner}
                      w-10 h-10 rounded-xl border
                      flex items-center justify-center
                    `}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(question)}
                    className="
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      bg-red-500 text-white
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/45 px-4 py-4
          "
        >
          <form
            onSubmit={handleSubmit}
            className={`
              ${dk.card}
              border w-full max-w-lg rounded-3xl
              p-5 max-h-[92vh] overflow-y-auto
            `}
          >
            <h2
              className={`font-display font-bold ${dk.textPrimary} text-xl mb-4`}
            >
              {editTarget ? "Edit Soal" : "Tambah Soal"}
            </h2>

            <div className="flex flex-col gap-3">
              <textarea
                name="question_text"
                value={form.question_text}
                onChange={handleChange}
                placeholder="Pertanyaan"
                rows={3}
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <input
                name="option_a"
                value={form.option_a}
                onChange={handleChange}
                placeholder="Pilihan A"
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <input
                name="option_b"
                value={form.option_b}
                onChange={handleChange}
                placeholder="Pilihan B"
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <input
                name="option_c"
                value={form.option_c}
                onChange={handleChange}
                placeholder="Pilihan C"
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <input
                name="option_d"
                value={form.option_d}
                onChange={handleChange}
                placeholder="Pilihan D"
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <input
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Jawaban benar (a/b/c/d)"
                className={`${dk.input} px-4 py-3 rounded-2xl border`}
              />

              <label
                className={`
                  ${dk.cardInner}
                  rounded-2xl border px-4 py-3
                  flex items-center gap-3 cursor-pointer
                `}
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
                  onChange={handleFile}
                />
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`
                    ${dk.cardInner}
                    flex-1 py-3 rounded-2xl border
                    font-semibold text-sm ${dk.textPrimary}
                  `}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    flex-1 py-3 rounded-2xl
                    font-semibold text-white text-sm
                    disabled:opacity-60
                  "
                  style={{
                    background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
                  }}
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editTarget
                      ? "Simpan"
                      : "Tambah"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
