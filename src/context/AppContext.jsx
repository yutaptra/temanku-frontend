import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  detectionResult: null,
  isDetecting: false,
  signLanguage: "SIBI",
  darkMode: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "LOGOUT":
      return { ...initialState, darkMode: state.darkMode };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_ONBOARDED":
      return { ...state, isOnboarded: action.payload };
    case "SET_DETECTION_RESULT":
      return { ...state, detectionResult: action.payload };
    case "SET_DETECTING":
      return { ...state, isDetecting: action.payload };
    case "SET_SIGN_LANGUAGE":
      return { ...state, signLanguage: action.payload };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Jangan baca localStorage di initializer ──────────────
  // Biarkan darkMode selalu mulai dari false,
  // baru load dari localStorage via useEffect setelah mount
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Satu kali saat mount: baca preferensi tersimpan
  useEffect(() => {
    try {
      const saved = localStorage.getItem("temanku_dark_mode");
      if (saved === "true") {
        dispatch({ type: "SET_DARK_MODE", payload: true });
      }
    } catch {}
  }, []); // hanya sekali

  // Setiap kali darkMode berubah: simpan + apply ke <html>
  useEffect(() => {
    try {
      localStorage.setItem("temanku_dark_mode", String(state.darkMode));
    } catch {}
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp harus digunakan di dalam AppProvider");
  return ctx;
}
