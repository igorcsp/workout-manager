import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CustomThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Workouts from "./pages/Workouts.jsx";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Settings from "./pages/Settings.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFound from "./pages/NotFound.jsx";

export function RootRedirect() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // ou um spinner de loading se preferir
  }

  return <Navigate to={currentUser ? "/workouts" : "/login"} replace />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CustomThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Rota raiz redireciona para login */}
              <Route index element={<RootRedirect />} />

              {/* Rotas públicas */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="about" element={<AboutPage />} />

              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="workouts" element={<Workouts />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CustomThemeProvider>
  </StrictMode>
);
