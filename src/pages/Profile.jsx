import { Camera, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/profile/Avatar";
import AvatarMenu from "../components/profile/AvatarMenu";
import LogoutModal from "../components/profile/LogoutModal";
import ProfileButton from "../components/profile/ProfileButton";
import { useDarkMode } from "../hooks/useDarkMode";
import { useProfile } from "../hooks/useProfile";

export default function Profile() {
  const navigate = useNavigate();
  const dk = useDarkMode();

  const {
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
  } = useProfile();

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
        <button
          type="button"
          onClick={() => setShowAvatarMenu(true)}
          className="relative rounded-full active:scale-95 transition-transform"
          aria-label="Ubah foto profil"
        >
          <Avatar name={profile.name} photoUrl={profile.photoUrl} size={100} />

          <span
            className="
              absolute right-0 bottom-1 w-8 h-8 rounded-full
              bg-primary-600 border-2 border-white
              flex items-center justify-center shadow-md
            "
          >
            <Camera className="w-4 h-4 text-white" strokeWidth={2.4} />
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div className="text-center">
          <h2
            className={`font-display font-bold ${dk.textPrimary} text-2xl leading-tight`}
          >
            {profile.name}
          </h2>

          <p className={`${dk.textMuted} text-sm mt-1`}>{profile.email}</p>
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

      {showAvatarMenu && (
        <AvatarMenu
          dk={dk}
          name={profile.name}
          photoUrl={profile.photoUrl}
          hasPhoto={Boolean(profile.photoUrl)}
          isUploading={isUploadingPhoto}
          isDeleting={isDeletingPhoto}
          onClose={() => setShowAvatarMenu(false)}
          onChangePhoto={openFilePicker}
          onRemovePhoto={handleRemoveAvatar}
        />
      )}

      {showLogoutModal && (
        <LogoutModal
          dk={dk}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
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
