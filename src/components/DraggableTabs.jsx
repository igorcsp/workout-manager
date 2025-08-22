import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile para ajustar a interface
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  // Melhora o comportamento de touch no mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setDragEnabled(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      // Pequeno delay para permitir o drag
      setTimeout(() => setDragEnabled(false), 100);
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{ 
            borderBottom: 1, 
            borderColor: "divider", 
            position: "relative",
            // Indicador de scroll no mobile
            "&::after": isMobile && workouts.length > 3 ? {
              content: '""',
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 20,
              pointerEvents: "none",
              zIndex: 1,
            } : {},
          }}
        >
          <Droppable droppableId="workout-tabs" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={isMobile ? "draggable-tabs-container" : ""}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: snapshot.isDraggingOver
                    ? "action.hover"
                    : "transparent",
                  minHeight: { xs: 56, sm: 48 }, // Maior altura no mobile
                  transition: "background-color 0.2s ease",
                  overflowX: "auto", // Scroll horizontal quando necessário
                  overflowY: "hidden",
                  // Estilo da scrollbar para mobile
                  "&::-webkit-scrollbar": {
                    height: 4,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                  },
                  // Padding para dar espaço no mobile
                  px: { xs: 1, sm: 0 },
                  // Scroll suave no mobile
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
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
                          // Melhor espaçamento no mobile
                          mr: { xs: 0.5, sm: 0 },
                          // Evita que o item seja muito pequeno no mobile
                          minWidth: isMobile ? "fit-content" : "auto",
                        }}
                        className={isMobile ? "draggable-tab-item" : ""}
                      >
                        <IconButton
                          {...provided.dragHandleProps}
                          size="small"
                          className={isMobile ? "drag-handle-mobile" : ""}
                          sx={{
                            opacity: 0.6,
                            "&:hover": { opacity: 1 },
                            // Maior área de toque no mobile
                            minWidth: { xs: 44, sm: 40 },
                            minHeight: { xs: 44, sm: 40 },
                            p: { xs: 1.5, sm: 1 },
                          }}
                          onMouseDown={() => setDragEnabled(true)}
                          onMouseUp={() => setDragEnabled(false)}
                          onTouchStart={handleTouchStart}
                          onTouchEnd={handleTouchEnd}
                        >
                          <DragIcon fontSize={isMobile ? "medium" : "small"} />
                        </IconButton>

                        <Tab
                          label={workout.title}
                          onClick={(e) => handleTabClick(e, index)}
                          sx={{
                            minWidth: { xs: 100, sm: "auto" }, // Largura mínima no mobile
                            maxWidth: { xs: 150, sm: 200 }, // Largura máxima para evitar tabs muito longas
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 1.5, sm: 1 },
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
                            // Texto responsivo
                            fontSize: { xs: "0.875rem", sm: "0.875rem" },
                            fontWeight: { xs: 500, sm: 400 },
                            // Quebra de texto se necessário
                            "& .MuiTab-wrapper": {
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            },
                            // Melhor espaçamento no mobile
                            flexShrink: 0, // Evita que as tabs encolham demais
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
