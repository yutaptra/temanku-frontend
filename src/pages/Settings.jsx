import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  Info,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useDarkMode } from "../hooks/useDarkMode";

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

        <ChevronRight className={`w-4 h-4 ${dk.textHint}`} />
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

  const [modal, setModal] = useState(null);

  const iconClass = `w-5 h-5 ${
    dk.isDark ? "text-primary-400" : "text-primary-600"
  }`;

  const menuIconClass = `w-[18px] h-[18px] ${dk.textSecondary}`;

  return (
    <div
      className={`flex flex-col min-h-screen ${dk.page} transition-colors duration-300`}
    >
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(160deg,#4A9BFF 0%,#2563EB 55%,#1848C8 100%)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="font-display font-extrabold text-white text-2xl leading-tight">
          Setelan
        </h1>

        <p className="text-blue-100 text-sm mt-0.5">
          Sistem Isyarat Bahasa Indonesia
        </p>
      </div>

      <div className="flex-1 px-4 pt-4 pb-10 flex flex-col gap-3">
        <SectionCard
          dk={dk}
          title="Tampilan"
          icon={<Moon className={iconClass} />}
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

        <div
          className={`${dk.card} rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300`}
        >
          {[
            {
              key: "privasi",
              label: "Privasi & Keamanan",
              icon: <ShieldCheck className={menuIconClass} />,
            },
            {
              key: "bantuan",
              label: "Bantuan & Dukungan",
              icon: <CircleHelp className={menuIconClass} />,
            },
            {
              key: "tentang",
              label: "Tentang TEMANKU",
              last: true,
              icon: <Info className={menuIconClass} />,
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

      <style>
        {`
          @keyframes popIn {
            from {
              transform: scale(.92);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
