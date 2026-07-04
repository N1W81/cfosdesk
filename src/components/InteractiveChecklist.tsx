import { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, TrendingUp, Cpu, Award, DollarSign } from "lucide-react";
import { ChecklistItem } from "../types";

interface InteractiveChecklistProps {
  tag?: string;
  title?: string;
  description1?: string;
  description2?: string;
  items?: ChecklistItem[];
}

export default function InteractiveChecklist({
  tag = "What We Do",
  title = "Expert Business Management & Profitability Consulting.",
  description1 = "We are seasoned business management consultants specializing in implementing proven profitability frameworks and organizational improvements. Our associates aren't just consultants; they are successful entrepreneurs who intimately understand the daily pressures of running a fast-paced business.",
  description2 = "If your business is demanding too much time, battling declining profits, or struggling with focus—we have the battle-tested strategies to turn the tide.",
  items
}: InteractiveChecklistProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const defaultItems = [
    {
      id: 1,
      title: "Cut Operational Costs",
      description: "Eliminating structural waste, negotiating supplier leverage, and introducing automated workflow tools to instantly lift your bottom-line margins.",
    },
    {
      id: 2,
      title: "Reduce Business Risk",
      description: "Structuring capital hedges, auditing cash flow vulnerabilities, and establishing rigid financial guardrails to withstand any macro shock.",
    },
    {
      id: 3,
      title: "Create Brand Value",
      description: "Strengthening enterprise equity positioning, packaging proprietary assets, and priming your Balance Sheet for premium valuation multiples.",
    },
    {
      id: 4,
      title: "Generate Revenue from New Sources",
      description: "Architecting adjacent monetization models, pricing optimizations, and identifying high-margin product or service extensions.",
    },
    {
      id: 5,
      title: "Transform into an Innovative Market Leader",
      description: "Equipping your board with dynamic forecasting dashboards and tactical agility to systematically outmaneuver legacy competitors.",
    },
  ];

  const displayItems = (items || defaultItems).map(item => {
    let icon = DollarSign;
    if (item.id === 2) icon = ShieldCheck;
    if (item.id === 3) icon = Award;
    if (item.id === 4) icon = TrendingUp;
    if (item.id === 5) icon = Cpu;
    return { ...item, icon };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
      {/* Left side: Sticky Intro */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#030C1B]/10 bg-[#030C1B]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#030C1B] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#030C1B]/80 font-semibold">{tag}</span>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl text-[#030C1B] leading-tight font-light">
          {title}
        </h3>
        
        <p className="text-slate-700 leading-relaxed text-sm md:text-base font-light">
          {description1}
        </p>

        {description2 && (
          <p className="text-slate-600 leading-relaxed text-sm italic font-light">
            {description2}
          </p>
        )}
      </div>

      {/* Right side: Staggered Pinned checklist */}
      <div className="lg:col-span-7 space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 mb-6 font-semibold">
          WE HELP YOU:
        </p>

        <div className="space-y-4">
          {displayItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isSelected = activeItem === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
                className={`relative p-6 rounded-2xl border transition-all duration-300 group cursor-pointer bg-[#030C1B] text-[#F5F2EB] shadow-md ${
                  isSelected 
                    ? "border-[#E2D4B7]/40 shadow-[0_10px_30px_rgba(3,12,27,0.15)] scale-[1.01]" 
                    : "border-white/5"
                }`}
              >
                <div className="flex gap-4 md:gap-6 items-start">
                  {/* Indicator Ring & Icon */}
                  <div className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                    isSelected 
                      ? "bg-[#E2D4B7]/15 text-[#E2D4B7]" 
                      : "bg-white/5 text-[#DCAE9F]/80 group-hover:text-[#E2D4B7]"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <h4 className={`font-sans text-base md:text-lg font-medium transition-colors duration-300 ${
                      isSelected ? "text-[#E2D4B7]" : "text-[#F5F2EB] group-hover:text-[#EFE6D4]"
                    }`}>
                      {item.title}
                    </h4>
                    
                    {/* Expandable detailed copy */}
                    <p className="text-[#DCAE9F]/90 text-sm leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Ambient glow decoration inside active item */}
                {isSelected && (
                  <motion.div 
                    layoutId="checklist-active-glow" 
                    className="absolute inset-0 border border-[#E2D4B7]/10 rounded-2xl pointer-events-none" 
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

