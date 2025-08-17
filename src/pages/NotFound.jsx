import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3" color="primary" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Oops! Página não encontrada.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Voltar para Início
      </Button>
    </Box>
  );
}
