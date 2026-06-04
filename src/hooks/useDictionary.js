import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  getErrorMessage,
  mapDictionaryItem,
  sortDictionary,
} from "../utils/dictionaryUtils";

const initialForm = {
  name: "",
  description: "",
  category: "Kosakata",
  file: null,
};

export function useDictionary() {
  const [dictionary, setDictionary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [addError, setAddError] = useState("");

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    ...initialForm,
  });
  const [editError, setEditError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDictionary();
  }, []);

  const filteredDictionary = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();

    return dictionary.filter((item) => {
      const matchFilter =
        activeFilter === "Semua" || item.category === activeFilter;

      const matchSearch =
        !keyword ||
        (item.name || "").toLowerCase().includes(keyword) ||
        (item.description || "").toLowerCase().includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [dictionary, searchQuery, activeFilter]);

  async function fetchDictionary() {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.get("/dictionary/");
      const list = res.data?.data || [];
      const mappedData = list.map(mapDictionaryItem);

      setDictionary(sortDictionary(mappedData));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data kamus.");
    } finally {
      setIsLoading(false);
    }
  }

  function showSuccess(message) {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }

  function resetAddForm() {
    setAddForm(initialForm);
    setAddError("");
  }

  function resetEditForm() {
    setEditTarget(null);
    setEditError("");
    setEditForm({
      id: null,
      ...initialForm,
    });
  }

  function handleAddChange(e) {
    setAddError("");

    setAddForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleAddFile(e) {
    setAddError("");

    setAddForm((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  }

  async function handleAddDictionary(e) {
    e.preventDefault();

    if (!addForm.name.trim()) {
      setAddError("Nama isyarat tidak boleh kosong.");
      return;
    }

    if (!addForm.description.trim()) {
      setAddError("Deskripsi tidak boleh kosong.");
      return;
    }

    if (!addForm.file) {
      setAddError("Gambar isyarat wajib dipilih.");
      return;
    }

    setIsSubmitting(true);
    setAddError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", addForm.file);

      await api.post("/dictionary/", formData, {
        params: {
          name: addForm.name.trim(),
          category: addForm.category,
          description: addForm.description.trim(),
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowAddModal(false);
      resetAddForm();

      showSuccess("Data kamus berhasil ditambahkan.");
      await fetchDictionary();
    } catch (err) {
      console.error(err);
      setAddError(getErrorMessage(err, "Gagal menambahkan data kamus."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditChange(e) {
    setEditError("");

    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleEditFile(e) {
    setEditError("");

    setEditForm((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  }

  function openEditModal(item) {
    setEditError("");
    setEditTarget(item);

    setEditForm({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      category: item.category || "Kosakata",
      file: null,
    });
  }

  async function handleEditDictionary(e) {
    e.preventDefault();

    if (!editForm.name.trim()) {
      setEditError("Nama isyarat tidak boleh kosong.");
      return;
    }

    if (!editForm.description.trim()) {
      setEditError("Deskripsi tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    setSuccess("");

    try {
      const formData = new FormData();

      if (editForm.file) {
        formData.append("file", editForm.file);
      }

      await api.put(`/dictionary/${editForm.id}`, formData, {
        params: {
          name: editForm.name.trim(),
          category: editForm.category,
          description: editForm.description.trim(),
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      resetEditForm();
      setSelectedItem(null);

      showSuccess("Data kamus berhasil diperbarui.");
      await fetchDictionary();
    } catch (err) {
      console.error(err);
      setEditError(getErrorMessage(err, "Gagal memperbarui data kamus."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDictionary(item) {
    setIsSubmitting(true);
    setError("");

    try {
      await api.delete(`/dictionary/${item.id}`);

      setDeleteTarget(null);
      setSelectedItem(null);

      showSuccess("Data kamus berhasil dihapus.");
      await fetchDictionary();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Gagal menghapus data kamus."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openAddModal() {
    resetAddForm();
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (isSubmitting) return;

    setShowAddModal(false);
    resetAddForm();
  }

  function closeEditModal() {
    if (isSubmitting) return;

    resetEditForm();
  }

  function closeDeleteModal() {
    if (isSubmitting) return;

    setDeleteTarget(null);
  }

  function closeDetail() {
    setSelectedItem(null);
  }

  return {
    dictionary,
    filteredDictionary,

    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,

    selectedItem,
    setSelectedItem,
    closeDetail,

    deleteTarget,
    setDeleteTarget,
    closeDeleteModal,

    showAddModal,
    openAddModal,
    closeAddModal,
    addForm,
    addError,
    handleAddChange,
    handleAddFile,
    handleAddDictionary,

    editTarget,
    openEditModal,
    closeEditModal,
    editForm,
    editError,
    handleEditChange,
    handleEditFile,
    handleEditDictionary,

    isLoading,
    isSubmitting,
    error,
    success,

    handleDeleteDictionary,
    fetchDictionary,
  };
}
