import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/Logo TEMANKU.svg";
import api from "../services/api";

// ── Komponen input field reusable ─────────────────────────────
function FormField({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  rightElement,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-neutral-700 text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={
            name === "email"
              ? "email"
              : name === "name"
                ? "name"
                : name === "password"
                  ? "new-password"
                  : "new-password"
          }
          className="
            w-full px-4 py-3 rounded-xl border text-sm
            text-neutral-800 placeholder-neutral-300
            outline-none transition-all duration-200
            border-neutral-200 bg-neutral-50
            focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100
            pr-11
          "
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ikon mata (show/hide password) ───────────────────────────
function EyeIcon({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-neutral-400 hover:text-neutral-600 transition-colors"
      aria-label={open ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
    >
      {open ? (
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
  );
}

// ── Indikator kekuatan password ───────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const levels = [
    { label: "Lemah", color: "bg-red-400" },
    { label: "Cukup", color: "bg-orange-400" },
    { label: "Baik", color: "bg-yellow-400" },
    { label: "Kuat", color: "bg-green-500" },
  ];
  const level = levels[score - 1] || levels[0];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {levels.map((l, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? level.color : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium text-neutral-500 w-8 text-right">
        {level.label}
      </span>
    </div>
  );
}

// ── Halaman Register ──────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.name.trim()) return "Nama tidak boleh kosong.";
    if (!form.email.trim()) return "Email tidak boleh kosong.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Format email tidak valid.";
    if (!form.password) return "Kata sandi tidak boleh kosong.";
    if (form.password.length < 8) return "Kata sandi minimal 8 karakter.";
    if (form.password !== form.confirmPassword)
      return "Konfirmasi kata sandi tidak cocok.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) return setError(validationError);

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/signup", {
        username: form.name,
        password: form.password,
        email: form.email,
        phone_number: "",
        first_name: form.name,
        last_name: "",
      });

      console.log(res.data);

      dispatch({
        type: "LOGIN",
        payload: {
          name: form.name,
          email: form.email,
        },
      });

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.detail || "Pendaftaran gagal.";

      setError(typeof message === "string" ? message : "Pendaftaran gagal.");
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
            Daftar Akun
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Nama */}
            <FormField
              label="Nama"
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap kamu"
            />

            {/* Email */}
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
            />

            {/* Kata Sandi */}
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  className="
                    w-full px-4 py-3 pr-11 rounded-xl border text-sm
                    text-neutral-800 placeholder-neutral-300
                    outline-none transition-all duration-200
                    border-neutral-200 bg-neutral-50
                    focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100
                  "
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EyeIcon
                    open={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                  />
                </div>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-neutral-700 text-sm font-medium"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  className={`
                    w-full px-4 py-3 pr-11 rounded-xl border text-sm
                    text-neutral-800 placeholder-neutral-300
                    outline-none transition-all duration-200 bg-neutral-50
                    focus:ring-2
                    ${
                      form.confirmPassword &&
                      form.password !== form.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : form.confirmPassword &&
                            form.password === form.confirmPassword
                          ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                          : "border-neutral-200 focus:border-primary-400 focus:ring-primary-100"
                    }
                  `}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EyeIcon
                    open={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  />
                </div>
                {/* Indikator match */}
                {form.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-red-400"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
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

            {/* Tombol Daftar */}
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
                "Daftar"
              )}
            </button>
          </form>

          {/* Link ke Login */}
          <p className="text-center text-sm text-neutral-500 mt-4">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
