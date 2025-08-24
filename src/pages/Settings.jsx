import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  DeleteForever as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useExerciseStates } from '../hooks/useExerciseStates';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout, deleteAccount } = useAuth();
  const { clearCorruptedData } = useExerciseStates();
  const navigate = useNavigate();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Erro ao fazer logout. Tente novamente.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setError('Por favor, digite sua senha para confirmar.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await deleteAccount(password);
      setSnackbarMessage('Conta deletada com sucesso!');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Erro ao deletar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPassword('');
    setError('');
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados de progresso dos treinos? Esta ação não pode ser desfeita.')) {
      clearCorruptedData();
      setSnackbarMessage('Dados de progresso limpos com sucesso!');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate('/workouts')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Configurações
          </Typography>
        </Box>

        {/* Informações do usuário */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Conta
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentUser?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.name || 'Nome não definido'}
            </Typography>
          </CardContent>
        </Card>

        {/* Configurações de Aparência */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Aparência
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Modo Escuro" 
                  secondary="Alternar entre tema claro e escuro"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Dados e Manutenção */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dados e Manutenção
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DeleteIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="Limpar Dados de Progresso" 
                  secondary="Remove o progresso de todos os treinos (checkboxes, timers, etc.)"
                />
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleClearData}
                  disabled={loading}
                >
                  Limpar
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Ações da Conta */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ações da Conta
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Sair da Conta" 
                  secondary="Fazer logout do aplicativo"
                />
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  Sair
                </Button>
              </ListItem>
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Deletar Conta" 
                  secondary="Remover permanentemente sua conta e todos os dados"
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={loading}
                >
                  Deletar
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Dialog de confirmação para deletar conta */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Deletar Conta Permanentemente
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Esta ação é <strong>irreversível</strong>. Todos os seus treinos e dados serão perdidos permanentemente.
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Para confirmar, digite sua senha:
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDeleteDialog}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={loading || !password.trim()}
            >
              {loading ? 'Deletando...' : 'Deletar Conta'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
