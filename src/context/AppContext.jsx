import { createContext, useContext, useReducer } from "react";

const initialState = {
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  detectionResult: null,
  isDetecting: false,
  signLanguage: "SIBI", // "SIBI" | "BISINDO"
};

function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "LOGOUT":
      return { ...initialState };
    case "SET_ONBOARDED":
      return { ...state, isOnboarded: action.payload };
    case "SET_DETECTION_RESULT":
      return { ...state, detectionResult: action.payload };
    case "SET_DETECTING":
      return { ...state, isDetecting: action.payload };
    case "SET_SIGN_LANGUAGE":
      return { ...state, signLanguage: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
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
