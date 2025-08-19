import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Pelo menos 6 caracteres (padrão do Firebase)
    return password.length >= 6;
  };

  const validateName = (name) => {
    // Nome deve ter pelo menos 2 caracteres e apenas letras e espaços
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    return nameRegex.test(name.trim());
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validações do frontend
    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    if (!validateName(name)) {
      setError("Nome deve ter pelo menos 2 caracteres e conter apenas letras.");
      return;
    }

    if (!email.trim()) {
      setError("Email é obrigatório.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (!password) {
      setError("Senha é obrigatória.");
      return;
    }

    if (!validatePassword(password)) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("Este email já está em uso.");
          break;
        case 'auth/invalid-email':
          setError("Email inválido.");
          break;
        case 'auth/weak-password':
          setError("A senha é muito fraca. Use pelo menos 6 caracteres.");
          break;
        case 'auth/operation-not-allowed':
          setError("Cadastro com email/senha não está habilitado.");
          break;
        default:
          setError("Falha ao criar a conta. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Página de Cadastro</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            required
            disabled={loading}
            maxLength={50}
          />
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={loading}
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (mínimo 6 caracteres)"
            required
            disabled={loading}
            minLength={6}
          />
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar senha"
            required
            disabled={loading}
            minLength={6}
          />
          
          <div>
            <label>Eu sou:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="usuario">Usuário</option>
              <option value="personal">Personal Trainer</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          
          {error && <p className="register-error">{error}</p>}
        </form>
        
        <p>
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}