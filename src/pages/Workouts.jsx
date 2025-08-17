import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Fab,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useWorkouts } from '../hooks/useWorkouts';
import { useAuth } from '../context/AuthContext';
import DraggableTabs from '../components/DraggableTabs';
import DraggableExerciseList from '../components/DraggableExerciseList';
import WorkoutHeader from '../components/WorkoutHeader';
import EmptyWorkoutState from '../components/EmptyWorkoutState';
import WorkoutEditDialog from '../components/WorkoutEditDialog';

export default function Workouts() {
  const { currentUser } = useAuth();
  const {
    workouts,
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    reorderWorkouts,
    reorderExercises,
    addExercise,
    updateExercise,
    deleteExercise
  } = useWorkouts();

  const [activeTab, setActiveTab] = useState(0);
  const [newWorkoutDialogOpen, setNewWorkoutDialogOpen] = useState(false);
  const [error, setError] = useState('');

  // Ajustar activeTab quando workouts mudam
  useEffect(() => {
    if (workouts.length > 0 && activeTab >= workouts.length) {
      setActiveTab(workouts.length - 1);
    }
  }, [workouts.length, activeTab]);

  const handleTabChange = (event, newValue) => {
    if (newValue >= 0 && newValue < workouts.length) {
      setActiveTab(newValue);
    }
  };

  const handleCreateWorkout = async (workoutData) => {
    try {
      setError('');
      await createWorkout({
        title: workoutData.title,
        exercises: []
      });
      setNewWorkoutDialogOpen(false);
      // Selecionar o novo treino
      setActiveTab(workouts.length);
    } catch (error) {
      console.error('Erro ao criar workout:', error);
      setError('Erro ao criar treino. Tente novamente.');
    }
  };

  const handleUpdateWorkout = async (workoutId, updates) => {
    try {
      setError('');
      await updateWorkout(workoutId, updates);
    } catch (error) {
      console.error('Erro ao atualizar workout:', error);
      setError('Erro ao atualizar treino. Tente novamente.');
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      setError('');
      await deleteWorkout(workoutId);
      // Ajustar tab ativa se necessário
      if (activeTab >= workouts.length - 1) {
        setActiveTab(Math.max(0, workouts.length - 2));
      }
    } catch (error) {
      console.error('Erro ao excluir workout:', error);
      setError('Erro ao excluir treino. Tente novamente.');
    }
  };

  const handleAddExercise = async (workoutId, exerciseData) => {
    try {
      setError('');
      await addExercise(workoutId, exerciseData);
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      setError('Erro ao adicionar exercício. Tente novamente.');
    }
  };

  const handleUpdateExercise = async (workoutId, exerciseId, updates) => {
    try {
      setError('');
      await updateExercise(workoutId, exerciseId, updates);
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      setError('Erro ao atualizar exercício. Tente novamente.');
    }
  };

  const handleDeleteExercise = async (workoutId, exerciseId) => {
    try {
      setError('');
      await deleteExercise(workoutId, exerciseId);
    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
      setError('Erro ao excluir exercício. Tente novamente.');
    }
  };

  const handleReorderWorkouts = async (reorderedWorkouts) => {
    try {
      setError('');
      await reorderWorkouts(reorderedWorkouts);
    } catch (error) {
      console.error('Erro ao reordenar workouts:', error);
      setError('Erro ao reordenar treinos. Tente novamente.');
    }
  };

  const handleReorderExercises = async (workoutId, reorderedExercises) => {
    try {
      setError('');
      await reorderExercises(workoutId, reorderedExercises);
    } catch (error) {
      console.error('Erro ao reordenar exercícios:', error);
      setError('Erro ao reordenar exercícios. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (workouts.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo, {currentUser?.name?.split(' ')[0]}!
          </Typography>
          <EmptyWorkoutState onCreateWorkout={() => setNewWorkoutDialogOpen(true)} />
          <WorkoutEditDialog
            open={newWorkoutDialogOpen}
            onClose={() => setNewWorkoutDialogOpen(false)}
            onSave={handleCreateWorkout}
          />
        </Box>
      </Container>
    );
  }

  const currentWorkout = workouts[activeTab];

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {currentUser?.name?.split(' ')[0]}!
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <DraggableTabs
          workouts={workouts}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onReorder={handleReorderWorkouts}
        />

        {currentWorkout && (
          <Box mt={3}>
            <WorkoutHeader
              workout={currentWorkout}
              onAddExercise={handleAddExercise}
              onUpdateWorkout={handleUpdateWorkout}
              onDeleteWorkout={handleDeleteWorkout}
            />

            {currentWorkout.exercises?.length > 0 ? (
              <DraggableExerciseList
                exercises={currentWorkout.exercises}
                workoutId={currentWorkout.id}
                onReorder={handleReorderExercises}
                onUpdateExercise={handleUpdateExercise}
                onDeleteExercise={handleDeleteExercise}
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={8}
                textAlign="center"
              >
                <Typography variant="h6" gutterBottom>
                  Nenhum exercício adicionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clique no botão + para adicionar exercícios a este treino
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setNewWorkoutDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        <WorkoutEditDialog
          open={newWorkoutDialogOpen}
          onClose={() => setNewWorkoutDialogOpen(false)}
          onSave={handleCreateWorkout}
        />
      </Box>
    </Container>
  );
}