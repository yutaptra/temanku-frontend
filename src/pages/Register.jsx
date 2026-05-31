import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CircleX, LoaderCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/Logo TEMANKU.svg";
import api from "../services/api";

function FormField({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  rightElement,
  isDark,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-sm font-medium ${
          isDark ? "text-neutral-200" : "text-neutral-700"
        }`}
      >
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
                : "new-password"
          }
          className={`
            w-full px-4 py-3 rounded-xl border text-sm pr-11
            outline-none transition-all duration-200
            ${
              isDark
                ? "border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
                : "border-neutral-200 bg-neutral-50 text-neutral-800 placeholder-neutral-300 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
            }
          `}
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

function EyeIcon({ open, onClick, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-colors ${
        isDark
          ? "text-neutral-500 hover:text-neutral-300"
          : "text-neutral-400 hover:text-neutral-600"
      }`}
      aria-label={open ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
    >
      {open ? (
        <EyeOff className="w-5 h-5" strokeWidth={1.8} />
      ) : (
        <Eye className="w-5 h-5" strokeWidth={1.8} />
      )}
    </button>
  );
}

function PasswordStrength({ password, isDark }) {
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
        {levels.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score
                ? level.color
                : isDark
                  ? "bg-neutral-700"
                  : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      <span
        className={`text-[10px] font-medium w-8 text-right ${
          isDark ? "text-neutral-400" : "text-neutral-500"
        }`}
      >
        {level.label}
      </span>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const isDark = state.darkMode;

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
        full_name: form.name,
        password: form.password,
        email: form.email,
        phone_number: "",
        first_name: form.name,
        last_name: "",
      });

      const data = res.data;

      if (data.code === "400" || data.status === "Bad Request") {
        setError(data.message || "Pendaftaran gagal.");
        return;
      }

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

  const inputClass = `
    w-full px-4 py-3 pr-11 rounded-xl border text-sm
    outline-none transition-all duration-200
    ${
      isDark
        ? "border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
        : "border-neutral-200 bg-neutral-50 text-neutral-800 placeholder-neutral-300 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
    }
  `;

  return (
    <div
      className="
        min-h-screen w-full
        flex flex-col items-center justify-center
        px-5 py-8 transition-colors duration-300
      "
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0F172A 0%, #111827 100%)"
          : "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)",
      }}
    >
      <div className="flex items-center gap-3 mb-8">
        <img
          src={logo}
          alt="Logo TEMANKU"
          className="w-14 h-14 object-contain"
        />

        <span
          className="font-display font-bold text-2xl"
          style={{
            letterSpacing: "0.18em",
            color: isDark ? "#FFFFFF" : "#176AC3",
          }}
        >
          TEMANKU
        </span>
      </div>

      <div className="w-full max-w-md">
        <div
          className={`rounded-3xl px-6 py-8 transition-colors duration-300 ${
            isDark ? "bg-neutral-900" : "bg-white"
          }`}
          style={{
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)",
          }}
        >
          <h1
            className={`font-bold text-xl text-center mb-6 ${
              isDark ? "text-white" : "text-neutral-800"
            }`}
          >
            Daftar Akun
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <FormField
              label="Nama"
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap kamu"
              isDark={isDark}
            />

            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              isDark={isDark}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-200" : "text-neutral-700"
                }`}
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
                  className={inputClass}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EyeIcon
                    open={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                    isDark={isDark}
                  />
                </div>
              </div>

              <PasswordStrength password={form.password} isDark={isDark} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-200" : "text-neutral-700"
                }`}
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
                    outline-none transition-all duration-200
                    ${
                      isDark
                        ? "bg-neutral-800 text-white placeholder-neutral-500"
                        : "bg-neutral-50 text-neutral-800 placeholder-neutral-300"
                    }
                    ${
                      form.confirmPassword &&
                      form.password !== form.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : form.confirmPassword &&
                            form.password === form.confirmPassword
                          ? "border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          : isDark
                            ? "border-neutral-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
                            : "border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    }
                  `}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EyeIcon
                    open={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${
                  isDark
                    ? "bg-red-950/40 border-red-900"
                    : "bg-red-50 border-red-100"
                }`}
              >
                <CircleX className="w-4 h-4 text-red-500 flex-shrink-0" />

                <p className="text-red-500 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3.5 rounded-xl font-semibold text-white text-sm
                transition-all duration-200 active:scale-95 mt-1
                disabled:opacity-70 disabled:cursor-not-allowed
                disabled:active:scale-100
              "
              style={{
                background: "linear-gradient(135deg, #176AC3 0%, #1F7DE3 100%)",
                boxShadow: isLoading
                  ? "none"
                  : "0 4px 14px rgba(23,106,195,0.4)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="animate-spin w-4 h-4" />
                  Memproses...
                </span>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          <p
            className={`text-center text-sm mt-4 ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: "#1A81F0" }}
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
