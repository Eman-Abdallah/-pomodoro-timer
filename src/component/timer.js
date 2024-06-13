import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const Timer = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const handleIncrement = (type) => {
    if (type === 'break' && breakLength < 60) {
      setBreakLength(breakLength + 1);
    } else if (type === 'session' && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'break' && breakLength > 1) {
      setBreakLength(breakLength - 1);
    } else if (type === 'session' && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
    }
  };

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
      setIntervalId(null);
    } else {
      setIsRunning(true);
      const newIntervalId = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            const beep = document.getElementById('beep');
            beep.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div id="pomodoro-timer">
        <h1>Pomodoro Timer</h1>
      <div className="length-controls">
        <div id="break-label">
          Break Length
          <div className='d-flex'>
          <button id="break-decrement" className='btn' onClick={() => handleDecrement('break')}>
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" className='btn' onClick={() => handleIncrement('break')}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          </div>
        </div>
        <div id="session-label">
          Session Length
          <div className='d-flex'>
          <button id="session-decrement" className='btn' onClick={() => handleDecrement('session')}>
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" className='btn' onClick={() => handleIncrement('session')}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <div className='d-flex'>
      <button id="start_stop" className='btn' onClick={handleStartStop}>
        {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
      </button>
      <button id="reset" className='btn' onClick={handleReset}>
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
    </div>
  );
};

export default Timer;
