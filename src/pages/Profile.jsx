import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, TriangleAlert } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";

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
        background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
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
        background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
        boxShadow: "0 4px 14px rgba(63,136,255,0.35)",
        color: "#fff",
      },
    },
    danger: {
      className: base,
      style: {
        background: "linear-gradient(135deg, #EF4444 0%, #D4183D 100%)",
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
          <div className="relative">
            <TriangleAlert
              className="w-7 h-7 text-red-500"
              fill="currentColor"
              strokeWidth={2}
            />

            <span
              className="
                absolute inset-0
                flex items-center justify-center
                text-white font-black text-[11px]
                leading-none select-none
              "
              style={{ transform: "translateY(-1px)" }}
            >
              !
            </span>
          </div>
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
              background: "linear-gradient(135deg,#EF4444,#D4183D)",
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

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = state.user ?? {
    name: "Pengguna",
    email: "",
    photoUrl: null,
  };

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
            onClick={() => navigate("/settings")}
            label="Setelan"
            icon={
              <Settings style={{ width: 18, height: 18 }} strokeWidth={2.2} />
            }
          />

          <ProfileButton
            onClick={() => setShowLogoutModal(true)}
            label="Keluar"
            variant="danger"
            icon={
              <LogOut style={{ width: 18, height: 18 }} strokeWidth={2.2} />
            }
          />
        </div>

        <p className={`${dk.textMuted} text-xs mt-auto pt-4`}>TEMANKU v1.0.0</p>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          dk={dk}
        />
      )}

      <style>{`
        @keyframes popIn {
          from {
            transform: scale(0.92);
            opacity: 0;
          }

          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
