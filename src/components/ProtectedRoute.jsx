import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../pages/Loader";

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  // Se não estiver logado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza as rotas filhas
  return <Outlet />;
}
