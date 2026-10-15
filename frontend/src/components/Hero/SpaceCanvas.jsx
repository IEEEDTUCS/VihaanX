'use client';

import { useEffect, useRef } from 'react';

export default function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Starfield
    const numStars = 70;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7, // mostly in the upper sky
      radius: Math.random() * 1.5 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      alpha: 0.5,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Shooting stars / Meteors
    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        // Spawn from upper center/right, flying towards bottom-left
        this.x = Math.random() * width * 0.8 + width * 0.2;
        this.y = Math.random() * height * 0.35;
        this.len = Math.random() * 90 + 70;
        this.speed = Math.random() * 6 + 7;
        this.angle = (135 * Math.PI) / 180 + (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.active = false;
        this.waitTime = Math.random() * 180 + 60; // frames until spawn
      }

      update() {
        if (!this.active) {
          this.waitTime--;
          if (this.waitTime <= 0) {
            this.active = true;
          }
          return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.018;

        if (this.opacity <= 0 || this.x < 0 || this.y > height) {
          this.reset();
        }
      }

      draw(c) {
        if (!this.active) return;
        c.save();
        c.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.lineWidth = 1.6;

        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;

        const grad = c.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, 'rgba(120, 200, 255, 0)');
        grad.addColorStop(0.6, 'rgba(210, 235, 255, 0.4)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

        c.strokeStyle = grad;
        c.beginPath();
        c.moveTo(tailX, tailY);
        c.lineTo(this.x, this.y);
        c.stroke();

        // Glow head
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.shadowColor = '#80d4ff';
        c.shadowBlur = 8;
        c.beginPath();
        c.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
        c.fill();

        c.restore();
      }
    }

    const shootingStars = [new ShootingStar(), new ShootingStar(), new ShootingStar()];

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05;

      // Draw subtle twinkling stars in the sky
      for (const s of stars) {
        s.alpha = s.baseAlpha + Math.sin(time * s.twinkleSpeed * 10 + s.twinkleOffset) * 0.3;
        ctx.fillStyle = `rgba(220, 240, 255, ${Math.max(0.1, Math.min(1, s.alpha))})`;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = s.radius > 1.2 ? 4 : 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw shooting stars
      for (const ss of shootingStars) {
        ss.update();
        ss.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}
