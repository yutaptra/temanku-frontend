import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo-temanku.svg";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const isDark = state.darkMode;

  return (
    <>
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeDown {
          0%   { opacity: 0; transform: translateY(-16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-8 transition-colors duration-300"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #0F172A 0%, #111827 100%)"
            : "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)",
        }}
      >
        {/* Logo & Title */}
        <div
          className="flex flex-col items-center mb-8"
          style={{ animation: "fadeDown 0.4s ease-out both" }}
        >
          <div className="w-28 h-28 mb-5">
            <img
              src={logo}
              alt="Logo TEMANKU"
              className="w-full h-full object-contain"
            />
          </div>

          <h1
            className="font-display font-bold text-3xl mb-2"
            style={{
              letterSpacing: "0.25em",
              color: isDark ? "#FFFFFF" : "#176AC3",
            }}
          >
            TEMANKU
          </h1>

          <p
            className={`text-sm text-center font-medium leading-snug ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
          >
            Sistem Penerjemah Komunikasi Tunarungu
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-md"
          style={{ animation: "popIn 0.35s ease-out 0.15s both" }}
        >
          <div
            className={`rounded-3xl px-6 py-8 transition-colors duration-300 ${isDark ? "bg-neutral-900" : "bg-white"}`}
            style={{
              boxShadow: isDark
                ? "0 10px 30px rgba(0,0,0,0.35)"
                : "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)",
            }}
          >
            <h2
              className={`font-bold text-xl text-center mb-3 leading-snug ${isDark ? "text-white" : "text-neutral-800"}`}
            >
              Selamat Datang di{" "}
              <span className="text-primary-600">TEMANKU</span>
            </h2>

            <p className="text-sm text-center leading-relaxed mb-7 text-neutral-400">
              Aplikasi penerjemah bahasa isyarat yang membantu komunikasi
              komunitas tunarungu secara real-time dan mudah digunakan.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95 mb-3"
              style={{
                background: "linear-gradient(135deg, #176AC3 0%, #1F7DE3 100%)",
                boxShadow: "0 4px 14px rgba(23,106,195,0.4)",
              }}
            >
              Daftar
            </button>

            <button
              onClick={() => navigate("/login")}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
                isDark
                  ? "bg-neutral-800 text-white hover:bg-neutral-700"
                  : "hover:bg-primary-50"
              }`}
              style={{ color: isDark ? "#FFFFFF" : "#176AC3" }}
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
