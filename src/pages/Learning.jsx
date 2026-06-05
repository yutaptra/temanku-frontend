import { ClipboardList, Plus, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLearning } from "../hooks/useLearning";

import MetricCard from "../components/learning/MetricCard";
import QuizCard from "../components/learning/QuizCard";
import QuizModal from "../components/learning/QuizModal";
import QuizFormModal from "../components/learning/QuizFormModal";
import DeleteQuizModal from "../components/learning/DeleteQuizModal";
import LoadingCard from "../components/learning/LoadingCard";
import InfoState from "../components/learning/InfoState";

export default function Learning() {
  const navigate = useNavigate();
  const dk = useDarkMode();
  const { state } = useApp();

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");

  const userRole =
    state.user?.role ||
    state.user?.data?.role ||
    savedUser?.role ||
    savedUser?.data?.role ||
    "";

  const isAdmin = String(userRole).toLowerCase() === "admin";

  const {
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
  } = useLearning();

  const iconMap = {
    sparkles: <Sparkles className="w-7 h-7 text-amber-500" />,
    clipboard: <ClipboardList className="w-7 h-7 text-orange-500" />,
    target: <Target className="w-7 h-7 text-green-500" />,
  };

  function handleStartQuiz() {
    if (!selectedQuiz?.id) return;

    navigate(`/quiz/${selectedQuiz.id}`);
    setSelectedQuiz(null);
  }

  function handleManageQuestions(quiz) {
    navigate(`/learning/packages/${quiz.id}/questions`);
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
            <MetricCard
              key={metric.id}
              {...metric}
              icon={iconMap[metric.icon]}
              dk={dk}
            />
          ))}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="
              w-full flex items-center justify-center gap-2
              py-3 rounded-2xl font-semibold text-white text-sm
              active:scale-95 transition-transform
            "
            style={{
              background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
              boxShadow: "0 4px 14px rgba(59,125,255,0.35)",
            }}
          >
            <Plus className="w-4 h-4" />
            Tambah Paket Kuis
          </button>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-green-600 text-sm font-semibold">{success}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <LoadingCard dk={dk} />
              <LoadingCard dk={dk} />
              <LoadingCard dk={dk} />
            </>
          ) : error ? (
            <InfoState
              title="Gagal memuat paket kuis"
              message={error}
              buttonText="Coba Lagi"
              onClick={fetchQuizzes}
              dk={dk}
              danger
            />
          ) : quizzes.length === 0 ? (
            <InfoState
              title="Belum ada paket kuis"
              message="Data paket kuis belum tersedia dari backend."
              buttonText="Refresh"
              onClick={fetchQuizzes}
              dk={dk}
            />
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                dk={dk}
                isAdmin={isAdmin}
                onPress={setSelectedQuiz}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
                onManageQuestions={handleManageQuestions}
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

      {showAddModal && (
        <QuizFormModal
          title="Tambah Paket Kuis"
          submitText="Simpan Paket"
          form={addForm}
          setForm={setAddForm}
          error={addError}
          onClose={closeAddModal}
          onSubmit={handleAddQuiz}
          isSubmitting={isSubmitting}
          dk={dk}
        />
      )}

      {editTarget && (
        <QuizFormModal
          title="Edit Paket Kuis"
          submitText="Simpan Perubahan"
          form={editForm}
          setForm={setEditForm}
          error={editError}
          onClose={closeEditModal}
          onSubmit={handleEditQuiz}
          isSubmitting={isSubmitting}
          dk={dk}
        />
      )}

      {deleteTarget && (
        <DeleteQuizModal
          dk={dk}
          quiz={deleteTarget}
          isSubmitting={isSubmitting}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteQuiz(deleteTarget)}
        />
      )}
    </div>
  );
}
