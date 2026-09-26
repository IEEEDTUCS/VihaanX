import { useEffect } from 'react';
import './PreviousEditions.css';

const EDITIONS = [
  { name: 'Vihaan 9.0', tagline: 'The 9th Edition', url: 'https://9.vihaan.ieeedtu.in' },
  { name: 'Vihaan 8.0', tagline: 'The 8th Edition', url: 'https://8.vihaan.ieeedtu.in' },
  { name: 'Vihaan 7.0', tagline: 'The 7th Edition', url: 'https://7.vihaan.ieeedtu.in' },
];

export default function PreviousEditions({ onClose }) {
  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Previous Editions">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close dialog">&times;</button>

        <h2 className="modal__heading">Previous Editions</h2>
        <p className="modal__sub">Explore our legacy.</p>

        <ul className="modal__list">
          {EDITIONS.map((ed) => (
            <li key={ed.url}>
              <a href={ed.url} target="_blank" rel="noopener noreferrer" className="modal__card">
                <div className="modal__card-text">
                  <span className="modal__card-name">{ed.name}</span>
                  <span className="modal__card-tagline">{ed.tagline}</span>
                </div>
                <span className="modal__card-arrow">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
