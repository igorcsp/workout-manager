import { useTimer } from "react-timer-hook";
import sound from "../assets/timerSound.mp3";

export default function Timer({ expiryTimestamp, onExpire, autoStart }) {
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      new Audio(sound).play();
      if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
      onExpire?.();
    },
    autoStart,
  });

  const formatTime = (min, sec) =>
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(minutes, seconds)}</div>
    </div>
  );
}
