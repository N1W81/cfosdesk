import { useState, useRef, MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  key?: any;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(212, 175, 55, 0.08)"
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setIsFocused(false);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
    >
      {/* Light spotlight glow under cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Subtle border spot highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300"
        style={{
          opacity: opacity * 0.4,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(212, 175, 55, 0.25), transparent 60%)`,
        }}
      />
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
