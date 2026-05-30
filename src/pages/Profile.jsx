import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../services/api";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function Avatar({ name, photoUrl, size = 96 }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="rounded-full object-cover border-4 border-white shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6366F1 0%, #3B7DFF 100%)",
      }}
    >
      <span
        className="text-white font-display font-bold select-none"
        style={{ fontSize: size * 0.33 }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}

function ProfileButton({ icon, label, onClick, variant = "primary" }) {
  const base = `
    w-full flex items-center justify-center gap-2.5
    py-3.5 rounded-2xl font-semibold text-sm
    transition-all duration-200 active:scale-95
  `;

  const styles = {
    primary: {
      className: base,
      style: {
        background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
        boxShadow: "0 4px 14px rgba(59,125,255,0.35)",
        color: "#fff",
      },
    },
    danger: {
      className: base,
      style: {
        background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
        color: "#fff",
      },
    },
  };

  const s = styles[variant] ?? styles.primary;

  return (
    <button onClick={onClick} className={s.className} style={s.style}>
      {icon}
      {label}
    </button>
  );
}

function EditProfileModal({ user, onClose, onSave, dk }) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), email: email.trim() });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className={`${dk.card} border w-full max-w-mobile rounded-t-3xl px-5 pt-4 pb-10`}
        style={{ animation: "slideUp .25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-10 h-1 ${dk.divider} rounded-full mx-auto mb-5`} />

        <h2 className={`font-display font-bold ${dk.textPrimary} text-xl mb-5`}>
          Ubah Profil
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={`${dk.textSecondary} text-sm font-medium`}>
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className={`
                w-full px-4 py-3 rounded-xl border text-sm outline-none
                focus:ring-2 focus:ring-primary-100 transition-all duration-200
                ${dk.input}
              `}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`${dk.textSecondary} text-sm font-medium`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`
                w-full px-4 py-3 rounded-xl border text-sm outline-none
                focus:ring-2 focus:ring-primary-100 transition-all duration-200
                ${dk.input}
              `}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="
              w-full py-3.5 rounded-2xl font-semibold text-white text-sm mt-1
              active:scale-95 transition-all duration-200
              disabled:opacity-50 disabled:active:scale-100
            "
            style={{
              background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
              boxShadow: "0 4px 14px rgba(59,125,255,0.4)",
            }}
          >
            Simpan Perubahan
          </button>

          <button
            onClick={onClose}
            className={`
              w-full py-2.5 rounded-2xl font-semibold text-sm
              ${dk.textSecondary} active:scale-95 transition-transform
            `}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onClose, onConfirm, dk }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className={`${dk.card} border w-full max-w-xs rounded-3xl px-6 py-6`}
        style={{ animation: "popIn .2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-red-500"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h3
          className={`font-display font-bold ${dk.textPrimary} text-lg text-center mb-1`}
        >
          Keluar Akun?
        </h3>

        <p
          className={`${dk.textSecondary} text-sm text-center mb-6 leading-relaxed`}
        >
          Kamu akan keluar dari TEMANKU. Yakin ingin melanjutkan?
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg,#EF4444,#DC2626)",
              boxShadow: "0 4px 12px rgba(239,68,68,.3)",
            }}
          >
            Ya, Keluar
          </button>

          <button
            onClick={onClose}
            className={`
              w-full py-2.5 rounded-2xl font-semibold text-sm
              ${dk.textSecondary} active:scale-95 transition-transform
            `}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const dk = useDarkMode();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profile, setProfile] = useState(state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const user = profile ??
    state.user ?? {
      name: "Pengguna",
      email: "",
    };

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError("");

      try {
        const res = await api.get("/profile/me");
        const data = res.data;

        const profileData =
          data.result?.user || data.result || data.data || data.user || data;

        const mappedUser = {
          name:
            profileData.full_name ||
            profileData.name ||
            profileData.first_name ||
            state.user?.name ||
            "Pengguna",
          email: profileData.email || state.user?.email || "",
          photoUrl: profileData.photo_url || profileData.avatar || null,
          role: profileData.role || state.user?.role,
        };

        setProfile(mappedUser);
        dispatch({ type: "SET_USER", payload: mappedUser });
        localStorage.setItem("user", JSON.stringify(mappedUser));
      } catch (err) {
        console.error(err);

        // Jangan logout otomatis dari halaman Profile
        if (!err.response) {
          setError("Gagal terhubung ke server.");
        } else if (err.response.status === 401) {
          setError("");
        } else {
          setError("Gagal memuat profil.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [dispatch, state.user]);

  function handleSaveProfile(updated) {
    const updatedUser = { ...user, ...updated };

    setProfile(updatedUser);
    dispatch({ type: "SET_USER", payload: updatedUser });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    navigate("/", { replace: true });
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
          Profil
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div
        className={`
          flex-1 ${dk.page} flex flex-col items-center
          px-6 pt-10 pb-10 gap-4
        `}
      >
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Avatar name={user.name} photoUrl={user.photoUrl} size={100} />

        <div className="text-center">
          <h2
            className={`font-display font-bold ${dk.textPrimary} text-2xl leading-tight`}
          >
            {user.name}
          </h2>
          <p className={`${dk.textMuted} text-sm mt-1`}>{user.email}</p>
        </div>

        <div className={`w-full h-px ${dk.divider} my-1`} />

        <div className="w-full flex flex-col gap-3">
          <ProfileButton
            onClick={() => setShowEditModal(true)}
            label="Ubah Profil"
            icon={
              <svg
                viewBox="0 0 24 24"
                style={{ width: 18, height: 18 }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
          />

          <ProfileButton
            onClick={() => navigate("/settings")}
            label="Setelan"
            icon={
              <svg
                viewBox="0 0 24 24"
                style={{ width: 18, height: 18 }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            }
          />

          <ProfileButton
            onClick={() => setShowLogoutModal(true)}
            label="Keluar"
            variant="danger"
            icon={
              <svg
                viewBox="0 0 24 24"
                style={{ width: 18, height: 18 }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            }
          />
        </div>

        <p className={`${dk.textMuted} text-xs mt-auto pt-4`}>TEMANKU v1.0.0</p>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          dk={dk}
        />
      )}

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          dk={dk}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
