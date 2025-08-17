import { Link, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>
          <Link to="/">Workout Manager</Link>
        </h1>
      </div>
      <div className="navbar-links">
        <NavLink
          to="/"
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
        {currentUser ? (
          <NavLink
            to="/profile"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            Perfil
          </NavLink>
        ) : (
          ""
        )}
        {currentUser ? (
          <Link to="/" onClick={handleLogout}>
            Sair
          </Link>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}
