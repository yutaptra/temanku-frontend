import { TriangleAlert } from "lucide-react";

export default function LogoutModal({ dk, onClose, onConfirm }) {
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
            type="button"
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
            type="button"
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
