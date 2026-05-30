import { createContext, useContext, useReducer, useEffect } from "react";

function getInitialState() {
  let savedUser = null;
  let savedToken = null;
  let savedDarkMode = false;

  try {
    savedUser = localStorage.getItem("user");
    savedToken = localStorage.getItem("token");
    savedDarkMode = localStorage.getItem("temanku_dark_mode") === "true";
  } catch {}

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedToken,
    isOnboarded: false,
    detectionResult: null,
    isDetecting: false,
    signLanguage: "SIBI",
    darkMode: savedDarkMode,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...getInitialState(),
        user: null,
        isAuthenticated: false,
        darkMode: state.darkMode,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "SET_ONBOARDED":
      return {
        ...state,
        isOnboarded: action.payload,
      };

    case "SET_DETECTION_RESULT":
      return {
        ...state,
        detectionResult: action.payload,
      };

    case "SET_DETECTING":
      return {
        ...state,
        isDetecting: action.payload,
      };

    case "SET_SIGN_LANGUAGE":
      return {
        ...state,
        signLanguage: action.payload,
      };

    case "SET_DARK_MODE":
      return {
        ...state,
        darkMode: action.payload,
      };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

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

  if (!ctx) {
    throw new Error("useApp harus digunakan di dalam AppProvider");
  }

  return ctx;
}
