import { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  doc 
} from "firebase/firestore";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Função para fazer logout
  const logout = async () => {
    try {
      await signOut(auth);
      // Limpar dados locais
      localStorage.clear();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  // Função para deletar todos os dados do usuário no Firestore
  const deleteUserData = async (userId) => {
    try {
      // Deletar todos os workouts do usuário
      const workoutsQuery = query(
        collection(db, "workouts"),
        where("createdBy", "==", userId)
      );
      const workoutsSnapshot = await getDocs(workoutsQuery);
      
      const deletePromises = workoutsSnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, "workouts", docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
      
      // Limpar localStorage
      localStorage.clear();
      
      console.log("Dados do usuário deletados com sucesso");
    } catch (error) {
      console.error("Erro ao deletar dados do usuário:", error);
      throw error;
    }
  };

  // Função para deletar conta
  const deleteAccount = async (password) => {
    if (!currentUser) {
      throw new Error("Usuário não está logado");
    }

    try {
      // Reautenticar o usuário antes de deletar
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Deletar dados do Firestore
      await deleteUserData(currentUser.uid);
      
      // Deletar conta do Firebase Auth
      await deleteUser(currentUser);
      
      console.log("Conta deletada com sucesso");
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}