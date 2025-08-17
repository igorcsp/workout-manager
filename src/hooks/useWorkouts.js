import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "workouts"),
      where("createdBy", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workoutsData = [];
      querySnapshot.forEach((doc) => {
        workoutsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Ordenar por order se existir, senão por data de criação
      workoutsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setWorkouts(workoutsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const createWorkout = async (workoutData) => {
    try {
      const docRef = await addDoc(collection(db, "workouts"), {
        ...workoutData,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        order: workouts.length,
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar workout:", error);
      throw error;
    }
  };

  const updateWorkout = async (workoutId, updates) => {
    try {
      const workoutRef = doc(db, "workouts", workoutId);
      await updateDoc(workoutRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Erro ao atualizar workout:", error);
      throw error;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      await deleteDoc(doc(db, "workouts", workoutId));
    } catch (error) {
      console.error("Erro ao deletar workout:", error);
      throw error;
    }
  };

  const reorderWorkouts = async (reorderedWorkouts) => {
    try {
      const batch = writeBatch(db);

      reorderedWorkouts.forEach((workout, index) => {
        const workoutRef = doc(db, "workouts", workout.id);
        batch.update(workoutRef, { order: index });
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao reordenar workouts:", error);
      throw error;
    }
  };

  const reorderExercises = async (workoutId, reorderedExercises) => {
    try {
      const workoutRef = doc(db, "workouts", workoutId);
      await updateDoc(workoutRef, {
        exercises: reorderedExercises,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Erro ao reordenar exercícios:", error);
      throw error;
    }
  };

  const addExercise = async (workoutId, exerciseData) => {
    try {
      const workout = workouts.find((w) => w.id === workoutId);
      const newExercise = {
        id: `exercise-${Date.now()}`,
        ...exerciseData,
      };

      const updatedExercises = [...(workout.exercises || []), newExercise];
      await updateWorkout(workoutId, { exercises: updatedExercises });
    } catch (error) {
      console.error("Erro ao adicionar exercício:", error);
      throw error;
    }
  };

  const updateExercise = async (workoutId, exerciseId, updates) => {
    try {
      const workout = workouts.find((w) => w.id === workoutId);
      const updatedExercises = workout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );
      await updateWorkout(workoutId, { exercises: updatedExercises });
    } catch (error) {
      console.error("Erro ao atualizar exercício:", error);
      throw error;
    }
  };

  const deleteExercise = async (workoutId, exerciseId) => {
    try {
      const workout = workouts.find((w) => w.id === workoutId);
      const updatedExercises = workout.exercises.filter(
        (ex) => ex.id !== exerciseId
      );
      await updateWorkout(workoutId, { exercises: updatedExercises });
    } catch (error) {
      console.error("Erro ao deletar exercício:", error);
      throw error;
    }
  };

  return {
    workouts,
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    reorderWorkouts,
    reorderExercises,
    addExercise,
    updateExercise,
    deleteExercise,
  };
};
