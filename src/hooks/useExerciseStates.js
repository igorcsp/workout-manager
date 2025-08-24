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
        const parsedStates = JSON.parse(savedStates);
        
        // Validar e limpar dados corrompidos
        const validatedStates = {};
        Object.keys(parsedStates).forEach(exerciseId => {
          const state = parsedStates[exerciseId];
          if (state && typeof state === 'object') {
            validatedStates[exerciseId] = {
              completed: Boolean(state.completed),
              currentSeries: Number(state.currentSeries) || 0,
              completedSeries: Array.isArray(state.completedSeries) ? state.completedSeries : [],
              timerActive: Boolean(state.timerActive),
              timerStartTime: state.timerStartTime || null,
              timerDuration: state.timerDuration || null
            };
          }
        });
        
        setExerciseStates(validatedStates);
      } else {
        setExerciseStates({});
      }
    } catch (error) {
      console.error("Erro ao carregar estados do localStorage:", error);
      // Limpar dados corrompidos
      localStorage.removeItem(storageKey);
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
        timerStartTime: null,
        timerDuration: null,
        ...prev[exerciseId],
        ...newState
      }
    }));
  }, []);

  // Função para obter o estado de um exercício específico
  const getExerciseState = useCallback((exerciseId) => {
    const state = exerciseStates[exerciseId];
    
    // Garantir que sempre retornamos valores válidos
    return {
      completed: Boolean(state?.completed),
      currentSeries: Number(state?.currentSeries) || 0,
      completedSeries: Array.isArray(state?.completedSeries) ? state.completedSeries : [],
      timerActive: Boolean(state?.timerActive),
      timerStartTime: state?.timerStartTime || null,
      timerDuration: state?.timerDuration || null
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

  // Função para limpar todos os dados corrompidos
  const clearCorruptedData = useCallback(() => {
    try {
      // Limpar todos os dados de workout do localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('workout-states-') || key.startsWith('timer-')) {
          localStorage.removeItem(key);
        }
      });
      setExerciseStates({});
      console.log('Dados corrompidos limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados corrompidos:', error);
    }
  }, []);

  return {
    updateExerciseState,
    getExerciseState,
    resetWorkoutStates,
    resetExerciseState,
    clearCorruptedData,
    exerciseStates
  };
};