import { useState, useEffect } from 'react';
import './Countdown.css';

const TARGET = new Date('2026-11-14T00:00:00+05:30');

function calcRemaining() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown() {
  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className="countdown" aria-label="Countdown to Vihaan X">
      {blocks.map((b, i) => (
        <div className="countdown__group" key={b.label}>
          <div className="countdown__block">
            <div className="countdown__card">
              <span className="countdown__number">{pad(b.value)}</span>
            </div>
            <span className="countdown__label">{b.label}</span>
          </div>
          {i < blocks.length - 1 && (
            <span className="countdown__sep" aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
