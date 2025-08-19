import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setError("");
    setResetMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/workouts", { replace: true });
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("Usuário não encontrado. Verifique o email ou cadastre-se.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Senha incorreta. Tente novamente ou redefina sua senha.");
          break;
        case "auth/invalid-email":
          setError("Email inválido.");
          break;
        case "auth/user-disabled":
          setError("Esta conta foi desabilitada.");
          break;
        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde.");
          break;
        default:
          setError("Email ou senha inválidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Por favor, insira seu email primeiro.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setError("");
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage(
        "Email de redefinição enviado! Verifique sua caixa de entrada."
      );
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("Usuário não encontrado com este email.");
          break;
        case "auth/invalid-email":
          setError("Email inválido.");
          break;
        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde.");
          break;
        default:
          setError("Erro ao enviar email de redefinição.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Página de Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={loading}
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            disabled={loading}
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error && <p className="login-error">{error}</p>}
          {resetMessage && <p className="login-success">{resetMessage}</p>}
        </form>

        <div className="login-links">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-btn"
            disabled={resetLoading}
          >
            {resetLoading ? "Enviando..." : "Esqueci minha senha"}
          </button>

          <p>
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}