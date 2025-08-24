import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";

export default function FinishWorkoutButton({ onFinishWorkout, disabled }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleFinish = () => {
    onFinishWorkout();
    setConfirmOpen(false);
  };

  return (
    <>
      <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<CheckIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={disabled}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Finalizar Treino
        </Button>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckIcon color="success" />
            Finalizar Treino
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja finalizar este treino? Isso irá resetar todos os estados dos exercícios (checkboxes e switches).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleFinish}
            variant="contained"
            color="success"
          >
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}