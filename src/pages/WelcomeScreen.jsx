import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo TEMANKU.svg";

// ── Halaman Welcome Screen ────────────────────────────────────
export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="app-shell"
      style={{
        background: "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)",
      }}
    >
      {/* ── Bagian atas: Logo + Nama App ───────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-6">
        {/* Logo lingkaran */}
        <div className="w-32 h-32 mb-6">
          <img
            src={logo}
            alt="Logo TEMANKU"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Nama app */}
        <h1
          className="font-display font-bold text-primary-600 text-3xl mb-2"
          style={{ letterSpacing: "0.25em" }}
        >
          TEMANKU
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-500 text-sm text-center font-medium leading-snug">
          Sistem Penerjemah Komunikasi Tunarungu
        </p>
      </div>

      {/* ── Card bawah ─────────────────────────────────────── */}
      <div className="px-5 pb-10">
        <div
          className="bg-white rounded-3xl px-6 py-8"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)",
          }}
        >
          {/* Judul card */}
          <h2 className="text-neutral-800 font-bold text-xl text-center mb-3 leading-snug">
            Selamat Datang di <span className="text-primary-600">TEMANKU</span>
          </h2>

          {/* Deskripsi */}
          <p className="text-neutral-400 text-sm text-center leading-relaxed mb-7">
            Aplikasi penerjemah bahasa isyarat yang membantu komunikasi
            komunitas tunarungu secara real-time dan mudah digunakan.
          </p>

          {/* Tombol Daftar */}
          <button
            onClick={() => navigate("/register")}
            className="
              w-full py-3.5 rounded-xl font-semibold text-white text-sm
              transition-all duration-200 active:scale-95 mb-3
            "
            style={{
              background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
              boxShadow: "0 4px 14px rgba(59,125,255,0.4)",
            }}
          >
            Daftar
          </button>

          {/* Tombol Masuk (text link) */}
          <button
            onClick={() => navigate("/login")}
            className="
              w-full py-2.5 rounded-xl font-semibold text-primary-600 text-sm
              transition-all duration-200 active:scale-95
              hover:bg-primary-50
            "
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
