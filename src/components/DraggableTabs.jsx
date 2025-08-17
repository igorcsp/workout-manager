import { useState } from "react";
import { Tab, Box, IconButton } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function DraggableTabs({
  workouts,
  activeTab,
  onTabChange,
  onReorder,
}) {
  const [dragEnabled, setDragEnabled] = useState(false);

  const handleDragEnd = (result) => {
    setDragEnabled(false);

    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(workouts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let newActiveTab = activeTab;
    if (activeTab === result.source.index) {
      newActiveTab = result.destination.index;
    } else if (
      activeTab > result.source.index &&
      activeTab <= result.destination.index
    ) {
      newActiveTab = activeTab - 1;
    } else if (
      activeTab < result.source.index &&
      activeTab >= result.destination.index
    ) {
      newActiveTab = activeTab + 1;
    }

    onReorder(items);
    onTabChange(null, newActiveTab);
  };

  const handleTabClick = (event, newValue) => {
    if (!dragEnabled) {
      onTabChange(event, newValue);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", position: "relative" }}
        >
          <Droppable droppableId="workout-tabs" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: snapshot.isDraggingOver
                    ? "action.hover"
                    : "transparent",
                  minHeight: 48,
                  transition: "background-color 0.2s ease",
                }}
              >
                {workouts.map((workout, index) => (
                  <Draggable
                    key={workout.id}
                    draggableId={workout.id}
                    index={index}
                    isDragDisabled={!dragEnabled}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transform: snapshot.isDragging
                            ? "rotate(2deg)"
                            : "none",
                          zIndex: snapshot.isDragging ? 1000 : 1,
                          backgroundColor: snapshot.isDragging
                            ? "background.paper"
                            : "transparent",
                          borderRadius: snapshot.isDragging ? 1 : 0,
                          boxShadow: snapshot.isDragging ? 3 : 0,
                        }}
                      >
                        <IconButton
                          {...provided.dragHandleProps}
                          size="small"
                          sx={{
                            opacity: 0.6,
                            "&:hover": { opacity: 1 },
                          }}
                          onMouseDown={() => setDragEnabled(true)}
                          onMouseUp={() => setDragEnabled(false)}
                        >
                          <DragIcon fontSize="small" />
                        </IconButton>

                        <Tab
                          label={workout.title}
                          onClick={(e) => handleTabClick(e, index)}
                          sx={{
                            minWidth: "auto",
                            px: 2,
                            cursor: dragEnabled ? "grabbing" : "pointer",
                            backgroundColor:
                              activeTab === index
                                ? "action.selected"
                                : "transparent",
                            borderBottom: activeTab === index ? 2 : 0,
                            borderColor: "primary.main",
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </Box>
  );
}
