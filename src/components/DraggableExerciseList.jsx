import { Box } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseCard from "./ExerciseCard";

export default function DraggableExerciseList({
  exercises,
  workoutId,
  onReorder,
  onUpdateExercise,
  onDeleteExercise,
  getExerciseState,
  onExerciseStateChange,
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(workoutId, items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`exercises-${workoutId}`}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ mt: 2 }}
          >
            {exercises.map((exercise, index) => (
              <Draggable
                key={exercise.id}
                draggableId={exercise.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      opacity: snapshot.isDragging ? 0.5 : 1,
                      mb: 2,
                    }}
                  >
                    <ExerciseCard
                      exercise={exercise}
                      workoutId={workoutId}
                      dragHandleProps={provided.dragHandleProps}
                      onUpdate={onUpdateExercise}
                      onDelete={onDeleteExercise}
                      isDragging={snapshot.isDragging}
                      exerciseState={getExerciseState(exercise.id)}
                      onStateChange={onExerciseStateChange}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
