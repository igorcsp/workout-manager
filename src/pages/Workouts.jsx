import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import ExerciseCard from "../components/ExerciseCard";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Workouts() {
  const { currentUser } = useAuth();

  const handleAddExercise = async () => {
    const exerciseData = {
      title: "Flexão de braços",
      weight: 0,
      series: 4,
      repetitions: 15,
      restTime: 60,
      observations: "Mantenha a postura correta durante o exercício.",
      createdBy: currentUser.uid,
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
      <p>Bem-vindo, {currentUser.name.split(" ")[0]}!</p>
      <ExerciseCard />
      <AddCircleIcon />
      <button onClick={handleAddExercise}>
        Adicionar Exercício de Exemplo
      </button>
    </div>
  );
}
