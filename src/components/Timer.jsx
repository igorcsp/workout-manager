import { useState, useEffect, useCallback, useRef } from "react";
import { Typography, Box } from "@mui/material";
import { usePageVisibility } from "../hooks/usePageVisibility";

export default function Timer({
  onExpire,
  autoStart = false,
  restTime = 60,
  exerciseId, // Novo prop para identificar o timer
}) {
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const isPageVisible = usePageVisibility();
  
  // Chave única para o localStorage
  const timerStorageKey = `timer-${exerciseId}`;

  // Callback estável para onExpire
  const handleExpire = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    // Limpar dados do localStorage quando expirar
    if (exerciseId) {
      localStorage.removeItem(timerStorageKey);
    }
    onExpire?.();
  }, [onExpire, exerciseId, timerStorageKey]);

  // Salvar estado do timer no localStorage
  const saveTimerState = useCallback((active, startTime, duration) => {
    if (!exerciseId) return;
    
    const timerState = {
      isActive: active,
      startTime: startTime,
      duration: duration,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(timerStorageKey, JSON.stringify(timerState));
    } catch (error) {
      console.error("Erro ao salvar estado do timer:", error);
    }
  }, [exerciseId, timerStorageKey]);

  // Carregar estado do timer do localStorage
  const loadTimerState = useCallback(() => {
    if (!exerciseId) return null;
    
    try {
      const savedState = localStorage.getItem(timerStorageKey);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Erro ao carregar estado do timer:", error);
    }
    return null;
  }, [exerciseId, timerStorageKey]);

  // Inicializar timer quando autoStart muda ou componente monta
  useEffect(() => {
    // Primeiro, tentar carregar estado salvo
    const savedState = loadTimerState();
    
    if (savedState && savedState.isActive) {
      // Calcular quanto tempo passou desde que foi salvo
      const now = Date.now();
      const elapsed = Math.floor((now - savedState.startTime) / 1000);
      const remaining = savedState.duration - elapsed;
      
      if (remaining > 0) {
        // Timer ainda está rodando
        setTimeLeft(remaining);
        setIsActive(true);
        startTimeRef.current = savedState.startTime;
      } else {
        // Timer já expirou enquanto estava em segundo plano
        handleExpire();
        return;
      }
    } else if (autoStart) {
      // Iniciar novo timer
      const now = Date.now();
      setTimeLeft(restTime);
      setIsActive(true);
      startTimeRef.current = now;
      saveTimerState(true, now, restTime);
    } else {
      // Timer inativo
      setIsActive(false);
      setTimeLeft(restTime);
      startTimeRef.current = null;
      if (exerciseId) {
        localStorage.removeItem(timerStorageKey);
      }
    }
  }, [autoStart, restTime, exerciseId, loadTimerState, saveTimerState, handleExpire, timerStorageKey]);

  // Lógica principal do timer
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isActive && timeLeft > 0 && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = restTime - elapsed;
        
        if (remaining <= 0) {
          // Timer chegou ao fim
          handleExpire();
        } else {
          setTimeLeft(remaining);
          // Atualizar localStorage periodicamente
          saveTimerState(true, startTimeRef.current, restTime);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, restTime, handleExpire, saveTimerState]);

  // Sincronizar timer quando a página fica visível
  useEffect(() => {
    if (isPageVisible && isActive && startTimeRef.current) {
      // Recalcular tempo restante baseado no timestamp
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      const remaining = restTime - elapsed;
      
      if (remaining <= 0) {
        handleExpire();
      } else {
        setTimeLeft(remaining);
      }
    }
  }, [isPageVisible, isActive, restTime, handleExpire]);

  // Wake Lock para manter a tela ativa durante o timer (quando suportado)
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isActive) {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('Wake Lock ativado para manter timer ativo');
        }
      } catch (err) {
        console.log('Wake Lock não suportado ou falhou:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock) {
        try {
          await wakeLock.release();
          wakeLock = null;
          console.log('Wake Lock liberado');
        } catch (err) {
          console.log('Erro ao liberar Wake Lock:', err);
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isActive]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: isActive ? "primary.main" : "grey.300",
        color: isActive ? "white" : "text.primary",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        minWidth: 60,
        textAlign: "center",
        transition: "all 0.3s ease",
        boxShadow: isActive ? 1 : 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${((restTime - timeLeft) / restTime) * 100}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transition: 'width 1s linear',
          }}
        />
      )}
      <Typography variant="body2" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
        {formatTime(timeLeft)}
        {isActive && !isPageVisible && (
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.7em' }}>
            ⏱️
          </Box>
        )}
      </Typography>
    </Box>
  );
}
