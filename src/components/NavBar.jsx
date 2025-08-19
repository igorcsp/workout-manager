import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>
          <Link to={currentUser ? "/workouts" : "/login"}>Workout Manager</Link>
        </h1>
      </div>
      <div className="navbar-links">
        {currentUser ? (
          <>
            <NavLink
              to="/workouts"
              end
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Treino
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Sobre
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Perfil
            </NavLink>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/about"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Sobre
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Cadastrar
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}