import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../services/api";
import QuestionCard from "../components/question/QuestionCard";
import QuestionFormModal from "../components/question/QuestionFormModal";
import DeleteQuestionModal from "../components/question/DeleteQuestionModal";

const INITIAL_FORM = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  answer: "",
  file: null,
};

const BTN_GRADIENT = {
  background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
};

export default function QuestionManager() {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const dk = useDarkMode();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("Kuis");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const successTimerRef = useRef(null);

  const showSuccess = useCallback((message) => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);

    setSuccess(message);

    successTimerRef.current = setTimeout(() => {
      setSuccess("");
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const fetchPackageTitle = useCallback(async () => {
    try {
      const { data } = await api.get(`/quiz/public/${packageId}`);
      setQuizTitle(data.data?.title || "Kuis");
    } catch {
      setQuizTitle("Kuis");
    }
  }, [packageId]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const { data } = await api.get(`/quiz/packages/${packageId}/questions`);
      setQuestions(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err?.message || "Gagal memuat soal.");
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchPackageTitle();
    fetchQuestions();
  }, [fetchPackageTitle, fetchQuestions]);

  function openAddModal() {
    setEditTarget(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  }

  function openEditModal(q) {
    setEditTarget(q);
    setForm({
      question_text: q.question_text || "",
      option_a: q.option_a || "",
      option_b: q.option_b || "",
      option_c: q.option_c || "",
      option_d: q.option_d || "",
      answer: q.answer || "",
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

  function handleChange({ target: { name, value } }) {
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

      [
        "question_text",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "answer",
      ].forEach((key) => {
        payload.append(key, form[key]);
      });

      if (form.file) {
        payload.append("file", form.file);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      if (editTarget) {
        await api.put(`/quiz/questions/${editTarget.id}`, payload, {
          headers,
        });

        showSuccess("Soal berhasil diperbarui.");
      } else {
        await api.post(`/quiz/packages/${packageId}/questions`, payload, {
          headers,
        });

        showSuccess("Soal berhasil ditambahkan.");
      }

      closeModal();
      await fetchQuestions();
    } catch (err) {
      setError(err?.message || "Gagal menyimpan soal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?.id) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await api.delete(`/quiz/questions/${deleteTarget.id}`);

      setDeleteTarget(null);
      showSuccess("Soal berhasil dihapus.");

      await fetchQuestions();
    } catch (err) {
      setError(err?.message || "Gagal menghapus soal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className={`min-h-screen ${dk.page}`}>
        <div
          className="px-4 pt-12 pb-5"
          style={{
            background:
              "linear-gradient(160deg,#4A9BFF 0%,#2563EB 55%,#1848C8 100%)",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="font-display font-extrabold text-white text-2xl">
            {quizTitle}
          </h1>

          <p className="text-blue-100 text-sm mt-0.5">
            Sistem Isyarat Bahasa Indonesia
          </p>
        </div>

        <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={openAddModal}
            style={BTN_GRADIENT}
            className="w-full py-3 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
              <p className={`${dk.textPrimary} font-semibold`}>
                Belum ada soal
              </p>
              <p className={`${dk.textSecondary} text-sm mt-1`}>
                Tambahkan soal pertama untuk paket belajar ini.
              </p>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                dk={dk}
                question={q}
                index={i}
                onEdit={() => openEditModal(q)}
                onDelete={() => setDeleteTarget(q)}
              />
            ))
          )}
        </div>

        {showModal && (
          <QuestionFormModal
            dk={dk}
            editTarget={editTarget}
            form={form}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onFile={handleFile}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />
        )}

        {deleteTarget && (
          <DeleteQuestionModal
            dk={dk}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </>
  );
}
