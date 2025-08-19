import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    } else {
      // Reset form quando não há exercício (novo exercício)
      setFormData({
        name: "",
        sets: 1,
        reps: 1,
        weight: 0,
        rest: 60,
        obs: "",
      });
    }
    setErrors({});
  }, [exercise, open]);

  const validateForm = () => {
    const newErrors = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome do exercício é obrigatório.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres.";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Nome deve ter no máximo 50 caracteres.";
    }

    // Validação das séries
    const sets = parseInt(formData.sets);
    if (!sets || sets < 1) {
      newErrors.sets = "Séries deve ser pelo menos 1.";
    } else if (sets > 9) {
      newErrors.sets = "Séries deve ser no máximo 9.";
    }

    // Validação das repetições
    const reps = parseInt(formData.reps);
    if (!reps || reps < 1) {
      newErrors.reps = "Repetições deve ser pelo menos 1.";
    } else if (reps > 99) {
      newErrors.reps = "Repetições deve ser no máximo 99.";
    }

    // Validação do peso
    const weight = parseFloat(formData.weight);
    if (weight < 0) {
      newErrors.weight = "Peso não pode ser negativo.";
    } else if (weight > 999) {
      newErrors.weight = "Peso deve ser no máximo 999kg.";
    }

    // Validação do descanso
    const rest = parseInt(formData.rest);
    if (rest < 0) {
      newErrors.rest = "Descanso não pode ser negativo.";
    } else if (rest > 3600) {
      newErrors.rest = "Descanso deve ser no máximo 3600 segundos (1 hora).";
    }

    // Validação das observações
    if (formData.obs.length > 500) {
      newErrors.obs = "Observações deve ter no máximo 500 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    // Formatação específica para campos numéricos
    if (field === 'sets' || field === 'reps' || field === 'rest') {
      value = value.replace(/[^0-9]/g, ''); // Apenas números
    } else if (field === 'weight') {
      value = value.replace(/[^0-9.]/g, ''); // Números e ponto decimal
      // Evitar múltiplos pontos decimais
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    setFormData({
      ...formData,
      [field]: value,
    });

    // Limpar erro específico quando o usuário começar a digitar
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Processar dados antes de salvar
      const processedData = {
        ...formData,
        name: formData.name.trim(),
        sets: parseInt(formData.sets) || 1,
        reps: parseInt(formData.reps) || 1,
        weight: parseFloat(formData.weight) || 0,
        rest: parseInt(formData.rest) || 60,
        obs: formData.obs.trim(),
      };

      await onSave(processedData);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar exercício:", err);
      setErrors({ general: "Erro ao salvar exercício. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {exercise ? "Editar Exercício" : "Novo Exercício"}
        </DialogTitle>
        
        <DialogContent>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Exercício"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={loading}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Séries"
                type="number"
                value={formData.sets}
                onChange={handleChange("sets")}
                error={!!errors.sets}
                helperText={errors.sets}
                inputProps={{ min: 1, max: 50 }}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Repetições"
                type="number"
                value={formData.reps}
                onChange={handleChange("reps")}
                error={!!errors.reps}
                helperText={errors.reps}
                inputProps={{ min: 1, max: 1000 }}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange("weight")}
                error={!!errors.weight}
                helperText={errors.weight}
                inputProps={{ min: 0, max: 1000, step: 0.5 }}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Descanso (segundos)"
                type="number"
                value={formData.rest}
                onChange={handleChange("rest")}
                error={!!errors.rest}
                helperText={errors.rest}
                inputProps={{ min: 0, max: 3600 }}
                disabled={loading}
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
                error={!!errors.obs}
                helperText={errors.obs || `${formData.obs.length}/500 caracteres`}
                inputProps={{ maxLength: 500 }}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || hasErrors}
          >
            {loading ? "Salvando..." : (exercise ? "Salvar" : "Criar")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExerciseEditDialog;