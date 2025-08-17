import { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';

const Timer = ({ 
  onExpire, 
  autoStart = false, 
  restTime = 60 // tempo em segundos
}) => {
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [isActive, setIsActive] = useState(autoStart);

  // Callback estável para onExpire
  const handleExpire = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    onExpire?.();
  }, [onExpire]);

  // Inicializar timer quando autoStart muda
  useEffect(() => {
    if (autoStart) {
      setTimeLeft(restTime);
      setIsActive(true);
    } else {
      setIsActive(false);
      setTimeLeft(restTime);
    }
  }, [autoStart, restTime]);

  // Lógica principal do timer
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer chegou ao fim
            setIsActive(false);
            handleExpire();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, handleExpire]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: isActive ? 'primary.main' : 'grey.300',
        color: isActive ? 'white' : 'text.primary',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        minWidth: 60,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? 1 : 0
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default Timer;