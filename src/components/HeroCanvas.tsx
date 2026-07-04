import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
      baseAlpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.15; // very slow
        this.vy = (Math.random() - 0.5) * 0.15;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseAlpha = Math.random() * 0.3 + 0.1;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.01 + 0.003;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap-around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction (gentle attraction)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          this.x -= dx * force * 0.01;
          this.y -= dy * force * 0.01;
        }

        // Pulse alpha
        this.alpha = this.baseAlpha + Math.sin(Date.now() * this.pulseSpeed) * 0.05;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Royal beige accent color
        c.fillStyle = `rgba(226, 212, 183, ${this.alpha})`;
        c.shadowColor = "rgba(226, 212, 183, 0.4)";
        c.shadowBlur = this.radius * 2;
        c.fill();
        c.restore();
      }
    }

    // Financial trend wave/curve
    class FinancialWave {
      points: { x: number; y: number }[] = [];
      particleProgress = 0;

      constructor() {
        this.recalculate();
      }

      recalculate() {
        this.points = [];
        const step = width / 5;
        const baseY = height * 0.65;
        for (let i = 0; i <= 5; i++) {
          this.points.push({
            x: i * step,
            y: baseY - Math.pow(i, 1.8) * (height * 0.05) + (Math.random() - 0.5) * 30,
          });
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 0; i < this.points.length - 1; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          c.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }

        // Draw the thin elegant financial curve line
        c.strokeStyle = "rgba(226, 212, 183, 0.09)";
        c.lineWidth = 1;
        c.stroke();

        // Ambient glowing trend filling
        c.lineTo(width, height);
        c.lineTo(0, height);
        c.closePath();
        const grad = c.createLinearGradient(0, height * 0.3, 0, height);
        grad.addColorStop(0, "rgba(226, 212, 183, 0.005)");
        grad.addColorStop(1, "rgba(226, 212, 183, 0.0)");
        c.fillStyle = grad;
        c.fill();

        // Flowing light dot representing capital flow
        this.particleProgress += 0.001;
        if (this.particleProgress > 1) this.particleProgress = 0;

        // Interpolate along quadratic segments to find exact particle position
        const t = this.particleProgress;
        const index = Math.floor(t * (this.points.length - 1));
        const localT = (t * (this.points.length - 1)) % 1;

        if (index < this.points.length - 1) {
          const p0 = this.points[index];
          const p1 = this.points[index + 1];
          // Simple linear approximation for the visual indicator
          const px = p0.x + (p1.x - p0.x) * localT;
          const py = p0.y + (p1.y - p0.y) * localT;

          c.beginPath();
          c.arc(px, py, 3, 0, Math.PI * 2);
          c.fillStyle = "rgba(226, 212, 183, 0.4)";
          c.shadowColor = "#E2D4B7";
          c.shadowBlur = 10;
          c.fill();
        }

        c.restore();
      }
    }

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 110;
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());
    const wave = new FinancialWave();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      wave.recalculate();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Grid details (faint mathematical intersections for high tech premium look)
    const drawGridDecorations = (c: CanvasRenderingContext2D) => {
      c.save();
      c.strokeStyle = "rgba(255, 255, 255, 0.015)";
      c.lineWidth = 0.5;

      const gridSize = 120;
      for (let x = 0; x < width; x += gridSize) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, height);
        c.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(width, y);
        c.stroke();
      }

      // Draw faint tiny ticks at grid intersections
      c.fillStyle = "rgba(226, 212, 183, 0.08)";
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          c.fillRect(x - 1, y - 1, 3, 3);
        }
      }
      c.restore();
    };

    // Main loops
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle radial dark gradient overlay
      const radialGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      radialGrad.addColorStop(0, "#051532");
      radialGrad.addColorStop(1, "#020813");
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      drawGridDecorations(ctx);
      wave.draw(ctx);

      // Connect particles if close
      ctx.strokeStyle = "rgba(226, 212, 183, 0.035)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update(mouseX, mouseY);
        p1.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
