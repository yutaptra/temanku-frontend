import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import api from "../services/api";

function mapProfile(data) {
  return {
    id: data.id,
    name: data.first_name || data.username || "Pengguna",
    email: data.email || "",
    phoneNumber: data.phone_number || "",
    photoUrl: data.profile_image_url || null,
  };
}

function getUploadedPhotoUrl(data, fallbackUrl) {
  return (
    data?.profile_image_url ||
    data?.data?.profile_image_url ||
    data?.result?.profile_image_url ||
    fallbackUrl
  );
}

export function useProfile() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const fileInputRef = useRef(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  const [profile, setProfile] = useState({
    name: state.user?.name || "Pengguna",
    email: state.user?.email || "",
    photoUrl: state.user?.photoUrl || null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/profile/me");
      const mappedProfile = mapProfile(res.data);

      setProfile(mappedProfile);
      dispatch({ type: "SET_USER", payload: mappedProfile });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const previousProfile = profile;

    setProfile((prev) => ({ ...prev, photoUrl: previewUrl }));
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.put("/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = getUploadedPhotoUrl(res.data, previewUrl);

      const updatedProfile = {
        ...previousProfile,
        photoUrl: uploadedUrl,
      };

      setProfile(updatedProfile);
      dispatch({ type: "SET_USER", payload: updatedProfile });
      setShowAvatarMenu(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil.");
      fetchProfile();
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
      URL.revokeObjectURL(previewUrl);
    }
  }

  async function handleRemoveAvatar() {
    if (isUploadingPhoto || isDeletingPhoto) return;

    setIsDeletingPhoto(true);

    try {
      await api.delete("/profile/photo");

      const updatedProfile = {
        ...profile,
        photoUrl: null,
      };

      setProfile(updatedProfile);
      dispatch({ type: "SET_USER", payload: updatedProfile });
      setShowAvatarMenu(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus foto profil.");
    } finally {
      setIsDeletingPhoto(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    navigate("/", { replace: true });
  }

  return {
    profile,
    fileInputRef,
    showLogoutModal,
    setShowLogoutModal,
    showAvatarMenu,
    setShowAvatarMenu,
    isUploadingPhoto,
    isDeletingPhoto,
    openFilePicker,
    handleAvatarChange,
    handleRemoveAvatar,
    handleLogout,
  };
}
