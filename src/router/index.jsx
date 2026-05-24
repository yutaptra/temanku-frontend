import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import WelcomeScreen from "../pages/WelcomeScreen";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Translate from "../pages/Translate";
import Dictionary from "../pages/Dictionary";
import Learning from "../pages/Learning";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  // ── Auth flow (tanpa Bottom Nav) ──────────────────────────
  { path: "/", element: <WelcomeScreen /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },

  // ── Protected App ─────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/translate", element: <Translate /> },
          { path: "/dictionary", element: <Dictionary /> },
          { path: "/learning", element: <Learning /> },
          { path: "/profile", element: <Profile /> },

          // Tidak tampil di Bottom Nav
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
