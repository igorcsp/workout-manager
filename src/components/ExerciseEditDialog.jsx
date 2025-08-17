import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const ExerciseEditDialog = ({ open, exercise, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    sets: 1,
    reps: 1,
    weight: 0,
    rest: 60,
    obs: "",
  });

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || "",
        sets: exercise.sets || 1,
        reps: exercise.reps || 1,
        weight: exercise.weight || 0,
        rest: exercise.rest || 60,
        obs: exercise.obs || "",
      });
    }
  }, [exercise]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {exercise ? "Editar Exercício" : "Novo Exercício"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Exercício"
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Séries"
                type="number"
                value={formData.sets}
                onChange={handleChange("sets")}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Repetições"
                type="number"
                value={formData.reps}
                onChange={handleChange("reps")}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange("weight")}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Descanso (s)"
                type="number"
                value={formData.rest}
                onChange={handleChange("rest")}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={formData.obs}
                onChange={handleChange("obs")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {exercise ? "Salvar" : "Criar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExerciseEditDialog;
