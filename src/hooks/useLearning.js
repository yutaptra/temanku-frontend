import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";

export const EMPTY_PACKAGE_FORM = {
  id: null,
  title: "",
  description: "",
  difficulty: "easy",
};

const DIFFICULTY_LABEL = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

function getDifficultyLabel(difficulty) {
  const key = String(difficulty || "easy").toLowerCase();
  return DIFFICULTY_LABEL[key] || difficulty || "Mudah";
}

function getDuration(totalQuestions, difficulty) {
  const secondsPerQuestion = {
    easy: 30,
    medium: 45,
    hard: 60,
  };

  const totalSeconds = (secondsPerQuestion[difficulty] || 45) * totalQuestions;
  const minutes = Math.ceil(totalSeconds / 60);

  return `± ${minutes} mnt`;
}

function getErrorMessage(err, fallback) {
  const detail = err.response?.data?.detail;

  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(", ");
  if (err.response?.data?.message) return err.response.data.message;

  return fallback;
}

function validatePackageForm(form, setFormError) {
  if (!form.title.trim()) {
    setFormError("Judul paket tidak boleh kosong.");
    return false;
  }

  if (!form.description.trim()) {
    setFormError("Deskripsi paket tidak boleh kosong.");
    return false;
  }

  if (!form.difficulty) {
    setFormError("Tingkat kesulitan wajib dipilih.");
    return false;
  }

  return true;
}

export function useLearning() {
  const [quizzes, setQuizzes] = useState([]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_PACKAGE_FORM);
  const [addError, setAddError] = useState("");

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_PACKAGE_FORM);
  const [editError, setEditError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const successTimerRef = useRef(null);

  const showSuccess = useCallback((msg) => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setSuccess(msg);
    successTimerRef.current = setTimeout(() => setSuccess(""), 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const metrics = useMemo(() => {
    const mudah = quizzes.filter((q) => q.rawCategory === "easy").length;
    const sedang = quizzes.filter((q) => q.rawCategory === "medium").length;
    const sulit = quizzes.filter((q) => q.rawCategory === "hard").length;

    return [
      { id: "easy", label: "Mudah", value: mudah, icon: "easy" },
      { id: "medium", label: "Sedang", value: sedang, icon: "medium" },
      { id: "hard", label: "Sulit", value: sulit, icon: "hard" },
    ];
  }, [quizzes]);

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
        title: item.title || "Paket Belajar",
        description: item.description || "Deskripsi paket belum tersedia.",
        difficulty: getDifficultyLabel(item.difficulty),
        rawCategory: item.difficulty || "easy",
        duration: getDuration(item.total_questions || 0, item.difficulty),
        count: `${item.total_questions || 0} soal`,
        questionType: "Pilihan Ganda",
        totalQuestions: item.total_questions || 0,
        raw: item,
      }));

      setQuizzes(mappedQuizzes);
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan saat memuat paket belajar.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  function openAddModal() {
    setAddError("");
    setAddForm(EMPTY_PACKAGE_FORM);
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (isSubmitting) return;
    setShowAddModal(false);
    setAddError("");
    setAddForm(EMPTY_PACKAGE_FORM);
  }

  async function handleAddQuiz(e) {
    e.preventDefault();
    setAddError("");

    if (!validatePackageForm(addForm, setAddError)) return;

    setIsSubmitting(true);

    try {
      const payload = new URLSearchParams();
      payload.append("title", addForm.title.trim());
      payload.append("description", addForm.description.trim());
      payload.append("difficulty", addForm.difficulty);

      await api.post("/quiz/packages", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setShowAddModal(false);
      setAddForm(EMPTY_PACKAGE_FORM);
      showSuccess("Paket belajar berhasil ditambahkan.");

      await fetchQuizzes();
    } catch (err) {
      console.error(err);
      setAddError(getErrorMessage(err, "Gagal menambahkan paket belajar."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditModal(quiz) {
    setEditError("");
    setEditTarget(quiz);
    setEditForm({
      id: quiz.id,
      title: quiz.raw?.title || quiz.title || "",
      description: quiz.raw?.description || quiz.description || "",
      difficulty: quiz.raw?.difficulty || quiz.rawCategory || "easy",
    });
  }

  function closeEditModal() {
    if (isSubmitting) return;
    setEditTarget(null);
    setEditError("");
    setEditForm(EMPTY_PACKAGE_FORM);
  }

  async function handleEditQuiz(e) {
    e.preventDefault();
    setEditError("");

    if (!validatePackageForm(editForm, setEditError)) return;

    setIsSubmitting(true);

    try {
      const payload = new URLSearchParams();
      payload.append("title", editForm.title.trim());
      payload.append("description", editForm.description.trim());
      payload.append("difficulty", editForm.difficulty);

      await api.put(`/quiz/packages/${editForm.id}`, payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setEditTarget(null);
      setEditForm(EMPTY_PACKAGE_FORM);
      showSuccess("Paket belajar berhasil diperbarui.");

      await fetchQuizzes();
    } catch (err) {
      console.error(err);
      setEditError(getErrorMessage(err, "Gagal memperbarui paket belajar."));
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

    try {
      await api.delete(`/quiz/packages/${quiz.id}`);

      setDeleteTarget(null);
      showSuccess("Paket belajar berhasil dihapus.");

      await fetchQuizzes();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Gagal menghapus paket belajar."));
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
