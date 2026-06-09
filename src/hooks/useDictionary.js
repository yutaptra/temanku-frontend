import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import {
  getErrorMessage,
  mapDictionaryItem,
  sortDictionary,
} from "../utils/dictionaryUtils";

export const EMPTY_DICTIONARY_FORM = {
  name: "",
  description: "",
  category: "Kosakata",
  file: null,
};

export const EMPTY_EDIT_DICTIONARY_FORM = {
  id: null,
  ...EMPTY_DICTIONARY_FORM,
};

function validateDictionaryForm(form, setFormError, isEdit = false) {
  if (!form.name.trim()) {
    setFormError("Nama isyarat tidak boleh kosong.");
    return false;
  }

  if (!form.description.trim()) {
    setFormError("Deskripsi tidak boleh kosong.");
    return false;
  }

  if (!isEdit && !form.file) {
    setFormError("Gambar isyarat wajib dipilih.");
    return false;
  }

  return true;
}

export function useDictionary() {
  const [dictionary, setDictionary] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_DICTIONARY_FORM);
  const [addError, setAddError] = useState("");

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_DICTIONARY_FORM);
  const [editError, setEditError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const successTimerRef = useRef(null);

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

  const fetchDictionary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await api.get("/dictionary/");
      const list = res.data?.data || [];
      const mappedData = list.map(mapDictionaryItem);

      setDictionary(sortDictionary(mappedData));
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Gagal memuat data kamus."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDictionary();
  }, [fetchDictionary]);

  function openAddModal() {
    setAddError("");
    setAddForm(EMPTY_DICTIONARY_FORM);
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (isSubmitting) return;

    setShowAddModal(false);
    setAddError("");
    setAddForm(EMPTY_DICTIONARY_FORM);
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
    setAddError("");

    if (!validateDictionaryForm(addForm, setAddError)) return;

    setIsSubmitting(true);
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
      setAddForm(EMPTY_DICTIONARY_FORM);

      showSuccess("Data kamus berhasil ditambahkan.");
      await fetchDictionary();
    } catch (err) {
      console.error(err);
      setAddError(getErrorMessage(err, "Gagal menambahkan data kamus."));
    } finally {
      setIsSubmitting(false);
    }
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

  function closeEditModal() {
    if (isSubmitting) return;

    setEditTarget(null);
    setEditError("");
    setEditForm(EMPTY_EDIT_DICTIONARY_FORM);
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

  async function handleEditDictionary(e) {
    e.preventDefault();
    setEditError("");

    if (!validateDictionaryForm(editForm, setEditError, true)) return;

    setIsSubmitting(true);
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

      setEditTarget(null);
      setEditForm(EMPTY_EDIT_DICTIONARY_FORM);
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

  function closeDeleteModal() {
    if (isSubmitting) return;

    setDeleteTarget(null);
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

    showAddModal,
    openAddModal,
    closeAddModal,
    addForm,
    setAddForm,
    addError,
    handleAddChange,
    handleAddFile,
    handleAddDictionary,

    editTarget,
    openEditModal,
    closeEditModal,
    editForm,
    setEditForm,
    editError,
    handleEditChange,
    handleEditFile,
    handleEditDictionary,

    deleteTarget,
    setDeleteTarget,
    closeDeleteModal,
    handleDeleteDictionary,

    isLoading,
    isSubmitting,
    error,
    success,

    fetchDictionary,
  };
}
