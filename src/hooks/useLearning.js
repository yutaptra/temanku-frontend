import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

export const EMPTY_QUIZ_FORM = {
  id: null,
  question_text: "",
  answer: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  file: null,
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

function getErrorMessage(err, fallback) {
  const detail = err.response?.data?.detail;

  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(", ");
  if (err.response?.data?.message) return err.response.data.message;

  return fallback;
}

function buildQuizFormData(form) {
  const formData = new FormData();

  formData.append("question_text", form.question_text.trim());
  formData.append("answer", form.answer.trim());
  formData.append("option_a", form.option_a.trim());
  formData.append("option_b", form.option_b.trim());
  formData.append("option_c", form.option_c.trim());
  formData.append("option_d", form.option_d.trim());

  if (form.file) {
    formData.append("file", form.file);
  }

  return formData;
}

function validateQuizForm(form, setFormError, requireFile = false) {
  if (!form.question_text.trim()) {
    setFormError("Pertanyaan tidak boleh kosong.");
    return false;
  }

  if (!form.answer.trim()) {
    setFormError("Jawaban benar tidak boleh kosong.");
    return false;
  }

  if (!form.option_a.trim() || !form.option_b.trim()) {
    setFormError("Minimal pilihan A dan B wajib diisi.");
    return false;
  }

  if (requireFile && !form.file) {
    setFormError("Gambar soal wajib dipilih.");
    return false;
  }

  return true;
}

export function useLearning() {
  const [quizzes, setQuizzes] = useState([]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_QUIZ_FORM);
  const [addError, setAddError] = useState("");

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_QUIZ_FORM);
  const [editError, setEditError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const metrics = useMemo(
    () => [
      {
        id: "exp",
        label: "Poin EXP",
        value: quizzes.length * 10,
        icon: "sparkles",
      },
      {
        id: "questions",
        label: "Jumlah Soal",
        value: quizzes.length,
        icon: "clipboard",
      },
      {
        id: "completion",
        label: "Penyelesaian",
        value: "0%",
        icon: "target",
      },
    ],
    [quizzes.length],
  );

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get("/quiz/public");
      const result = response.data;

      if (!result?.success || !Array.isArray(result?.data)) {
        throw new Error("Format data dari server tidak sesuai.");
      }

      const mappedQuizzes = result.data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        difficulty: getDifficultyLabel(item.difficulty),
        rawCategory: item.difficulty,
        duration: "± 5 mnt",
        count: `${item.total_questions || 0} soal`,
        status: "belum",
        questionType: "Pilihan Ganda",
        raw: item,
      }));

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

  function openAddModal() {
    setAddError("");
    setAddForm(EMPTY_QUIZ_FORM);
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (isSubmitting) return;
    setShowAddModal(false);
    setAddError("");
  }

  async function handleAddQuiz(e) {
    e.preventDefault();

    setAddError("");

    if (!validateQuizForm(addForm, setAddError, true)) return;

    setIsSubmitting(true);
    setSuccess("");

    try {
      const formData = buildQuizFormData(addForm);

      await api.post("/quiz/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowAddModal(false);
      setAddForm(EMPTY_QUIZ_FORM);
      setSuccess("Soal kuis berhasil ditambahkan.");

      await fetchQuizzes();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setAddError(getErrorMessage(err, "Gagal menambahkan soal kuis."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditModal(quiz) {
    const options = quiz.options || [];

    setEditError("");
    setEditTarget(quiz);
    setEditForm({
      id: quiz.id,
      question_text: quiz.description || "",
      answer: quiz.answer || "",
      option_a: options[0] || "",
      option_b: options[1] || "",
      option_c: options[2] || "",
      option_d: options[3] || "",
      file: null,
    });
  }

  function closeEditModal() {
    if (isSubmitting) return;
    setEditTarget(null);
    setEditError("");
  }

  async function handleEditQuiz(e) {
    e.preventDefault();

    setEditError("");

    if (!validateQuizForm(editForm, setEditError, false)) return;

    setIsSubmitting(true);
    setSuccess("");

    try {
      const formData = buildQuizFormData(editForm);

      await api.put(`/quiz/questions/${editForm.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditTarget(null);
      setEditForm(EMPTY_QUIZ_FORM);
      setSuccess("Soal kuis berhasil diperbarui.");

      await fetchQuizzes();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setEditError(getErrorMessage(err, "Gagal memperbarui soal kuis."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeDeleteModal() {
    if (isSubmitting) return;
    setDeleteTarget(null);
  }

  async function handleDeleteQuiz(quiz) {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/quiz/questions/${quiz.id}`);

      setDeleteTarget(null);
      setSuccess("Soal kuis berhasil dihapus.");

      await fetchQuizzes();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Gagal menghapus soal kuis."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    quizzes,
    metrics,

    selectedQuiz,
    setSelectedQuiz,

    showAddModal,
    openAddModal,
    closeAddModal,
    addForm,
    setAddForm,
    addError,
    handleAddQuiz,

    editTarget,
    openEditModal,
    closeEditModal,
    editForm,
    setEditForm,
    editError,
    handleEditQuiz,

    deleteTarget,
    setDeleteTarget,
    closeDeleteModal,
    handleDeleteQuiz,

    isLoading,
    isSubmitting,
    error,
    success,

    fetchQuizzes,
  };
}
