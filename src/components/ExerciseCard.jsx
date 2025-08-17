import { Switch, Checkbox } from "@mui/material";
import { useState } from "react";
import Timer from "./Timer";

const data = {
  title: "Flexão de braços",
  weight: 8,
  series: 4,
  repetitions: 8,
  restTime: 2,
  observations: "Mantenha a postura correta durante o exercício.",
};

export default function ExerciseCard() {
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [currentSeries, setCurrentSeries] = useState(0);
  const [completedSeries, setCompletedSeries] = useState([]);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const handleCheckboxClick = (index) => {
    if (index === currentSeries && !timerActive) {
      setCompletedSeries((prev) => [...prev, index]);

      if (index < data.series - 1) {
        setTimerActive(true);
        setTimerKey((prev) => prev + 1);
      } else {
        setCheckedSwitch(true);
      }
    }
  };

  const handleTimerExpire = () => {
    setTimerActive(false);

    if (currentSeries < data.series - 1) {
      setCurrentSeries((prev) => prev + 1);
    }
  };

  const getExpiryTime = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + data.restTime);
    return time;
  };

  return (
    <div className="exercise-card">
      <div className="exercise-card-header">
        <h2>{data.title}</h2>
        <Switch checked={checkedSwitch} />
      </div>

      <div className="exercise-card-main">
        <div className="exercise-series">
          <span>Séries:</span>
          {Array.from({ length: data.series }).map((_, i) => (
            <Checkbox
              key={i}
              checked={completedSeries.includes(i)}
              disabled={i > currentSeries || timerActive}
              onChange={() => handleCheckboxClick(i)}
            />
          ))}
        </div>
        <div className="exercise-weight">Carga: {data.weight}kg</div>
      </div>

      <div className="exercise-card-info">
        <span>Repetições: {data.repetitions}</span>
        <div className="exercise-timer">
          <span>Descanso:</span>
          <Timer
            key={timerKey}
            expiryTimestamp={getExpiryTime()}
            onExpire={handleTimerExpire}
            autoStart={timerActive}
          />
        </div>
      </div>

      <div className="exercise-card-footer">
        Observações: {data.observations}
      </div>
    </div>
  );
}
