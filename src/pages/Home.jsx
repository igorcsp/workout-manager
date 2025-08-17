import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import ExerciseCard from "../components/ExerciseCard";

export default function Home() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  const handleAddExercise = async () => {
    // Exemplo de dados do exercício
    const exerciseData = {
      title: "Flexão de braços",
      weight: 0, // Flexão não usa peso
      series: 4,
      repetitions: 15,
      restTime: 60, // em segundos
      observations: "Mantenha a postura correta durante o exercício.",
      createdBy: currentUser.uid, // Associa o exercício ao usuário logado
    };

    try {
      const docRef = await addDoc(collection(db, "exercises"), exerciseData);
      alert(`Exercício "${exerciseData.title}" adicionado com sucesso!`);
      console.log("Documento adicionado com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar exercício: ", e);
      alert("Ocorreu um erro ao adicionar o exercício.");
    }
  };

  return (
    <div>
      <p>current user: {currentUser?.email}</p>
      <p>current user: {currentUser?.password}</p>
      <ExerciseCard />
      <button onClick={handleAddExercise}>
        Adicionar Exercício de Exemplo
      </button>
      <br />
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
