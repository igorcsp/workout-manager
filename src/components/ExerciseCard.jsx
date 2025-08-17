import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Checkbox,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import Timer from "./Timer";
import ExerciseEditDialog from "./ExerciseEditDialog";
import sound from "../assets/timerSound.mp3";

export default function ExerciseCard({
  exercise,
  workoutId,
  dragHandleProps,
  onUpdate,
  onDelete,
  isDragging,
}) {
  const [completed, setCompleted] = useState(false);
  const [currentSeries, setCurrentSeries] = useState(0);
  const [completedSeries, setCompletedSeries] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    resetExercise();
  }, [exercise.id]);

  const resetExercise = () => {
    setCompleted(false);
    setCurrentSeries(0);
    setCompletedSeries([]);
    setTimerActive(false);
    setTimerKey((prev) => prev + 1);
  };

  const handleCheckboxClick = (index) => {
    if (index !== currentSeries || timerActive || completed) {
      return;
    }

    const newCompletedSeries = [...completedSeries, index];
    setCompletedSeries(newCompletedSeries);

    if (index < exercise.sets - 1) {
      setTimerActive(true);
      setTimerKey((prev) => prev + 1);
    } else {
      setCompleted(true);
      setTimerActive(false);
    }
  };

  const handleTimerExpire = () => {
    console.log("Timer expirou!");
    new Audio(sound).play();
    if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
    setTimerActive(false);

    const nextSeries = currentSeries + 1;
    if (nextSeries < exercise.sets) {
      setCurrentSeries(nextSeries);
    }
  };

  const handleEdit = (updatedExercise) => {
    onUpdate(workoutId, exercise.id, updatedExercise);
    setEditOpen(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o exercício "${exercise.name}"?`
      )
    ) {
      onDelete(workoutId, exercise.id);
    }
  };

  const handleSwitchChange = (event) => {
    if (event.target.checked) {
      setCompleted(true);
      setCompletedSeries(Array.from({ length: exercise.sets }, (_, i) => i));
      setCurrentSeries(exercise.sets - 1);
      setTimerActive(false);
    } else {
      resetExercise();
    }
  };

  return (
    <>
      <Card
        elevation={isDragging ? 8 : 2}
        sx={{
          opacity: isDragging ? 0.8 : 1,
          transform: isDragging ? "rotate(2deg)" : "none",
          transition: "all 0.2s ease",
          mb: 2,
          border: completed ? "2px solid" : "1px solid",
          borderColor: completed ? "success.main" : "divider",
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton {...dragHandleProps} size="small">
                <DragIcon />
              </IconButton>
              <Typography variant="h6">{exercise.name}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={completed}
                onChange={handleSwitchChange}
                color="success"
              />
              <IconButton onClick={() => setEditOpen(true)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Series */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={2}
            flexWrap="wrap"
          >
            <Typography variant="body2" sx={{ minWidth: 50 }}>
              Séries:
            </Typography>
            {Array.from({ length: exercise.sets || 1 }).map((_, i) => {
              const isCompleted = completedSeries.includes(i);
              const isCurrent = i === currentSeries;
              const isDisabled = i > currentSeries || timerActive || completed;

              return (
                <Checkbox
                  key={i}
                  checked={isCompleted}
                  disabled={isDisabled}
                  onChange={() => handleCheckboxClick(i)}
                  size="small"
                  sx={{
                    color: isCompleted
                      ? "success.main"
                      : isCurrent
                      ? "primary.main"
                      : "default",
                    "&.Mui-checked": {
                      color: "success.main",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.5,
                    },
                    border: isCurrent && !isCompleted ? "2px solid" : "none",
                    borderColor: "primary.main",
                    borderRadius: "4px",
                  }}
                />
              );
            })}
          </Box>

          {(exercise.weight || 0) > 0 && (
            <Box mb={2}>
              <Chip
                label={`${exercise.weight} kg`}
                variant="outlined"
                size="small"
                color="primary"
              />
            </Box>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body2">
              Repetições: {exercise.reps || 0}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">Descanso:</Typography>
              <Timer
                key={`${exercise.id}-${timerKey}`}
                restTime={exercise.rest || 60}
                onExpire={handleTimerExpire}
                autoStart={timerActive}
              />
            </Box>
          </Box>

          {timerActive && (
            <Box mb={2}>
              <Chip
                label={`Descansando após série ${currentSeries + 1}`}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          )}

          {completed && (
            <Box mb={2}>
              <Chip
                label="Exercício concluído!"
                size="small"
                color="success"
                variant="filled"
              />
            </Box>
          )}

          {exercise.obs && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {exercise.obs}
            </Typography>
          )}
        </CardContent>
      </Card>

      <ExerciseEditDialog
        open={editOpen}
        exercise={exercise}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />
    </>
  );
}
