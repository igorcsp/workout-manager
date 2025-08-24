import { useState, useEffect, useCallback } from "react";

export const useExerciseStates = (workoutId) => {
  const [exerciseStates, setExerciseStates] = useState({});

  // Chave única para o localStorage baseada no workoutId
  const storageKey = `workout-states-${workoutId}`;

  // Carregar estados do localStorage quando o workoutId mudar
  useEffect(() => {
    if (!workoutId) return;

    try {
      const savedStates = localStorage.getItem(storageKey);
      if (savedStates) {
        setExerciseStates(JSON.parse(savedStates));
      } else {
        setExerciseStates({});
      }
    } catch (error) {
      console.error("Erro ao carregar estados do localStorage:", error);
      setExerciseStates({});
    }
  }, [workoutId, storageKey]);

  // Salvar estados no localStorage sempre que mudarem
  useEffect(() => {
    if (!workoutId) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(exerciseStates));
    } catch (error) {
      console.error("Erro ao salvar estados no localStorage:", error);
    }
  }, [exerciseStates, storageKey, workoutId]);

  // Função para atualizar o estado de um exercício específico
  const updateExerciseState = useCallback((exerciseId, newState) => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseId]: {
        completed: false,
        currentSeries: 0,
        completedSeries: [],
        timerActive: false,
        ...prev[exerciseId],
        ...newState
      }
    }));
  }, []);

  // Função para obter o estado de um exercício específico
  const getExerciseState = useCallback((exerciseId) => {
    return exerciseStates[exerciseId] || {
      completed: false,
      currentSeries: 0,
      completedSeries: [],
      timerActive: false
    };
  }, [exerciseStates]);

  // Função para resetar todos os estados do treino
  const resetWorkoutStates = useCallback(() => {
    setExerciseStates({});
    if (workoutId) {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Erro ao limpar estados do localStorage:", error);
      }
    }
  }, [workoutId, storageKey]);

  // Função para resetar o estado de um exercício específico
  const resetExerciseState = useCallback((exerciseId) => {
    setExerciseStates(prev => {
      const newStates = { ...prev };
      delete newStates[exerciseId];
      return newStates;
    });
  }, []);

  return {
    updateExerciseState,
    getExerciseState,
    resetWorkoutStates,
    resetExerciseState,
    exerciseStates
  };
};