import { useState, useRef, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  key?: any;
}

export default function TiltCard({ children, className = "", maxTilt = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    // Skip tilt on mobile/touch screens
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    // Calculate rotation (invert Y axis so mouse up tilts forward)
    const rotateX = normY * -maxTilt;
    const rotateY = normX * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    // Mirror shine position
    setGlareStyle({
      opacity: 0.15,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.3) 0%, transparent 65%)`,
      transition: "opacity 0.2s ease",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`relative overflow-hidden rounded-2xl transition-all ${className}`}
    >
      {/* Dynamic specular lighting */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={glareStyle as any}
      />
      {children}
    </div>
  );
}
