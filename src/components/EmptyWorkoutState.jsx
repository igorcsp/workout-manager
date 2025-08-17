import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { FitnessCenter as FitnessCenterIcon } from "@mui/icons-material";

const EmptyWorkoutState = ({ onCreateWorkout }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={3}
      textAlign="center"
    >
      <FitnessCenterIcon
        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
      />
      <Typography variant="h5" gutterBottom>
        Nenhum treino encontrado
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Crie seu primeiro treino para começar
      </Typography>
      <Button variant="contained" onClick={onCreateWorkout} size="large">
        Criar Primeiro Treino
      </Button>
    </Box>
  );
};

export default EmptyWorkoutState;
