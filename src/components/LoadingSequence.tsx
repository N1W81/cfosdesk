import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingSequenceProps {
  onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    const duration = 1200; // 1.2s
    const intervalTime = 15;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 300); // smooth exit
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="loading-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#020813]"
        >
          {/* Subtle noise in loading too */}
          <div className="noise-overlay" />

          <div className="relative flex flex-col items-center px-4 max-w-md w-full">
            {/* Elegant Monogram */}
            <div className="relative mb-8 h-20 w-20 flex items-center justify-center">
              <svg
                id="loading-monogram-svg"
                className="absolute inset-0 w-full h-full text-[#E2D4B7]/20"
                viewBox="0 0 100 100"
                fill="none"
              >
                {/* Outer frame circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                {/* Animated progress arc */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#E2D4B7"
                  strokeWidth="1.5"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-serif text-3xl font-light text-[#F5F2EB] tracking-widest pl-1">CD</span>
            </div>

            {/* Logo Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="font-serif text-xl tracking-widest text-[#F5F2EB] uppercase mb-1">
                CFO'S DESK
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#E2D4B7]/60">
                Financial Strategy & Leadership
              </p>
            </motion.div>

            {/* Percentage Display */}
            <motion.div
              id="loading-percentage"
              className="mt-12 font-mono text-xs text-[#F5F2EB]/60"
            >
              {Math.min(100, Math.round(progress))}%
            </motion.div>

            {/* Skip Button */}
            <button
              onClick={onComplete}
              className="absolute bottom-10 font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-[#E2D4B7] transition-colors duration-300 py-2 px-4 border border-zinc-900 rounded-full cursor-pointer"
            >
              Skip Intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
