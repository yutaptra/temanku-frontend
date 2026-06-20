import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { Eye, EyeOff, CircleX, CircleCheck, LoaderCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo-temanku.svg";
import api from "../services/api";

const AUTH_BG_LIGHT = "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)";
const AUTH_BG_DARK = "linear-gradient(180deg, #0F172A 0%, #111827 100%)";
const CARD_SHADOW_LIGHT =
  "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)";
const CARD_SHADOW_DARK = "0 10px 30px rgba(0,0,0,0.35)";
const BTN_GRADIENT = "linear-gradient(135deg, #176AC3 0%, #1F7DE3 100%)";

const INPUT_CLASS = (isDark) => `
  w-full px-4 py-3 rounded-xl border text-sm
  outline-none transition-all duration-200 disabled:opacity-70
  ${
    isDark
      ? "border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
      : "border-neutral-200 bg-neutral-50 text-neutral-800 placeholder-neutral-300 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
  }
`;

function validate(form) {
  if (!form.email.trim()) return "Email tidak boleh kosong.";
  if (!/\S+@\S+\.\S+/.test(form.email)) return "Format email tidak valid.";
  if (!form.password) return "Kata sandi tidak boleh kosong.";
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useApp();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDark = state.darkMode;

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setError("Sesi login berakhir. Silakan masuk kembali.");
      navigate("/login", { replace: true });
    }

    const successMessage = location.state?.successMessage;
    if (successMessage) {
      setSuccess(successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [searchParams, location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate(form);
    if (validationError) return setError(validationError);

    setIsLoading(true);

    try {
      const { data } = await api.post("/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const token = data.result?.access_token;

      if (!token) {
        setError(data.message || "Login gagal. Token tidak diterima.");
        return;
      }

      const user = {
        id: data.result?.user?.id,
        name: data.result?.user?.full_name || form.email.trim(),
        email: form.email.trim(),
        role: data.result?.user?.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: { ...user, token } });
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError("Gagal terhubung ke server. Coba lagi nanti.");
        return;
      }
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Email atau kata sandi salah.";
      setError(typeof message === "string" ? message : "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          0%   { opacity: 0; transform: translateY(-16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-8 transition-colors duration-300"
        style={{ background: isDark ? AUTH_BG_DARK : AUTH_BG_LIGHT }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 mb-8"
          style={{ animation: "fadeDown 0.4s ease-out both" }}
        >
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

        {/* Card */}
        <div
          className="w-full max-w-md"
          style={{ animation: "popIn 0.35s ease-out 0.15s both" }}
        >
          <div
            className={`rounded-3xl px-6 py-8 transition-colors duration-300 ${isDark ? "bg-neutral-900" : "bg-white"}`}
            style={{ boxShadow: isDark ? CARD_SHADOW_DARK : CARD_SHADOW_LIGHT }}
          >
            <h1
              className={`font-bold text-xl text-center mb-6 ${isDark ? "text-white" : "text-neutral-800"}`}
            >
              Masuk Akun
            </h1>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className={`text-sm font-medium ${isDark ? "text-neutral-200" : "text-neutral-700"}`}
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
                  disabled={isLoading}
                  placeholder="Masukkan email"
                  className={INPUT_CLASS(isDark)}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className={`text-sm font-medium ${isDark ? "text-neutral-200" : "text-neutral-700"}`}
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
                    disabled={isLoading}
                    placeholder="Masukkan kata sandi"
                    className={`${INPUT_CLASS(isDark)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-60 ${
                      isDark
                        ? "text-neutral-500 hover:text-neutral-300"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {success && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-green-950/40 border-green-900" : "bg-green-50 border-green-100"}`}
                >
                  <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-green-500 text-xs font-medium">
                    {success}
                  </p>
                </div>
              )}

              {error && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-red-950/40 border-red-900" : "bg-red-50 border-red-100"}`}
                >
                  <CircleX className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-500 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95 mt-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{
                  background: BTN_GRADIENT,
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 14px rgba(23,106,195,0.4)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin w-4 h-4" />{" "}
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <p
              className={`text-center text-sm mt-4 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
            >
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold transition-opacity hover:opacity-80"
                style={{ color: "#1A81F0" }}
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
