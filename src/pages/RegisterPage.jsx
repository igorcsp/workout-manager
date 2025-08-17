import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario"); // Papel padrão
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
        email: user.email,
        role: role,
      });

      navigate("/");
    } catch (err) {
      setError("Falha ao criar a conta. Verifique os dados e tente novamente.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Página de Cadastro</h2>
      <form onSubmit={handleRegister}>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
}
