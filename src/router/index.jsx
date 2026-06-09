import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import WelcomeScreen from "../pages/WelcomeScreen";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Translate from "../pages/Translate";
import Dictionary from "../pages/Dictionary";
import Learning from "../pages/Learning";
import Quiz from "../pages/Quiz";
import QuestionManager from "../pages/QuestionManager";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <WelcomeScreen /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },

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
        ],
      },

      // Protected tanpa BottomNav
      { path: "/quiz/:id", element: <Quiz /> },

      {
        path: "/learning/packages/:packageId/questions",
        element: <QuestionManager />,
      },

      { path: "/settings", element: <Settings /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
