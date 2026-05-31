import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, CircleX, CircleCheck, LoaderCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo-temanku.svg";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDark = state.darkMode;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("session") === "expired") {
      setError("Sesi login berakhir. Silakan masuk kembali.");
      window.history.replaceState({}, "", "/login");
    }

    const successMessage = location.state?.successMessage;

    if (successMessage) {
      setSuccess(successMessage);
      window.history.replaceState({}, "", "/login");
    }
  }, [location.state]);

  function handleChange(e) {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim()) return setError("Email tidak boleh kosong.");
    if (!form.password) return setError("Kata sandi tidak boleh kosong.");

    setIsLoading(true);

    try {
      const res = await api.post("/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = res.data;

      if (String(data.code) !== "200") {
        setError(data.message || "Email atau kata sandi salah.");
        return;
      }

      const token = data.result?.access_token;

      const user = {
        id: data.result?.user?.id,
        name: data.result?.user?.full_name || form.email.trim(),
        email: form.email.trim(),
        role: data.result?.user?.role,
      };

      if (!token) {
        setError("Login berhasil, tetapi token tidak diterima dari server.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN",
        payload: user,
      });

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
          className={`
            rounded-3xl px-6 py-8 transition-colors duration-300
            ${isDark ? "bg-neutral-900" : "bg-white"}
          `}
          style={{
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(59,125,255,0.12)",
          }}
        >
          <h1
            className={`
              font-bold text-xl text-center mb-6
              ${isDark ? "text-white" : "text-neutral-800"}
            `}
          >
            Masuk Akun
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className={`
                  text-sm font-medium
                  ${isDark ? "text-neutral-200" : "text-neutral-700"}
                `}
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
                className={`
                  w-full px-4 py-3 rounded-xl border text-sm
                  outline-none transition-all duration-200
                  disabled:opacity-70
                  ${
                    isDark
                      ? `
                        border-neutral-700
                        bg-neutral-800
                        text-white
                        placeholder-neutral-500
                        focus:border-primary-400
                        focus:ring-2
                        focus:ring-primary-500/20
                      `
                      : `
                        border-neutral-200
                        bg-neutral-50
                        text-neutral-800
                        placeholder-neutral-300
                        focus:border-primary-400
                        focus:bg-white
                        focus:ring-2
                        focus:ring-primary-100
                      `
                  }
                `}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className={`
                  text-sm font-medium
                  ${isDark ? "text-neutral-200" : "text-neutral-700"}
                `}
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
                  className={`
                    w-full px-4 py-3 pr-11 rounded-xl border text-sm
                    outline-none transition-all duration-200
                    disabled:opacity-70
                    ${
                      isDark
                        ? `
                          border-neutral-700
                          bg-neutral-800
                          text-white
                          placeholder-neutral-500
                          focus:border-primary-400
                          focus:ring-2
                          focus:ring-primary-500/20
                        `
                        : `
                          border-neutral-200
                          bg-neutral-50
                          text-neutral-800
                          placeholder-neutral-300
                          focus:border-primary-400
                          focus:bg-white
                          focus:ring-2
                          focus:ring-primary-100
                        `
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading}
                  className={`
                    absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                    disabled:opacity-60
                    ${
                      isDark
                        ? "text-neutral-500 hover:text-neutral-300"
                        : "text-neutral-400 hover:text-neutral-600"
                    }
                  `}
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
                className={`
                  flex items-center gap-2 rounded-xl px-3 py-2.5 border
                  ${
                    isDark
                      ? "bg-green-950/40 border-green-900"
                      : "bg-green-50 border-green-100"
                  }
                `}
              >
                <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />

                <p className="text-green-500 text-xs font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div
                className={`
                  flex items-center gap-2 rounded-xl px-3 py-2.5 border
                  ${
                    isDark
                      ? "bg-red-950/40 border-red-900"
                      : "bg-red-50 border-red-100"
                  }
                `}
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
                "Masuk"
              )}
            </button>
          </form>

          <p
            className={`
              text-center text-sm mt-4
              ${isDark ? "text-neutral-400" : "text-neutral-500"}
            `}
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
  );
}
