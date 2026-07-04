import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode[];
  speed?: number; // duration in seconds
  reverse?: boolean;
}

export default function Marquee({ children, speed = 30, reverse = false }: MarqueeProps) {
  // Duplicate children to ensure continuous flow
  const items = [...children, ...children, ...children, ...children];

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-zinc-900 bg-[#070709] select-none">
      {/* Self-contained keyframe styles */}
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr ${speed}s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl ${speed}s linear infinite;
        }
      `}</style>

      {/* Fade out edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070709] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070709] to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max items-center gap-16 whitespace-nowrap px-8 ${
          reverse ? "animate-marquee-rtl" : "animate-marquee-ltr"
        } hover:[animation-play-state:paused]`}
      >
        {items.map((child, idx) => (
          <div key={idx} className="flex-shrink-0 flex items-center gap-4">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
