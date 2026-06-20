import { createContext, useContext, useReducer, useEffect } from "react";

const getDarkModeKey = (user) => {
  if (!user?.email) return null;
  return `temanku_dark_mode_${user.email}`;
};

function getInitialState() {
  let parsedUser = null;
  let savedToken = null;
  let savedDarkMode = false;

  try {
    const savedUser = localStorage.getItem("user");
    savedToken = localStorage.getItem("token");

    if (savedUser) {
      parsedUser = JSON.parse(savedUser);

      const darkModeKey = getDarkModeKey(parsedUser);
      if (darkModeKey) {
        savedDarkMode = localStorage.getItem(darkModeKey) === "true";
      }
    }
  } catch {}

  return {
    user: parsedUser,
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
    case "LOGIN": {
      const user = action.payload;

      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {}

      let savedDarkMode = false;

      try {
        const darkModeKey = getDarkModeKey(user);
        if (darkModeKey) {
          savedDarkMode = localStorage.getItem(darkModeKey) === "true";
        }
      } catch {}

      return {
        ...state,
        isAuthenticated: true,
        user,
        darkMode: savedDarkMode,
      };
    }

    case "LOGOUT":
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}

      return {
        ...state,
        user: null,
        isAuthenticated: false,
        darkMode: state.darkMode,
      };

    case "SET_USER": {
      const user = action.payload;

      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {}

      return {
        ...state,
        user,
      };
    }

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

    case "TOGGLE_DARK_MODE":
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  useEffect(() => {
    function handleSessionExpired() {
      dispatch({ type: "LOGOUT" });
      window.location.replace("/login?session=expired");
    }

    window.addEventListener("session:expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session:expired", handleSessionExpired);
  }, []);

  useEffect(() => {
    try {
      const darkModeKey = getDarkModeKey(state.user);

      if (darkModeKey) {
        localStorage.setItem(darkModeKey, String(state.darkMode));
      }
    } catch {}
  }, [state.darkMode, state.user]);

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
