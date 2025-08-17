import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import ExerciseEditDialog from "./ExerciseEditDialog";
import WorkoutEditDialog from "./WorkoutEditDialog";

const WorkoutHeader = ({
  workout,
  onAddExercise,
  onUpdateWorkout,
  onDeleteWorkout,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddExercise = (exerciseData) => {
    onAddExercise(workout.id, exerciseData);
    setExerciseDialogOpen(false);
  };

  const handleEditWorkout = (workoutData) => {
    onUpdateWorkout(workout.id, workoutData);
    setWorkoutDialogOpen(false);
  };

  const handleDeleteWorkout = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o treino "${workout.title}"?`
      )
    ) {
      onDeleteWorkout(workout.id);
    }
    handleMenuClose();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {workout.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workout.exercises?.length || 0} exercícios
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button variant="contained" startIcon={<PlayIcon />} color="primary">
            Iniciar Treino
          </Button>

          <IconButton
            onClick={() => setExerciseDialogOpen(true)}
            color="primary"
          >
            <AddIcon />
          </IconButton>

          <IconButton onClick={handleMenuOpen}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setWorkoutDialogOpen(true);
            handleMenuClose();
          }}
        >
          Editar Treino
        </MenuItem>
        <MenuItem onClick={handleDeleteWorkout}>Excluir Treino</MenuItem>
      </Menu>

      <ExerciseEditDialog
        open={exerciseDialogOpen}
        onClose={() => setExerciseDialogOpen(false)}
        onSave={handleAddExercise}
      />

      <WorkoutEditDialog
        open={workoutDialogOpen}
        workout={workout}
        onClose={() => setWorkoutDialogOpen(false)}
        onSave={handleEditWorkout}
      />
    </>
  );
};

export default WorkoutHeader;
