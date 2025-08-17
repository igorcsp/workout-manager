// src/pages/RegisterPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        role: role,
      });

      navigate("/");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else {
        setError("Falha ao criar a conta. Verifique os dados.");
      }
      console.error(err);
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
            placeholder="Nome"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
          <div>
            <label>Eu sou:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="usuario">Usuário</option>
              <option value="personal">Personal Trainer</option>
            </select>
          </div>
          <button type="submit">Cadastrar</button>
          {error && <p className="register-error">{error}</p>}
        </form>
        <p>
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}