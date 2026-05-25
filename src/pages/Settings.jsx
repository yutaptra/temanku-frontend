import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";

function Toggle({ enabled, onChange, dk }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex items-center flex-shrink-0
        w-12 h-6 rounded-full transition-colors duration-300
        focus:outline-none active:scale-95
        ${enabled ? dk.toggleOn : dk.toggleOff}
      `}
    >
      <span
        className={`
        inline-block w-5 h-5 bg-white rounded-full shadow-md
        transform transition-transform duration-300
        ${enabled ? "translate-x-6" : "translate-x-0.5"}
      `}
      />
    </button>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
  showDivider = true,
  dk,
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex-1 min-w-0">
          <p
            className={`${dk.textPrimary} text-sm font-semibold leading-tight`}
          >
            {label}
          </p>
          {description && (
            <p className={`${dk.textMuted} text-xs mt-0.5 leading-snug`}>
              {description}
            </p>
          )}
        </div>
        <Toggle enabled={enabled} onChange={onChange} dk={dk} />
      </div>
      {showDivider && <div className={`h-px ${dk.divider} mx-4`} />}
    </>
  );
}

function SectionCard({ icon, title, children, dk }) {
  return (
    <div
      className={`${dk.card} rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300`}
    >
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div
          className={`w-8 h-8 rounded-xl ${dk.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <h2 className={`font-bold ${dk.textPrimary} text-base`}>{title}</h2>
      </div>
      <div className={`h-px ${dk.divider}`} />
      {children}
    </div>
  );
}

function MenuItem({ icon, label, onClick, showDivider = true, dk }) {
  return (
    <>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-4 ${dk.card} transition-colors duration-150 active:opacity-80 text-left`}
      >
        <div
          className={`w-8 h-8 rounded-xl ${dk.cardInner} flex items-center justify-center flex-shrink-0 border`}
        >
          {icon}
        </div>
        <span className={`flex-1 ${dk.textPrimary} text-sm font-semibold`}>
          {label}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${dk.textHint}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      {showDivider && <div className={`h-px ${dk.divider} mx-4`} />}
    </>
  );
}

function InfoModal({ title, content, onClose, dk }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className={`${dk.card} border w-full max-w-xs rounded-3xl px-6 py-6 transition-colors duration-300`}
        style={{ animation: "popIn .2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`font-display font-bold ${dk.textPrimary} text-lg mb-3`}>
          {title}
        </h3>
        <p
          className={`${dk.textSecondary} text-sm leading-relaxed mb-5 whitespace-pre-line`}
        >
          {content}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg,#3B7DFF,#1A5FE8)",
            boxShadow: "0 4px 12px rgba(59,125,255,.35)",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const dk = useDarkMode();

  const [localSettings, setLocalSettings] = useState({
    pushNotification: true,
    soundEffect: true,
  });
  const [modal, setModal] = useState(null);

  const INFO_MODALS = {
    privasi: {
      title: "Privasi & Keamanan",
      content:
        "Data kamu disimpan dengan aman menggunakan enkripsi standar industri. TEMANKU tidak menjual atau membagikan data pribadi kamu kepada pihak ketiga tanpa izin.",
    },
    bantuan: {
      title: "Bantuan & Dukungan",
      content:
        "Butuh bantuan? Hubungi tim kami melalui email: support@temanku.id\n\nKami siap membantu setiap hari pukul 08.00–20.00 WIB.",
    },
    tentang: {
      title: "Tentang TEMANKU",
      content:
        "TEMANKU v1.0.0\nSistem Penerjemah Komunikasi Tunarungu.\n\nDikembangkan sebagai proyek skripsi untuk membantu komunikasi komunitas tunarungu menggunakan teknologi pengenalan bahasa isyarat SIBI berbasis AI.",
    },
  };

  const iconClass = `w-5 h-5 ${dk.isDark ? "text-primary-400" : "text-primary-600"}`;
  const menuIconClass = `w-4.5 h-4.5 ${dk.textSecondary}`;

  return (
    <div
      className={`flex flex-col min-h-full ${dk.page} transition-colors duration-300`}
    >
      {/* Header — selalu biru */}
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg,#4A9BFF 0%,#2563EB 55%,#1848C8 100%)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-blue-100 mb-3 active:opacity-70 transition-opacity"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Setelan
        </h1>
        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className="flex-1 px-4 pt-4 pb-10 flex flex-col gap-3">
        {/* Notifikasi */}
        <SectionCard
          dk={dk}
          title="Notifikasi"
          icon={
            <svg
              viewBox="0 0 24 24"
              className={iconClass}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          }
        >
          <ToggleRow
            dk={dk}
            label="Notifikasi Push"
            description="Terima pengingat harian dan pembaruan"
            enabled={localSettings.pushNotification}
            onChange={(v) =>
              setLocalSettings((p) => ({ ...p, pushNotification: v }))
            }
          />
          <ToggleRow
            dk={dk}
            label="Efek Suara"
            description="Memutar suara untuk aksi dan pencapaian"
            enabled={localSettings.soundEffect}
            onChange={(v) =>
              setLocalSettings((p) => ({ ...p, soundEffect: v }))
            }
            showDivider={false}
          />
        </SectionCard>

        {/* Tampilan */}
        <SectionCard
          dk={dk}
          title="Tampilan"
          icon={
            <svg
              viewBox="0 0 24 24"
              className={iconClass}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          }
        >
          <ToggleRow
            dk={dk}
            label="Mode Gelap"
            description="Gunakan tema gelap di aplikasi"
            enabled={state.darkMode}
            onChange={(v) => dispatch({ type: "SET_DARK_MODE", payload: v })}
            showDivider={false}
          />
        </SectionCard>

        {/* Menu */}
        <div
          className={`${dk.card} rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300`}
        >
          {[
            {
              key: "privasi",
              label: "Privasi & Keamanan",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: 18, height: 18 }}
                  className={dk.textSecondary}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            },
            {
              key: "bantuan",
              label: "Bantuan & Dukungan",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: 18, height: 18 }}
                  className={dk.textSecondary}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={2.5} />
                </svg>
              ),
            },
            {
              key: "tentang",
              label: "Tentang TEMANKU",
              last: true,
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: 18, height: 18 }}
                  className={dk.textSecondary}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2.5} />
                </svg>
              ),
            },
          ].map(({ key, label, icon, last }) => (
            <MenuItem
              key={key}
              dk={dk}
              label={label}
              icon={icon}
              onClick={() => setModal(INFO_MODALS[key])}
              showDivider={!last}
            />
          ))}
        </div>

        <p className={`${dk.textHint} text-xs text-center mt-2`}>
          TEMANKU v1.0.0
        </p>
      </div>

      {modal && (
        <InfoModal
          dk={dk}
          title={modal.title}
          content={modal.content}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`@keyframes popIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
