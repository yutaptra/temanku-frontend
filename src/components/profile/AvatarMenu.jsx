import { ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import Avatar from "./Avatar";

export default function AvatarMenu({
  dk,
  name,
  photoUrl,
  hasPhoto,
  isUploading,
  isDeleting,
  onClose,
  onChangePhoto,
  onRemovePhoto,
}) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/45 px-0 sm:px-6"
      onClick={onClose}
    >
      <div
        className={`
          ${dk.card} border w-full sm:max-w-sm
          rounded-t-3xl sm:rounded-3xl
          px-5 pt-5 pb-8 sm:pb-7
          max-h-[88vh] overflow-y-auto
        `}
        style={{ animation: "popIn .2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`font-display font-bold ${dk.textPrimary} text-lg`}>
            Foto Profil
          </h3>

          <button
            type="button"
            onClick={onClose}
            className={`${dk.cardInner} border rounded-full p-2 active:scale-95 transition-transform`}
            aria-label="Tutup menu foto profil"
          >
            <X className={`w-4 h-4 ${dk.textPrimary}`} />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <Avatar name={name} photoUrl={photoUrl} size={150} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onChangePhoto}
            disabled={isUploading}
            className={`
              w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border
              ${dk.cardInner} active:scale-[0.98] transition-transform
              disabled:opacity-60
            `}
          >
            {isUploading ? (
              <LoaderCircle className="w-5 h-5 animate-spin text-primary-600" />
            ) : (
              <ImagePlus className="w-5 h-5 text-primary-600" />
            )}

            <span className={`text-sm font-semibold ${dk.textPrimary}`}>
              {isUploading ? "Mengunggah..." : "Ganti Foto Profil"}
            </span>
          </button>

          <button
            type="button"
            onClick={onRemovePhoto}
            disabled={!hasPhoto || isUploading || isDeleting}
            className={`
    w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border
    ${dk.cardInner} active:scale-[0.98] transition-transform
    disabled:opacity-40
  `}
          >
            {isDeleting ? (
              <LoaderCircle className="w-5 h-5 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-5 h-5 text-red-500" />
            )}

            <span className="text-sm font-semibold text-red-500">
              {isDeleting ? "Menghapus..." : "Hapus Foto Profil"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
