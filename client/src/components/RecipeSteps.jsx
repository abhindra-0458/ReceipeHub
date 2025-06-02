// client/src/components/RecipeSteps.jsx
import React, { useState, useEffect } from 'react';

const RecipeStep = ({ step }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(step.timerMinutes * 60);
  
  useEffect(() => {
    let interval;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
      // Play sound alert
      const audio = new Audio('/alert.mp3');
      audio.play();
      // Show visual alert
      alert(`Timer for step ${step.order} is complete!`);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, step.order]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleTimer = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(step.timerMinutes * 60);
    }
    setTimerActive(!timerActive);
  };
  
  return (
    <div className="recipe-step">
      <div className="step-number">{step.order}</div>
      <div className="step-content">
        <p>{step.description}</p>
        {step.timerMinutes > 0 && (
          <div className="step-timer">
            <span className={`timer ${timerActive ? 'active' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
            <button onClick={toggleTimer}>
              {timerActive ? 'Pause' : timeRemaining === 0 ? 'Reset' : 'Start'} Timer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RecipeSteps = ({ steps }) => {
  return (
    <div className="recipe-steps">
      <h3>Instructions</h3>
      {steps.map(step => (
        <RecipeStep key={step.order} step={step} />
      ))}
    </div>
  );
};

export default RecipeSteps;