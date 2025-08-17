import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function WorkoutEditDialog({ open, workout, onClose, onSave }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (workout) {
      setTitle(workout.title || "");
    } else {
      setTitle("");
    }
  }, [workout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{workout ? "Editar Treino" : "Novo Treino"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Treino"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {workout ? "Salvar" : "Criar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
