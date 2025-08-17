import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Workouts from "./pages/Workouts.jsx";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Settings from "./pages/Settings.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="about" element={<AboutPage />} />

            <Route element={<ProtectedRoute />}>
              <Route index element={<Workouts />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<p>Not Found</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
