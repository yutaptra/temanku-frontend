import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/Logo TEMANKU.svg";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validasi sederhana
    if (!form.email.trim()) return setError("Email tidak boleh kosong.");
    if (!form.password) return setError("Kata sandi tidak boleh kosong.");

    setIsLoading(true);
    try {
      // ── TODO: ganti dengan panggilan API login kamu ──────────
      // const res = await api.post("/auth/login", form);
      // dispatch({ type: "LOGIN", payload: res.data.user });

      // Simulasi login sukses (hapus saat integrasi API)
      await new Promise((r) => setTimeout(r, 800));
      dispatch({
        type: "LOGIN",
        payload: { name: "Yusri Afta", email: form.email },
      });
      navigate("/home", { replace: true });
      // ─────────────────────────────────────────────────────────
    } catch (err) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="app-shell items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)",
      }}
    >
      {/* ── Logo + Nama App ─────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <img
          src={logo}
          alt="Logo TEMANKU"
          className="w-14 h-14 object-contain"
        />
        <span
          className="font-display font-bold text-primary-600 text-2xl"
          style={{ letterSpacing: "0.18em" }}
        >
          TEMANKU
        </span>
      </div>

      {/* ── Card Form ───────────────────────────────────────── */}
      <div className="w-full px-5">
        <div
          className="bg-white rounded-3xl px-6 py-8"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)",
          }}
        >
          {/* Judul */}
          <h1 className="text-neutral-800 font-bold text-xl text-center mb-6">
            Masuk Akun
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Field Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-neutral-700 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="
                  w-full px-4 py-3 rounded-xl border text-sm
                  text-neutral-800 placeholder-neutral-300
                  outline-none transition-all duration-200
                  border-neutral-200 bg-neutral-50
                  focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100
                "
              />
            </div>

            {/* Field Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-neutral-700 text-sm font-medium"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi"
                  className="
                    w-full px-4 py-3 pr-11 rounded-xl border text-sm
                    text-neutral-800 placeholder-neutral-300
                    outline-none transition-all duration-200
                    border-neutral-200 bg-neutral-50
                    focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100
                  "
                />
                {/* Toggle show/hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Pesan error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-red-500 flex-shrink-0"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3.5 rounded-xl font-semibold text-white text-sm
                transition-all duration-200 active:scale-95 mt-1
                disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
              "
              style={{
                background: "linear-gradient(135deg, #3B7DFF 0%, #1A5FE8 100%)",
                boxShadow: isLoading
                  ? "none"
                  : "0 4px 14px rgba(59,125,255,0.4)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Link ke Register */}
          <p className="text-center text-sm text-neutral-500 mt-4">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
