import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Magnetic from "./Magnetic";

interface HeaderProps {
  logo?: {
    type: "text" | "image";
    initials: string;
    text: string;
    subtext: string;
    imageUrl: string;
  };
}

export default function Header({ logo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "What We Do", href: "#what-we-do" },
    { label: "Vision", href: "#vision" },
    { label: "Why CFO's Desk", href: "#why-us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active section highlights
      const scrollPosition = window.scrollY + 150;
      const sections = ["services", "about", "what-we-do", "vision", "why-us"];
      
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "py-3 bg-white/[0.03] backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#root")}
            className="flex items-center gap-4 group cursor-pointer"
          >
            {logo?.type === "image" && logo?.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt={logo.text || "CFO'S DESK"}
                className={`rounded-2xl object-contain border border-[#E2D4B7]/30 bg-[#030C1B] p-1.5 shadow-2xl transition-all duration-500 ease-out group-hover:border-[#E2D4B7] group-hover:shadow-[0_0_25px_rgba(226,212,183,0.25)] ${
                  isScrolled
                    ? "w-14 h-14 md:w-16 md:h-16"
                    : "w-20 h-20 md:w-28 md:h-28"
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`rounded-2xl border border-[#E2D4B7]/30 flex items-center justify-center bg-white/5 backdrop-blur-md text-[#E2D4B7] font-serif font-semibold tracking-wider transition-all duration-500 ease-out group-hover:border-[#E2D4B7] group-hover:shadow-[0_0_25px_rgba(226,212,183,0.25)] ${
                isScrolled
                  ? "w-14 h-14 md:w-16 md:h-16 text-base"
                  : "w-20 h-20 md:w-28 md:h-28 text-2xl md:text-4xl"
              }`}>
                {logo?.initials || "CD"}
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className={`font-serif font-semibold tracking-widest text-[#F5F2EB] group-hover:text-[#E2D4B7] transition-all duration-500 ${
                isScrolled ? "text-base md:text-lg" : "text-lg md:text-2xl"
              }`}>
                {logo?.text || "CFO'S DESK"}
              </span>
              <span className={`font-mono uppercase tracking-widest text-zinc-400 transition-all duration-500 ${
                isScrolled ? "text-[8px] md:text-[9px]" : "text-[9px] md:text-[11px]"
              }`}>
                {logo?.subtext || "Fractional CFO"}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative font-sans text-[13px] tracking-widest uppercase transition-colors py-2 text-zinc-400 hover:text-[#E2D4B7]"
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.span
                    layoutId="header-active-dot"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E2D4B7]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Contact Actions / CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="font-mono text-[11px] tracking-widest uppercase py-2.5 px-6 rounded-full border border-white/10 text-[#F5F2EB] bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                data-cursor-text="Let's Talk"
              >
                Get Started
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#030C1B]/95 backdrop-blur-xl pt-28 px-6 flex flex-col justify-between pb-12 lg:hidden"
          >
            <div className="noise-overlay" />
            
            <nav className="flex flex-col gap-6">
              {navItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-serif text-2xl text-zinc-300 hover:text-[#E2D4B7] transition-colors py-1"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="space-y-6 pt-8 border-t border-white/5">
              <div className="flex flex-col gap-2 font-mono text-xs text-zinc-400">
                <span className="uppercase tracking-wider text-[10px]">Direct line</span>
                <a href="tel:+923212909766" className="text-zinc-300 flex items-center gap-2 hover:text-[#E2D4B7]">
                  <Phone className="w-3.5 h-3.5 text-[#E2D4B7]" /> +92 (321) 290-97-66
                </a>
                <a href="mailto:info@cfosdesk.com" className="text-zinc-300 flex items-center gap-2 hover:text-[#E2D4B7] mt-1">
                  <Mail className="w-3.5 h-3.5 text-[#E2D4B7]" /> info@cfosdesk.com
                </a>
              </div>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full text-center block font-mono text-xs uppercase tracking-widest py-4 bg-[#E2D4B7] text-black font-semibold rounded-xl"
              >
                Confidential Consultation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
