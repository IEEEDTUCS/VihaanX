import { useState, useEffect } from 'react';
import './Loader.css';

export default function Loader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onComplete]);

  return (
    <div className={`loader ${fadeOut ? 'loader--exit' : ''}`} aria-hidden="true">
      <div className="loader__content">
        <div className="loader__title-row">
          <span className="loader__letter" style={{ animationDelay: '0.1s' }}>V</span>
          <span className="loader__letter" style={{ animationDelay: '0.2s' }}>I</span>
          <span className="loader__letter" style={{ animationDelay: '0.3s' }}>H</span>
          <span className="loader__letter" style={{ animationDelay: '0.4s' }}>A</span>
          <span className="loader__letter" style={{ animationDelay: '0.5s' }}>A</span>
          <span className="loader__letter" style={{ animationDelay: '0.6s' }}>N</span>
        </div>
        <span className="loader__x">X</span>
        <div className="loader__edition">THE 10TH EDITION</div>
      </div>
      <div className="loader__progress">
        <div className="loader__progress-track">
          <div className="loader__progress-fill" />
        </div>
      </div>
    </div>
  );
}
