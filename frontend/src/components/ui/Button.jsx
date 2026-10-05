'use client';

import { useRef } from 'react';
import './StarBorder.css';

/**
 * Button — StarBorder rotating glow + ripple on click
 * props:
 *   as        — 'button' | 'a'  (default 'button')
 *   href      — renders as <a> automatically when provided
 *   size      — 'sm' | 'md' | 'lg'
 *   speed     — CSS duration string for the border spin  (default '4s')
 *   color     — glow color  (default red-pink)
 *   className — extra classes on the outer container
 */
export default function Button({
  children,
  onClick,
  href,
  size       = 'md',
  speed      = '4s',
  color,
  borderColor,
  className  = '',
  innerClassName = '',
  style      = {},
  ...rest
}) {
  const containerRef = useRef(null);

  const handleClick = (e) => {
    const container = containerRef.current;
    if (!container) return;

    // Remove old ripple
    container.querySelectorAll('.btn-ripple').forEach(r => r.remove());

    const inner = container.querySelector('.star-border-inner');
    if (inner) {
      const rect  = inner.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const size  = Math.max(rect.width, rect.height) * 2.2;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      Object.assign(ripple.style, {
        left:   `${x - size / 2}px`,
        top:    `${y - size / 2}px`,
        width:  `${size}px`,
        height: `${size}px`,
      });
      inner.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    onClick?.(e);
  };

  const Tag = href ? 'a' : 'button';

  const customStyle = {
    animationDuration: speed,
    ...(color ? { '--btn-glow-color': color, '--btn-glow-highlight': color } : {}),
    ...(borderColor ? { '--btn-border-color': borderColor } : {}),
    ...style,
  };

  return (
    <Tag
      ref={containerRef}
      href={href}
      type={href ? undefined : 'button'}
      className={`star-border-container star-border-${size} ${className}`}
      style={customStyle}
      onClick={handleClick}
      {...rest}
    >
      {/* Rotating conic-gradient border glow */}
      <span
        className="star-border-glow"
        style={{ animationDuration: speed }}
      />

      {/* Inner pill */}
      <span className={`star-border-inner ${innerClassName}`}>
        {children}
      </span>
    </Tag>
  );
}
